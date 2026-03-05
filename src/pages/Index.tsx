import { useState, useRef, useEffect } from 'react';
import { InstrumentConfig, ChordConfig, DisplayConfig, ChartTheme, AllLabelSettings, DEFAULT_LABEL_SETTINGS } from '@/types/chord';
import { INSTRUMENTS, CHORD_LIBRARIES } from '@/data/chordTemplates';
import { ChordSVG } from '@/components/chord/ChordSVG';
import { ControlPanel } from '@/components/chord/ControlPanel';
import { ExportDialog } from '@/components/chord/ExportDialog';

const Index = () => {
  const [instrumentKey, setInstrumentKey] = useState('guitar');
  const [instrument, setInstrument] = useState<InstrumentConfig>(INSTRUMENTS.guitar);
  const [selectedChordKey, setSelectedChordKey] = useState('G7');
  const [variationIndex, setVariationIndex] = useState(0);
  const [chord, setChord] = useState<ChordConfig>({
    name: 'G7',
    positions: [3, 2, 0, 0, 0, 1],
    startFret: 0,
    numFrets: 5,
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
  });
  const [chartTheme, setChartTheme] = useState<ChartTheme>('realistic-dark');
  const [labelSettings, setLabelSettings] = useState<AllLabelSettings>(DEFAULT_LABEL_SETTINGS);
  const [exportOpen, setExportOpen] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // Apply webapp theme based on chart theme
  useEffect(() => {
    document.documentElement.setAttribute('data-chart-theme', chartTheme);
    return () => { document.documentElement.removeAttribute('data-chart-theme'); };
  }, [chartTheme]);

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
      setChord({ name: first.name, positions: [...first.positions], startFret: first.startFret, numFrets: 5 });
    } else {
      setSelectedChordKey('');
      setVariationIndex(0);
      setChord({ name: '', positions: new Array(inst.strings).fill(null), startFret: 0, numFrets: 5 });
    }
  };

  const handleChordKeyChange = (key: string) => {
    setSelectedChordKey(key);
    setVariationIndex(0);
    const presets = CHORD_LIBRARIES[instrumentKey];
    const variations = presets[key];
    if (variations && variations[0]) {
      const t = variations[0];
      setChord({ name: t.name, positions: [...t.positions], startFret: t.startFret, numFrets: chord.numFrets });
    }
  };

  const handleVariationChange = (idx: number) => {
    setVariationIndex(idx);
    const presets = CHORD_LIBRARIES[instrumentKey];
    const variations = presets[selectedChordKey];
    if (variations && variations[idx]) {
      const t = variations[idx];
      setChord({ name: t.name, positions: [...t.positions], startFret: t.startFret, numFrets: chord.numFrets });
    }
  };

  const handlePositionClick = (stringIndex: number, fret: number) => {
    setChord((prev) => {
      const np = [...prev.positions];
      if (fret === 0) {
        np[stringIndex] = np[stringIndex] === 0 ? null : 0;
      } else {
        np[stringIndex] = np[stringIndex] === fret ? null : fret;
      }
      return { ...prev, positions: np };
    });
  };

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
        />
      </main>

      <ExportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        svgRef={svgRef}
        chordName={chord.name}
      />
    </div>
  );
};

export default Index;
