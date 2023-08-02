export const opacityTransitions = {
  initialState: {
    opacity: 0,
  },
  animateState: {
    opacity: 1,
  },
  existState: {
    opacity: 0,
  },
};

export const transitionDuration = {
  duration: 0.75,
};

export const delayTransition = {
  delay: 1,
};

export const upTransitions = {
  initialState: {
    opacity: 0,
    y: 100,
  },
  animateState: {
    opacity: 1,
    y: 0,
  },
  exitState: {
    opacity: 0,
    y: -100,
  },
};

export const slideTransitions = {
  initialState: {
    opacity: 0,
    x: 100,
  },
  animateState: {
    opacity: 1,
    x: 0,
  },
  exitState: {
    opacity: 0,
    x: -100,
  },
};

export const blurTransition = {
  initialState: {
    filter: "blur(5px)",
    opacity: 0.5,
  },
  viewTransition: {
    filter: "blur(0)",
    opacity: 1,
  },
  exit: {
    filter: "blur(0)",
    opacity: 0,
  },
};

export const viewPort = {
  once: true,
  amount: 0.5,
};
