# Feedback: Canaries vs E2E Tests, Part 2: Designing the Stack

- Source: `src/content/drafts/Canaries vs E2E Tests, Part 2.md`
- Article: `src/content/articles/canaries-vs-e2e-tests-part-2.mdx`
- Status: Pending author review

## Requires a decision

## Technical accuracy

### [Medium] Synthetic-account sentence may reverse the intended meaning

- Location: “you do want real-user noise to affect your monitoring”
- Concern: The surrounding paragraph argues for a predictable, isolated synthetic account, so this sentence appears to be missing “not.” Adding it changes the claim rather than merely correcting grammar.
- Why it matters: As written, the recommendation conflicts with the stated reasons for isolating synthetic activity.
- Recommendation: Change it to: “You do not want the canary to affect real users, and you do not want unrelated user activity to contaminate the canary’s signal.”
- Status: Pending

### [Medium] Percentiles require an aggregation window

- Location: The login-canary output with `P50`, `P95`, and `P99`.
- Concern: A single canary run produces one duration. Percentiles become meaningful across a collection of runs over a stated period.
- Why it matters: Readers may interpret the sample as the output from one execution rather than a dashboard or query aggregating many executions.
- Recommendation: Introduce it as a dashboard summary, for example: “Over the last 24 hours, its dashboard might report…”
- Sources: [CloudWatch metrics published by canaries](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_metrics.html)
- Status: Pending

### [Medium] Failure-class table presents typical coverage as capability

- Location: “The honest ledger” comparison table.
- Concern: DNS, CDN, certificate, dependency, and configuration failures are not inherently impossible for pre-release E2E tests to detect. Detection depends on the environment and path under test. Production canaries are more likely to encounter production-specific failures, but the current yes/no framing is categorical.
- Why it matters: The article’s main argument is about environment, timing, and purpose, not absolute tool limitations.
- Recommendation: Rename the columns to “Typical pre-release E2E” and “Production synthetic canary,” then use terms such as “Broad,” “Limited,” “Production-specific,” and “Unsafe” rather than absolute yes/no values.
- Sources: [Grafana Synthetic Monitoring introduction](https://grafana.com/docs/grafana-cloud/observe-and-act/testing/synthetic-monitoring/introduction/)
- Status: Pending

### [Medium] The closing claim is more absolute than the article’s earlier model

- Location: “E2E tests prove that a workflow can work. Canaries continuously verify that the deployed workflow still works.”
- Concern: E2E tests provide evidence for a tested path in a particular environment. Scheduled canaries sample production repeatedly rather than continuously observing every request.
- Why it matters: “Prove” and “continuously” weaken an otherwise careful explanation of scope and coverage.
- Recommendation: Consider: “E2E tests build confidence that a workflow works before release. Canaries repeatedly check whether the deployed workflow still works.”
- Sources: [CloudWatch Synthetics canaries](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries.html)
- Status: Pending

### [Medium] Checkout success in RUM requires suitable instrumentation

- Location: “RUM: ‘97.6% of real customers successfully complete checkout’” in the source draft and the surrounding RUM explanation.
- Concern: RUM observes real sessions, browsers, performance, and errors, but a business outcome such as checkout completion requires the application or RUM setup to capture the relevant journey events.
- Why it matters: The current phrasing can imply that all RUM installations produce this metric automatically.
- Recommendation: Add “when the checkout journey is instrumented” or use a metric RUM captures directly, such as page-load performance or JavaScript error rate.
- Sources: [CloudWatch RUM API reference](https://docs.aws.amazon.com/cloudwatchrum/latest/APIReference/cloudwatchrum-api.pdf), [CloudWatch RUM data](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-view-data.html)
- Status: Pending

## Suggested additions

### [Low] Label the consecutive-failure policy as illustrative

- Location: “1 failure… 2 consecutive failures… 3 consecutive failures…”
- Concern: The paragraph reads like a general alerting prescription even though the next sentence acknowledges that criticality matters.
- Why it matters: Some systems use multiple probe locations, quorum rules, rolling success rates, or SLO burn-rate alerts instead of a fixed consecutive-failure threshold.
- Recommendation: Prefix the list with “For example, you might tier the response.” Optionally mention that multiple probes can reduce flapping caused by internet variability.
- Sources: [Grafana uptime and reachability](https://grafana.com/docs/grafana-cloud/observe-and-act/testing/synthetic-monitoring/analyze-results/uptime-and-reachability/), [CloudWatch canary SLOs](https://docs.aws.amazon.com/en_en/AmazonCloudWatch/latest/monitoring/CloudWatch-ServiceLevelObjectives.html)
- Status: Pending
