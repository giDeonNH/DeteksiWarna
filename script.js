const urlParams = new URLSearchParams(window.location.search);
const userName = urlParams.get("name");

document.getElementById("usernameDisplay").textContent = `Hello, ${userName}!`;

document.getElementById("exitButton").addEventListener("click", function () {
  const confirmExit = confirm("Apakah Anda yakin ingin keluar?");
  if (confirmExit) {
    window.location.href = "https://gideonnh.github.io/DeteksiWarna/";
  }
});


let video = document.getElementById("video");
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Access the device camera and stream to video element
navigator.mediaDevices
  .getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
    video.play();
  })
  .catch((err) => {
    console.error("Error accessing webcam: " + err);
  });

video.addEventListener("play", function () {
  let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
  let hsv = new cv.Mat();
  let cap = new cv.VideoCapture(video);
  let pixel = new cv.Mat(1, 1, cv.CV_8UC3);

  function processVideo() {
    try {
      cap.read(src);
      cv.cvtColor(src, hsv, cv.COLOR_RGB2HSV);

      let height = src.rows;
      let width = src.cols;
      let cx = Math.floor(width / 2);
      let cy = Math.floor(height / 2);

      let pixelValue = hsv.ucharPtr(cy, cx);
      let hue = pixelValue[0];
      let saturation = pixelValue[1];
      let value = pixelValue[2];

      let color = "Tak Terdeteksi";
      if (hue === 0 || saturation === 0) {
        color = "PUTIH";
      } else if (value < 50) {
        color = "HITAM";
      } else if (saturation < 50) {
        color = "ABU-ABU";
      } else if (hue < 25) {
        color = "MERAH";
      } else if (hue < 30) {
        color = "ORANGE";
      } else if (hue < 50) {
        color = "KUNING";
      } else if (hue < 100) {
        color = "HIJAU";
      } else if (hue < 125) {
        color = "BIRU";
      } else if (hue < 145) {
        color = "UNGU";
      } else if (hue < 170) {
        color = "PINK";
      } else {
        color = "MERAH";
      }

      // Display color text
      ctx.drawImage(video, 0, 0, width, height);
      ctx.font = "30px Arial";
      ctx.fillStyle =
        "rgb(" +
        pixelValue[0] +
        "," +
        pixelValue[1] +
        "," +
        pixelValue[2] +
        ")";
      ctx.fillText(color, cx - 50, cy - 60);
      ctx.strokeStyle = "black";
      ctx.beginPath();
      ctx.arc(cx, cy, 10, 0, 2 * Math.PI);
      ctx.stroke();

      requestAnimationFrame(processVideo);
    } catch (err) {
      console.error(err);
    }
  }

  requestAnimationFrame(processVideo);
});
