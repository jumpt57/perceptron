 var perceptron = new Perceptron();

 /*--------  Constants ------*/
 var PIXEL_SIZE = 30; //pixels

 var GRID_WIDTH = 0;
 var GRID_HEIGHT = 0;

 var OUTPUT_COUNT = 6;

 var SEUIL = 1;
 
 
 var VALUE = 1.0;
 var TICKNESS = 0;
 var LSD_MODE = false;

 /*--------  Variables ------*/
 var pixels = [];

 var mousePressed = false;
 var mousePixelIndex = -1;
 var canvas = null;
 
 var thicknessSlider = null;

 /*--------  Initialization ------*/
 function init() {
     canvas = document.getElementById("canvas");
     GRID_WIDTH = Math.floor(canvas.width / PIXEL_SIZE);
     GRID_HEIGHT = Math.floor(canvas.height / PIXEL_SIZE);

     perceptron.initialiserReseauxNeuronaux(GRID_WIDTH * GRID_HEIGHT, 10);

     resetCanvas();
     showLearningRate();
	 
	 thicknessSlider  = document.getElementById('thickness_slider');
	lsdmodeSwitch = document.getElementById('lsdmode_switch');
	lsdmodeSwitch.checked = false;
	
	canvas.addEventListener("click", function(e) {
		var mousePoint = mouseCanvasPosition(e);
		setPixelValueAtPoint(mousePoint, VALUE);
		drawPixels();
	});

	canvas.addEventListener("mousedown", function() {
		mousePressed = true;
	}, false);
	canvas.addEventListener("mouseup", function() {
		mousePressed = false;
	}, false);

	canvas.addEventListener("mousemove", function(e) {
		if(mousePressed) {
			var mousePoint = mouseCanvasPosition(e);
			var pixelIndex = pixelIndexAtPoint(mousePoint);
			if(pixelIndex != mousePixelIndex) {
				setPixelValueAtPoint(mousePoint, VALUE);
				drawPixels();
				mousePixelIndex = pixelIndex;
			}
		}
	});
	
	thicknessSlider.min = 0;
	thicknessSlider.max = Math.ceil(GRID_WIDTH / 20);
	thicknessSlider.step = 1;
	thicknessSlider.value = 0;
	thicknessSlider.onchange = function() {
		TICKNESS = thicknessSlider.value;
		document.getElementById('thickness_slider').innerHTML = thicknessSlider.value;
	};
	
	lsdmodeSwitch.onchange = function() {
		LSD_MODE = lsdmodeSwitch.checked;
	};
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
		 drawNeighboursPixels(x, y, value);
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

 this.drawNeighboursPixels = function(x, y, value) {

	var writeMode = true;

	if (GRID_WIDTH == 0)
		this.resetCanvas();

	var coeffValue = value / (2 * TICKNESS);

	pixels[x][y] = writeMode ? value : 0.0;

	for (var x2 = x - TICKNESS, xMax = x + TICKNESS; x2 < xMax; x2++) {
		if (x2 < 0 || x2 >= GRID_WIDTH)
			continue;

		for (var y2 = y - TICKNESS, yMax = y + TICKNESS; y2 < yMax; y2++) {
			if (y2 < 0 || y2 >= GRID_HEIGHT)
				continue;

			var deltaX = x2 - x;
			var deltaY = y2 - y;
			var dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

			if (dist > TICKNESS)
				continue;

			if (writeMode) {
				var reviewedValue = value - (dist * coeffValue);
				if (reviewedValue > pixels[x2][y2])
					pixels[x2][y2] = pixels[x2][y2] + reviewedValue;
			} else {
				pixels[x2][y2] = 0;
			}
		}
	}
};

 
function drawPixels() {
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = '#555';

	context.fill();

	var alpha;
	for(var y = 0; y < GRID_HEIGHT; y++) {
		for(var x = 0; x < GRID_WIDTH; x++) {
			context.beginPath();
			context.rect(x*PIXEL_SIZE, y*PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
			alpha = 1 - (1 - pixels[x][y]) * 1.6;
			var r = LSD_MODE?(Math.floor(Math.random() * 255) + 1):35;
			var g = LSD_MODE?(Math.floor(Math.random() * 255) + 1):255;
			var b = LSD_MODE?(Math.floor(Math.random() * 255) + 1):35;
			//context.fillStyle = 'rgba(35, 255, 35, ' + alpha + ')';
			context.fillStyle = 'rgba('+r+', '+g+', '+b+', ' + alpha + ')';
			if (this.pixels[x][y] < 0.5){
				context.fillStyle = '#999';
			}
			context.fill();
			context.lineWidth = 1;
			context.strokeStyle = '#000';
			context.stroke();
		}
	}
}