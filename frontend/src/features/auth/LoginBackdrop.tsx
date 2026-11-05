"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const LoginAurora = dynamic(() => import("./LoginAurora"), { ssr: false });

/**
 * Animated background of the brand panel, which is only visible from `lg` up.
 * Loaded after hydration and only on wide screens, so phones never download the motion bundle.
 */
export function LoginBackdrop() {
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return wide ? <LoginAurora /> : null;
}
