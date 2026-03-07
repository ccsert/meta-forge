# Stage Routing Reference

This skill wraps the existing meta-repo routing logic instead of redefining it.

Primary sources:

- `AI_ENTRYPOINT.md`
- `docs/ai-stage-routing.md`
- `playbooks/new-project.md`
- `standards/document-baseline.md`

Interpretation rule:

- Treat stage completion, task synchronization, and execution readiness as separate states
- Do not collapse "binding complete" into "execution started"
- Do not collapse "seed tasks created" into "full task tree synchronized"
