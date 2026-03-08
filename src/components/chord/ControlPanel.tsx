import { ChordConfig, DisplayConfig, ChartTheme, AllLabelSettings } from '@/types/chord';
import { INSTRUMENTS, CHORD_LIBRARIES, FONT_OPTIONS } from '@/data/chordTemplates';
import { CHART_THEME_OPTIONS } from '@/data/chartThemes';
import { LabelSettingsSection } from './LabelSettingsSection';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Download, RotateCcw, RotateCw, Info } from 'lucide-react';

interface Props {
  instrumentKey: string;
  onInstrumentChange: (key: string) => void;
  chord: ChordConfig;
  onChordChange: (chord: ChordConfig) => void;
  display: DisplayConfig;
  onDisplayChange: (display: DisplayConfig) => void;
  chartTheme: ChartTheme;
  onChartThemeChange: (theme: ChartTheme) => void;
  labelSettings: AllLabelSettings;
  onLabelSettingsChange: (settings: AllLabelSettings) => void;
  selectedChordKey: string;
  onChordKeyChange: (key: string) => void;
  variationIndex: number;
  onVariationChange: (index: number) => void;
  onExport: () => void;
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{children}</h3>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-3">
    <Label className="text-sm text-secondary-foreground shrink-0">{label}</Label>
    {children}
  </div>
);

export function ControlPanel({
  instrumentKey, onInstrumentChange,
  chord, onChordChange,
  display, onDisplayChange,
  chartTheme, onChartThemeChange,
  labelSettings, onLabelSettingsChange,
  selectedChordKey, onChordKeyChange,
  variationIndex, onVariationChange,
  onExport,
}: Props) {
  const chordPresets = CHORD_LIBRARIES[instrumentKey] || {};
  const variations = chordPresets[selectedChordKey] || [];
  const isOutlineTheme = chartTheme === 'outline-light' || chartTheme === 'outline-dark';

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-bold text-foreground tracking-tight">ChordForge</h1>
        <p className="text-xs text-muted-foreground">Chord chart generator</p>
      </div>

      <Separator />

      {/* Theme */}
      <div className="space-y-3">
        <SectionTitle>Theme</SectionTitle>
        <Field label="Chart Style">
          <Select value={chartTheme} onValueChange={(v) => onChartThemeChange(v as ChartTheme)}>
            <SelectTrigger className="w-36 h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {CHART_THEME_OPTIONS.map((t) => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Separator />

      {/* Template */}
      <div className="space-y-3">
        <SectionTitle>Template</SectionTitle>
        <Field label="Instrument">
          <Select value={instrumentKey} onValueChange={onInstrumentChange}>
            <SelectTrigger className="w-32 h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(INSTRUMENTS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Chord">
          <Select value={selectedChordKey} onValueChange={onChordKeyChange}>
            <SelectTrigger className="w-32 h-8 text-sm"><SelectValue placeholder="Select..." /></SelectTrigger>
            <SelectContent>
              {Object.keys(chordPresets).map((k) => (
                <SelectItem key={k} value={k}>{k}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        {variations.length > 1 && (
          <Field label="Variation">
            <Select value={String(variationIndex)} onValueChange={(v) => onVariationChange(parseInt(v))}>
              <SelectTrigger className="w-32 h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {variations.map((vr, i) => (
                  <SelectItem key={i} value={String(i)}>{vr.variation}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        )}
      </div>

      <Separator />

      {/* Chord */}
      <div className="space-y-3">
        <SectionTitle>Chord</SectionTitle>
        <Field label="Name">
          <Input className="w-32 h-8 text-sm" value={chord.name}
            onChange={(e) => onChordChange({ ...chord, name: e.target.value })} />
        </Field>
      </div>

      <Separator />

      {/* Fretboard */}
      <div className="space-y-3">
        <SectionTitle>Fretboard</SectionTitle>
        <Field label="Start Fret">
          <Input type="number" className="w-20 h-8 text-sm" min={0} max={24}
            value={chord.startFret}
            onChange={(e) => onChordChange({ ...chord, startFret: Math.max(0, parseInt(e.target.value) || 0) })} />
        </Field>
        <Field label="Frets Shown">
          <Input type="number" className="w-20 h-8 text-sm" min={1} max={24}
            value={chord.numFrets}
            onChange={(e) => onChordChange({ ...chord, numFrets: Math.max(1, parseInt(e.target.value) || 1) })} />
        </Field>
        <Field label="Nut Width (mm)">
          <Input type="number" className="w-20 h-8 text-sm" min={10} max={100}
            value={display.nutWidth}
            onChange={(e) => onDisplayChange({ ...display, nutWidth: parseFloat(e.target.value) || 43 })} />
        </Field>
        <Field label="Bridge Width (mm)">
          <Input type="number" className="w-20 h-8 text-sm" min={10} max={120}
            value={display.bridgeWidth}
            onChange={(e) => onDisplayChange({ ...display, bridgeWidth: parseFloat(e.target.value) || 56 })} />
        </Field>
        <Field label="Scale Length (mm)">
          <Input type="number" className="w-20 h-8 text-sm" min={100} max={2000}
            value={display.scaleLength}
            onChange={(e) => onDisplayChange({ ...display, scaleLength: parseFloat(e.target.value) || 648 })} />
        </Field>
      </div>

      <Separator />

      {/* Rotation */}
      <div className="space-y-3">
        <SectionTitle>Rotation</SectionTitle>
        <TooltipProvider delayDuration={200}>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={display.rotation === -90 ? 'default' : 'outline'} size="sm"
                  onClick={() => onDisplayChange({ ...display, rotation: display.rotation === -90 ? 0 : -90 })}
                  className="gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5" /> Left
                </Button>
              </TooltipTrigger>
              <TooltipContent>As seen from player's perspective</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={display.rotation === 0 ? 'default' : 'outline'} size="sm"
                  onClick={() => onDisplayChange({ ...display, rotation: 0 })}>
                  0°
                </Button>
              </TooltipTrigger>
              <TooltipContent>Standard orientation</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={display.rotation === 90 ? 'default' : 'outline'} size="sm"
                  onClick={() => onDisplayChange({ ...display, rotation: display.rotation === 90 ? 0 : 90 })}
                  className="gap-1.5">
                  <RotateCw className="w-3.5 h-3.5" /> Right
                </Button>
              </TooltipTrigger>
              <TooltipContent>As seen from audience's perspective</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>

      <Separator />

      {/* Display */}
      <div className="space-y-3">
        <SectionTitle>Display</SectionTitle>
        {isOutlineTheme && (
          <TooltipProvider delayDuration={200}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <Label className="text-sm text-secondary-foreground shrink-0">Global Full Contrast</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[240px]">
                    Apply maximum contrast to all chart elements — pure {chartTheme === 'outline-light' ? 'white' : 'black'} for the {chartTheme === 'outline-light' ? 'Outline Light' : 'Outline Dark'} theme.
                  </TooltipContent>
                </Tooltip>
              </div>
              <Switch checked={display.globalFullContrast}
                onCheckedChange={(v) => onDisplayChange({ ...display, globalFullContrast: v })} />
            </div>
          </TooltipProvider>
        )}
        <Field label="Inlay Dots">
          <Switch checked={display.showInlay}
            onCheckedChange={(v) => onDisplayChange({ ...display, showInlay: v })} />
        </Field>
        <Field label="Note Labels">
          <Switch checked={display.showNoteLabels}
            onCheckedChange={(v) => onDisplayChange({ ...display, showNoteLabels: v })} />
        </Field>
        <Field label="Fret Numbers">
          <Switch checked={display.showFretNumbers}
            onCheckedChange={(v) => onDisplayChange({ ...display, showFretNumbers: v })} />
        </Field>
        <Field label="Tuning Labels">
          <Switch checked={display.showTuning}
            onCheckedChange={(v) => onDisplayChange({ ...display, showTuning: v })} />
        </Field>
        <TooltipProvider delayDuration={200}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <Label className="text-sm text-secondary-foreground shrink-0">Multi-Position</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[220px]">
                  Allow multiple finger positions on the same string. Useful for scale diagrams, interval maps, or tab alternatives.
                </TooltipContent>
              </Tooltip>
            </div>
            <Switch checked={display.multiPositionMode}
              onCheckedChange={(v) => onDisplayChange({ ...display, multiPositionMode: v })} />
          </div>
        </TooltipProvider>
      </div>

      <Separator />

      {/* Barres */}
      {chord.barres.length > 0 && (
        <>
          <div className="space-y-3">
            <SectionTitle>Barres</SectionTitle>
            <div className="space-y-1.5">
              {chord.barres.map((b, i) => (
                <div key={i} className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Fret {b.fret}: string {b.fromString}–{b.toString}</span>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs"
                    onClick={() => {
                      const newBarres = [...chord.barres];
                      newBarres.splice(i, 1);
                      onChordChange({ ...chord, barres: newBarres });
                    }}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground italic">Drag across strings on the chart to add barres</p>
          </div>
          <Separator />
        </>
      )}

      {chord.barres.length === 0 && (
        <>
          <div className="space-y-2">
            <SectionTitle>Barres</SectionTitle>
            <p className="text-xs text-muted-foreground italic">Drag across strings on the same fret to create a barre indicator</p>
          </div>
          <Separator />
        </>
      )}

      {/* Marker Sizes */}
      <div className="space-y-3">
        <SectionTitle>Marker Sizes</SectionTitle>
        <Field label="Mute (×) Size">
          <Input type="number" className="w-20 h-8 text-sm" min={1} max={10} step={0.1}
            value={display.muteSize}
            onChange={(e) => onDisplayChange({ ...display, muteSize: parseFloat(e.target.value) || 3.2 })} />
        </Field>
        <Field label="Open (○) Size">
          <Input type="number" className="w-20 h-8 text-sm" min={0.5} max={8} step={0.1}
            value={display.openSize}
            onChange={(e) => onDisplayChange({ ...display, openSize: parseFloat(e.target.value) || 1.6 })} />
        </Field>
        <Field label="Finger Dot Size">
          <Input type="number" className="w-20 h-8 text-sm" min={0.5} max={8} step={0.1}
            value={display.dotSize}
            onChange={(e) => onDisplayChange({ ...display, dotSize: parseFloat(e.target.value) || 2.6 })} />
        </Field>
      </div>

      <Separator />

      {/* Typography */}
      <div className="space-y-3">
        <SectionTitle>Typography</SectionTitle>
        <Field label="Global Font">
          <Select value={display.labelFont} onValueChange={(v) => onDisplayChange({ ...display, labelFont: v })}>
            <SelectTrigger className="w-36 h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {FONT_OPTIONS.map((f) => (
                <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Separator />

      {/* Per-label settings */}
      <div className="space-y-1">
        <SectionTitle>Label Settings</SectionTitle>
        <LabelSettingsSection title="Chord Name"
          settings={labelSettings.chordName}
          onChange={(s) => onLabelSettingsChange({ ...labelSettings, chordName: s })}
          globalContrastActive={isOutlineTheme && display.globalFullContrast} />
        <LabelSettingsSection title="Fret Numbers"
          settings={labelSettings.fretNumbers}
          onChange={(s) => onLabelSettingsChange({ ...labelSettings, fretNumbers: s })}
          globalContrastActive={isOutlineTheme && display.globalFullContrast} />
        <LabelSettingsSection title="Tuning Labels"
          settings={labelSettings.tuning}
          onChange={(s) => onLabelSettingsChange({ ...labelSettings, tuning: s })}
          globalContrastActive={isOutlineTheme && display.globalFullContrast} />
        <LabelSettingsSection title="Note Labels"
          settings={labelSettings.noteLabels}
          onChange={(s) => onLabelSettingsChange({ ...labelSettings, noteLabels: s })}
          globalContrastActive={isOutlineTheme && display.globalFullContrast} />
      </div>

      <Separator />

      <Button onClick={onExport} className="w-full gap-2">
        <Download className="w-4 h-4" />
        Export Chart
      </Button>
    </div>
  );
}
