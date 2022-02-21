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
const radioBtns = document.querySelectorAll(".custom-radio");

// FileReader will be used for transforming the binary file using Base64 encoding into a string
const fileReader = new FileReader();

let rustApp = null;

const initialize = async () => {
  makeRadioButtonsDynamic();
  listenToFileDrags();

  try {
    const workerInstance = new Worker(new URL("./worker.js", import.meta.url));
    const Wrapper = wrap(workerInstance);
    rustApp = await new Wrapper();
  } catch (err) {
    throw new Error(err);
  }

  fileReader.onloadend = async () => {
    disableDragZone();
    disableRadioButtons();

    const base64 = fileReader.result.replace(
      /^data:image\/(png|jpeg|jpg);base64,/,
      ""
    );
    let imgDataUrl = await getChosenProcessingMethod(base64);
    oldImage.src = fileReader.result;
    newImage.src = imgDataUrl;
    imagesWrapper.classList.remove("hidden");

    enableDragZone();
    enableRadioButtons();
    removeOnDraggingStyles();
  };

  input.addEventListener("change", () => {
    fileReader.readAsDataURL(input.files[0]);
  });
};

const makeRadioButtonsDynamic = () => {
  radioBtns.forEach((btn) => {
    const input = btn.firstElementChild;
    input.addEventListener("change", () => {
      removeRadioBtnsSelectedStyles();
      if (input.checked) {
        addRadioBtnSelectedStyles(btn);
      } else {
        removeRadioBtnSelectedStyles(btn);
      }
    });
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
    removeOnDraggingStyles();
  });
  dropZone.addEventListener("dragend", (event) => {
    event.preventDefault();
    removeOnDraggingStyles();
  });
  dropZone.addEventListener("mouseleave", (event) => {
    event.preventDefault();
    removeOnDraggingStyles();
  });
};

const disableDragZone = () => {
  dropZoneContent.classList.add("opacity-10");
  dropZone.classList.add("pointer-events-none");
  loadingIndicator.classList.remove("hidden");
};

const disableRadioButtons = () => {
  radioBtns.forEach((btn) => {
    btn.classList.add("opacity-40", "pointer-events-none");
  });
};

const getChosenProcessingMethod = async (base64) => {
  const checkedRadioBtn = document.querySelector("input[type=radio]:checked");
  const processingMethod = checkedRadioBtn.id;

  switch (processingMethod) {
    case "grayscale":
      return await rustApp.grayscale(base64);
    case "brighten":
      return await rustApp.brighten(base64);
    case "blur":
      return await rustApp.blur(base64);
    default:
      break;
  }
};

const enableDragZone = () => {
  dropZoneContent.classList.remove("opacity-10");
  dropZone.classList.remove("pointer-events-none");
  loadingIndicator.classList.add("hidden");
};

const enableRadioButtons = () => {
  radioBtns.forEach((btn) => {
    btn.classList.remove("opacity-40", "pointer-events-none");
  });
};

const removeOnDraggingStyles = () => {
  browseFilesBtn.classList.remove("pointer-events-none");
  dropZoneContent.classList.remove("pointer-events-none");
  dropZone.classList.remove("bg-gray-300", "border-gray-500");
};

const removeRadioBtnsSelectedStyles = () => {
  radioBtns.forEach((btn) => {
    removeRadioBtnSelectedStyles(btn);
  });
};

const addRadioBtnSelectedStyles = (btn) => {
  btn.classList.remove("tracking-wider");
  btn.classList.add("tracking-normal", "bg-blue-100");
};

const removeRadioBtnSelectedStyles = (btn) => {
  btn.classList.add("tracking-wider");
  btn.classList.remove("tracking-normal", "bg-blue-100");
};

const addDragStyles = () => {
  browseFilesBtn.classList.add("pointer-events-none");
  dropZoneContent.classList.add("pointer-events-none");
  dropZone.classList.add("bg-gray-300", "border-gray-500");
};

initialize();
