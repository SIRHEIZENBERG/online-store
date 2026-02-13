import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ColorExtractorService {
  /**
   * Extracts the dominant color from an image URL
   * @param imageUrl - URL of the image to analyze
   * @returns Promise<string> - RGB color string like 'rgb(255, 100, 50)'
   */
  async extractDominantColor(imageUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous'; // Enable CORS if images are from external sources

      img.onload = () => {
        try {
          const color = this.getAverageColor(img);
          resolve(color);
        } catch (error) {
          resolve('rgb(240, 240, 240)'); // Fallback color
        }
      };

      img.onerror = () => {
        resolve('rgb(240, 240, 240)'); // Fallback color
      };

      img.src = imageUrl;
    });
  }

  /**
   * Gets the average color from an image using canvas
   */
  private getAverageColor(img: HTMLImageElement): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return 'rgb(240, 240, 240)';
    }

    // Use smaller canvas for faster processing
    canvas.width = 50;
    canvas.height = 50;

    ctx.drawImage(img, 0, 0, 50, 50);

    const imageData = ctx.getImageData(0, 0, 50, 50);
    const data = imageData.data;

    let r = 0,
      g = 0,
      b = 0;
    let count = 0;

    // Sample every few pixels for better performance
    for (let i = 0; i < data.length; i += 16) {
      // Step by 4 pixels (RGBA = 4 values)
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }

    r = Math.floor(r / count);
    g = Math.floor(g / count);
    b = Math.floor(b / count);

    return `rgb(${r}, ${g}, ${b})`;
  }

  /**
   * Creates an ambient color effect (desaturated and lighter)
   * @param rgbColor - RGB color string
   * @param opacity - Opacity for the ambient effect (0-1)
   * @returns RGBA color string
   */
  createAmbientColor(rgbColor: string, opacity: number = 0.15): string {
    const matches = rgbColor.match(/\d+/g);
    if (!matches || matches.length < 3) {
      return `rgba(240, 240, 240, ${opacity})`;
    }

    let [r, g, b] = matches.map(Number);

    // Desaturate by moving toward average
    const avg = (r + g + b) / 3;
    r = Math.floor(r + (avg - r) * 0.4);
    g = Math.floor(g + (avg - g) * 0.4);
    b = Math.floor(b + (avg - b) * 0.4);

    // Lighten the color
    r = Math.min(255, Math.floor(r + (255 - r) * 0.3));
    g = Math.min(255, Math.floor(g + (255 - g) * 0.3));
    b = Math.min(255, Math.floor(b + (255 - b) * 0.3));

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
}
