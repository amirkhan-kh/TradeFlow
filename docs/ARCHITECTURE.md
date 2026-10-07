# Architecture

Smallest correct cut. One truth per fact. Same domain name on API and UI.

Write-path in 30s: `router → service → repository`.

FE: thin route, `features/<domain>`, `shared/ui` only.

No god files, circular imports, extra packages “for scale”, second state lib, drifting copy-paste types.

New module = new folder + TASKS line.