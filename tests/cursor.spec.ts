import { test, expect } from "@playwright/test";

test("architectural cursor follows the mouse, responds to links, and does not intercept clicks", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.locator(".cinematic-intro")).toBeHidden({ timeout: 20000 });
  const cursor = page.locator(".architectural-cursor");
  await page.mouse.move(600, 250);
  await expect(cursor).toHaveClass(/is-visible/);
  await expect(page.locator("html")).toHaveClass(/custom-cursor-ready/);
  await page.mouse.move(700, 280);
  await page.waitForTimeout(500);
  expect(
    await page
      .locator(".cursor-follower")
      .evaluate((el) =>
        Math.abs(new DOMMatrix(getComputedStyle(el).transform).m41 - 700),
      ),
  ).toBeLessThan(5);
  await page.locator(".nav-cta").hover();
  await expect(cursor).toHaveAttribute("data-mode", "link");
  await page.mouse.down();
  await expect(cursor).toHaveClass(/is-pressed/);
  await page.mouse.up();
  await expect(cursor).not.toHaveClass(/is-pressed/);
  await expect(page.locator("#contact")).toBeInViewport();
  await page.locator('input[name="name"]').hover();
  await expect(cursor).not.toHaveClass(/is-visible/);
  await expect(page.locator("html")).not.toHaveClass(/custom-cursor-ready/);
  await page.locator('input[name="name"]').fill("Alex Example");
  await expect(page.locator('input[name="name"]')).toHaveValue("Alex Example");
  expect(errors).toEqual([]);
});

test("context labels distinguish project viewing, dragging, and comparison sliding", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".cinematic-intro")).toBeHidden({ timeout: 20000 });
  const cursor = page.locator(".architectural-cursor");
  await page.locator("#work").scrollIntoViewIfNeeded();
  await page.locator(".project-image").first().hover();
  await expect(cursor).toHaveAttribute("data-mode", "view");
  await expect(page.locator(".cursor-caption")).toHaveText("VIEW");
  await page.mouse.down();
  await expect(cursor).toHaveAttribute("data-mode", "drag");
  await page.mouse.move(400, 400, { steps: 6 });
  await page.mouse.up();
  await page.getByRole("slider").scrollIntoViewIfNeeded();
  await page.getByRole("slider").hover();
  await expect(cursor).toHaveAttribute("data-mode", "slide");
  await expect(page.locator(".cursor-caption")).toHaveText("SLIDE");
});

test("touch browsing does not activate the custom cursor or hide the native fallback", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  try {
    await page.goto("/");
    await expect(page.locator(".cinematic-intro")).toBeHidden({
      timeout: 20000,
    });
    await page.touchscreen.tap(195, 250);
    await expect(page.locator(".architectural-cursor")).not.toHaveClass(
      /is-visible/,
    );
    await expect(page.locator("html")).not.toHaveClass(/custom-cursor-ready/);
  } finally {
    await context.close();
  }
});
