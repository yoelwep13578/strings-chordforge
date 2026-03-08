export interface InstrumentConfig {
  name: string;
  strings: number;
  tuning: string[];
  tuningIndices: number[];
  scaleLength: number;
  nutWidth: number;
  bridgeWidth: number;
  totalFrets: number;
  inlayFrets: number[];
  doubleInlayFrets: number[];
}

export interface ChordTemplate {
  name: string;
  variation: string;
  positions: (number | null)[];
  startFret: number;
  barres?: BarreConfig[];
}

export interface ChordConfig {
  name: string;
  positions: (number | null)[];
  multiPositions: number[][];  // per-string array of frets (for scale mode)
  startFret: number;
  numFrets: number;
  barres: BarreConfig[];
}

export interface BarreConfig {
  fret: number;
  /** 1-indexed from right (string 1 = thinnest/highest pitch) */
  fromString: number;
  /** 1-indexed from right (string 1 = thinnest/highest pitch) */
  toString: number;
}

/** Convert user-facing 1-indexed-from-right barre to internal 0-indexed-from-left */
export function barreToInternal(barre: BarreConfig, totalStrings: number): { fret: number; fromIdx: number; toIdx: number } {
  const fromIdx = totalStrings - barre.toString;
  const toIdx = totalStrings - barre.fromString;
  return { fret: barre.fret, fromIdx, toIdx };
}

/** Convert internal 0-indexed-from-left to user-facing 1-indexed-from-right barre */
export function barreFromInternal(fret: number, fromIdx: number, toIdx: number, totalStrings: number): BarreConfig {
  return { fret, fromString: totalStrings - toIdx, toString: totalStrings - fromIdx };
}

export type ChartTheme = 'realistic-dark' | 'realistic-light' | 'outline-light' | 'outline-dark';

export interface LabelSettings {
  fontSize: number;
  fullContrast: boolean;
  heightOffset: number;
  widthOffset: number;
  rotateWithChart: boolean;
  useSystemFont: boolean;
  systemFontName: string;
}

export interface AllLabelSettings {
  chordName: LabelSettings;
  fretNumbers: LabelSettings;
  tuning: LabelSettings;
  noteLabels: LabelSettings;
}

export const DEFAULT_LABEL_SETTINGS: AllLabelSettings = {
  chordName: { fontSize: 4.8, fullContrast: false, heightOffset: 0, widthOffset: 0, rotateWithChart: true, useSystemFont: false, systemFontName: '' },
  fretNumbers: { fontSize: 2.6, fullContrast: false, heightOffset: 0, widthOffset: 0, rotateWithChart: true, useSystemFont: false, systemFontName: '' },
  tuning: { fontSize: 2.6, fullContrast: false, heightOffset: 0, widthOffset: 0, rotateWithChart: true, useSystemFont: false, systemFontName: '' },
  noteLabels: { fontSize: 2.5, fullContrast: false, heightOffset: 0, widthOffset: 0, rotateWithChart: true, useSystemFont: false, systemFontName: '' },
};

export interface DisplayConfig {
  showInlay: boolean;
  showNoteLabels: boolean;
  showFretNumbers: boolean;
  showTuning: boolean;
  nutWidth: number;
  bridgeWidth: number;
  scaleLength: number;
  labelFont: string;
  rotation: number;
  muteSize: number;
  openSize: number;
  dotSize: number;
  multiPositionMode: boolean;
  globalFullContrast: boolean;
}

export interface ExportOptions {
  format: 'svg' | 'png' | 'jpg';
  width: number;
  transparent: boolean;
}
