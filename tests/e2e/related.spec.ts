import { expect, test } from "@playwright/test";

// Audit E6: projects and the posts about them link to each other, posts end
// with related reading, and About shows the latest articles.

test("project page links its articles", async ({ page }) => {
  await page.goto("/projects/fusily/");
  const section = page.locator("section", {
    has: page.getByRole("heading", { name: "À lire sur le blog" }),
  });
  await expect(section.locator("a")).toHaveCount(3);
  await expect(
    section.locator('a[href="/blog/react-native-expo-developpeur-backend/"]'),
  ).toBeVisible();
});

test("article links back to its project", async ({ page }) => {
  await page.goto(
    "/en/blog/dotcraft-open-source-qr-code-generator-claude-code/",
  );
  await expect(
    page.locator('main a[href="/en/projects/dotcraft/"]'),
  ).toBeVisible();
});

test("article ends with related reading, same project first", async ({
  page,
}) => {
  await page.goto(
    "/blog/tamagui-vs-react-native-paper-retour-experience-fusily/",
  );
  const related = page.locator("section", {
    has: page.getByRole("heading", { name: "À lire aussi" }),
  });
  const hrefs = await related
    .locator("a")
    .evaluateAll((links) => links.map((a) => a.getAttribute("href")));
  expect(hrefs).toHaveLength(2);
  // Both other Fusily articles, not the newest unrelated ones.
  expect(hrefs).toEqual(
    expect.arrayContaining([
      "/blog/react-native-expo-developpeur-backend/",
      "/blog/i18n-django-react-native-contenu-utilisateur/",
    ]),
  );
});

test("about page shows the latest articles", async ({ page }) => {
  await page.goto("/en/about/");
  const latest = page.locator("section", {
    has: page.getByRole("heading", { name: "Latest articles" }),
  });
  await expect(latest.locator('a[href^="/en/blog/"]')).toHaveCount(3);
});
