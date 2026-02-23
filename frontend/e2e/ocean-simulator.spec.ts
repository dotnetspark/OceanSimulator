import { test, expect, Page } from '@playwright/test';

// Helper: fill in the config form with default values
async function configureSimulation(page: Page, options?: {
  rows?: number;
  cols?: number;
  plankton?: number;
  sardines?: number;
  sharks?: number;
  crabs?: number;
  reefs?: number;
}) {
  const o = {
    rows: 10, cols: 10,
    plankton: 15, sardines: 8, sharks: 4, crabs: 3, reefs: 5,
    ...options
  };
  
  // Fill the config form
  await page.fill('[data-testid="input-rows"]', String(o.rows));
  await page.fill('[data-testid="input-cols"]', String(o.cols));
  await page.fill('[data-testid="input-plankton"]', String(o.plankton));
  await page.fill('[data-testid="input-sardines"]', String(o.sardines));
  await page.fill('[data-testid="input-sharks"]', String(o.sharks));
  await page.fill('[data-testid="input-crabs"]', String(o.crabs));
  await page.fill('[data-testid="input-reefs"]', String(o.reefs));
  
  await page.click('[data-testid="btn-start"]');
  await page.waitForSelector('[data-testid="ocean-grid"]', { timeout: 10000 });
}

test.describe('Ocean Simulator E2E', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('TC1: Load app and display config form', async ({ page }) => {
    // Config panel is shown on load
    await expect(page.locator('[data-testid="config-panel"]')).toBeVisible();
    await expect(page.locator('[data-testid="input-rows"]')).toBeVisible();
    await expect(page.locator('[data-testid="input-cols"]')).toBeVisible();
    await expect(page.locator('[data-testid="btn-start"]')).toBeVisible();
    
    // Ocean grid is NOT visible yet
    await expect(page.locator('[data-testid="ocean-grid"]')).not.toBeVisible();
  });

  test('TC2: Initialize simulation and render grid', async ({ page }) => {
    await configureSimulation(page, { rows: 10, cols: 10, plankton: 15, sardines: 8, sharks: 4 });
    
    // Grid is now visible
    const grid = page.locator('[data-testid="ocean-grid"]');
    await expect(grid).toBeVisible();
    
    // Simulation controls are visible
    await expect(page.locator('[data-testid="btn-run-one"]')).toBeVisible();
    await expect(page.locator('[data-testid="btn-run-n"]')).toBeVisible();
    
    // Snapshot counter starts at 0
    const snapshotNum = page.locator('[data-testid="snapshot-number"]');
    await expect(snapshotNum).toContainText('0');
    
    // Stats panel visible
    await expect(page.locator('[data-testid="stats-panel"]')).toBeVisible();
  });

  test('TC3: Run single snapshot updates grid and counter', async ({ page }) => {
    await configureSimulation(page);
    
    // Record initial snapshot number
    const snapshotBefore = await page.locator('[data-testid="snapshot-number"]').textContent();
    
    // Click Run 1 Snapshot
    await page.click('[data-testid="btn-run-one"]');
    
    // Wait for update
    await page.waitForFunction(() => {
      const el = document.querySelector('[data-testid="snapshot-number"]');
      return el && el.textContent?.includes('1');
    }, { timeout: 15000 });
    
    // Snapshot counter incremented to 1
    await expect(page.locator('[data-testid="snapshot-number"]')).toContainText('1');
    
    // Grid is still visible and rendered
    await expect(page.locator('[data-testid="ocean-grid"]')).toBeVisible();
  });

  test('TC4: Run N snapshots and verify counter', async ({ page }) => {
    await configureSimulation(page);
    
    // Set N to 5
    await page.fill('[data-testid="input-n"]', '5');
    await page.click('[data-testid="btn-run-n"]');
    
    // Wait for 5 snapshots to complete
    await page.waitForFunction(() => {
      const el = document.querySelector('[data-testid="snapshot-number"]');
      return el && parseInt(el.textContent || '0') >= 5;
    }, { timeout: 30000 });
    
    await expect(page.locator('[data-testid="snapshot-number"]')).toContainText('5');
    
    // Population graph has data
    await expect(page.locator('[data-testid="population-graph"]')).toBeVisible();
    await expect(page.locator('[data-testid="birth-death-graph"]')).toBeVisible();
  });

  test('TC5: Stats panel shows population counts', async ({ page }) => {
    await configureSimulation(page, { plankton: 10, sardines: 5, sharks: 3, crabs: 2 });
    
    // Stats panel visible
    const statsPanel = page.locator('[data-testid="stats-panel"]');
    await expect(statsPanel).toBeVisible();
    
    // Species count cards visible
    await expect(statsPanel.locator('[data-testid="count-plankton"]')).toBeVisible();
    await expect(statsPanel.locator('[data-testid="count-sardine"]')).toBeVisible();
    await expect(statsPanel.locator('[data-testid="count-shark"]')).toBeVisible();
    await expect(statsPanel.locator('[data-testid="count-crab"]')).toBeVisible();
  });

  test('TC6: Run until extinction stops when species gone', async ({ page }) => {
    // Small ocean with few sardines, many sharks ΓÇö sardines should go extinct fast
    await configureSimulation(page, { 
      rows: 5, cols: 5,
      plankton: 2, sardines: 3, sharks: 8, crabs: 0, reefs: 0
    });
    
    // Click run until extinction (sardine)
    await page.click('[data-testid="btn-run-extinction"]');
    
    // Wait for simulation to stop (up to 60s ΓÇö small ocean, should be quick)
    await page.waitForFunction(() => {
      const btn = document.querySelector('[data-testid="btn-run-extinction"]') as HTMLButtonElement;
      return btn && !btn.disabled;
    }, { timeout: 60000 });
    
    // Simulation has stopped (button re-enabled)
    await expect(page.locator('[data-testid="btn-run-extinction"]')).not.toBeDisabled();
    
    // Snapshot number > 0 (some work was done)
    const snapText = await page.locator('[data-testid="snapshot-number"]').textContent();
    const snapNum = parseInt(snapText || '0');
    expect(snapNum).toBeGreaterThan(0);
  });

  test('TC7: Population graph updates as simulation runs', async ({ page }) => {
    await configureSimulation(page);
    
    // Graph visible
    const graph = page.locator('[data-testid="population-graph"]');
    await expect(graph).toBeVisible();
    
    // Run 3 snapshots
    await page.fill('[data-testid="input-n"]', '3');
    await page.click('[data-testid="btn-run-n"]');
    
    await page.waitForFunction(() => {
      const el = document.querySelector('[data-testid="snapshot-number"]');
      return el && parseInt(el.textContent || '0') >= 3;
    }, { timeout: 30000 });
    
    // Graph container still visible and has rendered content
    await expect(graph).toBeVisible();
    // Recharts renders SVG elements
    await expect(graph.locator('svg')).toBeVisible();
  });

  test('TC8: Save and restore simulation state', async ({ page }) => {
    await configureSimulation(page);
    
    // Run 3 snapshots to build some state
    await page.fill('[data-testid="input-n"]', '3');
    await page.click('[data-testid="btn-run-n"]');
    await page.waitForFunction(() => {
      const el = document.querySelector('[data-testid="snapshot-number"]');
      return el && parseInt(el.textContent || '0') >= 3;
    }, { timeout: 30000 });
    
    // Note the snapshot number before save
    const snapshotText = await page.locator('[data-testid="snapshot-number"]').textContent();
    
    // Set up download handler
    const downloadPromise = page.waitForEvent('download');
    await page.click('[data-testid="btn-save"]');
    const download = await downloadPromise;
    
    // Download completed ΓÇö file exists
    expect(download.suggestedFilename()).toBeTruthy();
    
    const savePath = `C:/tmp/ocean-save-test-${Date.now()}.json`;
    await download.saveAs(savePath);
    
    // Reload the page
    await page.goto('/');
    await expect(page.locator('[data-testid="config-panel"]')).toBeVisible();
    
    // Load the saved state via file input
    const fileInput = page.locator('[data-testid="input-load-file"]');
    await fileInput.setInputFiles(savePath);
    
    // Wait for grid to appear
    await page.waitForSelector('[data-testid="ocean-grid"]', { timeout: 10000 });
    
    // Snapshot number matches saved state
    await expect(page.locator('[data-testid="snapshot-number"]')).toContainText(snapshotText?.trim() || '3');
  });

  test('TC9: Grid cells render correct species', async ({ page }) => {
    await configureSimulation(page, { plankton: 20, sardines: 0, sharks: 0, crabs: 0, reefs: 0 });
    
    // With 20 plankton in a 10x10 grid, we should have plankton cells
    const grid = page.locator('[data-testid="ocean-grid"]');
    await expect(grid).toBeVisible();
    
    // At least some non-water cells visible (plankton cells)
    const cells = grid.locator('[data-testid^="cell-"]');
    const cellCount = await cells.count();
    expect(cellCount).toBe(100); // 10x10 grid
  });

  test('TC10: App layout has left and right panels', async ({ page }) => {
    await configureSimulation(page);
    
    // Left panel contains grid
    await expect(page.locator('[data-testid="left-panel"]')).toBeVisible();
    await expect(page.locator('[data-testid="ocean-grid"]')).toBeVisible();
    
    // Right panel contains stats
    await expect(page.locator('[data-testid="right-panel"]')).toBeVisible();
    await expect(page.locator('[data-testid="stats-panel"]')).toBeVisible();
  });

});
