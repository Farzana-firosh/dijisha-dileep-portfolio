import type { CSSProperties, ReactNode } from "react";
import { BinderClip, BugGlyph, Pin } from "@/components/board-bits";
import { BoardStrings } from "@/components/board-strings";
import { Defect } from "@/components/defects";
import { ToolLogo } from "@/components/icons";
import { PinOnView } from "@/components/pin-on-view";
import { domains, platforms, skillGroups } from "@/content/skills";

const group = (id: string) => skillGroups.find((g) => g.id === id)!;

const vars = (v: Record<string, string | number>) => v as CSSProperties;

// Order the cards arrive in; each one's thread draws from the main note's clip once it is pinned
const order = ["selenium", "vc", "postman", "methods", "domains", "platforms"];
const links: [string, string, number][] = order.map((id, i) => ["clip", id, i + 1]);

/** One card on the board: flies in from its side (`--i` = turn), gets pinned, sways from the pin, and flies off again
 *  as the board scrolls away. */
function Piece({ id, side, className = "", children }: { id: string; side: "l" | "r"; className?: string; children: ReactNode }) {
  const l = side === "l";
  return (
    <div
      className={`pin-in ${className}`}
      style={vars({
        "--i": order.indexOf(id) + 1,
        "--from-x": l ? "-42vw" : "42vw",
        "--from-r": l ? "-18deg" : "18deg",
      })}
    >
      <div className="fly" style={vars({ "--fx": l ? "-38vw" : "38vw", "--fr": l ? "-24deg" : "24deg" })}>
        {children}
      </div>
    </div>
  );
}

/** Skills as an evidence board: the main note is already up; the other cards fly in one by one, get pinned and tied
 *  to it with yarn, then sway from their pins. Leaving, a bug crumples the note and walks on into the next section. Every
 *  list is real HTML; strings, pins and motion are decoration. */
export function Toolkit() {
  const testing = group("testing");
  const selenium = group("automation").items[0];

  return (
    <section id="skills" aria-labelledby="skills-title" className="board board-stage relative z-10 overflow-x-clip">
      <div className="wrap py-24 sm:py-28">
        <header className="mb-14 text-center">
          <p className="annot inline-block -rotate-2 bg-mark px-3 py-1 text-lg text-on-mark">02 · Skills</p>
          <h2 id="skills-title" data-spec="h2" className="font-display mx-auto mt-5 max-w-4xl text-[clamp(2.6rem,7vw,5.5rem)] text-balance">
            Skills and testing tools
          </h2>
        </header>

        <PinOnView className="relative mx-auto grid max-w-6xl grid-cols-2 items-center gap-x-3 gap-y-7 sm:gap-x-6 lg:grid-cols-[1fr_minmax(0,25rem)_1fr] lg:gap-x-12 lg:gap-y-8">
          <BoardStrings links={links} />

          {/* Centre: the main note, hanging from its clip; it's there from the start. Leaving, a bug walks on,
              crumples it and carries on down into the next section. */}
          <div className="relative order-first col-span-2 mb-2 lg:order-none lg:col-span-1 lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:mb-0">
            <span aria-hidden className="crumple-bug">
              <BugGlyph className="h-full w-full" />
            </span>
            <div className="fly-note">
              <div className="hang relative" style={vars({ "--r": "-1deg", "--sway": "6s" })}>
                <BinderClip className="absolute -top-8 left-1/2 z-10 w-16 -translate-x-1/2" />
                <Pin id="clip" className="left-1/2 -top-6 opacity-0" />
                <div className="lifted">
                  <div className="note-paper torn-top curl px-5 pb-12 pt-11 sm:px-7">
                    <h3 className="font-display text-center text-4xl sm:text-5xl">{testing.label}</h3>
                    <ul className="mt-6 space-y-1 sm:text-lg">
                      {testing.items.map((s) => (
                        <li key={s.name} className="flex items-center gap-3 border-b border-sheet-ink/10 pb-1">
                          <span aria-hidden className="annot text-pass">
                            ✓
                          </span>
                          {s.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Left */}
          <Piece id="selenium" side="l" className="lg:col-start-1 lg:row-start-1 lg:ml-10">
            <div className="hang sheet-paper relative p-4 pt-7" style={vars({ "--r": "-4deg", "--sway": "5s", "--delay": "-1s" })}>
              <Pin id="selenium" className="left-1/2 top-3" />
              <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
                <ToolLogo name="Selenium" className="size-10 shrink-0" />
                <div>
                  <h3 className="font-semibold">Selenium WebDriver</h3>
                  <p className="annot text-sm text-sheet-soft">Automation · {selenium.note}</p>
                </div>
              </div>
            </div>
          </Piece>

          <Piece id="postman" side="l" className="lg:col-start-1 lg:row-start-2 lg:mr-6">
            <div className="hang sheet-paper relative p-4 pt-7" style={vars({ "--r": "3deg", "--sway": "6.5s", "--delay": "-2s" })}>
              <Pin id="postman" className="left-1/2 top-3" />
              <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
                <ToolLogo name="Postman" className="size-10 shrink-0" />
                <div>
                  <h3 className="font-semibold">Postman</h3>
                  <p className="annot text-sm text-sheet-soft">API testing · REST APIs</p>
                </div>
              </div>
            </div>
          </Piece>

          <Piece id="domains" side="l" className="lg:col-start-1 lg:row-start-3 lg:ml-6">
            <div className="hang sheet-paper relative p-5 pt-7" style={vars({ "--r": "-2deg", "--sway": "5.5s", "--delay": "-3s" })}>
              <Pin id="domains" className="left-1/2 top-3" />
              <h3 className="annot text-sheet-soft">Domain knowledge</h3>
              <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                {domains.map((d) => (
                  <li key={d.name} title={d.full} className="font-display text-xl sm:text-2xl">
                    {d.name}
                  </li>
                ))}
              </ul>
            </div>
          </Piece>

          {/* Right */}
          <Piece id="vc" side="r" className="lg:col-start-3 lg:row-start-1 lg:mr-10">
            {/* DEF-03: Git/GitLab card hanging off a missing pin */}
            <Defect id="pin" context="Version control: Git and GitLab" className="defect-card sheet-paper relative block w-full p-4 pt-7 text-left">
              <Pin id="vc" className="left-1/2 top-3" />
              <span className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
                <span className="flex shrink-0 gap-1.5">
                  <ToolLogo name="Git" className="size-9" />
                  <ToolLogo name="GitLab" className="size-9" />
                </span>
                <span>
                  <span className="block font-semibold">Git · GitLab</span>
                  <span className="annot block text-sm text-sheet-soft">Version control</span>
                </span>
              </span>
            </Defect>
          </Piece>

          <Piece id="methods" side="r" className="lg:col-start-3 lg:row-start-2 lg:ml-6">
            <div className="hang relative bg-mark p-5 pt-7 text-on-mark shadow-xl" style={vars({ "--r": "-3deg", "--sway": "6s", "--delay": "-1.5s" })}>
              <Pin id="methods" className="left-1/2 top-3" />
              <h3 className="annot">{group("process").label}</h3>
              <p className="mt-1 font-display text-2xl leading-tight sm:text-3xl">
                {group("process")
                  .items.map((i) => i.name)
                  .join(" · ")}
              </p>
            </div>
          </Piece>

          <Piece id="platforms" side="r" className="lg:col-start-3 lg:row-start-3 lg:mr-8">
            <div
              className="hang sheet-paper relative border-t-4 border-yarn p-5 pt-7"
              style={vars({ "--r": "2deg", "--sway": "5s", "--delay": "-2.5s" })}
            >
              <Pin id="platforms" className="left-1/2 top-3" />
              <h3 className="annot text-sheet-soft">Platforms</h3>
              <ul className="mt-1 text-lg">
                {platforms.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          </Piece>

          {/* Working with people: a strip under the board, rising in last */}
          <div className="pin-in col-span-2 lg:col-span-3" style={vars({ "--i": order.length + 1, "--from-x": "0px", "--from-y": "80px", "--from-r": "0deg" })}>
            <div className="fly" style={vars({ "--fx": "0px", "--fr": "-4deg" })}>
              <div className="lifted mx-auto mt-6 max-w-3xl">
                <div className="note-paper torn-top rotate-[0.8deg] px-6 pb-5 pt-8 text-center">
                  <h3 className="annot text-sheet-soft">{group("professional").label}</h3>
                  <p className="mt-2 text-lg">
                    {group("professional")
                      .items.map((i) => i.name)
                      .join(" · ")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </PinOnView>
      </div>
    </section>
  );
}
