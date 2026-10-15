import { Easing } from 'react-native-reanimated';

/** Strong ease-out for things entering, exiting or responding to a press. */
export const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);
/** For things moving or morphing while already on screen. */
export const EASE_IN_OUT = Easing.bezier(0.77, 0, 0.175, 1);
/** The iOS sheet curve. */
export const EASE_SHEET = Easing.bezier(0.32, 0.72, 0, 1);

export const PRESS_IN_MS = 110;
export const PRESS_OUT_MS = 160;
export const PRESS_SCALE = 0.97;

/** Spring used when a sheet snaps back after a drag. */
export const SHEET_SPRING = { duration: 300, dampingRatio: 0.8 } as const;

/** Spread into a style whose backgroundColor / borderColor flip with state. */
export const COLOR_TRANSITION = {
  transitionProperty: ['backgroundColor', 'borderColor'] as ('backgroundColor' | 'borderColor')[],
  transitionDuration: 160,
  transitionTimingFunction: 'ease-out' as const,
};
