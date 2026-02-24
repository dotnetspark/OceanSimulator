# Work Routing

How to decide who handles what.

## Routing Table

| Work Type | Route To | Examples |
|-----------|----------|----------|
| Architecture, SOLID, design patterns, code review | Ripley | System design, layer separation, pattern selection, PR review |
| C# backend, simulation engine, domain logic, API | Dallas | Species behaviors, strategies, factories, snapshot engine, API controllers, persistence |
| React/TypeScript, UI, state management, real-time | Parker | Grid visualization, stats panel, WebSocket hooks, simulation controls, configuration inputs |
| SVG illustrations, visual design, CSS, graphs | Lambert | Species SVG components, UI styling, Recharts graph components, color palette |
| Tests (unit, integration, e2e), QA | Ash | xUnit tests, Jest tests, Playwright e2e, edge case analysis, coverage |
| Charts, data visualization, KPIs, ecosystem metrics | Bishop | Recharts components, chart strategy, meaningful stats, data transformations |
| Aspire orchestration, DevOps, service hosting, Docker | Kane | .NET Aspire AppHost, service discovery, npm/Vite integration, containerization, CI/CD |
| Session logging | Scribe | Automatic — never needs routing |
| Work queue, backlog monitoring | Ralph | Activated on demand |

## Issue Routing

| Label | Action | Who |
|-------|--------|-----|
| `squad` | Triage: analyze issue, assign `squad:{member}` label | Ripley |
| `squad:ripley` | Pick up issue and complete the work | Ripley |
| `squad:dallas` | Pick up issue and complete the work | Dallas |
| `squad:parker` | Pick up issue and complete the work | Parker |
| `squad:lambert` | Pick up issue and complete the work | Lambert |
| `squad:ash` | Pick up issue and complete the work | Ash |
| `squad:kane` | Pick up issue and complete the work | Kane |

## Rules

1. **Eager by default** — spawn all agents who could usefully start work simultaneously.
2. **Scribe always runs** after substantial work, always as `mode: "background"`. Never blocks.
3. **Quick facts → coordinator answers directly.** Don't spawn an agent for simple lookups.
4. **When two agents could handle it**, pick the one whose domain is the primary concern.
5. **"Team, ..." → fan-out.** Spawn all relevant agents in parallel as `mode: "background"`.
6. **Anticipate downstream work.** Ash writes tests from specs simultaneously while Dallas/Parker implement.
7. **Lambert works in parallel** with Parker — SVG components and graph components can be designed while Parker builds the shell.
