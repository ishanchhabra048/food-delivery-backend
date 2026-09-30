export const transitionEase = [0.22, 1, 0.36, 1];

export const fadeIn = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: transitionEase } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15, ease: transitionEase } },
};

export const cardHoverMotion = {
  whileHover: { y: -3, transition: { duration: 0.25, ease: transitionEase } },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: transitionEase } },
};
