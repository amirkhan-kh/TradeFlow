# Backend

Language from `STACK.md`. API tasks only.
backend/app|src/ core/ modules// models schemas repository service router


`router → service → repository → db`. Rules in service. SQL in repository.
Typed I/O. Edge validation. Authz deny-by-default. Transactions. Idempotent money/stock. Paginate. Migrations. Secrets in env.
`/api/v1/<module>` · 201/204/409/422.
No extra framework. No empty future modules.