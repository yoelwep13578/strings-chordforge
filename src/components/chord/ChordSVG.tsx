import React, { useMemo, forwardRef, useState, useCallback } from 'react';
import { InstrumentConfig, ChordConfig, DisplayConfig, ChartTheme, AllLabelSettings, LabelSettings, BarreConfig } from '@/types/chord';
import { getNoteAtFret, fretPosition } from '@/utils/music';
import { CHART_THEMES, ChartColors } from '@/data/chartThemes';

interface Props {
  instrument: InstrumentConfig;
  chord: ChordConfig;
  display: DisplayConfig;
  chartTheme: ChartTheme;
  labelSettings: AllLabelSettings;
  onPositionClick: (stringIndex: number, fret: number) => void;
  onBarreAdd?: (barre: BarreConfig) => void;
}

function getLabelFont(ls: LabelSettings, globalFont: string): string {
  if (ls.useSystemFont) return ls.systemFontName || 'system-ui, sans-serif';
  return globalFont;
}

function getLabelColor(ls: LabelSettings, normal: string, contrast: string): string {
  return ls.fullContrast ? contrast : normal;
}

interface DragState {
  startString: number;
  startFret: number;
  currentString: number;
}

export const ChordSVG = forwardRef<SVGSVGElement, Props>(
  ({ instrument, chord, display, chartTheme, labelSettings, onPositionClick, onBarreAdd }, ref) => {
    const C: ChartColors = CHART_THEMES[chartTheme] || CHART_THEMES['realistic-dark'];
    const [dragState, setDragState] = useState<DragState | null>(null);

    const calc = useMemo(() => {
      const sl = display.scaleLength;
      const nw = display.nutWidth;
      const bw = display.bridgeWidth;
      const sf = chord.startFret;
      const nf = chord.numFrets;
      const ns = instrument.strings;

      const fretAbsY = (n: number) => fretPosition(sl, n);
      const topAbsY = fretAbsY(sf);
      const botAbsY = fretAbsY(sf + nf);
      const fbHeight = botAbsY - topAbsY;

      const widthAt = (absY: number) => nw + (bw - nw) * (absY / sl);
      const topW = widthAt(topAbsY);
      const botW = widthAt(botAbsY);
      const maxW = Math.max(topW, botW);

      const pad = { top: 32, bottom: 10, left: 28, right: 8 };
      const vw = maxW + pad.left + pad.right;
      const vh = fbHeight + pad.top + pad.bottom;
      const cx = pad.left + maxW / 2;

      const toSvgY = (absY: number) => pad.top + (absY - topAbsY);

      const stringX = (s: number, absY: number) => {
        const w = widthAt(absY);
        const m = w * 0.06;
        const u = w - 2 * m;
        const sp = ns > 1 ? u / (ns - 1) : 0;
        return cx - w / 2 + m + s * sp;
      };

      const frets: { num: number; svgY: number; absY: number }[] = [];
      for (let i = 0; i <= nf; i++) {
        const fn = sf + i;
        frets.push({ num: fn, svgY: toSvgY(fretAbsY(fn)), absY: fretAbsY(fn) });
      }

      const stringThick = (s: number) => {
        const min = 0.12;
        const max = 0.55;
        return max - (max - min) * (s / Math.max(ns - 1, 1));
      };

      return { sl, nw, bw, sf, nf, ns, topAbsY, botAbsY, topW, botW, maxW, pad, vw, vh, cx, toSvgY, stringX, widthAt, fretAbsY, frets, stringThick };
    }, [instrument, chord.startFret, chord.numFrets, display]);

    const { sf, nf, ns, topAbsY, botAbsY, topW, botW, maxW, pad, vw, vh, cx, toSvgY, stringX, widthAt, fretAbsY, frets, stringThick } = calc;
    const rotation = display.rotation;

    const hitTest = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
      const svg = e.currentTarget;
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const ctm = svg.getScreenCTM();
      if (!ctm) return null;
      const p = pt.matrixTransform(ctm.inverse());

      // Above nut area
      if (p.y < frets[0].svgY && p.y > frets[0].svgY - 14) {
        let nearest = 0, minD = Infinity;
        for (let s = 0; s < ns; s++) {
          const d = Math.abs(p.x - stringX(s, topAbsY));
          if (d < minD) { minD = d; nearest = s; }
        }
        if (minD < 8) return { stringIndex: nearest, fret: 0 };
        return null;
      }

      if (p.y < frets[0].svgY || p.y > frets[frets.length - 1].svgY) return null;

      let fretNum = sf + 1;
      for (let i = 1; i < frets.length; i++) {
        if (p.y <= frets[i].svgY) { fretNum = frets[i].num; break; }
      }

      const absY = topAbsY + (p.y - pad.top);
      let nearest = 0, minD = Infinity;
      for (let s = 0; s < ns; s++) {
        const d = Math.abs(p.x - stringX(s, absY));
        if (d < minD) { minD = d; nearest = s; }
      }
      if (minD < 8) return { stringIndex: nearest, fret: fretNum };
      return null;
    }, [frets, ns, sf, topAbsY, pad, stringX]);

    const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
      const hit = hitTest(e);
      if (!hit || hit.fret === 0) return;
      setDragState({ startString: hit.stringIndex, startFret: hit.fret, currentString: hit.stringIndex });
    };

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
      if (!dragState) return;
      const hit = hitTest(e);
      if (hit && hit.fret === dragState.startFret) {
        setDragState({ ...dragState, currentString: hit.stringIndex });
      }
    };

    const handleMouseUp = (e: React.MouseEvent<SVGSVGElement>) => {
      if (dragState) {
        const from = Math.min(dragState.startString, dragState.currentString);
        const to = Math.max(dragState.startString, dragState.currentString);
        if (from !== to && onBarreAdd) {
          onBarreAdd({ fret: dragState.startFret, fromString: from, toString: to });
        } else {
          // Single click - normal position toggle
          onPositionClick(dragState.startString, dragState.startFret);
        }
        setDragState(null);
        return;
      }
      // Fallback for clicks above nut
      const hit = hitTest(e);
      if (hit && hit.fret === 0) {
        onPositionClick(hit.stringIndex, 0);
      }
    };

    const fbPoints = [
      `${cx - topW / 2},${frets[0].svgY}`,
      `${cx + topW / 2},${frets[0].svgY}`,
      `${cx + botW / 2},${frets[frets.length - 1].svgY}`,
      `${cx - botW / 2},${frets[frets.length - 1].svgY}`,
    ].join(' ');

    // Inlays
    const inlays: { x: number; y: number }[] = [];
    if (display.showInlay) {
      const all = [
        ...instrument.inlayFrets.map(f => ({ f, double: false })),
        ...instrument.doubleInlayFrets.map(f => ({ f, double: true })),
      ];
      for (const { f, double } of all) {
        if (f > sf && f <= sf + nf) {
          const midAbsY = (fretAbsY(f - 1) + fretAbsY(f)) / 2;
          const my = toSvgY(midAbsY);
          if (double) {
            const w = widthAt(midAbsY);
            inlays.push({ x: cx - w * 0.15, y: my });
            inlays.push({ x: cx + w * 0.15, y: my });
          } else {
            inlays.push({ x: cx, y: my });
          }
        }
      }
    }

    // Collect all finger dots (standard + multi-position)
    const allFingerDots: { x: number; y: number; note: string; stringIndex: number }[] = [];

    if (display.multiPositionMode && chord.multiPositions) {
      chord.multiPositions.forEach((fretList, s) => {
        for (const fret of fretList) {
          if (fret <= sf || fret > sf + nf) continue;
          const midAbsY = (fretAbsY(fret - 1) + fretAbsY(fret)) / 2;
          allFingerDots.push({
            x: stringX(s, midAbsY),
            y: toSvgY(midAbsY),
            note: getNoteAtFret(instrument.tuningIndices[s], fret),
            stringIndex: s,
          });
        }
      });
    }

    // Standard single-position dots
    chord.positions.forEach((fret, s) => {
      if (fret === null || fret === 0 || fret <= sf || fret > sf + nf) return;
      // In multi-position mode, skip if already covered
      if (display.multiPositionMode && chord.multiPositions[s]?.includes(fret)) return;
      const midAbsY = (fretAbsY(fret - 1) + fretAbsY(fret)) / 2;
      allFingerDots.push({
        x: stringX(s, midAbsY),
        y: toSvgY(midAbsY),
        note: getNoteAtFret(instrument.tuningIndices[s], fret),
        stringIndex: s,
      });
    });

    const nutH = 1.8;
    const dotR = display.dotSize;
    const muteSize = display.muteSize;
    const openR = display.openSize;

    const counterRotate = (ls: LabelSettings, x: number, y: number) => {
      if (rotation !== 0 && !ls.rotateWithChart) {
        return `rotate(${-rotation}, ${x}, ${y})`;
      }
      return undefined;
    };

    const getLabelAnchor = (ls: LabelSettings) => {
      if (rotation !== 0 && !ls.rotateWithChart) {
        return { dominantBaseline: 'central' as const, textAnchor: 'middle' as const };
      }
      return {};
    };

    // Barre rendering
    const barreElements = (chord.barres || []).map((barre, i) => {
      if (barre.fret <= sf || barre.fret > sf + nf) return null;
      const midAbsY = (fretAbsY(barre.fret - 1) + fretAbsY(barre.fret)) / 2;
      const y = toSvgY(midAbsY);
      const x1 = stringX(barre.fromString, midAbsY);
      const x2 = stringX(barre.toString, midAbsY);
      return (
        <line key={`barre${i}`}
          x1={x1} y1={y} x2={x2} y2={y}
          stroke={C.finger} strokeWidth={dotR * 1.8}
          strokeLinecap="round" opacity={0.85}
        />
      );
    });

    // Drag preview barre
    const dragPreview = dragState && dragState.startString !== dragState.currentString ? (() => {
      const fret = dragState.startFret;
      if (fret <= sf || fret > sf + nf) return null;
      const midAbsY = (fretAbsY(fret - 1) + fretAbsY(fret)) / 2;
      const y = toSvgY(midAbsY);
      const from = Math.min(dragState.startString, dragState.currentString);
      const to = Math.max(dragState.startString, dragState.currentString);
      const x1 = stringX(from, midAbsY);
      const x2 = stringX(to, midAbsY);
      return (
        <line
          x1={x1} y1={y} x2={x2} y2={y}
          stroke={C.finger} strokeWidth={dotR * 1.8}
          strokeLinecap="round" opacity={0.4}
        />
      );
    })() : null;

    return (
      <svg
        ref={ref}
        viewBox={`0 0 ${vw} ${vh}`}
        xmlns="http://www.w3.org/2000/svg"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          cursor: 'crosshair',
          maxHeight: '82vh',
          width: 'auto',
          transform: rotation !== 0 ? `rotate(${rotation}deg)` : undefined,
          transformOrigin: 'center',
        }}
        className="select-none"
      >
        <defs>
          {C.useGradients && (
            <>
              <linearGradient id="fb-grad" x1="0" y1="0" x2="0.25" y2="1">
                <stop offset="0%" stopColor={C.fretboard} />
                <stop offset="45%" stopColor={C.fretboardLight} />
                <stop offset="100%" stopColor={C.fretboard} />
              </linearGradient>
              <linearGradient id="nut-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.nut} />
                <stop offset="100%" stopColor={C.nutDark} />
              </linearGradient>
              <radialGradient id="finger-grad" cx="40%" cy="35%" r="60%">
                <stop offset="0%" stopColor={C.fingerHighlight} />
                <stop offset="100%" stopColor={C.finger} />
              </radialGradient>
            </>
          )}
        </defs>

        {/* Fretboard */}
        {C.useGradients ? (
          <>
            <polygon points={fbPoints} fill="url(#fb-grad)" />
            <polygon points={fbPoints} fill="none" stroke={C.binding} strokeWidth={0.35} />
          </>
        ) : (
          <polygon points={fbPoints} fill="none" stroke={C.binding} strokeWidth={0.5} />
        )}

        {/* Inlays */}
        {inlays.map((dot, i) => (
          <circle key={`il${i}`} cx={dot.x} cy={dot.y} r={1.4} fill={C.inlay} />
        ))}

        {/* Frets */}
        {frets.map((f, i) => {
          if (f.num === 0) return null;
          const w = widthAt(f.absY);
          return (
            <line key={`fr${i}`} x1={cx - w / 2} y1={f.svgY} x2={cx + w / 2} y2={f.svgY}
              stroke={C.fret} strokeWidth={0.35} />
          );
        })}

        {/* Nut */}
        {sf === 0 && (
          C.useGradients ? (
            <rect x={cx - topW / 2} y={frets[0].svgY - nutH} width={topW} height={nutH}
              fill="url(#nut-grad)" rx={0.25} />
          ) : (
            <rect x={cx - topW / 2} y={frets[0].svgY - nutH} width={topW} height={nutH}
              fill={C.nut} rx={0.25} />
          )
        )}
        {sf > 0 && (
          <line x1={cx - topW / 2} y1={frets[0].svgY} x2={cx + topW / 2} y2={frets[0].svgY}
            stroke={C.fret} strokeWidth={0.5} />
        )}

        {/* Strings */}
        {Array.from({ length: ns }).map((_, s) => {
          const t = s / Math.max(ns - 1, 1);
          const color = C.useGradients ? (t < 0.5 ? C.stringBass : C.stringTreble) : C.stringBass;
          return (
            <line key={`st${s}`}
              x1={stringX(s, topAbsY)} y1={frets[0].svgY}
              x2={stringX(s, botAbsY)} y2={frets[frets.length - 1].svgY}
              stroke={color} strokeWidth={C.useGradients ? stringThick(s) : 0.3} strokeLinecap="round" />
          );
        })}

        {/* Barres */}
        {barreElements}
        {dragPreview}

        {/* Finger dots */}
        {allFingerDots.map((dot, i) => (
          <g key={`fd${i}`}>
            <circle cx={dot.x} cy={dot.y} r={dotR}
              fill={C.useGradients ? 'url(#finger-grad)' : C.finger} />
            {display.showNoteLabels && (
              <text x={dot.x + labelSettings.noteLabels.widthOffset} y={dot.y + 0.85 + labelSettings.noteLabels.heightOffset}
                textAnchor="middle"
                fontSize={labelSettings.noteLabels.fontSize}
                fontFamily={getLabelFont(labelSettings.noteLabels, display.labelFont)}
                fontWeight="700"
                fill={getLabelColor(labelSettings.noteLabels, C.fingerText, C.fingerText)}
                transform={counterRotate(labelSettings.noteLabels, dot.x + labelSettings.noteLabels.widthOffset, dot.y + 0.85 + labelSettings.noteLabels.heightOffset)}
                {...getLabelAnchor(labelSettings.noteLabels)}
              >{dot.note}</text>
            )}
          </g>
        ))}

        {/* Open / Muted indicators */}
        {chord.positions.map((fret, s) => {
          const x = stringX(s, topAbsY);
          const y = frets[0].svgY - (sf === 0 ? nutH + 3.5 : 4.5);
          if (fret === 0) {
            return <circle key={`op${s}`} cx={x} cy={y} r={openR} fill="none" stroke={C.openMute} strokeWidth={0.35} />;
          }
          if (fret === null) {
            return <text key={`mt${s}`} x={x} y={y + muteSize * 0.375} textAnchor="middle" fontSize={muteSize}
              fontFamily={display.labelFont} fontWeight="600" fill={C.openMute}>×</text>;
          }
          return null;
        })}

        {/* Fret numbers */}
        {display.showFretNumbers && frets.slice(1).map((f, i) => {
          const midY = (frets[i].svgY + f.svgY) / 2;
          const x = cx - maxW / 2 - 4 + labelSettings.fretNumbers.widthOffset;
          const y = midY + 1 + labelSettings.fretNumbers.heightOffset;
          return (
            <text key={`fn${i}`} x={x} y={y}
              textAnchor="middle"
              fontSize={labelSettings.fretNumbers.fontSize}
              fontFamily={getLabelFont(labelSettings.fretNumbers, display.labelFont)}
              fill={getLabelColor(labelSettings.fretNumbers, C.label, C.labelContrast)}
              transform={counterRotate(labelSettings.fretNumbers, x, y)}
              {...getLabelAnchor(labelSettings.fretNumbers)}
            >{f.num}</text>
          );
        })}

        {/* Tuning labels */}
        {display.showTuning && Array.from({ length: ns }).map((_, s) => {
          const x = stringX(s, topAbsY) + labelSettings.tuning.widthOffset;
          const y = frets[0].svgY - (sf === 0 ? nutH + 7.5 : 8.5) + labelSettings.tuning.heightOffset;
          return (
            <text key={`tu${s}`} x={x} y={y}
              textAnchor="middle"
              fontSize={labelSettings.tuning.fontSize}
              fontFamily={getLabelFont(labelSettings.tuning, display.labelFont)}
              fontWeight="500"
              fill={getLabelColor(labelSettings.tuning, C.label, C.labelContrast)}
              transform={counterRotate(labelSettings.tuning, x, y)}
              {...getLabelAnchor(labelSettings.tuning)}
            >{instrument.tuning[s]}</text>
          );
        })}

        {/* Chord name */}
        {(() => {
          const x = cx + labelSettings.chordName.widthOffset;
          const y = 9 + labelSettings.chordName.heightOffset;
          return (
            <text x={x} y={y} textAnchor="middle"
              fontSize={labelSettings.chordName.fontSize}
              fontFamily={getLabelFont(labelSettings.chordName, display.labelFont)}
              fontWeight="700"
              fill={getLabelColor(labelSettings.chordName, C.chordName, C.chordNameContrast)}
              transform={counterRotate(labelSettings.chordName, x, y)}
              {...getLabelAnchor(labelSettings.chordName)}
            >
              {chord.name}
            </text>
          );
        })()}
      </svg>
    );
  }
);

ChordSVG.displayName = 'ChordSVG';
