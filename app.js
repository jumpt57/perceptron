 var perceptron = new Perceptron();

 /*--------  Constants ------*/
 var PIXEL_SIZE = 30; //pixels

 var GRID_WIDTH = 0;
 var GRID_HEIGHT = 0;

 var OUTPUT_COUNT = 6;

 var SEUIL = 1;

 /*--------  Variables ------*/
 var pixels = [];

 var mousePressed = false;
 var mousePixelIndex = -1;
 var canvas = null;

 /*--------  Initialization ------*/
 function init() {
     canvas = document.getElementById("canvas");
     GRID_WIDTH = Math.floor(canvas.width / PIXEL_SIZE);
     GRID_HEIGHT = Math.floor(canvas.height / PIXEL_SIZE);

     perceptron.initialiserReseauxNeuronaux(GRID_WIDTH * GRID_HEIGHT, 10);

     resetCanvas();
     showLearningRate();

     canvas.addEventListener("click", function(e) {
         var mousePoint = mouseCanvasPosition(e);
         togglePixelAtPoint(mousePoint);
         drawPixels();
     });

     canvas.addEventListener("mousedown", function() {
         mousePressed = true;
     }, false);
     canvas.addEventListener("mouseup", function() {
         mousePressed = false;
     }, false);

     canvas.addEventListener("mousemove", function(e) {
         if (mousePressed) {
             var mousePoint = mouseCanvasPosition(e);
             var pixelIndex = pixelIndexAtPoint(mousePoint);
             if (pixelIndex != mousePixelIndex) {
                 setPixelValueAtPoint(mousePoint, true);
                 drawPixels();
                 mousePixelIndex = pixelIndex;
             }
         }
     })
 }

 /*--------  Interactions  ------*/
 function learnClicked() {
     var learnedNumber = parseInt(getInputElement().value);
     learn(learnedNumber);
     processClicked();
 }

 function processClicked() {
     processedNumbers = process();

     showProcessedNumbers(processedNumbers);
 }

 function changeRateClicked() {
     var newRate = parseFloat(getRateElement().value);
     changeLearningRate(newRate);
     showLearningRate();
 }

 function showProcessedNumbers(processedNumbers) {
     var result = "";
     for (var i = 0; i < processedNumbers.length; i++) {
         result += processedNumbers[i].toString() + ",";
     }
     if (result.length > 0) result = result.substring(0, result.length - 1);
     getOutputElement().value = result;
 }

  function showLearningRate() {
    var currentRateText = perceptron.getLearningRate();
    getRateElement().value = currentRateText;
}

 function getInputElement() {
     return document.getElementById("inputNumber");
 }

 function getOutputElement() {
     return document.getElementById("outputNumber");
 }

 function getRateElement() {
     return document.getElementById("inputLearningRate");
 }

 /*--------  Learn and process  ------*/
 function learn(number) {
     perceptron.apprendre(convertirPixelEnTable(), number);
 }

 function process() {
     return perceptron.chercher(convertirPixelEnTable());
 }

 function convertirPixelEnTable() {
     var linearPixels = [];
     for (var i = 0; i < pixels.length; i++) {
         for (var j = 0; j < pixels[i].length; j++) {
             linearPixels[i * pixels[i].length + j] = pixels[i][j];
         }
     }

     return linearPixels;
 }

 function foreachPixel(f) {
     for (var x = 0; x < GRID_WIDTH; x++) {
         for (var y = 0; y < GRID_HEIGHT; y++) {
             f(x, y, pixels[x][y]);
         }
     }
 }

 function changeLearningRate(newRate) {
     perceptron.changerTauxApprentissage(newRate);
 }

 /*--------  Canvas helpers  ------*/
 function mouseCanvasPosition(e) {
     var rect = canvas.getBoundingClientRect();
     return {
         x: e.clientX - rect.left,
         y: e.clientY - rect.top
     };
 }

 function pixelIndexAtPoint(point) {
     var pixelIndex = -1;
     var x = Math.floor(point.x / PIXEL_SIZE);
     var y = Math.floor(point.y / PIXEL_SIZE);
     if (x < GRID_WIDTH && y < GRID_HEIGHT) {
         pixelIndex = y * GRID_WIDTH + x;
     }
     return pixelIndex;
 }

 function togglePixelAtPoint(point) {
     var x = Math.floor(point.x / PIXEL_SIZE);
     var y = Math.floor(point.y / PIXEL_SIZE);
     if (x < GRID_WIDTH && y < GRID_HEIGHT) {
         pixels[x][y] = !pixels[x][y];
     }
 }

 function setPixelValueAtPoint(point, value) {
     var x = Math.floor(point.x / PIXEL_SIZE);
     var y = Math.floor(point.y / PIXEL_SIZE);
     if (x < GRID_WIDTH && y < GRID_HEIGHT) {
         pixels[x][y] = value;
     }
 }

 function resetCanvas() {
     resetPixels();
     drawPixels();
 }

 function resetPixels() {
     for (var x = 0; x < GRID_WIDTH; x++) {
         pixels[x] = [];
         for (var y = 0; y < GRID_HEIGHT; y++) {
             pixels[x][y] = false;
         }
     }
 }

 function drawPixels() {
     var canvas = document.getElementById("canvas");
     var context = canvas.getContext("2d");

     for (var y = 0; y < GRID_HEIGHT; y++) {
         for (var x = 0; x < GRID_WIDTH; x++) {
             context.beginPath();
             context.rect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
             context.fillStyle = pixels[x][y] ? '#2D2' : '#555';
             context.fill();
             context.lineWidth = 1;
             context.strokeStyle = '#000';
             context.stroke();
         }
     }
 }