let loadingManagerInstance: LoadingManager;

class LoadingManager {
  itemsToLoad: number = 0;
  itemsLoaded: number = 0;
  onLoadCallback: (() => void) | null = null;
  onProgressCallback:
    | ((itemsToLoad: number, itemsLoaded: number) => void)
    | null = null;
  onErrorCallback: ((src: string) => void) | null = null;
  constructor() {
    // Singleton
    if (loadingManagerInstance) {
      return loadingManagerInstance;
    }
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    loadingManagerInstance = this;
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
