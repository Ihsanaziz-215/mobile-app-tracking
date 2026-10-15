import { CircleAlert, CircleCheck, Info } from 'lucide-react-native';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { hapticError, hapticSuccess } from '@/lib/haptics';
import { EASE_OUT } from '@/lib/motion';
import { colors } from '@/lib/theme';
import { AppText } from './AppText';

type Variant = 'success' | 'info' | 'error';

interface ToastState {
  key: number;
  title: string;
  subtitle?: string;
  variant: Variant;
}

type ShowToast = (title: string, subtitle?: string) => void;

interface ToastApi {
  success: ShowToast;
  info: ShowToast;
  error: ShowToast;
}

interface ToastContextValue {
  api: ToastApi;
  toast: ToastState | null;
  dismiss: () => void;
  /** Hosts register so only the top-most one (e.g. an open sheet) renders the toast. */
  register: (id: string) => () => void;
  topHost: string | undefined;
}

const DURATION_MS = 2800;
const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const [hosts, setHosts] = useState<string[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const counter = useRef(0);

  const dismiss = useCallback(() => {
    clearTimeout(timer.current);
    setToast(null);
  }, []);

  const show = useCallback((variant: Variant, title: string, subtitle?: string) => {
    clearTimeout(timer.current);
    if (variant === 'success') hapticSuccess();
    if (variant === 'error') hapticError();
    counter.current += 1;
    setToast({ key: counter.current, title, subtitle, variant });
    timer.current = setTimeout(() => setToast(null), DURATION_MS);
  }, []);

  const register = useCallback((id: string) => {
    setHosts((h) => [...h, id]);
    return () => setHosts((h) => h.filter((x) => x !== id));
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  const api = useMemo<ToastApi>(
    () => ({
      success: (t, s) => show('success', t, s),
      info: (t, s) => show('info', t, s),
      error: (t, s) => show('error', t, s),
    }),
    [show],
  );

  const value = useMemo(
    () => ({ api, toast, dismiss, register, topHost: hosts[hosts.length - 1] }),
    [api, toast, dismiss, register, hosts],
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

function useToastContext() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('Toast hooks must be used inside ToastProvider');
  return ctx;
}

export function useToast(): ToastApi {
  return useToastContext().api;
}

const VARIANTS = {
  success: { Icon: CircleCheck, icon: '#1E8E4A', bg: '#E6F4EA', border: '#BFE0C9', text: '#14532D' },
  info: { Icon: Info, icon: colors.blue, bg: colors.blueSoft, border: colors.blueBorder, text: colors.navy },
  error: { Icon: CircleAlert, icon: colors.red, bg: colors.redBg, border: '#F1C7C3', text: colors.redText },
} as const;

/**
 * Renders the current toast. Place one in the root layout and one inside every
 * modal-style screen; only the top-most mounted host shows it.
 */
export function ToastHost() {
  const id = useId();
  const insets = useSafeAreaInsets();
  const { toast, dismiss, register, topHost } = useToastContext();

  useEffect(() => register(id), [register, id]);

  if (!toast || topHost !== id) return null;
  const { Icon, icon, bg, border, text } = VARIANTS[toast.variant];

  return (
    <Animated.View
      key={toast.key}
      entering={FadeInUp.duration(240).easing(EASE_OUT)}
      exiting={FadeOutUp.duration(180).easing(EASE_OUT)}
      style={[styles.wrap, { top: insets.top + 8 }]}
      pointerEvents="box-none"
    >
      <Pressable
        onPress={dismiss}
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
        style={[styles.toast, { backgroundColor: bg, borderColor: border }]}
      >
        <Icon size={20} color={icon} style={styles.icon} />
        <View style={styles.text}>
          <AppText size={14} weight="semibold" color={text}>
            {toast.title}
          </AppText>
          {toast.subtitle ? (
            <AppText size={13} color={text} style={styles.subtitle}>
              {toast.subtitle}
            </AppText>
          ) : null}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 16, right: 16, zIndex: 1000, alignItems: 'center' },
  toast: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    maxWidth: '100%',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    boxShadow: '0 4px 12px rgba(16, 38, 79, 0.12)',
  },
  icon: { marginTop: 1 },
  text: { flexShrink: 1, gap: 2 },
  subtitle: { opacity: 0.85 },
});
