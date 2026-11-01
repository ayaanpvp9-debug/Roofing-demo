import { useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
export type MotionPreference = "system" | "full" | "reduced";
const key = "roofcraft-motion";
export function motionEnabled() {
  return document.documentElement.dataset.motion !== "reduced";
}
function readPreference(): MotionPreference {
  try {
    const value = localStorage.getItem(key);
    return value === "full" || value === "reduced" ? value : "system";
  } catch {
    return "system";
  }
}
export function MotionPreferenceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [preference, setPreference] =
    useState<MotionPreference>(readPreference);
  const [systemReduced, setSystemReduced] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const reduced =
    preference === "reduced" || (preference === "system" && systemReduced);
  // Set before child animation effects run, including an explicit opt-in to full motion.
  document.documentElement.dataset.motion = reduced ? "reduced" : "full";
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setSystemReduced(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return (
    <>
      <MotionConfig reducedMotion={reduced ? "always" : "never"}>
        <div key={reduced ? "reduced" : "full"}>{children}</div>
      </MotionConfig>
      <label
        className="motion-control"
        title="Full motion enables the cinematic experience on every screen. System follows your accessibility setting."
      >
        <span>Motion</span>
        <select
          aria-label="Animation preference"
          value={preference}
          onChange={(event) => {
            const value = event.target.value as MotionPreference;
            try {
              localStorage.setItem(key, value);
            } catch {
              /* Storage can be disabled in private browsers. */
            }
            setPreference(value);
          }}
        >
          <option value="system">System</option>
          <option value="full">Full</option>
          <option value="reduced">Reduced</option>
        </select>
        <span
          className="motion-indicator"
          aria-label={reduced ? "Reduced motion active" : "Full motion active"}
          data-active={!reduced}
        />
      </label>
    </>
  );
}
