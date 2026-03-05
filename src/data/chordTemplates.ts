import { InstrumentConfig, ChordTemplate } from '@/types/chord';

export const GUITAR_CONFIG: InstrumentConfig = {
  name: 'Guitar',
  strings: 6,
  tuning: ['E', 'A', 'D', 'G', 'B', 'E'],
  tuningIndices: [4, 9, 2, 7, 11, 4],
  scaleLength: 648,
  nutWidth: 43,
  bridgeWidth: 56,
  totalFrets: 24,
  inlayFrets: [3, 5, 7, 9, 15, 17, 19, 21],
  doubleInlayFrets: [12, 24],
};

export const UKULELE_CONFIG: InstrumentConfig = {
  name: 'Ukulele',
  strings: 4,
  tuning: ['G', 'C', 'E', 'A'],
  tuningIndices: [7, 0, 4, 9],
  scaleLength: 382,
  nutWidth: 35,
  bridgeWidth: 42,
  totalFrets: 18,
  inlayFrets: [3, 5, 7, 10, 15],
  doubleInlayFrets: [12],
};

export const BASS_CONFIG: InstrumentConfig = {
  name: 'Bass',
  strings: 4,
  tuning: ['E', 'A', 'D', 'G'],
  tuningIndices: [4, 9, 2, 7],
  scaleLength: 864,
  nutWidth: 42,
  bridgeWidth: 60,
  totalFrets: 24,
  inlayFrets: [3, 5, 7, 9, 15, 17, 19, 21],
  doubleInlayFrets: [12, 24],
};

export const INSTRUMENTS: Record<string, InstrumentConfig> = {
  guitar: GUITAR_CONFIG,
  ukulele: UKULELE_CONFIG,
  bass: BASS_CONFIG,
};

export const GUITAR_CHORDS: Record<string, ChordTemplate[]> = {
  C: [
    { name: 'C', variation: 'Variation 1', positions: [null, 3, 2, 0, 1, 0], startFret: 0 },
    { name: 'C', variation: 'Variation 2', positions: [null, 3, 5, 5, 5, 3], startFret: 3 },
  ],
  D: [
    { name: 'D', variation: 'Variation 1', positions: [null, null, 0, 2, 3, 2], startFret: 0 },
    { name: 'D', variation: 'Variation 2', positions: [null, 5, 7, 7, 7, 5], startFret: 5 },
  ],
  E: [
    { name: 'E', variation: 'Variation 1', positions: [0, 2, 2, 1, 0, 0], startFret: 0 },
    { name: 'E', variation: 'Variation 2', positions: [null, 7, 9, 9, 9, 7], startFret: 7 },
  ],
  F: [
    { name: 'F', variation: 'Variation 1', positions: [1, 1, 2, 3, 3, 1], startFret: 0 },
    { name: 'F', variation: 'Variation 2', positions: [null, null, 3, 2, 1, 1], startFret: 0 },
  ],
  G: [
    { name: 'G', variation: 'Variation 1', positions: [3, 2, 0, 0, 0, 3], startFret: 0 },
    { name: 'G', variation: 'Variation 2', positions: [3, 2, 0, 0, 3, 3], startFret: 0 },
  ],
  A: [
    { name: 'A', variation: 'Variation 1', positions: [null, 0, 2, 2, 2, 0], startFret: 0 },
    { name: 'A', variation: 'Variation 2', positions: [5, 7, 7, 6, 5, 5], startFret: 5 },
  ],
  Am: [
    { name: 'Am', variation: 'Variation 1', positions: [null, 0, 2, 2, 1, 0], startFret: 0 },
    { name: 'Am', variation: 'Variation 2', positions: [5, 7, 7, 5, 5, 5], startFret: 5 },
  ],
  Em: [
    { name: 'Em', variation: 'Variation 1', positions: [0, 2, 2, 0, 0, 0], startFret: 0 },
    { name: 'Em', variation: 'Variation 2', positions: [null, 7, 9, 9, 8, 7], startFret: 7 },
  ],
  Dm: [
    { name: 'Dm', variation: 'Variation 1', positions: [null, null, 0, 2, 3, 1], startFret: 0 },
    { name: 'Dm', variation: 'Variation 2', positions: [null, 5, 7, 7, 6, 5], startFret: 5 },
  ],
  G7: [
    { name: 'G7', variation: 'Variation 1', positions: [3, 2, 0, 0, 0, 1], startFret: 0 },
    { name: 'G7', variation: 'Variation 2', positions: [3, 2, 3, 0, 0, 1], startFret: 0 },
  ],
  C7: [
    { name: 'C7', variation: 'Variation 1', positions: [null, 3, 2, 3, 1, 0], startFret: 0 },
    { name: 'C7', variation: 'Variation 2', positions: [null, 3, 5, 3, 5, 3], startFret: 3 },
  ],
  A7: [
    { name: 'A7', variation: 'Variation 1', positions: [null, 0, 2, 0, 2, 0], startFret: 0 },
    { name: 'A7', variation: 'Variation 2', positions: [5, 7, 5, 6, 5, 5], startFret: 5 },
  ],
  D7: [
    { name: 'D7', variation: 'Variation 1', positions: [null, null, 0, 2, 1, 2], startFret: 0 },
    { name: 'D7', variation: 'Variation 2', positions: [null, 5, 7, 5, 7, 5], startFret: 5 },
  ],
  E7: [
    { name: 'E7', variation: 'Variation 1', positions: [0, 2, 0, 1, 0, 0], startFret: 0 },
    { name: 'E7', variation: 'Variation 2', positions: [0, 2, 2, 1, 3, 0], startFret: 0 },
  ],
  B7: [
    { name: 'B7', variation: 'Variation 1', positions: [null, 2, 1, 2, 0, 2], startFret: 0 },
    { name: 'B7', variation: 'Variation 2', positions: [7, 9, 7, 8, 7, 7], startFret: 7 },
  ],
  Bm: [
    { name: 'Bm', variation: 'Variation 1', positions: [null, 2, 4, 4, 3, 2], startFret: 0 },
    { name: 'Bm', variation: 'Variation 2', positions: [7, 9, 9, 7, 7, 7], startFret: 7 },
  ],
};

export const UKULELE_CHORDS: Record<string, ChordTemplate[]> = {
  C: [
    { name: 'C', variation: 'Variation 1', positions: [0, 0, 0, 3], startFret: 0 },
    { name: 'C', variation: 'Variation 2', positions: [5, 4, 3, 3], startFret: 3 },
  ],
  G: [
    { name: 'G', variation: 'Variation 1', positions: [0, 2, 3, 2], startFret: 0 },
    { name: 'G', variation: 'Variation 2', positions: [4, 2, 3, 2], startFret: 0 },
  ],
  Am: [
    { name: 'Am', variation: 'Variation 1', positions: [2, 0, 0, 0], startFret: 0 },
    { name: 'Am', variation: 'Variation 2', positions: [2, 0, 0, 3], startFret: 0 },
  ],
  F: [
    { name: 'F', variation: 'Variation 1', positions: [2, 0, 1, 0], startFret: 0 },
    { name: 'F', variation: 'Variation 2', positions: [2, 0, 1, 3], startFret: 0 },
  ],
  D: [
    { name: 'D', variation: 'Variation 1', positions: [2, 2, 2, 0], startFret: 0 },
    { name: 'D', variation: 'Variation 2', positions: [2, 2, 2, 5], startFret: 0 },
  ],
};

export const BASS_CHORDS: Record<string, ChordTemplate[]> = {};

export const CHORD_LIBRARIES: Record<string, Record<string, ChordTemplate[]>> = {
  guitar: GUITAR_CHORDS,
  ukulele: UKULELE_CHORDS,
  bass: BASS_CHORDS,
};

export const FONT_OPTIONS = [
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Instrument Serif', value: "'Instrument Serif', serif" },
  { label: 'JetBrains Mono', value: "'JetBrains Mono', monospace" },
  { label: 'Playfair Display', value: "'Playfair Display', serif" },
  { label: 'Source Serif 4', value: "'Source Serif 4', serif" },
];
