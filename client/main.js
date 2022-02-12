const initialize = () => {
  const input = document.querySelector("#upload");

  // FileReader will be used for transforming the binary file using Base64 encoding into a string
  const fileReader = new FileReader();

  fileReader.onloadend = () => {
    const base64 = fileReader.result.replace(
      /^data:image\/(png|jpeg|jpg);base64,/,
      ""
    );
    console.log(base64);
  };

  input.addEventListener("change", () => {
    fileReader.readAsDataURL(input.files[0]);
  });
};

initialize();
