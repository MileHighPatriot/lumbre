"use client";

import { useEffect, useState } from "react";

/** Denver-facing clock. Null until mounted so the server HTML stays stable. */
export function useNow(ms = 30000) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the clock is a browser subscription, not render state
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), ms);
    return () => clearInterval(id);
  }, [ms]);
  return now;
}
