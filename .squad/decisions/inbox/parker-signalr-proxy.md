# SignalR Proxy Configuration Needed

**From:** Parker (Frontend Dev)  
**Date:** 2026-02-24  
**Context:** Relative API paths migration

## Issue

SignalR WebSocket connection now uses relative path `/hubs/simulation` instead of hardcoded `http://localhost:5000/hubs/simulation`.

The current Vite proxy config only handles `/api` → backend API. SignalR WebSocket upgrades may fail because `/hubs/*` is not proxied.

## Recommendation

Add a separate proxy entry in `frontend/vite.config.ts` for SignalR hubs:

```typescript
proxy: {
  '/api': {
    target: apiTarget,
    changeOrigin: true
  },
  '/hubs': {
    target: apiTarget,
    changeOrigin: true,
    ws: true  // Enable WebSocket proxy
  }
}
```

## Testing

1. Start Aspire AppHost
2. Open frontend in browser
3. Check browser console for SignalR connection errors
4. If connection succeeds, no proxy needed (YARP may already handle it)
5. If connection fails with 404 or connection refused, add the `/hubs` proxy entry

## Files

- `frontend/vite.config.ts` — proxy configuration
- `frontend/src/hooks/useSignalR.ts` — SignalR connection code
