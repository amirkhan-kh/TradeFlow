"use client";

import { Aurora } from "@/shared/ui/Aurora";
import { MotionProvider } from "@/shared/ui/motion";

export default function LoginAurora() {
  return (
    <MotionProvider>
      <Aurora dark interactive={false} />
    </MotionProvider>
  );
}
