var video = document.getElementById("video");
var canvas = document.getElementById("cameraOut");
var selection = document.getElementById("selection");
var img = document.getElementById("imageDisplay");
var recaptureButton = document.getElementById("recaptureButton");
var reuploadButton = document.getElementById("reuploadButton");
var trackButton = document.getElementById("trackButton");
var outputarea = document.getElementById("output");
var productName = document.getElementById("productName");
var natureFood = document.getElementById("natureFood");
var protein = document.getElementById("protein");
var energy = document.getElementById("energy");
var sugars = document.getElementById("sugars");
var fat = document.getElementById("fat");
var productImg = document.getElementById("productImg");
var outputWarning = document.getElementById("warning-area");
var consumption = document.getElementById("consumption");

var warning = `<div class="warning text-lg w-full h-auto bg-yellow-300 bg-opacity-45 px-3 border-2 border-white rounded-xl font-bold my-3 ">
          <img width="40" height="40" src="https://img.icons8.com/emoji/40/warning-emoji.png" alt="warning" class="inline-block"/>
         $MESSAGE
        </div>`;
var error = ` <div class="severe text-lg w-full h-auto bg-red-400 bg-opacity-65 px-3 border-2 border-white rounded-xl font-bold">
          <img width="40" height="40" src="https://img.icons8.com/emoji/40/cross-mark-button-emoji.png" alt="hazard" class="inline-block"/>
          $MESSAGE
        </div>`;
var loading = `<div role="status">
<svg aria-hidden="true" class="mx-auto inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
</svg>
<span class="sr-only">Loading...</span>
</div>`;
document
  .querySelector("input[type='file']")
  .addEventListener("change", function (e) {
    var reader = new FileReader();
    reader.onload = function (e) {
      img.src = e.target.result;
      img.parentElement.classList.remove("hidden");
      img.classList.remove("hidden");
      canvas.classList.add("hidden");
      video.parentElement.classList.add("hidden");
      selection.classList.add("hidden");
      reuploadButton.classList.remove("hidden");
      recaptureButton.classList.add("hidden");
    };
    reader.readAsDataURL(this.files[0]);
  });
function openSelector() {
  img.parentElement.querySelectorAll("button").forEach((button, index) => {
    button.removeAttribute("disabled");
  });
  recaptureButton.innerHTML="Re-Take Photo";
  reuploadButton.innerHTML="Re-Upload Photo";
  trackButton.innerHTML="Track";
  document.querySelector("input[type=file]").value = "";
  selection.classList.remove("hidden");
  outputarea.classList.add("hidden");
}
function startCam() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((stream) => {
      selection.classList.add("hidden");
      video.srcObject = stream;
      video.parentElement.classList.remove("hidden");
      video.play();
    })
    .catch((err) => {
      console.error(`An error occurred: ${err}`);
    });
}
function captureFullVisibleimageFromVideo() {
  var canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  var dataURI = canvas.toDataURL("image/jpeg");
  return dataURI;
}
function takepicture() {
  var context = canvas.getContext("2d");
  if (video.videoWidth && video.videoHeight) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    var data = canvas.toDataURL("image/jpeg");
    img.src = data;
    img.parentElement.classList.remove("hidden");
    img.classList.remove("hidden");
    canvas.classList.add("hidden");
    video.parentElement.classList.add("hidden");
    recaptureButton.classList.remove("hidden");
    reuploadButton.classList.add("hidden");
    closeCamera();
  }
}
function closeCamera() {
  video.srcObject.getTracks().forEach((track) => track.stop());
  video.srcObject = null;
}

function postImage() {
  img.parentElement.querySelectorAll("button").forEach((button) => {
    button.innerHTML = loading;
    button.setAttribute("disabled", true);
  });
  var data = img.src;
  fetch("/predict", {
    method: "POST",
    body: JSON.stringify({ image: data }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (response) => {
      if (response.status == 200) {
        displayOutput(await response.json());
      } else if (response.status == 500) {
        displayOutput(response.statusText, true);
      } else if (response.status == 404) {
        displayOutput("Not Found", true);
      }
    })
    .catch((error) => {
      alert("An Error Occured");
      alert(error);
    });
}

function displayOutput(data, isError = false) {
  if (isError) {
    outputarea.innerHTML = error.replace("$MESSAGE", data);
    outputarea.innerHTML += `<button
      onclick="openSelector()"
      class="bg-[#086064] text-white text-xl my-5 rounded-lg w-64 py-3 px-7 capitalize m-auto"
    >
      Check More
    </button>`;

    outputarea.classList.remove("hidden");
    img.parentElement.classList.add("hidden");
    return;
  }
  productName.innerText = data.name;
  natureFood.innerText = data.natural ? "Natural" : "Artificial";
  protein.innerText = data.protein;
  energy.innerText = data.energy;
  sugars.innerText = data.sugars;
  fat.innerText = data.fat ? data.fat : "NA";
  consumption.innerText = "Suggested Consumption : " + data.consumption;
  productImg.src = img.src;
  outputWarning.innerHTML = "";
  for (var element in data.warning) {
    outputWarning.innerHTML +=
      element == "mild"
        ? warning.replace("$MESSAGE", data.warning[element])
        : error.replace("$MESSAGE", data.warning[element]);
  }
  outputarea.classList.remove("hidden");
  img.parentElement.classList.add("hidden");
}