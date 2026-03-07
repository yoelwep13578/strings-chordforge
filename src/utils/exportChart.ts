export function exportChartSVG(svgEl: SVGSVGElement, filename: string) {
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgEl);
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  downloadBlob(blob, filename);
}

export function exportChartRaster(
  svgEl: SVGSVGElement,
  format: 'png' | 'jpg',
  size: number,
  transparent: boolean,
  filename: string,
  rotation: number = 0
) {
  renderToCanvas(svgEl, format, size, transparent, rotation).then((canvas) => {
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
  size: number,
  transparent: boolean,
  rotation: number = 0
): Promise<void> {
  return renderToCanvas(svgEl, format, size, transparent, rotation).then((canvas) => {
    return new Promise<void>((resolve, reject) => {
      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            reject(new Error('Failed to create blob'));
            return;
          }
          try {
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
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
  size: number,
  transparent: boolean,
  rotation: number = 0
): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const serializer = new XMLSerializer();
	
    const cleanSvg = svgEl.cloneNode(true) as SVGSVGElement;
    cleanSvg.style.transform = '';
    cleanSvg.style.transformOrigin = '';

    const svgString = serializer.serializeToString(cleanSvg);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();

    img.onload = () => {
      const vb = svgEl.viewBox.baseVal;
      const sourceW = vb.width || svgEl.clientWidth || 1;
      const sourceH = vb.height || svgEl.clientHeight || 1;
      const aspectRatio = sourceH / sourceW;
      const isHorizontal = rotation === 90 || rotation === -90;

      let canvasW: number;
      let canvasH: number;
      let drawW: number;
      let drawH: number;

      if (isHorizontal) {
        // In horizontal mode, size controls final height
        // Width grows with fret count (sourceH/sourceW ratio)
        canvasH = size;
        canvasW = Math.round(size * aspectRatio);

        // Draw unrotated rectangle for horizontal orientation
        drawW = canvasH;
        drawH = canvasW;
      } else {
        // In vertical mode, size controls final width
        canvasW = size;
        canvasH = Math.round(size * aspectRatio);
        drawW = canvasW;
        drawH = canvasH;
      }

      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, canvasW);
      canvas.height = Math.max(1, canvasH);

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to create canvas context'));
        return;
      }

      if (!transparent || format === 'jpg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      if (isHorizontal) {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();
      } else {
        ctx.drawImage(img, 0, 0, drawW, drawH);
      }

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