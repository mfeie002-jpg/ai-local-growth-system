import {
  computeScore,
  runSignals,
  SCORE_VERSION,
  type SignalCategory,
  type SignalResult,
  type SiteContext,
} from "./audit-signals.ts";

function assert(
  condition: unknown,
  message = "Assertion failed",
): asserts condition {
  if (!condition) throw new Error(message);
}

function assertEquals<T>(
  actual: T,
  expected: T,
  message = "Values differ",
): void {
  const actualJson = JSON.stringify(actual);
  const expectedJson = JSON.stringify(expected);
  if (actualJson !== expectedJson) {
    throw new Error(
      `${message}\nExpected: ${expectedJson}\nActual:   ${actualJson}`,
    );
  }
}

function signal(
  id: string,
  category: SignalCategory,
  score: number,
  maxScore: number,
  passed = score === maxScore,
  state: SignalResult["state"] = "measured",
): SignalResult {
  return {
    id,
    category,
    name: id,
    value: score,
    evidence: `${score}/${maxScore}`,
    score,
    max_score: maxScore,
    recommendation: `Improve ${id}`,
    passed,
    state,
    source: state === "unavailable" ? "engine" : "html",
    confidence: state === "unavailable" ? "low" : "high",
  };
}

const CATEGORIES: SignalCategory[] = [
  "technical",
  "content",
  "trust",
  "conversion",
  "automation",
];

Deno.test("computeScore exposes the approved category weights", () => {
  const result = computeScore(
    CATEGORIES.map((category) =>
      signal(`${category}-perfect`, category, 10, 10)
    ),
  );

  assertEquals(result.score_version, SCORE_VERSION);
  assertEquals(result.category_weights, {
    technical: 15,
    content: 25,
    trust: 20,
    conversion: 25,
    automation: 15,
  });
  assertEquals(
    Object.values(result.category_weights).reduce(
      (sum, weight) => sum + weight,
      0,
    ),
    100,
    "Category weights must add up to 100",
  );
});

Deno.test("a complete perfect signal set scores 100 deterministically", () => {
  const words = Array.from({ length: 320 }, (_, index) => `wort${index}`).join(
    " ",
  );
  const context: SiteContext = {
    url: "https://example.ch",
    finalUrl: "https://example.ch",
    status: 200,
    responseTimeMs: 250,
    sizeBytes: 50_000,
    hasSitemap: true,
    hasRobots: true,
    headers: { "content-encoding": "br" },
    html: `<!doctype html>
      <html lang="de-CH">
        <head>
          <title>Digitale Standortanalyse für Schweizer KMU</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <meta name="description" content="Eine nachvollziehbare digitale Standortanalyse zeigt Schweizer KMU konkrete Chancen für Sichtbarkeit, Leads und bessere Abläufe.">
          <meta property="og:title" content="Digitale Standortanalyse">
          <meta property="og:description" content="Konkrete Chancen erkennen">
          <meta property="og:image" content="https://example.ch/preview.png">
          <link rel="canonical" href="https://example.ch">
          <link rel="icon" href="/favicon.ico">
          <script type="application/ld+json">{"@type":"Organization"}</script>
        </head>
        <body>
          <h1>Digitale Standortanalyse</h1>
          <a href="/impressum">Impressum</a>
          <a href="/datenschutz">Datenschutz</a>
          <a href="mailto:hello@example.ch">hello@example.ch</a>
          <a href="tel:+41445551212">+41 44 555 12 12</a>
          <a href="https://linkedin.com/company/example">LinkedIn</a>
          <a href="https://youtube.com/@example">YouTube</a>
          <button>Kostenlos starten</button>
          <form><label>E-Mail <input type="email"></label></form>
          <p>Echte Kundenbewertungen und Case-Studies sind verfügbar.</p>
          <p>${words}</p>
        </body>
      </html>`,
  };

  const signals = runSignals(context);
  const result = computeScore(signals);

  assertEquals(signals.length, 26);
  assert(
    signals.every((item) =>
      item.passed &&
      item.score === item.max_score &&
      (item.state === "measured" || item.state === "inferred")
    ),
    "Every signal in the perfect fixture must pass at full score",
  );
  assertEquals(
    signals.find((item) => item.id === "primary_cta")?.state,
    "inferred",
    "HTML-copy heuristics must not be labelled as direct measurements",
  );
  assertEquals(result.overall_score, 100);
  assertEquals(result.total_score, 88);
  assertEquals(result.total_max, 88);
  assertEquals(result.top_actions, []);
});

Deno.test("unavailable robots and sitemap probes stay neutral and localize transparently", () => {
  const context: SiteContext = {
    url: "https://example.ch",
    finalUrl: "https://example.ch",
    status: 200,
    responseTimeMs: 250,
    sizeBytes: 2_000,
    hasSitemap: null,
    hasRobots: null,
    headers: {},
    html: `<!doctype html><html lang="en"><head><title>Example business website</title></head><body><h1>Example</h1><p>This is a sufficiently long public homepage fixture for the signal engine.</p></body></html>`,
  };

  const signals = runSignals(context, "en");
  for (const id of ["sitemap", "robots"]) {
    const result = signals.find((item) => item.id === id);
    assert(result, `${id} signal must exist`);
    assertEquals(result.state, "unavailable");
    assertEquals(result.max_score, 0);
    assertEquals(result.score, 0);
    assert(
      result.evidence.includes("could not be checked reliably"),
      `${id} evidence must not claim that the file is missing`,
    );
  }

  const score = computeScore(signals);
  assert(
    !score.top_actions.some((action) =>
      action.signal_id === "sitemap" || action.signal_id === "robots"
    ),
    "Unavailable probes must not create remediation actions",
  );
});

Deno.test("zero-valued inputs score zero in every category", () => {
  const result = computeScore(
    CATEGORIES.map((category) =>
      signal(`${category}-zero`, category, 0, 10, false)
    ),
  );

  assertEquals(result.overall_score, 0);
  assertEquals(result.total_score, 0);
  assertEquals(result.total_max, 50);
  for (const category of CATEGORIES) {
    assertEquals(result.category_scores[category], {
      score: 0,
      max: 10,
      percent: 0,
    });
  }
});

Deno.test("unavailable inputs do not create denominator points or actions", () => {
  const unavailable = CATEGORIES.map((category) =>
    signal(`${category}-unavailable`, category, 0, 0, false, "unavailable")
  );
  const unavailableOnly = computeScore(unavailable);

  assertEquals(unavailableOnly.overall_score, 0);
  assertEquals(unavailableOnly.total_score, 0);
  assertEquals(unavailableOnly.total_max, 0);
  assertEquals(unavailableOnly.top_actions, []);

  const perfect = CATEGORIES.map((category) =>
    signal(`${category}-perfect`, category, 10, 10)
  );
  const withUnavailable = computeScore([...perfect, ...unavailable]);

  assertEquals(withUnavailable.overall_score, 100);
  assertEquals(withUnavailable.total_score, 50);
  assertEquals(withUnavailable.total_max, 50);
  assertEquals(withUnavailable.top_actions, []);
});

Deno.test("top actions are stable, weighted, ranked, and capped at five", () => {
  const signals: SignalResult[] = [
    signal("automation-first", "automation", 0, 10, false),
    signal("technical-second", "technical", 0, 10, false),
    signal("content-half", "content", 5, 10, false),
    signal("conversion-full-gap", "conversion", 0, 10, false),
    signal("trust-full-gap", "trust", 0, 10, false),
    signal("content-full-gap", "content", 0, 10, false),
    signal("technical-half", "technical", 5, 10, false),
  ];

  const first = computeScore(signals).top_actions;
  const second = computeScore(signals).top_actions;

  assertEquals(
    first,
    second,
    "Repeated scoring must produce identical actions",
  );
  assertEquals(first.map((action) => action.signal_id), [
    "conversion-full-gap",
    "content-full-gap",
    "trust-full-gap",
    "automation-first",
    "technical-second",
  ]);
  assertEquals(first.map((action) => action.rank), [1, 2, 3, 4, 5]);
  assertEquals(first.map((action) => action.impact), [25, 25, 20, 15, 15]);
});
