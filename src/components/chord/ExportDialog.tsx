import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Download, Copy, Check } from 'lucide-react';
import { exportChartSVG, exportChartRaster, copyChartRaster } from '@/utils/exportChart';
import { useToast } from '@/hooks/use-toast';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  svgRef: React.RefObject<SVGSVGElement>;
  chordName: string;
  rotation: number;
  size: number;
  onSizeChange: (size: number) => void;
}

export function ExportDialog({ open, onOpenChange, svgRef, chordName, rotation, size, onSizeChange }: Props) {
  const [format, setFormat] = useState<'svg' | 'png' | 'jpg'>('svg');
  const [transparent, setTransparent] = useState(true);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const isHorizontal = rotation === 90 || rotation === -90;
  const sizeLabel = isHorizontal ? 'Height (px)' : 'Width (px)';

  const handleExport = () => {
    if (!svgRef.current) return;
    const filename = `chord-${chordName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    if (format === 'svg') {
      exportChartSVG(svgRef.current, `${filename}.svg`);
    } else {
      exportChartRaster(svgRef.current, format, size, transparent, `${filename}.${format}`, rotation);
    }
    onOpenChange(false);
  };

  const handleCopy = async () => {
    if (!svgRef.current) return;
    try {
      await copyChartRaster(svgRef.current, format as 'png' | 'jpg', size, transparent, rotation);
      setCopied(true);
      toast({ title: 'Copied to clipboard!' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: 'Failed to copy to clipboard', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Chord Chart</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 py-2">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Format</Label>
            <RadioGroup value={format} onValueChange={(v) => setFormat(v as 'svg' | 'png' | 'jpg')}
              className="flex gap-4">
              {(['svg', 'png', 'jpg'] as const).map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <RadioGroupItem value={f} id={`fmt-${f}`} />
                  <Label htmlFor={`fmt-${f}`} className="text-sm uppercase cursor-pointer">{f}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {format !== 'svg' && (
            <>
              <div className="flex items-center justify-between">
                <Label className="text-sm">{sizeLabel}</Label>
                <Input type="number" className="w-28 h-8 text-sm" min={100} max={8000}
                  value={size} onChange={(e) => onSizeChange(parseInt(e.target.value) || 1200)} />
              </div>
              {format === 'png' && (
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Transparent Background</Label>
                  <Switch checked={transparent} onCheckedChange={setTransparent} />
                </div>
              )}
            </>
          )}

          <div className="flex gap-2">
            <Button onClick={handleExport} className="flex-1 gap-2">
              <Download className="w-4 h-4" />
              Download {format.toUpperCase()}
            </Button>
            {format !== 'svg' && (
              <Button variant="outline" onClick={handleCopy} className="gap-2">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
