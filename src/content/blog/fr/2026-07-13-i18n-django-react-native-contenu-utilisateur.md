---
title: "i18n Django et React Native : traduire jusqu'au contenu de vos utilisateurs"
description: "Internationaliser une app Django et React Native : gettext, i18next, et surtout traduire le contenu généré par les utilisateurs (Google Translate + Celery)."
pubDate: 2026-07-13
lang: fr
slug: i18n-django-react-native-contenu-utilisateur
translationKey: i18n-django-react-native
cover: ../../../assets/blog/i18n-django-react-native/cover.jpg
tags: []
---

Fusily est une application de cuisine où les utilisateurs publient leurs recettes et leurs astuces. De par la nature même du produit — du contenu écrit, partagé, destiné à voyager — j'ai intégré la gestion de plusieurs langues dès les premiers jours. Certains diront que c'est inapproprié si tôt dans la vie d'une application. Ils ont raison. Mais au-delà du timing, il y avait une vraie curiosité technique à assouvir.

Car internationaliser une interface est un problème résolu et abondamment documenté. Traduire automatiquement une recette qu'un utilisateur vient d'écrire — sans savoir dans quelle langue il l'a rédigée, et sans le faire attendre — l'est beaucoup moins. C'est là que la documentation s'arrête, et c'est précisément ce qui m'a occupé. Cet article retrace le chemin complet : l'internationalisation (i18n) côté serveur avec Django, côté client avec React Native, puis le vrai défi — la traduction du contenu généré par les utilisateurs.

## Internationalisation (i18n) vs localisation (l10n)

Avant d'entrer dans le code, un mot de vocabulaire. On distingue l'**internationalisation** (i18n) — préparer le logiciel pour qu'il puisse gérer plusieurs langues, en général le travail des développeurs — de la **localisation** (l10n) — écrire les traductions et les formats locaux, en général le travail des traducteurs. La [documentation de Django](https://docs.djangoproject.com/en/dev/topics/i18n/) résume bien :

> **internationalization** — Preparing the software for localization. Usually done by developers.
>
> **localization** — Writing the translations and local formats. Usually done by translators.

Et cela ne se limite pas à l'affichage dans une langue ou une autre : fuseaux horaires, devises, unités de mesure et formats de nombres entrent aussi en jeu. Dans le cas de Django et React Native, la partie interface se met en place assez facilement.

## Côté serveur : l'internationalisation avec Django

Django sait, par défaut, gérer l'internationalisation pour la traduction des textes, le format des dates, heures et nombres, ainsi que les fuseaux horaires.

### Activer l'i18n dans les settings

```python
USE_I18N = True  # active le système de traduction de Django
LANGUAGE_CODE = "en-us"  # langue par défaut du projet
LANGUAGES = [
    ("en", _("English")),
    ("fr", _("French")),
]  # langues supportées par le projet
```

### Marquer les chaînes à traduire

Dans le code, il suffit d'identifier les valeurs à traduire avec `gettext_lazy` ou `gettext` (par convention, importés avec l'alias `_`) :

```python
from django.utils.translation import gettext_lazy as _

class Recipe(NutritionFact, ShareTokenMixin, SoftDeleteModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="recipes",
        on_delete=models.CASCADE,
        verbose_name=_("user"),
    )
    # ... reste du modèle
```

Retenez la distinction entre les deux versions : `gettext_lazy` s'utilise pour le code évalué au chargement du module (les `verbose_name`, les `choices`, les constantes), car le catalogue de traduction n'est pas encore résolu à ce moment-là ; la traduction n'est réellement produite qu'à l'usage sous forme de string. `gettext` (eager), lui, convient au code exécuté par requête. Confondre les deux mène à des chaînes évaluées trop tôt. La [documentation Django](https://docs.djangoproject.com/en/dev/topics/i18n/translation/#lazy-translations) détaille les cas d'usage.

### Générer les fichiers de traduction

Une fois les chaînes taguées, on génère les fichiers de messages. Django en manipule deux : les `message files` `.po` (paires valeur d'origine / traduction) et les fichiers binaires `.mo`, versions compilées utilisées à l'exécution.

```shell
django-admin makemessages
```

Par défaut, les fichiers atterrissent dans `locale/{lang}/LC_MESSAGES/`. Pour chaque valeur taguée, `makemessages` crée une entrée `msgid` et une string vide `msgstr` à remplir. Il ne reste plus qu'à compiler :

```shell
django-admin compilemessages
```

Une fois tout en place, Django sert la bonne traduction selon la langue demandée par le client. Avec le `LocaleMiddleware`, l'ordre de résolution est en réalité : préfixe d'URL, puis session, puis cookie, puis l'en-tête `Accept-Language`, et enfin `LANGUAGE_CODE` par défaut. Pour un usage avancé, la documentation de Django est la meilleure référence.

Cette partie gère l'interface côté serveur. Reste à traiter l'interface côté client.

## Côté client : l'internationalisation avec React Native

Par défaut, React Native ne gère pas l'internationalisation : il faut des dépendances externes. Le sujet est un cran plus subtil que sous Django, car sur mobile le choix de la langue se fait au niveau de l'OS, sur deux niveaux (réglage général, puis choix application par application).

### Configurer expo-localization

Fusily tourne avec le SDK [Expo](https://expo.dev). On commence par `expo-localization`, qui expose notamment `getLocales`, une fonction qui récupère les langues préférées de l'utilisateur. On déclare le plugin dans `app.config.{js/ts}` :

```typescript
plugins: [
    [
        "expo-localization",
        { supportedLocales: { ios: ["en", "fr"], android: ["en", "fr"] } },
    ],
];
```

`supportedLocales` est primordial : c'est lui qui détermine les langues sélectionnables depuis les réglages d'iOS ou Android pour votre application.

### Traduire l'interface avec i18next

Pour les traductions, j'utilise `i18next` ([i18next.com](https://www.i18next.com/)) — projet ancien, populaire et activement maintenu — couplé à `react-i18next` ([react.i18next.com](https://react.i18next.com/)). Comme ce sont des librairies 100 % JavaScript, un simple `bun add i18next react-i18next` suffit ; `expo install` n'est utile que pour les librairies à code natif comme `expo-localization`.

On ajoute ensuite un fichier d'initialisation (j'ai créé un dossier `i18n` à la racine du frontend) :

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
    // RN affiche du texte, pas du HTML : pas de risque XSS, et l'échappement
    // ne produirait que des entités littérales (&#39;) à l'écran.
    interpolation: { escapeValue: false },
    // Ressources bundlées de façon synchrone : pas besoin de Suspense.
    react: { useSuspense: false },
});

export default i18n;
```

On note l'usage de `languageCode` (`"fr"`) plutôt que `languageTag` (`"fr-FR"`), pour rester cohérent avec `supportedLngs`. Il ne reste qu'à taguer les chaînes avec `useTranslation` :

```typescript
const { t } = useTranslation();
// ...
{t("common.delete")}
```

et à créer les fichiers JSON correspondants (`i18n/locales/en/translation.json`, `.../fr/translation.json`) :

```json
{
  "common": {
    "delete": "Delete"
  }
}
```

Petit bonus pour un projet TypeScript : en déclarant `CustomTypeOptions` dans un fichier `i18n.d.ts`, on rend `t()` entièrement typé, avec autocomplétion des clés et erreur à la compilation si une clé n'existe pas.

### Trois pièges à connaître

Premièrement, l'ordre d'import. Le fichier `i18n.ts` doit être importé une seule fois, tout en haut du layout racine, avant le moindre `useTranslation` — sinon les premiers rendus affichent la clé brute (`common.delete`) au lieu de la traduction.

Deuxièmement, la réactivité. `getLocales()` est lu une seule fois à l'initialisation : si l'utilisateur change la langue dans les réglages de l'OS en cours d'exécution, l'app ne se met pas à jour tant que le JS n'est pas rechargé. Pour gérer le changement à chaud, il faut passer par le hook réactif `useLocales()` et appeler `i18n.changeLanguage()`.

Troisièmement, les pluriels. i18next s'appuie sur `Intl.PluralRules`, parfois incomplet sur certaines versions du moteur Hermes : les formes plurielles peuvent ne pas se résoudre en production. Un polyfill `Intl` ou l'option `compatibilityJSON` règle le problème.

Jusqu'ici, tout est balisé : la documentation abonde et les librairies font le travail. À partir de maintenant, on quitte les sentiers battus.

## Le vrai défi : le contenu utilisateur

Nous avons géré les chaînes dont nous avons la maîtrise, celles des interfaces. Mais qu'en est-il du contenu généré par les utilisateurs ? Internet regorge d'articles sur l'internationalisation avec Django ; beaucoup moins dès qu'il s'agit de traduire ce que les utilisateurs écrivent. J'ai retourné le problème plusieurs fois, tenté quelques pistes, cherché des applications existantes, sans rien trouver de vraiment convaincant.

### Que doit-on traduire ?

Fusily héberge trois types de contenus utilisateurs : des recettes, des astuces (fiches de cuisson, entretien du matériel, réussir une chantilly à tous les coups…) et des commentaires. Le critère de décision n'est pas technique mais éditorial : un contenu **pérenne et documentaire** mérite d'être traduit, un contenu **conversationnel et éphémère** beaucoup moins. Les recettes et les astuces durent dans le temps et peuvent intéresser bien au-delà de leur auteur ; les commentaires, non. J'ai donc choisi de traduire les deux premiers, pas les commentaires.

Reste à lister les champs concernés. Pour une recette : nom, description, étapes, ingrédients, sections d'ingrédients, catégories, unités. Pour la clarté, concentrons-nous sur le nom et la description.

### Un modèle de traduction dédié : RecipeTranslation

Au départ, un modèle classique porte directement le nom et la description. L'idée est de déporter ces champs traduisibles dans un modèle `RecipeTranslation`, lié à la recette et associé à une langue :

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

La contrainte d'unicité sur `(recipe, language)` est essentielle : elle garantit qu'une recette n'a qu'une seule traduction par langue, et rend les écritures idempotentes. Trois points méritent l'attention :

- pour tout endpoint de type `list` qui renvoie `name` et `description`, un prefetch des traductions est obligatoire. Et attention : un simple `prefetch_related("translations")` suivi d'un `.filter(language=...)` refait des requêtes ; il faut un `Prefetch` ciblé sur la langue voulue pour vraiment éviter les requêtes N+1.
- côté frontend, partez toujours du principe que les traductions ne sont pas toutes présentes : prévoyez un fallback sur la valeur disponible.
- lors de la migration, prévoyez une période de transition durant laquelle les champs legacy restent sur le modèle parent, avant leur suppression.

La structure est là. Reste à obtenir, effectivement, le contenu traduit dans les autres langues.

### L'API Google Translate entre en jeu

Comment détecter la langue d'origine ? Se fier à la langue de l'application ne suffit pas : Fusily n'a d'interfaces qu'en français et en anglais, ce qui obligerait nos voisins espagnols à écrire dans l'une de ces deux langues. C'est là qu'intervient l'API de traduction de Google, qui offre deux outils : la détection de la langue d'un contenu, et la traduction d'une langue source vers une langue cible. Au niveau des serializers de création/modification, une task Celery complète alors les traductions manquantes.

### Déterminer la langue source

D'où vient la langue d'origine ? La réponse tient en une cascade, dans le `update()` du serializer :

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
            # 1) langue explicite envoyée par le client, sinon
            # 2) langue déduite de la requête.
            source_language_code = language or get_language_from_request(request)
            self.store_source_translation(instance, source_language_code)
            translate_recipe_description.delay_on_commit(
                str(instance.id), source_language_code
            )

    return instance
```

Deux détails importants. D'abord, on ne lit pas l'en-tête brut : `request.headers.get("Accept-Language")` renverrait quelque chose comme `"fr-FR,fr;q=0.9,en;q=0.8"`, inexploitable tel quel. `get_language_from_request` fait le parsing et ramène la valeur à un code supporté. Ensuite, le `transaction.atomic()` n'est pas décoratif : `delay_on_commit` ne déclenche la task qu'après le commit de la transaction — sans transaction active, la garantie « on commit » tombe. Ce `source_language_code` n'est qu'un *indice* : dans la task, la détection automatique de Google reste prioritaire, et cette valeur ne sert de filet que lorsque la détection échoue.

### Répondre tout de suite, traduire ensuite

On ne se contente pas de déclencher la task asynchrone : on appelle aussi `store_source_translation` **de façon synchrone**, juste avant. C'est l'un des détails les plus importants pour l'expérience utilisateur.

```python
def store_source_translation(self, instance, source_language_code):
    """Persiste tout de suite la description brute comme sa traduction en
    langue source — sans aucun appel réseau — pour que la réponse de l'API
    reflète la modification immédiatement, sans attendre la task async."""
    if source_language_code in SUPPORTED_LANGUAGE_CODES:
        _save_recipe_description_translation(
            instance, source_language_code, instance.description
        )
```

L'idée : le texte que l'utilisateur vient de saisir est, par définition, déjà une traduction valide — celle de sa propre langue. Inutile d'appeler Google pour ça, et surtout hors de question d'ajouter un aller-retour réseau dans le chemin de la requête. On l'enregistre donc immédiatement, de sorte que la réponse de l'API contienne déjà sa version. La task asynchrone, elle, se charge en arrière-plan des **autres** langues, dont la traduction prend du temps.

On sépare ainsi deux temporalités : ce qui doit être immédiat (le texte que l'utilisateur voit juste après avoir sauvegardé) et ce qui peut attendre (les langues qu'il ne parle pas). C'est ce découpage synchrone/asynchrone qui rend le tout fluide.

### La traduction en tâche de fond avec Celery

Le gros du travail se passe dans la task, qui reprend la langue source et complète chaque langue manquante :

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

    # La détection sur le texte lui-même prime ; source_language_code
    # (issu du serializer) n'est qu'un fallback.
    source = detect_language(recipe.description) or source_language_code
    if not source:
        return

    for target in SUPPORTED_LANGUAGE_CODES:
        if target == source:
            translated = recipe.description  # déjà dans la bonne langue
        else:
            translated = get_translation(source, recipe.description, target)
            if not translated:
                # Échec sur cette langue : on passe à la suivante sans
                # bloquer les autres, quitte à réessayer plus tard.
                continue

        RecipeTranslation.objects.update_or_create(
            recipe=recipe,
            language=target,
            defaults={"description": translated},
        )
```

`detect_language` et `get_translation` ne sont qu'une fine couche autour de `google.cloud.translate`, avec un seuil de confiance sur la détection.

### Les pièges en production

L'**idempotence** repose sur le couple `update_or_create` + contrainte d'unicité. Attention toutefois : sous forte concurrence, deux tasks simultanées peuvent malgré tout tenter deux `INSERT` et lever une `IntegrityError` — d'où l'intérêt d'un retry (déjà configuré sur la task) et, idéalement, d'une déduplication des tasks par recette.

L'**isolation des échecs** est assurée par le `continue` : si Google ne renvoie rien pour l'espagnol, on ne perd pas la traduction allemande réussie.

La **détection reste faillible**, surtout sur un texte très court (« Chantilly ») : c'est tout l'intérêt du `source_language_code` transmis en filet de sécurité.

Enfin, le **coût** : l'API est facturée au caractère. Ne déclenchez la task que lorsque la description change réellement, ne retraduisez que les langues manquantes, et ne réécrasez jamais une traduction corrigée à la main.

## En conclusion

Rendre une application multilingue, ce n'est pas *une* problématique mais trois qui se répondent : l'interface côté serveur (Django, gettext, `.po`/`.mo`), l'interface côté client (Expo, i18next) et — la plus intéressante — la traduction du **contenu généré par les utilisateurs**, pour laquelle il n'existe pas de recette toute faite.

L'approche retenue est volontairement pragmatique. La traduction automatique n'est pas parfaite : elle offre un bon point de départ, pas une version irréprochable. La suite logique serait de laisser l'utilisateur corriger une traduction générée, puis de *verrouiller* sa version pour qu'un futur passage de la task ne l'écrase pas. Mais c'est une autre histoire, sans doute pour un prochain article.

Était-ce nécessaire dès les premiers jours de Fusily ? Probablement pas. Mais répondre à la question de départ — traduire ce qu'un utilisateur vient d'écrire, sans savoir dans quelle langue, et sans le faire attendre — valait bien le détour.

## FAQ

**Internationalisation ou localisation : quelle différence ?** L'internationalisation (i18n) prépare le code à gérer plusieurs langues ; la localisation (l10n) fournit les traductions et les formats locaux.

**Faut-il traduire le contenu utilisateur de façon synchrone ou asynchrone ?** Les deux. On stocke immédiatement le texte dans sa langue source pour une réponse instantanée, et on délègue la traduction vers les autres langues à une tâche de fond (Celery).

**L'API Google Translate est-elle payante ?** Oui, elle est facturée au caractère. D'où l'intérêt de ne traduire que lorsque le contenu change, et uniquement les langues manquantes.

**Comment détecter la langue d'un contenu écrit par un utilisateur ?** Via la détection automatique de l'API Google, avec la langue de la requête (en-tête `Accept-Language`) comme filet de sécurité quand la détection n'est pas fiable.
