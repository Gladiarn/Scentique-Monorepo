import { expect, test } from "@playwright/test";

/* next dev compiles on first visit and hydrates late: a ceiling for waits, not a delay. */
const SLOW = 30_000;

test("the page is one world: a hero, then the acts in order, with nothing fixed behind them", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Made in small batches");
  await expect(page.locator("main section[id]")).toHaveCount(6, { timeout: SLOW });
  expect(await page.locator("main section[id]").evaluateAll((els) => els.map((el) => el.id))).toEqual(["top", "about", "shop", "quiz", "reviews", "close"]);
  await expect(page.locator("canvas")).toHaveCount(0);
});

test("buying path: product, size, add to bag, the bag, the way to checkout", async ({ page }) => {
  await page.goto("/product/bois-fume-precieux");
  await expect(page.getByRole("heading", { level: 1, name: "Bois Fumé Précieux" })).toBeVisible();
  // Shoppers click the visible label; the real radio is visually hidden but stays reachable by keyboard.
  await page.getByText("50 ml", { exact: true }).click({ timeout: SLOW });
  await expect(page.getByRole("radio", { name: "50 ml" })).toBeChecked();
  await page.getByRole("button", { name: /add to bag/i }).click();
  await expect(page.getByRole("status")).toContainText("Added to bag");
  await expect(page.getByRole("link", { name: "Bag, 1 item" })).toBeVisible();
  await page.getByRole("link", { name: /view bag/i }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Your bag" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Bois Fumé Précieux" })).toBeVisible();
  await page.getByRole("button", { name: /increase quantity of bois fumé précieux/i }).click();
  await expect(page.getByRole("link", { name: "Bag, 2 items" })).toBeVisible();
  await page.getByRole("link", { name: /checkout/i }).click();
  await expect(page).toHaveURL(/\/checkout$/);
  await page.getByRole("button", { name: /place order/i }).click();
  await expect(page.getByText(/enter an email address/i)).toBeVisible();
  for (const [label, value] of [["Email", "ada@example.com"], ["Full name", "Ada Lovelace"], ["Street address", "12 Rue Cler"], ["City", "Paris"], ["Postcode", "75007"], ["Country", "France"], ["Card number", "4242 4242 4242 4242"]] as const) {
    await page.getByLabel(label).fill(value);
  }
  await page.getByRole("button", { name: /place order/i }).click();
  await expect(page.getByRole("heading", { name: /thank you/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /^Bag/ })).toHaveAccessibleName("Bag, 0 items");
});

test("the quiz ends on scents to try, and each one opens its page", async ({ page }) => {
  await page.goto("/");
  const quiz = page.locator("section#quiz");
  await quiz.scrollIntoViewIfNeeded({ timeout: SLOW });
  for (const answer of [/oud/i, /evening/i, /unisex/i, /intense/i]) await quiz.getByRole("button", { name: answer }).click({ timeout: SLOW });
  await expect(quiz.getByRole("heading", { level: 2, name: /two or three scents to try/i })).toBeVisible();
  await quiz.getByRole("listitem").first().getByRole("link").click();
  await expect(page).toHaveURL(/\/product\//);
});

test("the seasonal letter names a bad email and how to fix it", async ({ page }) => {
  await page.goto("/");
  const close = page.locator("section#close");
  await close.scrollIntoViewIfNeeded({ timeout: SLOW });
  await close.getByLabel("Email").fill("not-an-email", { timeout: SLOW });
  await close.getByRole("button", { name: "Subscribe" }).click();
  await expect(close.getByRole("alert")).toContainText("Enter an email like name@example.com");
});

test("the shop filters by family and keeps the choice in the address", async ({ page }) => {
  await page.goto("/shop");
  await page.getByRole("navigation", { name: /filter by family/i }).getByRole("link", { name: "Oud" }).click({ timeout: SLOW });
  await expect(page).toHaveURL(/family=oud/);
  await expect(page.getByRole("navigation", { name: /filter by family/i }).getByRole("link", { name: "Oud" })).toHaveAttribute("aria-current", "true");
});

test.describe("with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("the hero is a still with every note readable, and nothing is hidden", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("video")).toHaveCount(0);
    const rail = page.getByRole("list", { name: /how the scent develops/i });
    await expect(rail).toContainText("Top");
    await expect(rail).toContainText("Base");
    await expect(page.getByRole("link", { name: /discover collection/i })).toBeVisible();
  });
});
