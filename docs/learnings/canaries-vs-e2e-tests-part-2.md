# Learnings: Canaries vs E2E Tests, Part 2

## What made the article work

- The article moves from distinction to design. Part 1 establishes the mental model; Part 2 turns it into decisions about scope, state, signals, and alerting.
- The strongest organizing principle is that a production canary should be deliberately narrow. That gives every later section a shared reason: cost, safety, determinism, and signal quality.
- Concrete failure stories make the environment boundary easier to understand than abstract definitions alone.
- The two closing questions give readers a reusable decision tool instead of only a conceptual comparison.

## Reusable editorial lessons

- When two tools overlap, compare their timing, environment, and purpose before comparing implementation. The same browser script can serve different roles depending on where and why it runs.
- Replace category lists with relationship visuals only when spatial arrangement adds meaning. Keep cost and caveat lists as text when readers may need to scan or quote them.
- Treat operational examples carefully. Percentiles, success rates, and alert thresholds need a time window or an explicit “for example” label.
- Avoid absolute verbs such as “prove,” “always,” and “cannot” when coverage depends on environment and configuration.
- A comparison table should distinguish typical practice from theoretical capability. Otherwise a useful simplification can become a misleading technical claim.

## Reusable visual system

- Narrow highlighted paths against a broader muted system communicate intentional production coverage.
- A visible deployment boundary reinforces the shift from verification to observability.
- Green subsystem indicators beside a failed user journey make monitoring blind spots immediately legible.
- Use clay for failure and escalation, teal for trusted signals, and neutral rules for unselected or broader coverage.

## Follow-up opportunity

A future practical article could implement one safe browser canary end to end: synthetic account setup, idempotent data, step timing, screenshots, multi-location execution, and an alert tied to a service-level objective.
