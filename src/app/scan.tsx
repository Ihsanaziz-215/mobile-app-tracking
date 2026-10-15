import { Camera, Check, ChevronDown, ChevronLeft, CircleCheck, Image as ImageIcon } from 'lucide-react-native';
import { Image } from 'expo-image';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { useToast } from '@/components/Toast';
import { PressableScale } from '@/components/PressableScale';
import { ScanViewfinder, type ScanStatus } from '@/components/ScanViewfinder';
import { MILESTONES, MOCK_SCAN, MOCK_SCAN_MS } from '@/data/scan';
import { hapticSelect, hapticSuccess } from '@/lib/haptics';
import { colors } from '@/lib/theme';

const SUCCESS = '#1E8E4A';
const MOCK_PHOTOS = 3;

interface Photo {
  /** Undefined for mock placeholders. */
  uri?: string;
}

const formatTime = (d: Date) => d.toTimeString().slice(0, 5);

export default function ScanScreen() {
  const router = useRouter();
  const toast = useToast();
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();

  const [status, setStatus] = useState<ScanStatus>('scanning');
  const [scanKey, setScanKey] = useState(0);
  const [milestone, setMilestone] = useState<string>(MILESTONES[0]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [scannedAt, setScannedAt] = useState('');

  const cameraGranted = !!permission?.granted;
  const itemCount = MOCK_SCAN.items.reduce((sum, i) => sum + i.count, 0);

  // Simulated scan: the camera runs, then the mock result "appears".
  useEffect(() => {
    if (!cameraGranted) return;
    const timer = setTimeout(() => {
      setStatus('done');
      hapticSuccess();
      setScannedAt(formatTime(new Date()));
      setPhotos(Array.from({ length: MOCK_PHOTOS }, () => ({})));
    }, MOCK_SCAN_MS);
    return () => clearTimeout(timer);
  }, [cameraGranted, scanKey]);

  const rescan = useCallback(() => {
    setPhotos([]);
    setMenuOpen(false);
    setStatus('scanning');
    setScanKey((k) => k + 1);
  }, []);

  const takePhoto = async () => {
    try {
      const shot = await cameraRef.current?.takePictureAsync({ quality: 0.4 });
      setPhotos((prev) => [...prev, { uri: shot?.uri }]);
    } catch {
      setPhotos((prev) => [...prev, {}]);
    }
    toast.success('Photo added', `${photos.length + 1} ${photos.length === 0 ? 'photo' : 'photos'} attached`);
  };

  const submit = () => {
    toast.success(`${itemCount} items updated`, `Milestone set to "${milestone}"`);
    router.back();
  };

  const done = status === 'done';

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} accessibilityLabel="Back">
          <ChevronLeft size={24} color={colors.ink} />
        </Pressable>
        <AppText size={17} weight="semibold">
          Scan to update
        </AppText>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScanViewfinder
          status={status}
          cameraGranted={cameraGranted}
          cameraRef={cameraRef}
          onRequestPermission={requestPermission}
          onRescan={rescan}
        />

        {done && (
          <>
            <Animated.View entering={FadeInDown.duration(300)} style={styles.section}>
              <AppText size={14} weight="medium">
                {itemCount} items scanned from {MOCK_SCAN.vendor}
              </AppText>
            </Animated.View>
            <View style={styles.results}>
              {MOCK_SCAN.items.map((item, i) => (
                <Animated.View
                  key={item.po}
                  entering={FadeInDown.delay(150 + i * 250).duration(300)}
                  style={[styles.resultRow, i > 0 && styles.resultDivider]}
                >
                  <CircleCheck size={20} color={SUCCESS} />
                  <View style={styles.resultText}>
                    <AppText size={16} weight="semibold">
                      {item.po}, {item.lines}
                    </AppText>
                    <AppText size={15} color={colors.muted}>
                      {item.description}
                    </AppText>
                  </View>
                </Animated.View>
              ))}
            </View>

            <Animated.View entering={FadeInDown.delay(150 + MOCK_SCAN.items.length * 250).duration(300)}>
              <AppText size={13} weight="medium" color={colors.muted} style={styles.fieldLabel}>
                Milestone
              </AppText>
              <PressableScale
                onPress={() => setMenuOpen((v) => !v)}
                accessibilityRole="button"
                accessibilityLabel={`Milestone, ${milestone}`}
                style={styles.select}
                scaleTo={0.985}
              >
                <AppText size={16}>{milestone}</AppText>
                <Animated.View
                  style={{
                    transform: [{ rotate: menuOpen ? '180deg' : '0deg' }],
                    transitionProperty: 'transform',
                    transitionDuration: 200,
                    transitionTimingFunction: 'ease-out',
                  }}
                >
                  <ChevronDown size={18} color={colors.ink} />
                </Animated.View>
              </PressableScale>
              {menuOpen && (
                <Animated.View entering={FadeIn.duration(160)} exiting={FadeOut.duration(120)} style={styles.menu}>
                  {MILESTONES.map((m) => (
                    <PressableScale
                      key={m}
                      onPress={() => {
                        if (m !== milestone) hapticSelect();
                        setMilestone(m);
                        setMenuOpen(false);
                      }}
                      style={styles.menuItem}
                      scaleTo={0.985}
                    >
                      <AppText size={15} weight={m === milestone ? 'semibold' : 'regular'}>
                        {m}
                      </AppText>
                      {m === milestone && <Check size={16} color={colors.blue} />}
                    </PressableScale>
                  ))}
                </Animated.View>
              )}

              <AppText size={15} style={styles.proofLabel}>
                Photo proof
              </AppText>
              <View style={styles.photos}>
                {photos.map((photo, i) => (
                  <Animated.View key={i} entering={FadeIn.duration(200)} style={styles.photo}>
                    {photo.uri ? (
                      <Image source={{ uri: photo.uri }} style={StyleSheet.absoluteFill} contentFit="cover" />
                    ) : (
                      <ImageIcon size={20} color={colors.muted} />
                    )}
                  </Animated.View>
                ))}
                <PressableScale
                  onPress={takePhoto}
                  accessibilityRole="button"
                  accessibilityLabel="Add photo"
                  style={styles.addPhoto}
                >
                  <Camera size={20} color={colors.ink} />
                </PressableScale>
              </View>
              <AppText size={15} color={colors.muted} style={styles.photoCaption}>
                {photos.length} {photos.length === 1 ? 'photo' : 'photos'} · {scannedAt} · GPS position attached
              </AppText>
            </Animated.View>
          </>
        )}

        {!done && cameraGranted && (
          <AppText size={14} color={colors.muted} style={styles.hint}>
            Scanned items will appear here
          </AppText>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Button label={done ? `Update ${itemCount} items` : 'Update items'} onPress={submit} disabled={!done} />
        <AppText size={14} color={colors.muted} style={styles.note}>
          No signal? The update waits in the offline queue and is sent when the signal returns.
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  header: {
    height: 57,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  content: { padding: 16, paddingBottom: 24 },
  section: { marginTop: 24, marginBottom: 8 },
  hint: { marginTop: 24, textAlign: 'center' },
  results: { borderRadius: 8, borderWidth: 1, borderColor: colors.borderSoft },
  resultRow: { flexDirection: 'row', gap: 12, padding: 12, alignItems: 'flex-start' },
  resultDivider: { borderTopWidth: 1, borderTopColor: colors.borderSoft },
  resultText: { flex: 1 },
  fieldLabel: { marginTop: 24, marginBottom: 6 },
  select: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E3E5E9',
  },
  menu: { marginTop: 6, borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white },
  menuItem: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  proofLabel: { marginTop: 24, marginBottom: 8 },
  photos: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  photo: {
    width: 72,
    height: 72,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: '#F4F5F7',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  addPhoto: {
    width: 72,
    height: 72,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E3E5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoCaption: { marginTop: 12 },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
    backgroundColor: colors.white,
  },
  note: { marginTop: 12, textAlign: 'center' },
});
