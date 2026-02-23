# Frontend Architecture Patterns

**Context:** Implementing React frontend for Ocean Simulator with real-time updates, grid visualization, and control panel.

**Decisions:**

1. **State Management:** Reducer pattern over Context API
   - `useSimulation` hook wraps reducer for cleaner component interface
   - Actions: INITIALIZED, SNAPSHOT_COMPLETED, RUNNING, LOADED
   - History arrays (population, births, deaths) stored in state for graphing
   - Rationale: Predictable state transitions for async operations; easy to debug

2. **Grid Rendering:** Adaptive cell sizing with React.memo
   - Formula: `Math.max(20, Math.min(40, Math.floor(600 / Math.max(rows, cols))))`
   - GridCell memoized to prevent unnecessary re-renders on large grids
   - Color mapping as placeholder until SVG components ready
   - Rationale: Performance on 100x100 grids; smooth transition to SVG components

3. **API Layer:** Typed fetch wrappers in `simulationApi.ts`
   - Environment variable `VITE_API_URL` with localhost fallback
   - Separate method per endpoint (initialize, runSnapshot, runN, etc.)
   - File upload uses FormData; save returns Blob with client-side download trigger
   - Rationale: Type safety; single source of truth for API URLs; testable

4. **SignalR Integration:** Auto-reconnect with useRef pattern
   - Connection stored in ref to prevent re-creation on renders
   - `withAutomaticReconnect()` handles network interruptions
   - Event callback passed as dependency
   - Rationale: Reliable real-time updates during long-running simulations

5. **Component Layout:** Two-panel desktop layout
   - Left: Grid (visual) + Controls (interaction)
   - Right: Stats panel (graphs from Lambert)
   - Grid container centers content with flexbox
   - Tailwind utility classes for spacing and backgrounds
   - Rationale: Clear separation of concerns; works well on 1920x1080+ displays

6. **Configuration UX:** Multi-step form → immediate start
   - Single ConfigPanel shown pre-simulation
   - All thresholds/populations configurable
   - "Start Simulation" initializes and switches to simulation view
   - No back button (user can refresh to reconfigure)
   - Rationale: Simple flow; configuration rarely changes mid-simulation

**Rejected Alternatives:**
- Redux: Too heavy for single-user simulation app
- Canvas rendering: Less flexible than DOM for per-cell interactions
- Inline API calls in components: Hard to test and mock

**Next Steps:**
- Lambert integrates SVG components → replace color squares in GridCell
- Add energy graph when backend provides energy data endpoint
- Consider adding pause/resume for long-running simulations
