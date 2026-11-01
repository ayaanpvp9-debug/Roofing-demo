import { MotionConfig } from "framer-motion";

// One cinematic mode on every device. Old saved preferences are intentionally ignored.
export function motionEnabled() {
  return true;
}

export function MotionPreferenceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  document.documentElement.dataset.motion = "full";
  return <MotionConfig reducedMotion="never">{children}</MotionConfig>;
}
