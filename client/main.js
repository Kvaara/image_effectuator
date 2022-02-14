const initialize = async () => {
  const input = document.querySelector("#upload");
  const image = document.querySelector("#new-img");

  let rustApp = null;

  try {
    rustApp = await import("../pkg");
  } catch (err) {
    throw new Error(err);
  }

  // FileReader will be used for transforming the binary file using Base64 encoding into a string
  const fileReader = new FileReader();

  fileReader.onloadend = () => {
    const base64 = fileReader.result.replace(
      /^data:image\/(png|jpeg|jpg);base64,/,
      ""
    );
    let imgDataUrl = rustApp.brighten(base64);
    image.src = imgDataUrl;
  };

  input.addEventListener("change", () => {
    fileReader.readAsDataURL(input.files[0]);
  });
};

initialize();
