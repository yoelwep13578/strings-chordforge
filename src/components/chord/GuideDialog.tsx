import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ThumbsUp } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GuideDialog({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">How to Use ChordForge</DialogTitle>
          <DialogDescription>A quick guide to get you started.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm text-secondary-foreground">
          <section className="space-y-1.5">
            <h4 className="font-semibold text-foreground">Select a Chord</h4>
            <p>Pick an <strong>Instrument</strong> and <strong>Chord</strong> from the Template section. Some chords have multiple <strong>Variations</strong>.</p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-semibold text-foreground">Edit Positions</h4>
            <p>Click on the fretboard to place or remove finger dots. Click above the nut to toggle open (○) and muted (×) strings.</p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-semibold text-foreground">Highlighted Positions</h4>
            <p>Highlighted mark position may useful for marking root notes, intervals, or scale degrees. <strong>Right-click</strong> (mouse) or <strong>long-press</strong> (touch) on a fret position to place a highlighted dot (different color). Left-click a highlighted dot to convert it to normal; right-click/long-press a normal dot to highlight it.</p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-semibold text-foreground">Add Barres</h4>
            <p>Drag horizontally across strings on the same fret to create a barre indicator. Drag again to remove it.</p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-semibold text-foreground">Customize Appearance</h4>
            <p>Change the <strong>Theme</strong>, toggle <strong>Inlay Dots</strong>, <strong>Note Labels</strong>, <strong>Fret Numbers</strong>, and <strong>Tuning Labels</strong>. Adjust marker sizes, typography, and label settings to your liking.</p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-semibold text-foreground">Rotation</h4>
            <p>Rotate the chart left (player's view), right (audience's view), or keep it standard (0°).</p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-semibold text-foreground">Notation Options</h4>
            <p>Use <strong>Change # to b</strong> to show flats instead of sharps. Enable <strong>Use proper ♯ and ♭</strong> for musical symbols.</p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-semibold text-foreground">Export & Copy</h4>
            <p>When you're done, click <strong>Export Chart</strong> or press <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">Ctrl+E</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">⌘E</kbd> to save as PNG/JPG/SVG.</p>
            <p>Click <strong>Copy</strong> or press <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">Ctrl+C</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">⌘C</kbd> to copy as a transparent PNG to clipboard.</p>
          </section>
        </div>

        <div className="flex justify-end pt-2">
          <DialogClose asChild>
            <Button className="gap-2">
              <ThumbsUp className="w-4 h-4" /> Got It
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
