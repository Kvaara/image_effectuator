import { wrap } from "comlink";
import "./index.styles.css";

const input = document.querySelector("#file-uploader");
const imagesWrapper = document.querySelector("#images");
const oldImage = document.querySelector("#old-img");
const newImage = document.querySelector("#new-img");
const browseFilesBtn = document.querySelector("#browse-files");
const dropZone = document.querySelector("#drop-zone");
const dropZoneContent = document.querySelector("#content-wrapper");
const loadingIndicator = document.querySelector("#loading-indicator");

// FileReader will be used for transforming the binary file using Base64 encoding into a string
const fileReader = new FileReader();

const initialize = async () => {
  listenToFileDrags();

  let rustApp = null;
  try {
    const workerInstance = new Worker(new URL("./worker.js", import.meta.url));
    const Wrapper = wrap(workerInstance);
    rustApp = await new Wrapper();
  } catch (err) {
    throw new Error(err);
  }

  fileReader.onloadend = async () => {
    addDisabledStyles();

    const base64 = fileReader.result.replace(
      /^data:image\/(png|jpeg|jpg);base64,/,
      ""
    );
    let imgDataUrl = await rustApp.blur(base64);
    oldImage.src = fileReader.result;
    newImage.src = imgDataUrl;
    imagesWrapper.classList.remove("hidden");

    removeDisabledStyles();
    removeDragStyles();
  };

  input.addEventListener("change", () => {
    fileReader.readAsDataURL(input.files[0]);
  });
};

const listenToFileDrags = () => {
  dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    if (event.dataTransfer.items) {
      if (
        event.dataTransfer.items[0].kind === "file" &&
        event.dataTransfer.items[0].type === "image/png"
      ) {
        const file = event.dataTransfer.items[0].getAsFile();
        fileReader.readAsDataURL(file);
      } else {
        alert("We currently only accept PNG image files.");
      }
    }
  });
  dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    addDragStyles();
  });
  dropZone.addEventListener("dragenter", (event) => {
    event.preventDefault();
    addDragStyles();
  });
  dropZone.addEventListener("dragleave", (event) => {
    event.preventDefault();
    removeDragStyles();
  });
  dropZone.addEventListener("dragend", (event) => {
    event.preventDefault();
    removeDragStyles();
  });
  dropZone.addEventListener("mouseleave", (event) => {
    event.preventDefault();
    removeDragStyles();
  });
};

const addDisabledStyles = () => {
  dropZoneContent.classList.add("opacity-10");
  dropZone.classList.add("pointer-events-none");
  loadingIndicator.classList.remove("hidden");
};

const removeDisabledStyles = () => {
  dropZoneContent.classList.remove("opacity-10");
  dropZone.classList.remove("pointer-events-none");
  loadingIndicator.classList.add("hidden");
};

const addDragStyles = () => {
  browseFilesBtn.classList.add("pointer-events-none");
  dropZoneContent.classList.add("pointer-events-none");
  dropZone.classList.add("bg-gray-300", "border-gray-500");
};

const removeDragStyles = () => {
  browseFilesBtn.classList.remove("pointer-events-none");
  dropZoneContent.classList.remove("pointer-events-none");
  dropZone.classList.remove("bg-gray-300", "border-gray-500");
};

initialize();
