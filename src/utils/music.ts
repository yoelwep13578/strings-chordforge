export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const SHARP_TO_FLAT: Record<string, string> = {
  'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb',
};

export function getNoteAtFret(openNoteIndex: number, fret: number): string {
  return NOTES[(openNoteIndex + fret) % 12];
}

export function formatNote(note: string, useFlats: boolean, useProperSymbols: boolean): string {
  let result = note;
  if (useFlats && SHARP_TO_FLAT[result]) {
    result = SHARP_TO_FLAT[result];
  }
  if (useProperSymbols) {
    result = result.replace(/#/g, '♯').replace(/b/g, '♭');
  }
  return result;
}

/** Format a chord name, replacing # with flat equivalent and/or using proper symbols */
export function formatChordName(name: string, flatName: string | undefined, useFlats: boolean, useProperSymbols: boolean): string {
  let result = useFlats && flatName ? flatName : name;
  if (useProperSymbols) {
    result = result.replace(/#/g, '♯').replace(/b/g, '♭');
  }
  return result;
}

export function fretPosition(scaleLength: number, fretNum: number): number {
  if (fretNum === 0) return 0;
  return scaleLength * (1 - 1 / Math.pow(2, fretNum / 12));
}
