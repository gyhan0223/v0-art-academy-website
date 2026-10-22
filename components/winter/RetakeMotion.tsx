"use client";
import { useEffect } from "react";
import { initRetakeMotion } from "@/lib/retake-motion";

export default function RetakeMotion() {
  useEffect(() => initRetakeMotion(document.querySelector('.rt')), []);
  return null;
}
