declare module 'colorthief' {
  export default class ColorThief {
    /**
     * Get dominant color from image
     * @param img Image element or image url
     * @param quality Optional. Value from 1-10. 10 is the highest quality for color.
     * @returns [r, g, b] for rgb color
     */
    getColor(img: HTMLImageElement | string, quality?: number): [number, number, number];
    
    /**
     * Get a color palette from image
     * @param img Image element or image url
     * @param colorCount The max number of colors to return
     * @param quality Optional. Value from 1-10. 10 is the highest quality.
     * @returns Array of [r, g, b] arrays
     */
    getPalette(img: HTMLImageElement | string, colorCount?: number, quality?: number): Array<[number, number, number]>;
  }
}