export interface ChartColors {
  fretboard: string;
  fretboardLight: string;
  fret: string;
  nut: string;
  nutDark: string;
  stringBass: string;
  stringTreble: string;
  inlay: string;
  finger: string;
  fingerHighlight: string;
  fingerText: string;
  highlighted: string;
  highlightedHighlight: string;
  highlightedText: string;
  binding: string;
  label: string;
  labelContrast: string;
  chordName: string;
  chordNameContrast: string;
  openMute: string;
  useGradients: boolean;
}

export const CHART_THEMES: Record<string, ChartColors> = {
  'realistic-dark': {
    fretboard: '#3d2415',
    fretboardLight: '#4a2d1a',
    fret: '#b8bcc4',
    nut: '#d8d2c4',
    nutDark: '#c8c0b0',
    stringBass: '#c9a84c',
    stringTreble: '#a0a5ad',
    inlay: 'rgba(170,175,185,0.15)',
    finger: '#e89b0c',
    fingerHighlight: '#f0b830',
    fingerText: '#1c1612',
    highlighted: '#2196F3',
    highlightedHighlight: '#42A5F5',
    highlightedText: '#ffffff',
    binding: '#6a6050',
    label: '#7a7e88',
    labelContrast: '#ffffff',
    chordName: '#e8e0d0',
    chordNameContrast: '#ffffff',
    openMute: '#7a7e88',
    useGradients: true,
  },
  'realistic-light': {
    fretboard: '#d4b896',
    fretboardLight: '#e0c8a8',
    fret: '#8a8a8a',
    nut: '#f0ebe0',
    nutDark: '#d8d0c0',
    stringBass: '#b8942a',
    stringTreble: '#707580',
    inlay: 'rgba(100,90,75,0.12)',
    finger: '#d45500',
    fingerHighlight: '#e87020',
    fingerText: '#ffffff',
    highlighted: '#1976D2',
    highlightedHighlight: '#2196F3',
    highlightedText: '#ffffff',
    binding: '#a09080',
    label: '#6a5e50',
    labelContrast: '#000000',
    chordName: '#3a3028',
    chordNameContrast: '#000000',
    openMute: '#6a5e50',
    useGradients: true,
  },
  'outline-light': {
    fretboard: 'transparent',
    fretboardLight: 'transparent',
    fret: '#555555',
    nut: '#cccccc',
    nutDark: '#aaaaaa',
    stringBass: '#999999',
    stringTreble: '#999999',
    inlay: 'rgba(255,255,255,0.06)',
    finger: '#e0e0e0',
    fingerHighlight: '#ffffff',
    fingerText: '#111111',
    highlighted: '#90CAF9',
    highlightedHighlight: '#BBDEFB',
    highlightedText: '#111111',
    binding: '#777777',
    label: '#999999',
    labelContrast: '#ffffff',
    chordName: '#e0e0e0',
    chordNameContrast: '#ffffff',
    openMute: '#999999',
    useGradients: false,
  },
  'outline-dark': {
    fretboard: 'transparent',
    fretboardLight: 'transparent',
    fret: '#aaaaaa',
    nut: '#444444',
    nutDark: '#333333',
    stringBass: '#666666',
    stringTreble: '#666666',
    inlay: 'rgba(0,0,0,0.04)',
    finger: '#222222',
    fingerHighlight: '#444444',
    fingerText: '#ffffff',
    highlighted: '#1565C0',
    highlightedHighlight: '#1976D2',
    highlightedText: '#ffffff',
    binding: '#888888',
    label: '#666666',
    labelContrast: '#000000',
    chordName: '#222222',
    chordNameContrast: '#000000',
    openMute: '#666666',
    useGradients: false,
  },
};

export const CHART_THEME_OPTIONS = [
  { value: 'realistic-dark', label: 'Dark Wood' },
  { value: 'realistic-light', label: 'Light Wood' },
  { value: 'outline-light', label: 'Outline Light' },
  { value: 'outline-dark', label: 'Outline Dark' },
];
