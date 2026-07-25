import { expect, type Page } from "@playwright/test";

export type PublicRoute = {
  path: string;
  language: "de-CH" | "en";
  indexable: boolean;
};

export const PUBLIC_ROUTES: PublicRoute[] = [
  { path: "/", language: "de-CH", indexable: true },
  { path: "/en", language: "en", indexable: true },
  { path: "/ai-business-audit", language: "de-CH", indexable: true },
  { path: "/en/ai-business-audit", language: "en", indexable: true },
  { path: "/website-audit", language: "de-CH", indexable: true },
  { path: "/en/website-audit", language: "en", indexable: true },
  { path: "/seo-analyse", language: "de-CH", indexable: true },
  { path: "/en/seo-analysis", language: "en", indexable: true },
  { path: "/ai-visibility", language: "de-CH", indexable: true },
  { path: "/en/ai-visibility", language: "en", indexable: true },
  { path: "/automation", language: "de-CH", indexable: true },
  { path: "/en/automation", language: "en", indexable: true },
  { path: "/leistungen", language: "de-CH", indexable: true },
  { path: "/en/services", language: "en", indexable: true },
  { path: "/fuer-kmu", language: "de-CH", indexable: true },
  { path: "/en/for-smes", language: "en", indexable: true },
  { path: "/partner", language: "de-CH", indexable: true },
  { path: "/en/partners", language: "en", indexable: true },
  { path: "/fallstudien", language: "de-CH", indexable: true },
  { path: "/en/case-studies", language: "en", indexable: true },
  { path: "/insights", language: "de-CH", indexable: true },
  { path: "/en/insights", language: "en", indexable: true },
  { path: "/ueber-uns", language: "de-CH", indexable: true },
  { path: "/en/about", language: "en", indexable: true },
  { path: "/kontakt", language: "de-CH", indexable: true },
  { path: "/en/contact", language: "en", indexable: true },
  { path: "/audit", language: "de-CH", indexable: false },
  { path: "/en/audit", language: "en", indexable: false },
  { path: "/impressum", language: "de-CH", indexable: false },
  { path: "/en/imprint", language: "en", indexable: false },
  { path: "/datenschutz", language: "de-CH", indexable: false },
  { path: "/en/privacy", language: "en", indexable: false },
];

export const RESPONSIVE_ROUTES = [
  "/",
  "/ai-business-audit",
  "/audit",
  "/partner",
  "/kontakt",
  "/en",
  "/en/audit",
  "/en/contact",
] as const;

export const VIEWPORTS = [
  { name: "320", width: 320, height: 800 },
  { name: "375", width: 375, height: 812 },
  { name: "390", width: 390, height: 844 },
  { name: "430", width: 430, height: 932 },
  { name: "768", width: 768, height: 1024 },
  { name: "1024", width: 1024, height: 900 },
  { name: "1440", width: 1440, height: 1000 },
] as const;

const BASE_URL = "https://itsfeierabend.ch";

export async function installEssentialConsent(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const consent = encodeURIComponent(
      JSON.stringify({
        necessary: true,
        analytics: false,
        marketing: false,
        timestamp: Date.now(),
      }),
    );
    document.cookie = `consent_v1=${consent}; path=/; SameSite=Lax`;
  });
}

export function captureRuntimeErrors(page: Page): string[] {
  const errors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(`console: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => {
    errors.push(`pageerror: ${error.message}`);
  });

  return errors;
}

export async function waitForHydratedPage(page: Page): Promise<void> {
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveCount(1);
  await page.waitForTimeout(100);
}

export async function assertMetadata(page: Page, route: PublicRoute): Promise<void> {
  await expect(page.locator("html")).toHaveAttribute("lang", route.language);

  const title = await page.title();
  expect(title).toContain("itsFeierabend.ch");
  expect(title).not.toContain("KI-gestützte Digital Marketing Agentur");

  const description = page.locator('meta[name="description"]');
  await expect(description).toHaveCount(1);
  const descriptionContent = await description.getAttribute("content");
  expect(descriptionContent?.trim().length ?? 0).toBeGreaterThan(40);

  const canonical = page.locator('link[rel="canonical"]');
  await expect(canonical).toHaveCount(1);
  const canonicalHref = await canonical.getAttribute("href");
  expect(canonicalHref).toMatch(/^https:\/\/itsfeierabend\.ch(?:\/|$)/);

  if (route.indexable) {
    const expectedCanonical = `${BASE_URL}${route.path === "/" ? "/" : route.path}`;
    expect(canonicalHref).toBe(expectedCanonical);
  }

  const robots = await page.locator('meta[name="robots"]').getAttribute("content");
  if (route.indexable) {
    expect(robots).toContain("index");
    expect(robots).not.toContain("noindex");
  } else {
    expect(robots).toContain("noindex");
  }

  for (const selector of [
    'meta[property="og:title"]',
    'meta[property="og:description"]',
    'meta[property="og:url"]',
    'meta[property="og:image"]',
    'meta[name="twitter:title"]',
    'meta[name="twitter:description"]',
    'meta[name="twitter:image"]',
  ]) {
    const tag = page.locator(selector);
    await expect(tag).toHaveCount(1);
    const content = await tag.getAttribute("content");
    expect(content?.trim().length ?? 0, `${selector} must not be empty`).toBeGreaterThan(0);
  }

  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    canonicalHref ?? "",
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    /^https:\/\/itsfeierabend\.ch\//,
  );

  const alternates = page.locator('link[rel="alternate"][data-seo-hreflang]');
  if (route.indexable) {
    await expect(alternates).toHaveCount(3);
    const hreflangs = await alternates.evaluateAll((links) =>
      links.map((link) => link.getAttribute("hreflang")).sort(),
    );
    expect(hreflangs).toEqual(["de-CH", "en", "x-default"]);
  } else {
    await expect(alternates).toHaveCount(0);
  }
}

export async function assertNoHorizontalOverflow(page: Page): Promise<void> {
  const result = await page.evaluate(() => {
    const viewportWidth = window.innerWidth;
    const documentWidth = Math.max(
      document.documentElement.scrollWidth,
      document.body?.scrollWidth ?? 0,
    );

    const offenders = documentWidth > viewportWidth + 1
      ? Array.from(document.querySelectorAll<HTMLElement>("body *"))
          .filter((element) => {
            const style = getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            return (
              style.display !== "none" &&
              style.visibility !== "hidden" &&
              rect.width > 0 &&
              (rect.right > viewportWidth + 1 || rect.left < -1)
            );
          })
          .slice(0, 8)
          .map((element) => {
            const id = element.id ? `#${element.id}` : "";
            const classes = Array.from(element.classList).slice(0, 2).join(".");
            return `${element.tagName.toLowerCase()}${id}${classes ? `.${classes}` : ""}`;
          })
      : [];

    return { viewportWidth, documentWidth, offenders };
  });

  expect(
    result.documentWidth,
    `Horizontal overflow at ${result.viewportWidth}px; offenders: ${result.offenders.join(", ")}`,
  ).toBeLessThanOrEqual(result.viewportWidth + 1);
}

export async function assertAccessibilityBaseline(page: Page): Promise<void> {
  const violations = await page.evaluate(() => {
    const issues: string[] = [];
    const isVisible = (element: Element): boolean => {
      if (element.closest('[aria-hidden="true"]')) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        rect.width > 0 &&
        rect.height > 0
      );
    };
    const identify = (element: Element): string => {
      const id = element.id ? `#${element.id}` : "";
      const name = element.getAttribute("name");
      return `${element.tagName.toLowerCase()}${id}${name ? `[name="${name}"]` : ""}`;
    };
    const accessibleName = (element: Element): string => {
      const ariaLabel = element.getAttribute("aria-label")?.trim();
      if (ariaLabel) return ariaLabel;

      const labelledBy = element.getAttribute("aria-labelledby");
      if (labelledBy) {
        const text = labelledBy
          .split(/\s+/)
          .map((id) => document.getElementById(id)?.textContent?.trim() ?? "")
          .filter(Boolean)
          .join(" ");
        if (text) return text;
      }

      const control = element as
        | HTMLInputElement
        | HTMLButtonElement
        | HTMLSelectElement
        | HTMLTextAreaElement;
      const labelText = Array.from(control.labels ?? [])
        .map((label) => label.textContent?.trim() ?? "")
        .filter(Boolean)
        .join(" ");
      if (labelText) return labelText;

      const title = element.getAttribute("title")?.trim();
      if (title) return title;

      const text = element.textContent?.trim();
      if (text) return text;

      const imageAlt = element.querySelector("img")?.getAttribute("alt")?.trim();
      return imageAlt ?? "";
    };

    const visibleMains = Array.from(document.querySelectorAll("main")).filter(isVisible);
    if (visibleMains.length !== 1) {
      issues.push(`expected one visible main landmark, found ${visibleMains.length}`);
    }

    const visibleH1s = Array.from(document.querySelectorAll("h1")).filter(isVisible);
    if (visibleH1s.length !== 1) {
      issues.push(`expected one visible h1, found ${visibleH1s.length}`);
    }

    const headings = Array.from(
      document.querySelectorAll<HTMLElement>("h1, h2, h3, h4, h5, h6"),
    ).filter(isVisible);
    let previousLevel = 0;
    for (const heading of headings) {
      const level = Number(heading.tagName.slice(1));
      if (previousLevel > 0 && level > previousLevel + 1) {
        issues.push(`heading level skips from h${previousLevel} to h${level}`);
      }
      previousLevel = level;
    }

    for (const image of Array.from(document.querySelectorAll("img")).filter(isVisible)) {
      if (!image.hasAttribute("alt")) {
        issues.push(`${identify(image)} is missing alt`);
      }
    }

    const interactive = new Set(
      Array.from(
        document.querySelectorAll(
          'a[href], button, input:not([type="hidden"]), select, textarea, [role="button"], [role="link"], [role="checkbox"], [role="switch"]',
        ),
      ),
    );
    for (const element of interactive) {
      if (!isVisible(element) || element.hasAttribute("disabled")) continue;
      if (!accessibleName(element)) {
        issues.push(`${identify(element)} has no accessible name`);
      }
    }

    for (const frame of Array.from(document.querySelectorAll("iframe")).filter(isVisible)) {
      if (!frame.getAttribute("title")?.trim()) {
        issues.push(`${identify(frame)} has no title`);
      }
    }

    const ids = new Map<string, number>();
    for (const element of document.querySelectorAll("[id]")) {
      ids.set(element.id, (ids.get(element.id) ?? 0) + 1);
    }
    for (const [id, count] of ids) {
      if (count > 1) issues.push(`duplicate id #${id} (${count} occurrences)`);
    }

    for (const element of document.querySelectorAll<HTMLElement>("[tabindex]")) {
      if (element.tabIndex > 0) {
        issues.push(`${identify(element)} uses positive tabindex=${element.tabIndex}`);
      }
    }

    return issues;
  });

  expect(violations, `Accessibility baseline violations:\n${violations.join("\n")}`).toEqual([]);
}
