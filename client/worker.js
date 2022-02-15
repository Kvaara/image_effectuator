import { expose } from "comlink";

export default class Worker {
  async brighten(base64) {
    const rustApp = await import("../pkg/index.js");
    const imgDataUrl = rustApp.brighten(base64);
    return imgDataUrl;
  }

  async grayscale(base64) {
    const rustApp = await import("../pkg/index.js");
    const imgDataUrl = rustApp.grayscale(base64);
    return imgDataUrl;
  }

  async blur(base64) {
    const rustApp = await import("../pkg/index.js");
    const imgDataUrl = rustApp.blur(base64);
    return imgDataUrl;
  }
}

expose(Worker);
