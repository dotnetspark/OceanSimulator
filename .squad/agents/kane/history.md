# Kane's Project Knowledge

## Project Context (Seeded at Creation)

**Owner:** Yadel Lopez  
**Stack:** C# (.NET 8), Clean Architecture, xUnit, React 18, TypeScript, Vite, Recharts, Playwright, Jest  
**Description:** Full-stack marine ecosystem simulator — 2D grid world with Plankton, Sardines, Sharks, Crabs, and Reefs evolving through Snapshots with predator-prey dynamics, breeding, and starvation mechanics.

**Current Architecture:**
- Backend API: `backend/OceanSimulator.Api/` (port 5001)
- Frontend: `frontend/` (React + Vite, port 5173)
- Currently requires manual startup of both services side by side

**Assignment:** Implement .NET Aspire orchestration to unify local development experience.

---

## Learnings

### 2025-02 — .NET Aspire Orchestration Implementation

**Task:** Implement .NET Aspire orchestration to unify development experience for OceanSimulator.

**Architecture Decisions:**
- Created `backend/OceanSimulator.AppHost/` to orchestrate both API and Vite frontend
- Created `backend/OceanSimulator.ServiceDefaults/` for shared Aspire configuration (telemetry, health checks, service discovery)
- Used `AddNpmApp()` to integrate Vite frontend with proper working directory path (`../../../frontend` from AppHost)
- API now uses `builder.AddServiceDefaults()` for OpenTelemetry, health checks, and resilience

**Key Patterns:**
- Aspire workload installation: `dotnet workload install aspire` (now deprecated in favor of NuGet packages)
- AppHost SDK: `Aspire.AppHost.Sdk/13.0.0`
- Node.js integration: `Aspire.Hosting.NodeJs` NuGet package
- Service defaults pattern: Shared project referenced by all services for consistent telemetry/health configuration

**CORS Configuration for Aspire:**
- Updated API CORS to accept both local (`http://localhost:5173`) and Aspire service discovery origins (`http://frontend`, `https://frontend`)
- Service discovery allows frontend to reference backend as `http://api` via Aspire's internal DNS

**Target Framework Alignment:**
- All projects must target the same .NET version (net8.0 in this case)
- ServiceDefaults and AppHost initially generated as net10.0, manually corrected to net8.0 to match API

**File Paths:**
- AppHost: `backend/OceanSimulator.AppHost/AppHost.cs`
- ServiceDefaults: `backend/OceanSimulator.ServiceDefaults/Extensions.cs`
- API integration: `backend/OceanSimulator.Api/Program.cs` (added `builder.AddServiceDefaults()`)

**User Preferences:**
- Single command startup preferred: `dotnet run --project backend/OceanSimulator.AppHost`
- Aspire Dashboard provides unified view of logs, metrics, traces, and health
- Manual startup still supported for individual projects

**GitHub Workflow:**
- Created issue #30 for tracking
- Created PR #31 from branch `feature/aspire-orchestration`
- Branched from `origin/main` to avoid local diverged commits

### 2025-02 — .NET 10.0 Migration and Aspire Version Fix

**Task:** Fix Aspire orchestration issues on `feature/aspire-orchestration` branch.

**Problems Fixed:**
1. **Target Framework Migration:** Upgraded all 7 projects from net8.0 to net10.0 to align with .NET SDK 10.0.100
   - OceanSimulator.Api, Application, Domain, Infrastructure, Tests, ServiceDefaults, AppHost
2. **Aspire SDK Version:** Changed from invalid `Aspire.AppHost.Sdk/13.0.0` to `9.3.0`
   - Added missing `Aspire.Hosting.AppHost` package reference (required for Aspire 9.x)
   - Updated `Aspire.Hosting.NodeJs` from 9.5.2 to 9.3.0 for version consistency
3. **Frontend Path:** Corrected relative path from `../../../frontend` to `../../frontend` in AppHost.cs

**Key Learnings:**
- Aspire workload is deprecated in .NET 10.0; uses NuGet packages instead
- Aspire 9.x requires explicit `Aspire.Hosting.AppHost` package reference
- ASPIRE002 warning about missing dependencies is a known false positive with Aspire 9.3.0 + .NET 10.0 (project builds successfully)
- AppHost projects don't support `Rebuild` target with `--no-incremental` flag
- Solution builds successfully with 4 warnings (1 ASPIRE002, 1 NU1503, 1 NU1510 about SignalR, all non-critical)

**Commit:** `d7ece31` - "fix: upgrade all projects to net10.0, fix Aspire SDK version and frontend path"

### 2025-02 — .gitignore Setup and Vite Proxy Integration

**Tasks:** Add .gitignore for .NET/Node.js monorepo and configure Vite proxy for single-port development.

**Key Learnings:**
- `.gitignore` pattern for .NET + Node.js monorepos: Must cover `**/bin/`, `**/obj/`, `**/node_modules/`, IDE files (`.vs/`, `.vscode/`), and test artifacts
- Vite proxy pattern for Aspire service discovery: Use `server.proxy` in `vite.config.ts` to forward `/api/*` requests to backend
- `services__api__http__0` Aspire env var convention for service URLs: Aspire injects service discovery URLs via this pattern
- Single exposed port architecture: Only frontend (5173) is externally accessible; API is internal-only in Aspire, accessed via Vite proxy
- Vite proxy as YARP equivalent: Achieves same reverse-proxy behavior as YARP without requiring additional .NET gateway project

**Implementation Details:**
- Created `.gitignore` at repo root with patterns for .NET build artifacts, Node.js modules, Playwright artifacts, IDE files, and OS files
- Removed all tracked `bin/` and `obj/` directories from git index (408 files) without deleting from disk
- Updated `frontend/vite.config.ts` with `server.proxy` block forwarding `/api` to backend using `services__api__http__0` env var
- Removed `.WithExternalHttpEndpoints()` from API resource in `backend/OceanSimulator.AppHost/AppHost.cs` to make it internal-only
- Frontend keeps `.WithExternalHttpEndpoints()` as the single external entry point

**Commits:**
- `e90a85f` - "chore: add .gitignore and remove tracked build artifacts"
- `941871a` - "feat: add Vite proxy to hide API behind frontend (single exposed port)"

### 2025-02 — YARP Reverse Proxy Integration

**Task:** Replace Vite `server.proxy` with proper Aspire YARP reverse proxy for production-ready single endpoint architecture.

**Package Used:**
- `Aspire.Hosting.Yarp` version `9.5.2-preview.1.25522.3`
- Compatible with Aspire 9.3.0 and .NET 10.0
- Official Microsoft Aspire package for YARP integration

**API Pattern:**
```csharp
var proxy = builder.AddYarp("oceanproxy")
    .WithExternalHttpEndpoints()
    .WithConfiguration(yarp =>
    {
        // Route API calls to backend
        yarp.AddRoute("/api/{**catch-all}", api);
        
        // Catch-all route for frontend (default)
        yarp.AddRoute(frontend);
    });
```

**Key Methods:**
- `builder.AddYarp(name)` — Creates YARP reverse proxy resource
- `.WithExternalHttpEndpoints()` — Makes proxy the only externally accessible endpoint
- `.WithConfiguration(yarp => {...})` — Configures routing rules
- `yarp.AddRoute(path, target)` — Adds route with path pattern to target resource
- `yarp.AddRoute(target)` — Adds catch-all route (no path prefix)

**Architecture Changes:**
- YARP proxy is now the single external endpoint (replaces frontend direct exposure)
- API remains internal-only (no `.WithExternalHttpEndpoints()`)
- Frontend remains internal-only (no `.WithExternalHttpEndpoints()`)
- `/api/*` requests routed to API resource
- All other requests routed to frontend resource (Vite dev server)
- Removed Vite `server.proxy` configuration (no longer needed)

**Why YARP over Vite Proxy:**
- Production-ready reverse proxy (YARP is Microsoft's production proxy)
- Works in both dev and publish modes (Vite proxy only works in dev)
- Proper gateway pattern for microservices
- Supports advanced features (load balancing, transforms, health checks)
- Single external endpoint for all traffic

**Aspire SDK Build Behavior:**
- Aspire.AppHost.Sdk 9.3.0 uses special build targets (no traditional DLL output in bin/)
- AppHost projects must be run with `dotnet run`, not `dotnet run --no-build`
- "Build succeeded" validates syntax and dependencies, doesn't produce standalone executable
- AppHost projects don't support `Clean` or `Rebuild` targets
- ASPIRE002 warning is expected with current SDK version combination

**Commit:** `1305048` - "feat: replace Vite proxy with Aspire YARP reverse proxy (single external endpoint)"


