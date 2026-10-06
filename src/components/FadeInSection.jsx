import { motion } from "framer-motion";

// Replays on every scroll: fades in when the section enters the viewport and
// fades back out when it leaves, so scrolling up OR down keeps animating
// (not just the first time on the way down).
export default function FadeInSection({ children, className = "", delay = 0, y = 24, as = "div" }) {
  const MotionTag = motion[as] ?? motion.div;
  const variants = {
    hidden: { opacity: 0, y, transition: { duration: 0.35, ease: "easeIn" } },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
    },
  };
  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.25 }}
    >
      {children}
    </MotionTag>
  );
}
