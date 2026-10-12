"use client";

import { useEffect } from "react";
import { handleWinterClick } from "@/lib/winter-analytics";

/** One delegated listener also covers dynamically rendered diagnosis results. */
export default function WinterClickTracker() {
  useEffect(() => {
    document.addEventListener("click", handleWinterClick, true);
    document.addEventListener("auxclick", handleWinterClick, true);
    return () => {
      document.removeEventListener("click", handleWinterClick, true);
      document.removeEventListener("auxclick", handleWinterClick, true);
    };
  }, []);
  return null;
}
