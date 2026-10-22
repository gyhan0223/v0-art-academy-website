"use client";

import { useEffect } from "react";
import { initGrade11WinterTime } from "@/lib/grade11-winter-time";

export default function Grade11TimeControls() {
  useEffect(() => initGrade11WinterTime(document.querySelector(".g11-winter-time")), []);
  return null;
}
