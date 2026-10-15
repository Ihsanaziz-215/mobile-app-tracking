import * as Haptics from 'expo-haptics';

// Fire-and-forget: haptics are a nicety, never let them throw into the UI.
const safe = (fn: () => Promise<unknown>) => {
  fn().catch(() => {});
};

/** A selection moved (chip, radio, switch). */
export const hapticSelect = () => safe(() => Haptics.selectionAsync());
/** An action succeeded. */
export const hapticSuccess = () => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
/** An action failed. */
export const hapticError = () => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
