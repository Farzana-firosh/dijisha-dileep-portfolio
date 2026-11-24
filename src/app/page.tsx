import type { Metadata } from "next";
import { Intro } from "@/components/intro";
import { PageCurl } from "@/components/page-curl";
import { profile } from "@/content/profile";
import { ld, profilePage } from "@/lib/seo";
import { About } from "./_sections/about";
import { Experience } from "./_sections/experience";
import { Hero } from "./_sections/hero";
import { Lifecycle } from "./_sections/lifecycle";
import { Process } from "./_sections/process";
import { Toolkit } from "./_sections/toolkit";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Intro name={profile.name} tags={["Manual", "Automation", "API", "Regression"]} />
      {/* The hero is a page that curls over to show About underneath (wide screens with motion only) */}
      <div className="turn-book">
        <PageCurl>
          <Hero />
        </PageCurl>
        <About />
      </div>
      <Toolkit />
      <Process />
      <Experience />
      <Lifecycle />
      <script type="application/ld+json" dangerouslySetInnerHTML={ld(profilePage)} />
    </>
  );
}
