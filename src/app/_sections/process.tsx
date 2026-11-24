import { StepDrum } from "@/components/step-drum";
import { steps } from "@/content/process";

/** How I test: the STLC card stack on the dark stage, which closes into a rounded card as Experience comes up. */
export function Process() {
  return (
    <section id="process" aria-labelledby="process-title" className="stage-out bg-night pb-16 text-chalk">
      <StepDrum
        steps={[...steps]}
        header={
          <header className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="annot text-lg text-mark">03 · Process</p>
              <h2 id="process-title" data-spec="h2" className="font-display mt-2 text-[clamp(2.6rem,6vw,5rem)]">
                How I test software
              </h2>
            </div>
            <p className="annot max-w-xs text-lg text-chalk/70">The Software Testing Life Cycle, run inside Agile Scrum sprints.</p>
          </header>
        }
      />
    </section>
  );
}
