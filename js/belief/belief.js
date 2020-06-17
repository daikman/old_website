let names;
function preload() {
//   myFont = loadFont('Poppins-Light.ttf');
  names = ["David", "John", "Remi", "Ashley", "Alex", "Eleanor", "Percy", "Amy", "Mandy", "Reece", "Sean", "Rebecca", 'Jack', 'Emma', 'George', 'Pippa', 'Raja', 'Joe', 'Peter', 'Myra', "Lee", "Kye", "Penelope", "Lachlan"];
}

let people = [];

let popSize = 24;
let personSize = 20;
let infoX;
let selection = 0;
let averageBelief;
let beliefHistory = [];
let totalBelief = 0;

var interactSpeed = 15;
var rIndex = 0;
var rSelected = 0;
var otherIndex = 3;

var chosen;

var speed = 0.5;

var totalAttention;

let distances = [];

let speedSlider;

var o;

var N, Amin, Astar, sO, sI, dA, p, rmin, tO, dt;

var As = [];

// global other in loop! in draw()

function setup() {
  randomSeed(4);
  //textFont(myFont);
  // initialising variables
  Amin = -1.02;
  Astar = 1;
  sO = 0.01;
  dA = 0.5;
  p = 5;
  rmin = 0;
  sI = 0.5;
  tO = 0.8;
  dt = 0.5;

  createCanvas(720, 512);
  speedSlider = createSlider(1, 15, 1, 1);
  speedSlider.position(10, 32);
  infoX = 3*width/4;

  for (var i = 0; i < popSize; i++) {
    people.push(new Person(i, infoX, names[i]));
    people[i].move();
    people[i].show();
    totalBelief += people[i].belief;
    totalAttention += people[i].A;
  }
  //rIndex = int(random(popSize));
  rIndex = 0;
  rIndex += 1;
  if (rIndex > popSize) {
  rIndex = 0;
  }
  chosen = people[rIndex];
  for (var i = 0; i < popSize; i++) {
     distances[i] = dist(chosen.x, chosen.y,
                         people[i].x, people[i].y)
     if (i == rIndex) {distances[i] = 2000}
    }

    for (var i = 0; i < popSize; i++) {
      if (distances[i] == min(distances)) {
          o = people[i];
      }
    }
  //frameRate(1);
  averageBelief = totalBelief/(popSize+1);
  beliefHistory.push(averageBelief);
}

function draw() {
  interactSpeed = 16-speedSlider.value();
  dt = 1/interactSpeed;
  dA = 1/interactSpeed;
  speed = map(interactSpeed, 1, 15, 0.9, 0.4);
  averageBelief = totalBelief/(popSize+1);
  beliefHistory.push(averageBelief);
  totalBelief = 0;

  background(0, 10, 10);

  transfer();

  decay();

  updateBelief();

  for (var i = 0; i < popSize; i++) {
    // collision
    // for (var j = 0; j < popSize; j++) {
    //   if (dist(people[i].x, people[i].y,
    //           people[j].x, people[j].y) <
    //      personSize/1.5 & i != j) {
    //   people[i].xspeed = -people[i].xspeed;
    //   people[i].yspeed = -people[i].yspeed;
    //   }
    // }
    people[i].updateI();

    people[i].move();

    totalBelief += people[i].belief;

    totalAttention += people[i].A;

    people[i].constrainBelief();


    people[i].show();

  }

  HUD();
  fill(255);
  textSize(20);
  noStroke();
  text("Speed", 10, 24);
}

function decay() {
  for (var i = 0; i < popSize; i++) {
    people[i].A += -(2*dA/pow(popSize, 2))*people[i].A;
    if (people[i].A < 0) {
      people[i].A = 0;
    }
    if (people[i].A > 1) {
      people[i].A = 1;
    }

    people[i].AHistory.push(people[i].A);
  }
}

function inform() {

  var rC = rmin + ((1-rmin)/(1+pow(2.718281, -p*(chosen.A - o.A))))
  var rO = rmin + ((1-rmin)/(1+pow(2.718281, -p*(o.A - chosen.A))))

  var chosenTemp = chosen.I;
  chosen.I = rC*chosen.I + (1-rC)*o.I + randomGaussian(0)*sI;

  if (chosen.I > 1) {
      chosen.I = 1;
    }
  if (chosen.I < 0) {
      chosen.I = 0;
  }

  o.I = rO*o.I + (1-rO)*chosenTemp + randomGaussian(0)*sI;

  if (o.I > 1) {
    o.I = 1;
  }
  if (o.I < 0) {
    o.I = 0;
  }

}

function updateBelief() {
  for (var i = 0; i < popSize; i++) {
    people[i].belief += -1*(pow(people[i].belief, 3) - (people[i].belief + Amin)*people[i].belief - people[i].I)*dt + randomGaussian()*sO;

    if (people[i].belief > 1) {
      people[i].belief = 1;
    }
    if (people[i].belief < 0) {
      people[i].belief = 0;
    }

    people[i].bHistory.push(people[i].belief);
  }

}

function transfer() {

  if (frameCount % interactSpeed == 0) {
    rSelected = 0;
    var probSelect = [];
    var As = [];

    for (var i = 0; i < popSize; i++) {
      As[i] = people[i].A;
    }
    var totalSelect = 0;
    for (var i = 0; i < popSize; i++) {
      totalSelect += As[i];
    }
    for (var i = 0; i < popSize; i++) {
      probSelect[i] = As[i]/totalSelect;
    }

    rSelected = 0;
    for (var i = 0; i < popSize; i++) {
      if (random(1) < probSelect[popSize - i] &
          rSelected == 0) {
        rIndex = i;
        rSelected = 1;
      }
    }

    chosen = people[rIndex];

    for (var i = 0; i < popSize; i++) {
     distances[i] = dist(chosen.x, chosen.y,
                         people[i].x, people[i].y)
     if (i == rIndex) {distances[i] = 2000}
    }

    for (var i = 0; i < popSize; i++) {
      if (distances[i] == min(distances)) {
          o = people[i];
      }
    }

    if (abs(chosen.belief - o.belief) < tO) {

      chosen.A += dA*(2*Astar - Astar);
      o.A += dA*(2*Astar - Astar);

      inform();
    }
  }

  stroke(254, 110, 0);
  strokeWeight(3);
  line(chosen.x, chosen.y, o.x, o.y);



}

function HUD() {

  fill(255, 255, 255);
  noStroke();
  strokeWeight(1);
  rect(infoX + 2, 4, width - infoX - 4, height-8, 20);

  if (selection == 1) {
    for (i = 0; i < popSize; i++) {
      if (people[i].selected == 1) {
        fill(245, 245, 245);
        rect(infoX + 8, 64-18, width - infoX - 16, 148, 4);
        fill(0);
        noStroke();
        textSize(24);
        text(people[i].name, infoX + 16, 32);

        // Belief
        textSize(16);
        text("Belief:", infoX + 24, 64);
        fill(0, 0, 200);
        rect(infoX + 48, 68, 110, 13)
        fill(0, 200, 0);
        rect(infoX + 48, 68, map(people[i].belief, 0, 1, 0, 110), 13);

        // Information
        textSize(16);
        fill(0, 0, 200);
        rect(infoX + 48, 104, 110, 13);
        fill(0, 0, 0);
        text("Information:", infoX + 24, 100);
        fill(0, 200, 0);
        rect(infoX + 48, 104,
             map(people[i].I, 0, 1, 0, 110),
             13);

        // Attention
        textSize(16);
        fill(0);
        text("Attention:", infoX + 24, 136);
        fill(200, 200, 200);
        rect(infoX + 48,
             140,
             110, 13);
        fill(0, 0, 0);
        rect(infoX + 48, 140,
             map(people[i].A, 0, 1, 0, 110),
             13);


        // Talking to:
        fill(0, 0, 0);
        text("Talking to:", infoX + 24, 172);
        if (people[i] == chosen) {
          text(o.name, infoX + 64, 188);
        } else {
          if (people[i] == o) {
          text(chosen.name, infoX + 64, 188);
        } else {
          text("no-one", infoX + 64, 188);
        }
        }

        // Masks
        // belief
        noFill();
        strokeWeight(3);
        stroke(245, 245, 245);
        rect(infoX + 48, 68, 110, 13, 4);

        // Info
        rect(infoX + 48,
             140,
             110, 13, 4);

        // Attention
        rect(infoX + 48, 104, 110, 13, 4);
        strokeWeight(1);
        noStroke();

        // GRAPH

        var ylims = [3*height/4 + 100, 3*height/4 -100];
        var xlims = [infoX+16, width-16];
        // fill(0);
        // text("History", xlims[0], ylims[1] - 48);


        stroke(0);
        strokeWeight(1);
        // x-axis
        line(xlims[0], 3*height/4, xlims[1], 3*height/4);

        // y-axis
        line(xlims[0], ylims[0], xlims[0], ylims[1]);

        // plotting belief
        strokeWeight(2);
        for (var j = 0; j < people[i].bHistory.length - 1; j++) {
          var tempA = map(people[i].bHistory[j+1], 0, 1, ylims[0], ylims[1]);
          var tempB = map(people[i].bHistory[j], 0, 1, ylims[0], ylims[1]);
          if ((tempB+tempA)/2 < (ylims[0] + ylims[1])/2) {
            stroke(0, 200, 0);
          } else {
            stroke(0, 0, 200);
          }
            line(xlims[0] + j + 1, tempA, xlims[0] + j + 2, tempB);
          }
        // belief legend
        strokeWeight(5);
        line(xlims[0] - 2, ylims[1] - 16, xlims[0] + 36, ylims[1] - 16);
        fill(0);
        textSize(14);
        noStroke();
        text("Belief", xlims[0] - 4, ylims[1] - 24);

        // plotting Information
        strokeWeight(2);
        for (var j = 0; j < people[i].IHistory.length - 1; j++) {
          if (j % 1 == 0) {
          var tempAI = map(people[i].IHistory[j+1], 0, 1, ylims[0], ylims[1]);
          var tempBI = map(people[i].IHistory[j], 0, 1, ylims[0], ylims[1]);
            stroke(245, 151, 86);
            line(xlims[0] + j + 1, tempAI, xlims[0] + j + 2, tempBI);
          }
          }
        // I legend
        strokeWeight(5);
        line(xlims[0] + 48, ylims[1] - 16, xlims[0] + 86, ylims[1] - 16);
        fill(0);
        textSize(14);
        noStroke();
        text("Info", xlims[0] + 46, ylims[1] - 24);

        // plotting Attention
        strokeWeight(1);
          for (var j = 0; j < people[i].AHistory.length - 1; j++) {
            var tempAA = map(people[i].AHistory[j+1], 0, 1, ylims[0], ylims[1]);
            var tempBA = map(people[i].AHistory[j], 0, 1, ylims[0], ylims[1]);
            stroke(0);
              line(xlims[0] + j + 1, tempAA, xlims[0] + j + 2, tempBA);
          }
        // A legend
        strokeWeight(5);
        line(xlims[0] + 98, ylims[1] - 16, xlims[0] + 136, ylims[1] - 16);
        fill(0);
        textSize(14);
        noStroke();
        text("Attention", xlims[0] + 96, ylims[1] - 24);

        if (people[i].bHistory.length > xlims[1] - xlims[0]) {
          people[i].bHistory = [];
          people[i].IHistory = [];
          people[i].AHistory = [];
        }
      }
    }
  } else {

    var line_1X, line_1Y, line_2X, line_2Y;

    fill(0);
    noStroke();
    textSize(22);
    text("Whole Network", infoX + 8, 36);
    textSize(16);
    //text("Belief:", infoX + 24, 64);
    fill(0, 0, 200);
    rect(infoX + 16,
         52,
         150, 13, 4)
    fill(0, 200, 0);
    rect(infoX + 16, 52, map(averageBelief, 0, 1, 0, 150), 13, 4, 0, 0, 4);

    traceHistory();

//     if (selection == 0) {
//       noFill();
//       stroke(0, 0, 0);
//       strokeWeight(3);
//       rect(0, 0, infoX, height);
//     }

    var centX = infoX + (width - infoX)/2;
    var centY = height/3;
    // ellipse(centX, centY, 50, 50);

    noStroke();
    for (i = 0; i < popSize; i ++) {

      fill(0,
           map(people[i].belief, 0, 1, 100, 220),
           map(people[i].belief, 0, 1, 220, 100));

      var posX = (width-infoX)/2.5*cos(i*(TWO_PI/popSize)) +
          centX;
      var posY = (width-infoX)/2.5*sin(i*(TWO_PI/popSize)) +
          centY;

      if (i == rIndex | people[i] == o) {
        strokeWeight(1);
        if (i == rIndex) {
          stroke(245, 110, 0);
          //fill(245, 110, 0);
          line_1X = posX;
          line_1Y = posY;
        } else {
          stroke(245, 110, 0);
          //stroke(200);
          //fill(200);
          line_2X = posX;
          line_2Y = posY;
        }
      } else {
        noStroke();
      }

      if (line_1X > 0 & line_2X > 0) {
        push();
        stroke(245, 110, 0);
        strokeWeight(1);
        line(line_1X, line_1Y, line_2X, line_2Y);
        pop();
      }

      ellipse(posX, posY, 12, 12);
    }
  }
}

function traceHistory() {

  var ylims = [3*height/4 + 100, 3*height/4 -100];
  var xlims = [infoX+16, width-16]

  stroke(0);
  strokeWeight(1);
  // x-axis
  line(xlims[0], 3*height/4, xlims[1], 3*height/4);

  // y-axis
  line(xlims[0], ylims[0], xlims[0], ylims[1]);

  // plotting line graph
  strokeWeight(2);
  for (var i = 0; i < beliefHistory.length - 1; i++) {
    var tempA = map(beliefHistory[i+1], 0, 1, ylims[0], ylims[1]);
    var tempB = map(beliefHistory[i], 0, 1, ylims[0], ylims[1]);
    if ((tempB+tempA)/2 < (ylims[0] + ylims[1])/2) {
      stroke(0, 200, 0);
    } else {
      stroke(0, 0, 200);
    }
    line(xlims[0] + i, tempA, xlims[0] + i + 1, tempB);
  }
   // belief legend
        strokeWeight(5);
        line(xlims[0] + 114, ylims[1] + 16, xlims[0] + 148, ylims[1] + 16);
        fill(0);
        textSize(14);
        noStroke();
        text("Average Belief", xlims[0] + 52, ylims[1] + 10);
  if (beliefHistory.length > xlims[1] - xlims[0]) {
    beliefHistory = [];
  }

}

class Person {
  constructor(i_, bound_, name_) {
    this.name = name_;
    this.bound = bound_;
    this.index = i_;
    this.x = random(this.bound - personSize - 1,
                    0 + personSize + 1);
    this.y = random(height - personSize - 1,
                   0 + personSize + 1);
    this.I = random(0, 1);
    this.IHistory = [];
    this.belief = random(0, 1);
    this.bHistory = [];
    this.A = random(0, 1);
    this.AHistory = [];
    this.distances = [];
    this.selected = 0;
    if (random(1) < 0.5) {
      this.xspeed = speed;
      this.yspeed = speed;
    } else {
      this.xspeed = -speed;
      this.yspeed = -speed;
    }
  }
  move() {
    if (random(1) < 0.005) {
      this.xspeed = -this.xspeed;
    }

    if (random(1) < 0.005) {
      this.yspeed = -this.yspeed;
    }

    if (random(1) < 0.005) {
      this.yspeed = 0;
    }


    if (random(1) < 0.005) {
      this.xspeed = 0;
    }

    if (this.xspeed == 0 & this.yspeed == 0) {

    if (random(1) < 0.5) {
      this.xspeed = speed;
      this.yspeed = -speed;
    } else {
      this.xspeed = -speed
      this.yspeed = speed
    }

    }

    this.x += this.xspeed;
    this.y += this.yspeed;

    // check for collision

    // check within area
    if (this.x < 0 + personSize |
       this.x > infoX - personSize) {
      this.xspeed = - this.xspeed;
    }


    if (this.y < 0 + personSize |
       this.y > height - personSize) {
      this.yspeed = -this.yspeed;
    }

  }

  show() {
    if (this.selected == 1 | this.index == rIndex) {
      strokeWeight(2);
      if (this.selected == 1) {
        //stroke(255, 0, 0);
        noStroke();
        fill(255);
        text(this.name, this.x + 5, this.y - 10);
        stroke(255);
      } else {
        stroke(254, 110, 0);
      }
    } else {
      noStroke();
      // strokeWeight(3);
      // stroke(0);
    }

    if (this == o) {
      strokeWeight(1);
      stroke(254, 110, 0);
    }

      fill(0,
           map(this.belief, 0, 1, 100, 220),
           map(this.belief, 0, 1, 220, 100));

//       if (this.name == "Mandy") {
//         fill(255, 44, 180);
//       }

      ellipse(this.x, this.y, personSize, personSize);
  }

  selectSearch() {
    if (dist(mouseX, mouseY, this.x, this.y) >= personSize/2
        | this.selected == 1) {
      this.selected = 0;
    } else {
      this.selected = 1;
    }

    if (selection == 1) {
      this.selected = 0;
    }

    return(this.selected == 1)
  }

  constrainBelief() {
  if (this.belief > 1) {
    this.belief = 1;
  }

  if (this.belief < 0) {
    this.belief = 0;
  }

  }

  // talk() {
  //   var probTalk = As[this.index]/totalAttention;
  //   if (random(1) < probTalk) {
  //     for (var i = 0; i < popSize; i++) {
  //       this.distances[i] = dist(this.x, this.y,
  //                               people[i].x,
  //                               people[i].y);
  //       if (i == this.index) {
  //         this.distances[i] = 200;
  //       }
  //     }
  //   }
  // }
  updateI() {
    this.IHistory.push(this.I);
  }
}

function mousePressed() {
  if (mouseX > 0 & mouseX < width & mouseY > 0 & mouseY < height) {
    if (!(mouseX < 146 & mouseY < 52)) {
      selection = 0;
      for (var i = 0; i < popSize; i++) {
        if (people[i].selectSearch()) {
          selection = 1;
        }
      }
    }
  }
}

function touchStarted() {
  if (mouseX > 0 & mouseX < width & mouseY > 0 & mouseY < height) {
    if (!(mouseX < 146 & mouseY < 52)) {
      selection = 0;
      for (var i = 0; i < popSize; i++) {
        if (people[i].selectSearch()) {
          selection = 1;
        }
      }
    }
  }
}
