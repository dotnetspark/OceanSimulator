### Decision: Use Aspire YARP proxy as single external endpoint

**By:** Yadel Lopez (executed by Kane)  
**Date:** 2025-02-24  
**Branch:** `feature/aspire-orchestration`  
**Commit:** `1305048`

**What:**  
Replaced Vite `server.proxy` with `Aspire.Hosting.Yarp` (v9.5.2-preview) as the single external endpoint for the application. YARP proxy routes `/api/{**catch-all}` to the API and all other traffic to the frontend. API and Vite dev server are now internal-only resources.

**Why:**  
- **Production-ready:** YARP is Microsoft's production reverse proxy (used in Azure, high-performance)
- **Consistent behavior:** Works identically in dev and publish modes (Vite proxy only works in dev)
- **Proper gateway pattern:** Single entry point for microservices architecture
- **Advanced features:** Supports load balancing, transforms, circuit breakers, health checks
- **Cleaner separation:** Frontend doesn't need to know about backend routing

**Implementation:**
```csharp
var proxy = builder.AddYarp("oceanproxy")
    .WithExternalHttpEndpoints()
    .WithConfiguration(yarp =>
    {
        yarp.AddRoute("/api/{**catch-all}", api);  // API routes
        yarp.AddRoute(frontend);                    // Catch-all for frontend
    });
```

**Trade-offs:**
- **Pro:** Production-ready, feature-rich, consistent dev/prod behavior
- **Pro:** Single port exposed (simpler firewall/networking)
- **Pro:** YARP can serve static files in publish mode (future enhancement)
- **Con:** Adds dependency on preview package (9.5.2-preview)
- **Con:** Slightly more complex than Vite proxy for dev-only scenarios

**Alternatives Considered:**
1. **Keep Vite proxy:** Simpler but dev-only, not production-ready
2. **Custom gateway project:** More control but requires maintaining custom code
3. **Frontend as direct endpoint:** Simpler but requires CORS configuration and doesn't scale to multiple services

**Decision:** Use YARP for better production readiness and alignment with Aspire best practices.
