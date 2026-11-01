import { test, expect } from "@playwright/test";

test.setTimeout(60000);
for (const device of [
  { name: "small phone", width: 320, height: 568, touch: true },
  { name: "phone", width: 390, height: 844, touch: true },
  { name: "tablet", width: 768, height: 1024, touch: true },
  { name: "narrow laptop", width: 900, height: 700, touch: false },
  { name: "laptop", width: 1366, height: 768, touch: false },
]) {
  test(`${device.name}: all three real scroll sequences, not a static fallback`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width: device.width, height: device.height },
      hasTouch: device.touch,
      isMobile: device.touch,
      reducedMotion: "no-preference",
    });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    try {
      await page.goto("/");
      await expect(page.locator(".cinematic-intro")).toBeHidden({
        timeout: 20000,
      });
      await expect(page.locator("html")).toHaveAttribute("data-motion", "full");
      await expect(page.locator(".pin-spacer")).toHaveCount(3);
      const progressTo = async (selector: string, progress: number) => {
        const y = await page.locator(selector).evaluate((el, p) => {
          const spacer = el.parentElement!;
          return (
            spacer.getBoundingClientRect().top +
            scrollY +
            (spacer.offsetHeight - (el as HTMLElement).offsetHeight) * p
          );
        }, progress);
        await page.evaluate((y) => window.scrollTo(0, y), y);
        await page.waitForTimeout(1700);
        expect(
          Math.abs((await page.locator(selector).boundingBox())!.y),
        ).toBeLessThan(5);
      };
      await progressTo(".hero", 0.65);
      expect(
        await page
          .locator(".hero-title .word")
          .first()
          .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41),
      ).toBeLessThan(-device.width * 0.2);
      expect(
        await page
          .locator(".hero-image")
          .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).a),
      ).toBeGreaterThan(1.2);
      await progressTo("#anatomy", 0.5);
      expect(
        await page
          .locator(".roof-label")
          .first()
          .evaluate((el) => Number(getComputedStyle(el).opacity)),
      ).toBeGreaterThan(0.5);
      expect(
        await page
          .locator(".roof-layer")
          .first()
          .evaluate((el) =>
            Math.abs(new DOMMatrix(getComputedStyle(el).transform).m42),
          ),
      ).toBeGreaterThan(40);
      await progressTo("#craft", 0.5);
      expect(
        await page
          .locator(".craft-track")
          .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41),
      ).toBeLessThan(-device.width * 0.6);
      expect(
        await page
          .locator(".craft-track")
          .evaluate((el) => getComputedStyle(el).display),
      ).toBe("flex");
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
      expect(errors).toEqual([]);
    } finally {
      await context.close();
    }
  });
}

test("reduced OS setting can be explicitly overridden; the selection persists", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  await page.getByLabel("Animation preference").selectOption("full");
  await expect(page.locator(".pin-spacer")).toHaveCount(3);
  await expect(page.locator("html")).toHaveAttribute("data-motion", "full");
  await expect(page.locator(".hero-seal")).toHaveCSS("display", "flex");
  await page.reload();
  await expect(page.getByLabel("Animation preference")).toHaveValue("full");
  await expect(page.locator(".pin-spacer")).toHaveCount(3);
  await page.getByLabel("Animation preference").selectOption("reduced");
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator(".hero-seal")).toHaveCSS("display", "none");
});

test("crossing the old breakpoint and rotating a phone retains three pins without duplicates", async ({
  page,
}) => {
  await page.setViewportSize({ width: 900, height: 700 });
  await page.goto("/");
  await expect(page.locator(".pin-spacer")).toHaveCount(3);
  for (const viewport of [
    { width: 1366, height: 768 },
    { width: 390, height: 844 },
    { width: 844, height: 390 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(600);
    await expect(page.locator(".pin-spacer")).toHaveCount(3);
    expect(
      await page
        .locator(".craft-track")
        .evaluate((el) => getComputedStyle(el).display),
    ).toBe("flex");
  }
});

test("native touch swiping drives the full mobile hero without desktop-site mode", async ({
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
    const session = await context.newCDPSession(page);
    await session.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: 195, y: 640 }],
    });
    for (let y = 600; y >= 240; y -= 30) {
      await session.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: 195, y }],
      });
      await page.waitForTimeout(35);
    }
    await session.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await page.waitForTimeout(1500);
    expect(await page.evaluate(() => scrollY)).toBeGreaterThan(100);
    expect(
      await page
        .locator(".hero-title .word")
        .first()
        .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41),
    ).toBeLessThan(-40);
  } finally {
    await context.close();
  }
});
