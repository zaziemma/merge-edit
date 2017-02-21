var v; // all vehicles
var t; // all targets
var mm;
var count = 5;


function setup() {
  createCanvas(windowWidth, windowHeight)
  frameRate(30)
  textFont('Roboto Mono')
  
 
  mm = new MouseMarker(mouseX, mouseY);

  v = []; // initialise empty vehicles array
  t = []; // initialise empty targets array
  for (var i = 0; i < count; i++) {

    // add new Vehicle to the end of the vehicles array
    v.push(
      new Vehicle(
        floor(random(width)), floor(random(height)),
        color(floor(random(255)) + 50, floor(random(255)))
      )
    );

    // add new target to the end of the targets array
    t.push(newTarget());
  }

}

function draw() {
  
  

    var alertness = map(dist(mouseX, mouseY, pmouseX, pmouseY), 0, 200, 0, 100)
  background(50 + alertness * 2);

  fill(255)
  textSize(height/40)
  textAlign(CENTER)
  text("SLEEP SIMULATOR",width/2,height/+30)


  mm.setPosition(mouseX, mouseY);
  mm.addAlertness(alertness);
  mm.update();
  mm.draw();

  for (var i = 0; i < count; i++) {

    // check if current vehicle at array index i has hit its target.
    if (v[i].position.x < t[i].x + 2 && v[i].position.x > t[i].x - 2 && v[i].position.y < t[i].y + 2 && v[i].position.y > t[i].y - 2) {
      // create new target for vehicle at index i
      t[i] = newTarget();
    }

    // draw target for vehicle at index i
    /*push();
    fill(v[i].color);
    stroke(0);
    strokeWeight(0);
    ellipse(t[i].x,t[i].y, 20,20);
    pop();*/

    // update and draw the vehicle at index i

    // alter general alertness by distance of mouse to vehicle

    var factor = 1 - (dist(v[i].position.x, v[i].position.y, mouseX, mouseY) / 200);

    if (factor < 0) factor = 0;
    if (factor > 1) factor = 1;

    var vAlertness = alertness * factor;

    v[i].seek(t[i]);
    v[i].update();
    v[i].draw();
    v[i].addAlertness(vAlertness);
  }
}

function newTarget() {
  // create new random target
  return new createVector(floor(random(width)), floor(random(height)));
}


/* Mouse Marker */

var MouseMarker = function(x, y) {
  this.position = new p5.Vector(x, y);
  this.targetPosition = new p5.Vector(x, y);
  this.alertness = 0;
  this.r = 10;
  this.maxAlertness = 60;
}
MouseMarker.prototype.setPosition = function(x, y) {
  this.targetPosition.x = x;
  this.targetPosition.y = y;
}

MouseMarker.prototype.addAlertness = function(a) {
  this.alertness += a;
}


MouseMarker.prototype.update = function() {

  this.position.x = this.position.x + (this.targetPosition.x - this.position.x) * 0.25;
  this.position.y = this.position.y + (this.targetPosition.y - this.position.y) * 0.25;

  this.alertness -= this.alertness * 0.5;

  // limit alertness
  if (this.alertness > this.maxAlertness) {
    this.alertness = this.maxAlertness;
  }
}

MouseMarker.prototype.draw = function() {
  push()
  noStroke()
  fill(255, (this.alertness * 10) + 50)

  var a = this.alertness * 1;

  ellipse(this.position.x, this.position.y, (a * 2), (a * 2))
  ellipse(this.position.x, this.position.y, (a * 4) + 30, (a * 4) + 30)
  ellipse(this.position.x, this.position.y, (a * 8) + 50, (a * 8) + 50)
  pop()
}

/* Vehicle class */
var Vehicle = function(x, y, color) {
  // 'this' in this case referst to the Vehicle class itself. 
  // It means all those variable are instance vars of the 
  // Vehicle class. Every vehicle has its own set of those
  // variables.
  this.alertness = 0;
  this.color = color;
  this.acceleration = new p5.Vector(0, 0)
  this.velocity = new p5.Vector(0, -1)
  this.position = new p5.Vector(x, y)
  this.r = 5
  this.maxspeed = 2
  this.maxforce = 1
  this.maxAlertness = 60;
  this.state=1
  this.lastupdate = 0
  this.levelup = 3000
  this.grow = 0
}

Vehicle.prototype.update = function() {
  
  //checking the sleep phase
  if (this.state > 3) {
    this.state = 1
  }

  if (millis() - this.lastupdate > this.levelup) {

    this.lastupdate = millis()
    this.state = this.state + 1
    
  }
  
  this.grow = this.grow + 0.1
  
  
  this.velocity.add(this.acceleration)
  this.velocity.limit(this.maxspeed)
  this.position.add(this.velocity)
  this.acceleration.mult(0)

  // decrease alertness. 
  // if you multiply by percentage you will not have to check if its negative
  this.alertness -= this.alertness * 0.05;

  // limit alertness
  if (this.alertness > this.maxAlertness) {
    this.alertness = this.maxAlertness;
  }

}

Vehicle.prototype.applyForce = function(force) {
  this.acceleration.add(force);
}

Vehicle.prototype.addAlertness = function(a) {
  this.alertness += a;
}

Vehicle.prototype.seek = function(target) {
  var desired = p5.Vector.sub(target, this.position)

  desired.setMag(this.maxspeed);

  var steer = p5.Vector.sub(desired, this.velocity)
  steer.limit(this.maxforce);

  this.applyForce(steer)
}

Vehicle.prototype.draw = function() {
  push()
  translate(this.position.x, this.position.y)
  
  
  radius = (this.r + this.alertness) * 5 +this.grow
  
  var circler = 255;  var circleg = 255;  var circleb = 255;

  var circler1 = 255;  var circleg1 = 255;  var circleb1 = 255;

  var circler2 = 255;  var circleg2 = 255;  var circleb2 = 255;

  var x = 0;  var y = 0;

  var x1 = 0;  var y1 = 0;

  var x2 = 0;  var y2 = 0;

  var speed1 = 0
  var pull1 = 0.9;
  var s = 0

  colorMode(RGB);

  ///

  blendMode(ADD);
  strokeWeight(5);
  noFill();

  if (this.state == 1) {

    circler = 255;    circleg = 255;    circleb = 255;

    circler1 = 255;    circleg1 = 255;    circleb1 = 255;

    circler2 = 255;    circleg2 = 255;    circleb2 = 255;
    
    
    speed1 = 0.3;
    pull1 = 0.9;
    s = 'LIGHT'
    this.maxspeed = 4
    
  }
  if (this.state == 2) {
    circler = 255;    circleg = 255;    circleb = 255;

    circler1 = 255;    circleg1 = 255;    circleb1 = 255;

    circler2 = 255;    circleg2 = 255;    circleb2 = 255;
    
    speed1= 0.1
    s = 'DEEP'
    this.maxspeed = 2

  }
  if (this.state == 3) {

    //circles
    circler = 255;    circleg = 0;    circleb = 0;

    circler1 = 0;    circleg1 = 255;    circleb1 = 0;

    circler2 = 0;    circleg2 = 0;    circleb2 = 255;
    
    
    
    speed1= 0.5
    pull1=0.99
    s = 'REM'
    this.maxspeed = 0.2
  }
  
  x = x + random(speed1, speed1*2);
  y = y + random(speed1, speed1*2);

  x1 = x1 + random(-speed1, -speed1*2);
  y1 = y1 + random(-speed1, -speed1*2);

  x2 = x2 + random(speed1, speed1*2);
  y2 = y2 + random(-speed1, -speed1*2);

x = x * pull1;
  y = y * pull1;

  x1 = x1 * pull1;
  y1 = y1 * pull1;

  x2 = x2 * pull1;
  y2 = y2 * pull1;
  

  noFill();
  stroke(circler, circleg, circleb, 50);
  ellipse(x2*5, y2*5, radius);
  stroke(circler1, circleg1, circleb1, 50);
  ellipse(x1*5, y1*5, radius);
  stroke(circler2, circleg2, circleb2, 50);
  ellipse(x, y, radius);

  

   if (radius > 100){
    this.lastupdate= millis()
    this.state= 1
    this.grow = 0
    
  }
  stroke(20,100)
  strokeWeight(2)
  line(0,radius/2,0,height - this.position.y - 30)
  
  rotate(Math.PI*-0.5)
  
  fill(255)
  textSize(height/40)
  text(s,-height + this.position.y + 30 ,0)
  
  pop()
}

/* end of Vehicle class */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
