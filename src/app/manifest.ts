import type { MetadataRoute } from "next";
import { profile } from "@/content/profile";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.name}, ${profile.role}`,
    short_name: profile.name,
    description: profile.seoDescription,
    start_url: "/",
    display: "browser",
    background_color: "#f1f2ee",
    theme_color: "#f1f2ee",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
