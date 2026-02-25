rate limiting,
Question: Should I:

- A) Keep ProtectedRoute as-is, just dynamic import the AdminLayout/BusinessLayout components
- B) Move auth check to layout and dynamic import the entire admin/business route chunks
- C) Add middleware-based auth (server-side) before dynamic importing
