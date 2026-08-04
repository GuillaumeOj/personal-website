---
title: "Django & React Native i18n: Translate User-Generated Content"
description: "How we internationalized a Django + React Native app: gettext, i18next, and translating user-generated content with the Google Translate API and Celery."
pubDate: 2026-07-13
lang: en
slug: i18n-django-react-native-user-content
translationKey: i18n-django-react-native
cover: ../../../assets/blog/i18n-django-react-native/cover.jpg
tags: []
---

Fusily is a cooking app where users publish their recipes and tips. By the very nature of the product — written content, meant to be shared and to travel — I built in multi-language support from the earliest days. Some will say that's premature so early in an app's life. They're right. But beyond the timing, there was a genuine technical curiosity to satisfy.

Internationalizing an interface is a solved, well-documented problem. Automatically translating a recipe a user just wrote — without knowing which language they wrote it in, and without making them wait — is far less so. That's where the documentation stops, and that's exactly what kept me busy. This article walks the whole path: internationalization (i18n) on the server with Django, on the client with React Native, and then the real challenge — translating user-generated content.

## Internationalization (i18n) vs. localization (l10n)

Before diving into code, a word on vocabulary. We distinguish **internationalization** (i18n) — preparing the software so it can handle multiple languages, usually the developers' job — from **localization** (l10n) — writing the translations and local formats, usually the translators' job. The [Django documentation](https://docs.djangoproject.com/en/dev/topics/i18n/) puts it well:

> **internationalization** — Preparing the software for localization. Usually done by developers.
>
> **localization** — Writing the translations and local formats. Usually done by translators.

And it goes beyond simply displaying one language or another: time zones, currencies, units, and number formats all come into play. With Django and React Native, the interface side comes together fairly easily.

## Server side: internationalization with Django

Out of the box, Django handles internationalization for text translation, date/time/number formatting, and time zones.

### Enabling i18n in the settings

```python
USE_I18N = True  # enables Django's translation system
LANGUAGE_CODE = "en-us"  # project default language
LANGUAGES = [
    ("en", _("English")),
    ("fr", _("French")),
]  # languages supported by the project
```

### Marking strings for translation

In your code, just mark the values to translate with `gettext_lazy` or `gettext` (conventionally imported under the alias `_`):

```python
from django.utils.translation import gettext_lazy as _

class Recipe(NutritionFact, ShareTokenMixin, SoftDeleteModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="recipes",
        on_delete=models.CASCADE,
        verbose_name=_("user"),
    )
    # ... rest of the model
```

Keep the distinction between the two in mind: `gettext_lazy` is for code evaluated at module load time (`verbose_name`, `choices`, constants), because the translation catalog isn't resolved yet at that point; the translation is only produced when the value is used as a string. `gettext` (eager) is for code executed per request. Confusing the two leads to strings evaluated too early. The [Django documentation](https://docs.djangoproject.com/en/dev/topics/i18n/translation/#lazy-translations) covers the use cases.

### Generating the translation files

Once the strings are marked, you generate the message files. Django works with two kinds: `.po` message files (original/translation pairs) and binary `.mo` files, the compiled versions used at runtime.

```shell
django-admin makemessages
```

By default the files land in `locale/{lang}/LC_MESSAGES/`. For each marked value, `makemessages` creates a `msgid` entry and an empty `msgstr` to fill in. All that's left is to compile:

```shell
django-admin compilemessages
```

Once everything is in place, Django serves the right translation based on the language the client requests. With `LocaleMiddleware`, the resolution order is actually: URL prefix, then session, then cookie, then the `Accept-Language` header, and finally the default `LANGUAGE_CODE`. For advanced usage, the Django documentation is the best reference.

That covers the interface on the server. Now for the client.

## Client side: internationalization with React Native

Out of the box, React Native doesn't handle internationalization: you need external dependencies. The topic is a notch subtler than with Django, because on mobile the language choice happens at the OS level, on two tiers (a global setting, then a per-app override).

### Configuring expo-localization

Fusily runs on the [Expo](https://expo.dev) SDK. We start with `expo-localization`, which exposes `getLocales`, a function that retrieves the user's preferred languages. You declare the plugin in `app.config.{js/ts}`:

```typescript
plugins: [
    [
        "expo-localization",
        { supportedLocales: { ios: ["en", "fr"], android: ["en", "fr"] } },
    ],
];
```

`supportedLocales` is crucial: it's what determines the languages the user can select from the iOS or Android settings for your app.

### Translating the UI with i18next

For translations I use `i18next` ([i18next.com](https://www.i18next.com/)) — an old, popular, actively maintained project — paired with `react-i18next` ([react.i18next.com](https://react.i18next.com/)). Since these are pure JavaScript libraries, a plain `bun add i18next react-i18next` is enough; `expo install` only matters for libraries with native code, such as `expo-localization`.

Then you add an initialization file (I created an `i18n` folder at the root of the frontend):

```typescript
import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "@/i18n/locales/en/translation.json";
import frTranslation from "@/i18n/locales/fr/translation.json";

const languageCode = getLocales()[0]?.languageCode ?? "en";

i18n.use(initReactI18next).init({
    lng: languageCode,
    fallbackLng: "en",
    supportedLngs: ["en", "fr"],
    resources: {
        en: { translation: enTranslation },
        fr: { translation: frTranslation },
    },
    // RN renders text, not HTML: no XSS risk, and escaping would only
    // produce literal entities (&#39;) on screen.
    interpolation: { escapeValue: false },
    // Resources are bundled synchronously: no need for Suspense.
    react: { useSuspense: false },
});

export default i18n;
```

Note the use of `languageCode` (`"fr"`) rather than `languageTag` (`"fr-FR"`), to stay consistent with `supportedLngs`. All that's left is to mark strings with `useTranslation`:

```typescript
const { t } = useTranslation();
// ...
{t("common.delete")}
```

and to create the matching JSON files (`i18n/locales/en/translation.json`, `.../fr/translation.json`):

```json
{
  "common": {
    "delete": "Delete"
  }
}
```

A nice bonus for a TypeScript project: by declaring `CustomTypeOptions` in an `i18n.d.ts` file, you make `t()` fully typed, with key autocompletion and a compile-time error if a key doesn't exist.

### Three gotchas to know

First, import order. The `i18n.ts` file must be imported exactly once, at the very top of the root layout, before any `useTranslation` — otherwise the first renders show the raw key (`common.delete`) instead of the translation.

Second, reactivity. `getLocales()` is read only once at initialization: if the user changes the language in the OS settings while the app is running, the app won't update until the JS reloads. To handle live changes, use the reactive `useLocales()` hook and call `i18n.changeLanguage()`.

Third, plurals. i18next relies on `Intl.PluralRules`, which is sometimes incomplete on certain versions of the Hermes engine: plural forms may fail to resolve in production. An `Intl` polyfill or the `compatibilityJSON` option fixes it.

Up to here, everything is well-trodden: the docs are plentiful and the libraries do the work. From now on, we leave the beaten path.

## The real challenge: user-generated content

We've handled the strings we control — the ones in the interfaces. But what about user-generated content? The internet is full of articles on internationalization with Django; far fewer when it comes to translating what users write. I turned the problem over several times, tried a few approaches, looked for existing apps, and found nothing truly convincing.

### What should you translate?

Fusily hosts three kinds of user content: recipes, tips (cooking-time charts, gear maintenance, how to nail whipped cream every time…), and comments. The deciding criterion isn't technical but editorial: **durable, reference-like** content is worth translating, **conversational, ephemeral** content much less so. Recipes and tips last over time and can interest far more people than just their author; comments don't. So I chose to translate the first two, not comments.

Then you list the fields involved. For a recipe: name, description, steps, ingredients, ingredient sections, categories, units. For clarity, let's focus on the name and the description.

### A dedicated translation model: RecipeTranslation

Initially a classic model carries the name and description directly. The idea is to move those translatable fields into a `RecipeTranslation` model, tied to the recipe and associated with a language:

```python
class RecipeTranslation(SoftDeleteModel):
    recipe = models.ForeignKey(
        "recipes.Recipe",
        related_name="translations",
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=255, default="", verbose_name=_("name"))
    description = models.TextField(
        blank=True, default="", verbose_name=_("description")
    )
    language = models.CharField(
        choices=settings.LANGUAGES,
        max_length=10,
        verbose_name=_("language used for translation"),
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["recipe", "language"],
                name="uniq_recipe_language",
            ),
        ]
```

The uniqueness constraint on `(recipe, language)` is essential: it guarantees a recipe has only one translation per language, and makes writes idempotent. Three points deserve attention:

- for any `list` endpoint that returns `name` and `description`, prefetching the translations is mandatory. And beware: a plain `prefetch_related("translations")` followed by a `.filter(language=...)` triggers extra queries; you need a `Prefetch` targeted at the desired language to truly avoid N+1 queries.
- on the frontend, always assume not all translations are present: plan a fallback to whatever value is available.
- during the migration, plan a transition period where the legacy fields stay on the parent model before being removed.

The structure is there. Now we actually need to get the content translated into the other languages.

### Google Translate API enters the picture

How do you detect the source language? Relying on the app's language isn't enough: Fusily only has interfaces in French and English, which would force our Spanish-speaking users to write in one of those two. That's where Google's translation API comes in, offering two tools: detecting a content's language, and translating from a source to a target language. In the create/update serializers, a Celery task then fills in the missing translations.

### Determining the source language

Where does the source language come from? The answer is a cascade, in the serializer's `update()`:

```python
from django.db import transaction
from django.utils.translation import get_language_from_request

def update(self, instance, validated_data):
    language = validated_data.pop("language", None)
    description_changed = (
        "description" in validated_data
        and validated_data["description"] != instance.description
    )

    with transaction.atomic():
        instance = super().update(instance, validated_data)

        if description_changed and instance.description:
            request = self.context["request"]
            # 1) explicit language sent by the client, otherwise
            # 2) language inferred from the request.
            source_language_code = language or get_language_from_request(request)
            self.store_source_translation(instance, source_language_code)
            translate_recipe_description.delay_on_commit(
                str(instance.id), source_language_code
            )

    return instance
```

Two important details. First, we don't read the raw header: `request.headers.get("Accept-Language")` would return something like `"fr-FR,fr;q=0.9,en;q=0.8"`, unusable as is. `get_language_from_request` parses it and reduces the value to a supported code. Second, the `transaction.atomic()` isn't just for show: `delay_on_commit` only fires the task after the transaction commits — with no active transaction, the "on commit" guarantee is gone. This `source_language_code` is only a *hint*: in the task, Google's automatic detection takes priority, and this value is just a safety net for when detection fails.

### Respond now, translate later

We don't just fire the async task: we also call `store_source_translation` **synchronously**, right before. It's one of the most important details for the user experience.

```python
def store_source_translation(self, instance, source_language_code):
    """Immediately persist the raw description as its source-language
    translation — with no network call — so the API response reflects the
    edit right away, without waiting for the async task."""
    if source_language_code in SUPPORTED_LANGUAGE_CODES:
        _save_recipe_description_translation(
            instance, source_language_code, instance.description
        )
```

The idea: the text the user just typed is, by definition, already a valid translation — the one in their own language. No need to call Google for that, and certainly no reason to add a network round-trip to the request path. So we store it immediately, so the API response already contains their version. The async task, meanwhile, handles the **other** languages in the background, where translation takes time.

We thus separate two timescales: what must be immediate (the text the user sees right after saving) and what can wait (the languages they don't speak). That synchronous/asynchronous split is what makes it all feel smooth.

### Background translation with Celery

The bulk of the work happens in the task, which takes the source language and fills in each missing language:

```python
@shared_task(
    autoretry_for=(GoogleAPIError,),
    retry_backoff=True,
    max_retries=5,
)
def translate_recipe_description(recipe_id, source_language_code=None):
    recipe = Recipe.objects.filter(id=recipe_id).first()
    if not recipe or not recipe.description:
        return

    # Detection on the text itself takes priority; source_language_code
    # (from the serializer) is only a fallback.
    source = detect_language(recipe.description) or source_language_code
    if not source:
        return

    for target in SUPPORTED_LANGUAGE_CODES:
        if target == source:
            translated = recipe.description  # already in the right language
        else:
            translated = get_translation(source, recipe.description, target)
            if not translated:
                # Failure on this language: move on to the next without
                # blocking the others, to retry later.
                continue

        RecipeTranslation.objects.update_or_create(
            recipe=recipe,
            language=target,
            defaults={"description": translated},
        )
```

`detect_language` and `get_translation` are just a thin layer around `google.cloud.translate`, with a confidence threshold on detection.

### Production gotchas

**Idempotence** rests on the `update_or_create` + uniqueness constraint pair. Beware, though: under heavy concurrency, two simultaneous tasks can still attempt two `INSERT`s and raise an `IntegrityError` — hence the value of a retry (already configured on the task) and, ideally, deduplicating tasks per recipe.

**Failure isolation** comes from the `continue`: if Google returns nothing for Spanish, you don't lose the successful German translation.

**Detection stays fallible**, especially on very short text ("Chantilly" — whipped cream): that's exactly why the `source_language_code` is passed along as a safety net.

Finally, **cost**: the API is billed per character. Only trigger the task when the description actually changes, only re-translate missing languages, and never overwrite a hand-corrected translation.

## In closing

Making an app multilingual isn't *one* problem but three that echo each other: the interface on the server (Django, gettext, `.po`/`.mo`), the interface on the client (Expo, i18next), and — the most interesting — translating **user-generated content**, for which there's no ready-made recipe.

The approach I settled on is deliberately pragmatic. Machine translation isn't perfect: it gives a good starting point, not a flawless version. The logical next step would be to let users correct a generated translation, then *lock* their version so a future task run doesn't overwrite it. But that's another story, probably for a future article.

Was it necessary in Fusily's earliest days? Probably not. But answering the original question — translating what a user just wrote, without knowing the language, and without making them wait — was well worth the detour.

## FAQ

**Internationalization or localization: what's the difference?** Internationalization (i18n) prepares the code to handle multiple languages; localization (l10n) provides the translations and local formats.

**Should user content be translated synchronously or asynchronously?** Both. You store the text in its source language immediately for an instant response, and delegate translation into the other languages to a background task (Celery).

**Is the Google Translate API paid?** Yes, it's billed per character. That's why it pays to translate only when the content changes, and only the missing languages.

**How do you detect the language of user-written content?** Through the Google API's automatic detection, with the request language (the `Accept-Language` header) as a safety net when detection isn't reliable.
