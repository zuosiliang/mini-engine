class LoadingManager {
  itemsToLoad: number;
  itemsLoaded: number;
  onLoadCallback: (() => void) | null;
  onProgressCallback:
    | ((itemsToLoad: number, itemsLoaded: number) => void)
    | null;
  onErrorCallback: ((src: string) => void) | null;
  constructor() {
    this.itemsToLoad = 0;
    this.itemsLoaded = 0;
    this.onLoadCallback = null;
    this.onProgressCallback = null;
    this.onErrorCallback = null;
  }

  setOnLoad(callback: () => void) {
    this.onLoadCallback = callback;
  }

  setOnProgress(callback: () => void) {
    this.onProgressCallback = callback;
  }

  setOnError(callback: () => void) {
    this.onErrorCallback = callback;
  }

  itemStart() {
    this.itemsToLoad++;
  }

  itemEnd() {
    this.itemsLoaded++;
    if (this.onProgressCallback) {
      this.onProgressCallback(this.itemsToLoad, this.itemsLoaded);
    }
    if (this.itemsLoaded === this.itemsToLoad && this.onLoadCallback) {
      this.onLoadCallback();
    }
  }

  itemError(url: string) {
    if (this.onErrorCallback) {
      this.onErrorCallback(url);
    }
  }
}

export default LoadingManager;
