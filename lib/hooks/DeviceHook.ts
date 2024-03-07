import { useMemo } from "react";

type DeviceType = "Chrome" | "Firefox" | "Safari";

export function useDevice() {
  const os: DeviceType = useMemo(() => {
    const userAgent = window.navigator.userAgent;

    if (userAgent.indexOf("Chrome") != -1) {
      return "Chrome";
    }
    if (userAgent.indexOf("Firefox") != -1) {
      return "Firefox";
    }
    return "Safari";
  }, []);

  return { os };
}
