import { useState, useRef, useEffect, useCallback } from 'react';
import { InstrumentConfig, ChordConfig, DisplayConfig, ChartTheme, AllLabelSettings, DEFAULT_LABEL_SETTINGS, BarreConfig, barreFromInternal, highlightKey } from '@/types/chord';
import { INSTRUMENTS, CHORD_LIBRARIES } from '@/data/chordTemplates';
import { ChordSVG } from '@/components/chord/ChordSVG';
import { ControlPanel } from '@/components/chord/ControlPanel';
import { ExportDialog } from '@/components/chord/ExportDialog';
import { copyChartRaster } from '@/utils/exportChart';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [instrumentKey, setInstrumentKey] = useState('guitar');
  const [instrument, setInstrument] = useState<InstrumentConfig>(INSTRUMENTS.guitar);
  const [selectedChordKey, setSelectedChordKey] = useState('G7');
  const [variationIndex, setVariationIndex] = useState(0);
  const [chord, setChord] = useState<ChordConfig>({
    name: 'G7',
    positions: [3, 2, 0, 0, 0, 1],
    highlightedPositions: new Set<string>(),
    multiPositions: [[], [], [], [], [], []],
    startFret: 0,
    numFrets: 5,
    barres: [],
  });
  const [display, setDisplay] = useState<DisplayConfig>({
    showInlay: true,
    showNoteLabels: true,
    showFretNumbers: true,
    showTuning: true,
    nutWidth: 43,
    bridgeWidth: 56,
    scaleLength: 648,
    labelFont: 'Inter, sans-serif',
    rotation: 0,
    muteSize: 3.2,
    openSize: 1.6,
    dotSize: 2.6,
    multiPositionMode: false,
    globalFullContrast: false,
    useFlats: false,
    useProperSymbols: false,
    highlightColor: '',
  });
  const [chartTheme, setChartTheme] = useState<ChartTheme>('realistic-dark');
  const [labelSettings, setLabelSettings] = useState<AllLabelSettings>(DEFAULT_LABEL_SETTINGS);
  const [exportOpen, setExportOpen] = useState(false);
  const [lastExportSize, setLastExportSize] = useState(1200);
  const svgRef = useRef<SVGSVGElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    document.documentElement.setAttribute('data-chart-theme', chartTheme);
    return () => { document.documentElement.removeAttribute('data-chart-theme'); };
  }, [chartTheme]);

  const handleQuickCopy = useCallback(async () => {
    if (!svgRef.current) return;
    try {
      await copyChartRaster(svgRef.current, 'png', lastExportSize, true, display.rotation);
      toast({ title: 'Copied to clipboard!' });
    } catch {
      toast({ title: 'Failed to copy to clipboard', variant: 'destructive' });
    }
  }, [lastExportSize, display.rotation, toast]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        setExportOpen(true);
      } else if (e.key === 'c' || e.key === 'C') {
        // Only intercept when not selecting text
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) return;
        e.preventDefault();
        handleQuickCopy();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleQuickCopy]);

  const makeEmptyMultiPositions = (strings: number) => Array.from({ length: strings }, () => [] as number[]);

  const handleInstrumentChange = (key: string) => {
    const inst = INSTRUMENTS[key];
    setInstrumentKey(key);
    setInstrument(inst);
    setDisplay((prev) => ({
      ...prev,
      nutWidth: inst.nutWidth,
      bridgeWidth: inst.bridgeWidth,
      scaleLength: inst.scaleLength,
    }));
    const presets = CHORD_LIBRARIES[key];
    const firstKey = Object.keys(presets)[0];
    if (firstKey && presets[firstKey][0]) {
      const first = presets[firstKey][0];
      setSelectedChordKey(firstKey);
      setVariationIndex(0);
      setChord({ name: first.name, flatName: first.flatName, positions: [...first.positions], highlightedPositions: new Set<string>(), multiPositions: makeEmptyMultiPositions(inst.strings), startFret: first.startFret, numFrets: 5, barres: first.barres ? [...first.barres] : [] });
    } else {
      setSelectedChordKey('');
      setVariationIndex(0);
      setChord({ name: '', positions: new Array(inst.strings).fill(null), highlightedPositions: new Set<string>(), multiPositions: makeEmptyMultiPositions(inst.strings), startFret: 0, numFrets: 5, barres: [] });
    }
  };

  const handleChordKeyChange = (key: string) => {
    setSelectedChordKey(key);
    setVariationIndex(0);
    const presets = CHORD_LIBRARIES[instrumentKey];
    const variations = presets[key];
    if (variations && variations[0]) {
      const t = variations[0];
      setChord(prev => ({ ...prev, name: t.name, flatName: t.flatName, positions: [...t.positions], highlightedPositions: new Set<string>(), multiPositions: makeEmptyMultiPositions(instrument.strings), startFret: t.startFret, barres: t.barres ? [...t.barres] : [] }));
    }
  };

  const handleVariationChange = (idx: number) => {
    setVariationIndex(idx);
    const presets = CHORD_LIBRARIES[instrumentKey];
    const variations = presets[selectedChordKey];
    if (variations && variations[idx]) {
      const t = variations[idx];
      setChord(prev => ({ ...prev, name: t.name, flatName: t.flatName, positions: [...t.positions], highlightedPositions: new Set<string>(), multiPositions: makeEmptyMultiPositions(instrument.strings), startFret: t.startFret, barres: t.barres ? [...t.barres] : [] }));
    }
  };

  const handlePositionClick = useCallback((stringIndex: number, fret: number, highlight?: boolean) => {
    if (display.multiPositionMode && fret > 0) {
      setChord((prev) => {
        const mp = prev.multiPositions.map(arr => [...arr]);
        const idx = mp[stringIndex].indexOf(fret);
        if (idx >= 0) {
          mp[stringIndex].splice(idx, 1);
        } else {
          mp[stringIndex].push(fret);
          mp[stringIndex].sort((a, b) => a - b);
        }
        return { ...prev, multiPositions: mp };
      });
    } else {
      setChord((prev) => {
        const np = [...prev.positions];
        const hp = new Set(prev.highlightedPositions);
        const key = highlightKey(stringIndex, fret);

        if (fret === 0) {
          // Open/mute toggle - no highlight support
          np[stringIndex] = np[stringIndex] === 0 ? null : 0;
          return { ...prev, positions: np };
        }

        const isCurrentlyPlaced = np[stringIndex] === fret;
        const isCurrentlyHighlighted = hp.has(key);

        if (highlight) {
          // Right-click / long-press: toggle highlight
          if (isCurrentlyHighlighted) {
            // Already highlighted → convert to normal
            hp.delete(key);
          } else if (isCurrentlyPlaced) {
            // Normal dot → convert to highlighted
            hp.add(key);
          } else {
            // Empty → place as highlighted
            np[stringIndex] = fret;
            hp.add(key);
          }
        } else {
          // Left-click: toggle normal
          if (isCurrentlyHighlighted) {
            // Highlighted → convert to normal (remove highlight)
            hp.delete(key);
          } else if (isCurrentlyPlaced) {
            // Normal dot → remove
            np[stringIndex] = null;
          } else {
            // Empty → place as normal
            np[stringIndex] = fret;
          }
        }

        return { ...prev, positions: np, highlightedPositions: hp };
      });
    }
  }, [display.multiPositionMode]);

  const handleBarreAdd = useCallback((barre: BarreConfig) => {
    setChord((prev) => {
      // barre comes from drag interaction as internal 0-indexed, convert to user format
      const userBarre = barreFromInternal(barre.fret, barre.fromString, barre.toString, instrument.strings);
      // Check if same barre exists, if so remove it (toggle)
      const existing = prev.barres.findIndex(
        b => b.fret === userBarre.fret && b.fromString === userBarre.fromString && b.toString === userBarre.toString
      );
      if (existing >= 0) {
        const newBarres = [...prev.barres];
        newBarres.splice(existing, 1);
        return { ...prev, barres: newBarres };
      }
      return { ...prev, barres: [...prev.barres, userBarre] };
    });
  }, [instrument.strings]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <aside className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-border bg-card overflow-y-auto p-5 shrink-0">
        <ControlPanel
          instrumentKey={instrumentKey}
          onInstrumentChange={handleInstrumentChange}
          chord={chord}
          onChordChange={setChord}
          display={display}
          onDisplayChange={setDisplay}
          chartTheme={chartTheme}
          onChartThemeChange={setChartTheme}
          labelSettings={labelSettings}
          onLabelSettingsChange={setLabelSettings}
          selectedChordKey={selectedChordKey}
          onChordKeyChange={handleChordKeyChange}
          variationIndex={variationIndex}
          onVariationChange={handleVariationChange}
          onExport={() => setExportOpen(true)}
          onQuickCopy={handleQuickCopy}
          lastExportSize={lastExportSize}
          rotation={display.rotation}
        />
      </aside>

      <main className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-hidden">
        <ChordSVG
          ref={svgRef}
          instrument={instrument}
          chord={chord}
          display={display}
          chartTheme={chartTheme}
          labelSettings={labelSettings}
          onPositionClick={handlePositionClick}
          onBarreAdd={handleBarreAdd}
        />
      </main>

      <ExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        svgRef={svgRef}
        chordName={chord.name}
        rotation={display.rotation}
        size={lastExportSize}
        onSizeChange={setLastExportSize}
      />
    </div>
  );
};

export default Index;
