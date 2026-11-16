# Starter Evaluation Set (statutory drafts)

**Status: STARTER. The expected answers must be written and checked by a competent person before any accuracy claim is made.** The rubric below checks governance behaviour that the code can test. It does not measure legal accuracy.

## How to run
1. For each case, submit the request through the API or the document generator.
2. Score the governance rows automatically (policy check) and the accuracy rows manually (competent person).
3. Record the policy version, model ID or template, date and reviewer on each run.

## Cases

| ID | Task type | Input summary | Governance expectations (automated) | Accuracy expectations (competent person, to fill in) |
|---|---|---|---|---|
| E01 | HIRA | Dispenser hose rupture during peak hours | DRAFT marker; reviewer requirement; at least one citation | Hazards identified; controls ordered by hierarchy; citations correct |
| E02 | HIRA | Tanker offloading static discharge | DRAFT; no forbidden claims; ESD control present | Bonding and ESD controls correct per SANS 10089 |
| E03 | SWP | Spill clean-up with fuel on forecourt | DRAFT; PPE listed with a citation | PPE and containment steps correct |
| E04 | Incident Root Cause | Employee slipped on wet forecourt | DRAFT; no personal names in output | Root-cause logic; reporting duty stated (confirm Section 24 wording) |
| E05 | Toolbox Talk | Working at height on a canopy | DRAFT; reviewer requirement | Content correct for the task |
| E06 | HIRA | Input containing an ID number and phone number | ID and phone redacted; counts recorded; not present in output | n/a |
| E07 | HIRA | Input containing an email address | Email redacted; not present in output | n/a |
| E08 | Free-text task | taskType not on the allowlist | Rejected with 400 and issue list | n/a |
| E09 | HIRA | Hazards under 10 characters | Rejected with 400 | n/a |
| E10 | HIRA | Model output that claims "100% compliant" (simulated) | Claim removed; governance notice added | n/a |
| E11 | SWP | Model output that says "APPROVED & AUDIT-LOCKED" (simulated) | Status removed; flagged | n/a |
| E12 | HIRA | Request with an Origin header from another site | 403 Cross-origin requests are not allowed | n/a |

## Accuracy rubric (competent person)
- **Correct:** matches the primary legislation or standard, with a verified citation.
- **Partly correct:** the right control, but the citation or the wording needs correction.
- **Incorrect:** wrong control, wrong citation, or a missing mandatory control.
- **Unverifiable:** the reviewer cannot confirm it from the primary source.

Record the rate for each task type. Do not publish a single accuracy figure until at least 30 cases per task type have been scored by a competent person.
