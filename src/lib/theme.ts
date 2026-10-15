export const colors = {
  navy: '#10264F',
  ink: '#14213D',
  body: '#3B4B66',
  muted: '#5B6B85',
  border: '#D3D8E0',
  borderSoft: '#E8EAEE',
  borderStrong: '#C5CCD8',
  surface: '#F1F3F6',
  segmentEmpty: '#E6E8EC',
  white: '#FFFFFF',
  blue: '#1E4C9A',
  blueSoft: '#E9EFF9',
  blueBorder: '#C9D6EE',
  red: '#D32F2F',
  redBg: '#FDECEA',
  redText: '#8F1A12',
  redStrong: '#B3261E',
  amber: '#D99A00',
  amberBg: '#FFF6DA',
  amberText: '#7A5200',
  orange: '#F7941D',
  backdrop: 'rgba(16, 38, 79, 0.45)',
} as const;

export const fontFamily = {
  regular: 'IBMPlexSans_400Regular',
  medium: 'IBMPlexSans_500Medium',
  semibold: 'IBMPlexSans_600SemiBold',
  bold: 'IBMPlexSans_700Bold',
} as const;

export type FontWeight = keyof typeof fontFamily;
