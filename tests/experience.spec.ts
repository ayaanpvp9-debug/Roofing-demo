import { test, expect } from "@playwright/test";

test("desktop cinematic scroll, projects, comparison, and demo validation", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  await page.goto("/");
  await expect(page.locator(".cinematic-intro")).toBeHidden({ timeout: 20000 });
  await expect(page.locator(".hero-char")).toHaveCount(24);
  expect(
    await page
      .locator(".hero-image")
      .evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0),
  ).toBeTruthy();
  await expect(page.locator(".pin-spacer")).toHaveCount(3);
  await expect(page.locator("html")).toHaveClass(/lenis/);
  await page.evaluate(() => window.scrollTo(0, 550));
  await page.waitForTimeout(1600);
  expect(
    await page
      .locator(".hero-title .word")
      .first()
      .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41),
  ).toBeLessThan(-100);
  expect(
    await page
      .locator(".hero-image")
      .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).a),
  ).toBeGreaterThan(1.2);
  const anatomy = page.locator("#anatomy");
  const start = await anatomy.evaluate(
    (el) => el.getBoundingClientRect().top + scrollY,
  );
  await page.evaluate((y) => window.scrollTo(0, y), start + 1450);
  await page.waitForTimeout(1600);
  expect(Math.abs((await anatomy.boundingBox())!.y)).toBeLessThan(5);
  expect(
    await page
      .locator(".roof-label")
      .first()
      .evaluate((el) => Number(getComputedStyle(el).opacity)),
  ).toBeGreaterThan(0.5);
  const craftStart = await page
    .locator("#craft")
    .evaluate((el) => el.getBoundingClientRect().top + scrollY);
  await page.evaluate((y) => window.scrollTo(0, y), craftStart + 900);
  await page.waitForTimeout(1600);
  expect(
    await page
      .locator(".craft-track")
      .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41),
  ).toBeLessThan(-300);
  await page.locator("#work").scrollIntoViewIfNeeded();
  await page
    .getByRole("button", { name: "Next projects", exact: true })
    .click();
  await page.waitForTimeout(1000);
  expect(
    await page.locator(".projects").evaluate((el) => el.scrollLeft),
  ).toBeGreaterThan(0);
  await page.locator(".project").nth(1).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  const slider = page.getByRole("slider");
  await slider.fill("72");
  await expect(slider).toHaveValue("72");
  await expect(page.locator(".comparison")).toHaveCSS("--position", "72%");
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "GET MY FREE ESTIMATE" }).click();
  await expect(page.getByRole("status")).toHaveCount(0);
  expect(
    await page
      .locator("form")
      .evaluate((el: HTMLFormElement) => el.checkValidity()),
  ).toBeFalsy();
  await page.locator('input[name="name"]').fill("Alex Example");
  await page.locator('input[name="email"]').fill("alex@example.com");
  await page.locator('input[name="phone"]').fill("+1 555 010 1234");
  await page.getByLabel("Property type").selectOption("Residential");
  await page.getByLabel("Service required").selectOption("Metal Roofing");
  await page.locator("textarea").fill("A demonstration roofing project.");
  await page.getByRole("button", { name: "GET MY FREE ESTIMATE" }).click();
  await expect(page.getByRole("status")).toContainText("Nothing has been sent");
  expect(errors).toEqual([]);
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`responsive ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.waitForTimeout(2500);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    const headlineFits = await page
      .locator(".hero-char")
      .last()
      .evaluate((el) => el.getBoundingClientRect().right <= innerWidth);
    expect(headlineFits).toBeTruthy();
    if (width <= 1100) {
      await page.getByRole("button", { name: "Open navigation" }).click();
      await expect(page.locator("#mobile-navigation")).toBeVisible();
      await expect(page.locator("#mobile-navigation")).toHaveCSS(
        "opacity",
        "1",
      );
      await page.locator("#mobile-navigation a").last().click();
      await expect(page.locator("#mobile-navigation")).toHaveCount(0);
    }
    await page.locator("#contact").scrollIntoViewIfNeeded();
    expect(
      await page.locator('input[name="email"]').evaluate((el) => {
        const r = el.getBoundingClientRect();
        return r.left >= 0 && r.right <= innerWidth;
      }),
    ).toBeTruthy();
  });
}

test("full motion and direct URL loading", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/a-direct-url#contact");
  await expect(page.locator("h1")).toContainText("BUILT");
  await expect(page.locator(".cinematic-intro")).toBeHidden({ timeout: 20000 });
  await expect(page.locator(".pin-spacer")).toHaveCount(3);
  await expect(page.locator("html")).toHaveClass(/lenis/);
});
