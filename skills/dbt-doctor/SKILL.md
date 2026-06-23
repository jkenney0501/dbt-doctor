---
name: dbt-doctor
description: Static analysis and health checks for dbt projects. Use before committing SQL/YAML or when enforcing CI quality gates.
version: "1.0.0"
---

# dbt-doctor

Static analysis and health checks for dbt projects.

Find missing docs, missing tests, schema drift risks, stale models, DAG maintainability issues, and CI quality gate failures.

## After making dbt changes

Run `npx dbt-doctor@latest --verbose --diff` and check the score did not regress.

## Command

```bash
npx dbt-doctor@latest --verbose --diff
```

| Flag        | Purpose                                       |
| ----------- | --------------------------------------------- |
| `.`         | Scan current directory                        |
| `--verbose` | Show affected files and line numbers per rule |
| `--diff`    | Only scan changed files vs base branch        |
| `--score`   | Output only the numeric score                 |
| `--offline` | Local score only (no API)                     |

Requires Python + `sqlfluff` for full SQL linting: `pip install sqlfluff sqlfluff-templater-dbt`
