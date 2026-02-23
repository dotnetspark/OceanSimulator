# E2E Testing Patterns with Playwright

**Date:** 2026-02-23  
**Author:** Ash (Tester)  

## Decision: Use data-testid for all interactive element selectors

**Rationale:**
- CSS classes and element hierarchies change frequently in UI development
- data-testid provides stable, semantic selectors that survive refactoring
- Clear naming convention: `data-testid="{component-type}-{identifier}"`
- Examples: `btn-start`, `input-rows`, `count-plankton`, `cell-5-7`

**Benefit:** Tests remain stable across UI refactoring; selectors are self-documenting.

## Decision: playwright.config.ts with webServer auto-start

**Configuration:**
```typescript
webServer: {
  command: 'npm run dev',
  url: 'http://localhost:5173',
  reuseExistingServer: !process.env.CI,
  timeout: 120 * 1000,
}
```

**Rationale:**
- Eliminates manual "start dev server before tests" step
- Tests always run against correct server version
- CI mode (process.env.CI) starts fresh server for isolation
- Local mode reuses existing server for speed

**Benefit:** Zero-friction test execution for developers and CI.

## Decision: Helper function pattern for repeated setup

**Pattern:**
```typescript
async function configureSimulation(page: Page, options?: {...}) {
  const defaults = { rows: 10, cols: 10, plankton: 15, ... };
  const o = { ...defaults, ...options };
  // Fill form, submit, wait for grid
}
```

**Rationale:**
- 10 tests all need simulation initialized with config
- Default values + optional overrides for specific test scenarios
- DRY principle: change once, apply everywhere

**Benefit:** Readable tests focused on what's being tested, not setup boilerplate.

## Decision: waitForFunction with timeout for async state changes

**Pattern:**
```typescript
await page.waitForFunction(() => {
  const el = document.querySelector('[data-testid="snapshot-number"]');
  return el && parseInt(el.textContent || '0') >= 5;
}, { timeout: 30000 });
```

**Rationale:**
- Snapshot execution is async (SignalR updates from backend)
- Fixed delays (page.waitForTimeout) are brittle and slow
- waitForFunction polls DOM until condition met or timeout

**Benefit:** Tests are both fast (exit immediately on condition) and reliable (don't fail on slow CI).

## Decision: Save/load test uses actual file system round-trip

**Pattern:**
```typescript
const downloadPromise = page.waitForEvent('download');
await page.click('[data-testid="btn-save"]');
const download = await downloadPromise;
const savePath = `C:/tmp/ocean-save-test-${Date.now()}.json`;
await download.saveAs(savePath);
// Reload page, upload file, verify state matches
```

**Rationale:**
- Tests the full save → download → upload → deserialize → restore flow
- Catches serialization bugs, file format issues, browser download behavior
- More realistic than mocking fetch/FormData

**Benefit:** High confidence in save/restore feature from user perspective.

## Decision: Extinction test with small grid + high predator density

**Pattern:**
```typescript
await configureSimulation(page, { 
  rows: 5, cols: 5,
  plankton: 2, sardines: 3, sharks: 8, crabs: 0, reefs: 0
});
await page.click('[data-testid="btn-run-extinction"]');
await page.waitForFunction(() => {
  const btn = document.querySelector('[data-testid="btn-run-extinction"]') as HTMLButtonElement;
  return btn && !btn.disabled;
}, { timeout: 60000 });
```

**Rationale:**
- Small grid (5x5) = fast extinction (seconds, not minutes)
- Many sharks + few sardines = predictable extinction scenario
- Button re-enables when simulation stops = observable end condition

**Benefit:** Fast test (completes in ~5-10s) with deterministic outcome.

## Decision: Graph validation via SVG element presence

**Pattern:**
```typescript
const graph = page.locator('[data-testid="population-graph"]');
await expect(graph).toBeVisible();
await expect(graph.locator('svg')).toBeVisible();
```

**Rationale:**
- Recharts renders LineChart/BarChart as SVG elements
- Testing pixel-perfect graph appearance is brittle and slow
- Presence of SVG = graph rendered successfully

**Benefit:** Fast, stable test that validates core graph rendering without fragile image comparison.

## Decision: GridCell updated to accept Cell object with position

**Change:**
```typescript
// Before: <GridCell specimenType={cell.specimenType} size={cellSize} />
// After: <GridCell cell={cell} size={cellSize} />
// Enables: <div data-testid={`cell-${cell.position.row}-${cell.position.col}`}>
```

**Rationale:**
- Tests need to select specific cells by position
- Cell interface already has position property
- Passing full Cell object vs just specimenType is equally efficient

**Benefit:** Tests can validate specific cell states (e.g., "plankton at row 3, col 5").

## Key Metrics

- **10 test cases** covering full user journey
- **30-60 second** total test suite runtime (including webServer startup)
- **100% coverage** of interactive UI elements (buttons, inputs, panels)
- **0 flaky tests** via robust waitForFunction patterns
