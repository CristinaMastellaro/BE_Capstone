declare module "jsvectormap" {
  interface JsVectorMapOptions {
    selector: HTMLElement | string;
    map: string;
    markers?: { name: string; coords: [number, number] }[];
    zoomButtons?: boolean;
    onRegionClick?: (
      this: jsVectorMap,
      event: MouseEvent,
      code: string
    ) => void;
  }

  class jsVectorMap {
    constructor(options: JsVectorMapOptions);
    destroy(): void;
    updateSize(): void;
    setScale(scale: number): void;
    setFocus(options: {
      scale?: number;
      x?: number;
      y?: number;
      animate?: boolean;
    }): void;
    getRegionName(code: string): string;
  }

  export default jsVectorMap;
}
