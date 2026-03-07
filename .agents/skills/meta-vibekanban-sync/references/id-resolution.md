# VibeKanban ID Resolution

Preferred resolution order:

1. `organization_id` via `list_organizations`
2. `project_id` via `list_projects(organization_id)`
3. `repo_id` via `list_repos`
4. `board_id` only if exposed by the current MCP tool path or explicitly required

Rules:

- `board_id` is not required if the active flow does not depend on it
- Repository binding must exist before `repo_id` can be treated as valid
- Issue creation is allowed only after `project_id` is known
