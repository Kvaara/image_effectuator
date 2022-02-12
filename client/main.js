const initialize = async () => {
  let rustApp = null;

  try {
    rustApp = await import("../pkg");
  } catch (err) {
    throw new Error(err);
  }

  const input = document.querySelector("#upload");

  // FileReader will be used for transforming the binary file using Base64 encoding into a string
  const fileReader = new FileReader();

  fileReader.onloadend = () => {
    const base64 = fileReader.result.replace(
      /^data:image\/(png|jpeg|jpg);base64,/,
      ""
    );
    rustApp.grayscale(base64);
  };

  input.addEventListener("change", () => {
    fileReader.readAsDataURL(input.files[0]);
  });
};

initialize();
