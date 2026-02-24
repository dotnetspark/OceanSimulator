### Decision: Vite proxy as YARP equivalent for Aspire + Vite
**By:** Yadel Lopez (via Kane)
**What:** Use Vite's server.proxy to forward /api/* to the .NET backend. Only frontend port (5173) is externally exposed. API is internal-only in Aspire.
**Why:** Single exposed endpoint, cleaner dev experience, hides backend service details. YARP would require an extra .NET gateway project; Vite proxy achieves the same effect natively.
