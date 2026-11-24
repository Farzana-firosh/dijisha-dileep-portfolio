/** "How I test": the STLC as Dijisha works it, each step tied to a line of her resume, and the defect lifecycle
 *  (standard QA terms, not claims about her). A step can take `image: "/process/<id>.webp"` (3:2, decorative) to
 *  replace its line drawing. */

export const steps = [
  {
    id: "analyse",
    output: "Test scenarios",
    title: "Read the requirement",
    body: "Break the feature down into test scenarios before anything gets built or run.",
  },
  {
    id: "plan",
    output: "Test plan",
    title: "Plan",
    body: "Write the test plan: what gets tested, and which kinds of testing the change needs.",
  },
  {
    id: "design",
    output: "Test cases",
    title: "Design the cases",
    body: "Write and maintain test cases for the web and mobile versions of the application.",
  },
  {
    id: "execute",
    output: "Test results",
    title: "Execute",
    body: "Run functional, regression, smoke and UAT cycles. Manually end to end, with Selenium WebDriver where automation fits, and against the API in Postman.",
  },
  {
    id: "report",
    output: "Defect reports",
    title: "Report defects",
    body: "Log what fails in the bug tracker and follow each defect through its lifecycle until the fix is verified.",
  },
  {
    id: "close",
    output: "Test report",
    title: "Close the cycle",
    body: "Write the test report, then start again with the next sprint.",
  },
] as const;

export type DefectState = { id: string; label: string; meaning: string };

/** Main path, left to right. */
export const lifecycle: DefectState[] = [
  { id: "new", label: "New", meaning: "Logged with steps, expected and actual result. Waiting for triage." },
  { id: "assigned", label: "Assigned", meaning: "Triaged and handed to a developer." },
  { id: "open", label: "Open", meaning: "The developer is working on it." },
  { id: "fixed", label: "Fixed", meaning: "The developer has a fix. It comes back to QA." },
  { id: "retest", label: "Retest", meaning: "QA repeats the steps on the new build." },
  { id: "verified", label: "Verified", meaning: "The fix holds. Nothing else broke around it." },
  { id: "closed", label: "Closed", meaning: "Done. No further action." },
];

/** Branches off the main path. */
export const sideStates: DefectState[] = [
  { id: "reopened", label: "Reopened", meaning: "Retest failed: it still reproduces. Back to the developer." },
  { id: "rejected", label: "Rejected", meaning: "Not a defect: works as intended, a duplicate, or can't be reproduced." },
  { id: "deferred", label: "Deferred", meaning: "A real defect, scheduled for a later release." },
];

/** One defect's walk through the lifecycle, including a failed retest, for the "Play" button. */
export const sampleRun = ["new", "assigned", "open", "fixed", "retest", "reopened", "open", "fixed", "retest", "verified", "closed"];
