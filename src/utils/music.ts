export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function getNoteAtFret(openNoteIndex: number, fret: number): string {
  return NOTES[(openNoteIndex + fret) % 12];
}

export function fretPosition(scaleLength: number, fretNum: number): number {
  if (fretNum === 0) return 0;
  return scaleLength * (1 - 1 / Math.pow(2, fretNum / 12));
}
