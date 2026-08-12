# Live DAX scaffolding (reference only)

These files come from the Microsoft Fabric Data Apps template. The teaching demo on `master` uses committed tables in `src/lib/demo-report/migration-pulse-data.ts` instead.

When you wire a live semantic model:

1. Run `npx fabric-app-data generate -o src/fabric.generated.ts` after connecting a model.
2. Copy the modules below into `src/lib/` and `src/hooks/`.
3. Wrap the app in `AuthProvider` in `src/main.tsx`.
4. Add query barrels under `src/queries/` and use `useSemanticModelQuery` with `toDataTable`.

See `docs/CONCEPTS.md` for the data-layer overview.

## Files in this folder

| File | Copy to |
|------|---------|
| `fabric-client.ts` | `src/lib/fabric-client.ts` |
| `fabric-auth.ts` | `src/lib/fabric-auth.ts` |
| `rayfin-client.ts` | `src/lib/rayfin-client.ts` |
| `to-data-table.ts` | `src/lib/to-data-table.ts` |
| `to-data-table.spec.ts` | `src/lib/to-data-table.spec.ts` |
| `use-auth.tsx` | `src/hooks/use-auth.tsx` |
| `auth.context.ts` | `src/hooks/auth.context.ts` |

Required npm packages (add back to `package.json`):

- `@microsoft/fabric-app-data`
- `@microsoft/fabric-app-data-proxy`
- `@microsoft/rayfin-auth-provider-fabric`
- `@microsoft/rayfin-client`
- `@microsoft/fabric-app-data-cli` (devDependency, for `fabric-app-data generate`)
