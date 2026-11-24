import Image from "next/image";
import { BugGlyph } from "./board-bits";

type Photo = { src: string; alt: string; width: number; height: number };

/** An old beige computer showing the portrait. On a loop (CSS only), a bug crawls onto the screen, the picture
 *  glitches into an error, it gets retested and comes back clean. Static with reduced motion. */
export function Crt({ photo }: { photo: Photo }) {
  return (
    <figure className="crt-wrap relative mx-auto w-[min(88vw,30rem)] lg:mx-0">
      <div className="crt">
        <div className="crt-bezel">
          <div className="crt-screen">
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(min-width: 1024px) 26rem, 80vw"
              loading="eager"
              fetchPriority="high"
              unoptimized={photo.src.endsWith(".svg")}
              className="crt-photo"
            />
            <div aria-hidden className="crt-bug">
              <BugGlyph className="h-full w-full" />
            </div>
            <div aria-hidden className="crt-error pixel">
              <p className="crt-error-bar">
                <span>defect_found.exe</span>
                <span>×</span>
              </p>
              <p className="px-4 pt-3 text-2xl leading-none">ERROR: bug on screen</p>
              <p className="px-4 pt-1 text-lg leading-none opacity-75">Expected a portrait. Got a bug.</p>
              <p className="m-4 mt-3 inline-block border-2 border-current px-3 text-lg">Retest</p>
            </div>
            <p aria-hidden className="crt-pass pixel">Retest passed ✓</p>
            <div aria-hidden className="crt-scan" />
          </div>
        </div>
        <div className="crt-chin" aria-hidden>
          <span className="pixel text-lg text-sheet-soft">QA·86</span>
          <span className="flex items-center gap-3">
            <span className="crt-led" />
            <span className="crt-knob" />
            <span className="crt-knob" />
          </span>
        </div>
      </div>
      <div aria-hidden className="crt-base">
        <span className="crt-slot" />
        <span className="crt-vents" />
      </div>

      {/* Notes stuck to the case */}
      <span aria-hidden className="annot absolute -left-5 top-10 z-10 rotate-[-9deg] bg-mark px-3 py-2 text-sheet-ink shadow-md sm:-left-10">
        Ctrl + S
      </span>
      <span aria-hidden className="annot absolute -right-3 top-24 z-10 rotate-[7deg] bg-note-blue px-3 py-2 text-on-board shadow-md sm:-right-8">
        Retest
      </span>
      <span aria-hidden className="annot absolute -bottom-3 right-6 z-10 rotate-[-4deg] bg-note-pink px-3 py-2 text-sheet-ink shadow-md">
        Expected = Actual
      </span>
      <figcaption className="sr-only">{photo.alt}</figcaption>
    </figure>
  );
}
