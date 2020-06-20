var incSpeed = 0.01;
var inc = 3.14519/24;
// var inc_input;
var grid_button;
let lines = 1;
var xpos, ypos;
var animate = 1;
var move = -0.9;
var stage = 1;
var shape = 1;
var squareSize, lineSize;


function setup() {
  var canvasDiv = document.getElementById('heringSketch');
  var width = canvasDiv.offsetWidth;
  heringCanvas = createCanvas(width, width);
  heringCanvas.parent('heringSketch');
  grid_button = createButton('Toggle Lines');
  grid_button.mousePressed(toggleGrid);
  grid_button.parent('heringSketch');
  grid_button.position(width-150,height+20, 'inherit');
  squareSize = width/32;
  lineSize = width/64;
  cursor(CROSS);

}

function windowResized() {
  var canvasDiv = document.getElementById('heringSketch');
  var width = canvasDiv.offsetWidth;
  heringCanvas = createCanvas(width, width);
  heringCanvas.parent('heringSketch');
  grid_button.position(width-150,height+20, 'inherit');
}

function draw() {
  // if (frameCount % 2 == 0) {
  //   saveCanvas('myCanvas', 'png');
  // }

  background(255);


  if (lines == 1) {
   spreadLines();
  }
  // strokeWeight(5);
  // stroke(255);
  // line(width/2, 0, width/2, height);
  // line(0, height/2, width, height/2);

  if (animate == -1) {
    if (mouseX < width & mouseX > 0 & mouseY < height & mouseY > 0) {
      xpos = constrain(mouseX, width/64, width-width/64);
      ypos = constrain(mouseY, height/64, height-height/64);
    }
    noCursor();
  } else {
    animateShape()
    cursor(CROSS);
  }

  strokeWeight(3);
  stroke(50, 50, 220);

  if (shape == 1) {
    // lines
    line(xpos - lineSize, 0, xpos - lineSize, height);
    line(xpos + lineSize, 0, xpos + lineSize, height);
    line(0, ypos + lineSize, width, ypos + lineSize);
    line(0, ypos-lineSize, width, ypos-lineSize);
  } else {
    // square
    line(xpos - squareSize, ypos + squareSize, xpos - squareSize, ypos - squareSize);
    line(xpos + squareSize, ypos + squareSize, xpos + squareSize, ypos - squareSize);
    line(xpos - squareSize, ypos + squareSize, xpos + squareSize, ypos + squareSize);
    line(xpos - squareSize, ypos - squareSize, xpos + squareSize, ypos-squareSize);
  }




}

function spreadLines() {
  stroke(80);
  strokeWeight(1);

  var x = width/2;
  var y = height/2;
  var xc = [];
  var yc = [];

  for (var i = 0; i < TWO_PI; i += inc) {
    xc[i] = 800*cos(i) + x;
    yc[i] = 800*sin(i) + y;
    line(width/2, height/2, xc[i], yc[i]);
  }

}

function toggleGrid() {
    lines = -lines;
}

function mouseClicked() {
  if (mouseX < width & mouseX > 0 & mouseY < height & mouseY > 0) {
      animate = -animate;
  }
}

function animateShape() {


  if (sin(move) < 0 & abs(sin(move)) > 0.99) {
     stage += 1;
    if (stage % 2 == 1) {
      move = -0.9;
    }
  }

  if (stage > 4) {
    stage = 1;
    shape = -shape;
  }

  move += 0.01;
  if (stage == 1 | stage == 2) {
    // stage 1+2
    ypos = height/2;
    xpos = map(sin(move), 1, -1, width/4, 3*width/4);
  }

  if (stage == 3 | stage == 4) {
    // stage 3+4
    xpos = width/2;
    ypos = map(sin(move), 1, -1, height/4, 3*height/4);
  }


}
