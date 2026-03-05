export function exportChartSVG(svgEl: SVGSVGElement, filename: string) {
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgEl);
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  downloadBlob(blob, filename);
}

export function exportChartRaster(
  svgEl: SVGSVGElement,
  format: 'png' | 'jpg',
  width: number,
  transparent: boolean,
  filename: string
) {
  renderToCanvas(svgEl, format, width, transparent).then((canvas) => {
    canvas.toBlob(
      (blob) => {
        if (blob) downloadBlob(blob, filename);
      },
      format === 'png' ? 'image/png' : 'image/jpeg',
      0.95
    );
  });
}

export function copyChartRaster(
  svgEl: SVGSVGElement,
  format: 'png' | 'jpg',
  width: number,
  transparent: boolean,
): Promise<void> {
  return renderToCanvas(svgEl, format, width, transparent).then((canvas) => {
    return new Promise<void>((resolve, reject) => {
      // Clipboard API only reliably supports PNG
      canvas.toBlob(
        async (blob) => {
          if (!blob) { reject(new Error('Failed to create blob')); return; }
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            resolve();
          } catch (e) {
            reject(e);
          }
        },
        'image/png',
        0.95
      );
    });
  });
}

function renderToCanvas(
  svgEl: SVGSVGElement,
  format: 'png' | 'jpg',
  width: number,
  transparent: boolean,
): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgEl);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();

    img.onload = () => {
      const vb = svgEl.viewBox.baseVal;
      const aspectRatio = vb.height / vb.width;
      const w = width;
      const h = Math.round(w * aspectRatio);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;

      if (!transparent || format === 'jpg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
      }

      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load SVG'));
    };

    img.src = url;
  });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
