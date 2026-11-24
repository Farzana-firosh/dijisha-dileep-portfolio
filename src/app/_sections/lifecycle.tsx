import { DefectLifecycle } from "@/components/defect-lifecycle";
import { PageCheck } from "@/components/page-check";

/** The defect lifecycle wheel, with this page's own test run beside it, on one sheet of paper. The sheet arrives
 *  crumpled and unfolds as it scrolls in (CSS, `.crumple-in`). */
export function Lifecycle() {
  return (
    <section id="lifecycle" aria-labelledby="lifecycle-title" className="wrap py-14 sm:py-16">
      <div className="crumple-in sheet-paper relative rounded-[1.75rem] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <header className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
          <div>
            <p className="annot text-lg text-board">05 · Defects</p>
            <h2 id="lifecycle-title" data-spec="h2" className="font-display mt-2 text-[clamp(2.4rem,5vw,4.2rem)]">
              The defect lifecycle
            </h2>
          </div>
          <p className="annot max-w-sm text-lg text-sheet-soft">Every bug report moves through these states, from logged to closed.</p>
        </header>

        <div className="mt-6 grid items-center gap-10 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <DefectLifecycle />
          <PageCheck />
        </div>
      </div>
    </section>
  );
}
