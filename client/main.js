import { wrap } from "comlink";

const initialize = async () => {
  const input = document.querySelector("#upload");
  const image = document.querySelector("#new-img");

  let rustApp = null;
  try {
    // rustApp = await import("../pkg/index.js");
    const workerInstance = new Worker(new URL("./worker.js", import.meta.url));
    const Wrapper = wrap(workerInstance);
    // const wrapperInstantiated = await new Wrapper();
    rustApp = await new Wrapper();
  } catch (err) {
    throw new Error(err);
  }

  // FileReader will be used for transforming the binary file using Base64 encoding into a string
  const fileReader = new FileReader();

  fileReader.onloadend = async () => {
    const base64 = fileReader.result.replace(
      /^data:image\/(png|jpeg|jpg);base64,/,
      ""
    );
    let imgDataUrl = await rustApp.blur(base64);
    image.src = imgDataUrl;
  };

  input.addEventListener("change", () => {
    fileReader.readAsDataURL(input.files[0]);
  });
};

initialize();
