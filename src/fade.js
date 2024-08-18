import { useState } from "react";

const FADING_STATES = {
  IN: "in",
  VISIBLE: "visible",
  OUT: "out",
  NONE: "none",
};

const FADING_CLASSES = {
  IN: "fade-in",
  OUT: "fade-out",
  VISIBLE: "",
  NONE: "",
};

function fadingClassForState(fadeState) {
  switch (fadeState) {
    case FADING_STATES.IN:
      return FADING_CLASSES.IN;
    case FADING_STATES.OUT:
      return FADING_CLASSES.OUT;
    case FADING_STATES.VISIBLE:
      return FADING_CLASSES.VISIBLE;
    default:
      return FADING_CLASSES.NONE;
  }
}

function nextFadeState(currentState) {
  switch (currentState) {
    case FADING_STATES.NONE:
      return FADING_STATES.IN;
    case FADING_STATES.IN:
      return FADING_STATES.VISIBLE;
    case FADING_STATES.VISIBLE:
      return FADING_STATES.OUT;
    case FADING_STATES.OUT:
      return FADING_STATES.NONE;
    default:
      return FADING_STATES.NONE;
  }
}

function isFadingIn(fadeState) {
  return fadeState === FADING_STATES.IN;
}

function isFadingOut(fadeState) {
  return fadeState === FADING_STATES.OUT;
}

function useFadeState() {
  const [fadeState, setFadeState] = useState(FADING_STATES.NONE);

  const fadeStep = () => {
    setFadeState(nextFadeState(fadeState));
  };

  return [fadeState, fadeStep];
}

function shouldShow(fadeState) {
  if (fadeState !== FADING_STATES.NONE) return true;
  return false;
}

export {
  FADING_STATES,
  FADING_CLASSES,
  fadingClassForState,
  useFadeState,
  shouldShow,
};
