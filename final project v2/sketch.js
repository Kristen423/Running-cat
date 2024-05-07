var music
var slider
let cat, starts;
let gif
let stage
let resources = {
  catImg: [],
  starImg: [],
  rbImg: [],
}

function preload(){
  resources.rbImg[0] = loadImage("asset/RainbowImg.png")
   for (let i= 0; i < 12; i++)
    resources.catImg[i] = loadImage('cat/catImg' + i + '.png');
  for (let i=0; i < 6; i++)
    resources.starImg[i] = loadImage('asset/star' + i + '.png')
  gif = loadImage('kitka.gif')
  music = loadSound('bgm.mp3')
}
/////////////////////////splash page
function splash(){
  background(255, 192, 203)
  textFont('Courier New',50);
  fill(255)
  stroke(88, 57, 39)
  strokeWeight(10)
  text('Running Cat🐈', 155,200)
  //
  textFont('Verdana', 20)
  noStroke()
  fill(88, 57, 39)
  text('DESCRIPTION:In this project, I use techniques of *particle system*' ,160, 250 )
  text('to draw the moving star, the running cat and the ra-' ,310, 270 )
  text('inbow follows behind. Its a project that mimics pixel',310, 290 )
  text('games, like Mario and Kirby.', 310, 310)
  text('INSTRUCTION:Use [W] or [S] to move the cat.',160, 345)
  //
  fill(255)
  strokeWeight(5)
  stroke(88, 57, 39)
  text('Press the screen to play',240, 470)
  //
  textSize(10)
  stroke(88, 57, 39)
  strokeWeight(3)
  text('Final Project by KristenZhang', 20, 580)
}

/////////////////////////main page

class Particle{
  constructor(image){
    this.image =image;
    this.totalFrames = image.length;
    this.index = Math.round(random(0, this.totalFrames));
    this.position = null;
    this.speed = null;
  }
  birth(pos){
    this.position= pos;
  }
  update(){
    this.position[0] -= this.speed
  }
  isDead(){
    return this.position[0] < 0;
  }
  show(){
    this.index += (frameCount %3 === 0);
    this.index %= this.totalFrames;
    imageMode(CENTER);
    image(this.image[this.index], this.position[0], this.position[1]);  
  }
}


class ParticleSystem{
  constructor(image){
    this.image = image;
    this.Particle = Particle; // constructor of particle class
    this.list = [];
    this.rate = 12; //emission rate
  }
  run(){
    this.emit();
    this.update();
    this.remove();
    this.show();
  } 
  emit(){
    if (Math.random() < (this.rate/ frameRate())){
      let particle = new this.Particle(this.image);
      particle.birth([width, random(0,height)]);
      this.list.push(particle);
    }
  } 
  update(){
    for (let i in this.list)
      this.list[i].update();
  } 
  remove(){
    for (let i in this.list)
      if(this.list[i].isDead()) this.list.splice(i,1);
  } 
  show(){
    for (let i in this.list)
      this.list[i].show();
  }
}


class Star extends Particle{
  constructor(image){
    super(image);
    this.speed= 24;
  }
}

class StarSystem extends ParticleSystem{
  constructor(image){
    super(image);
    this.Particle = Star;
    this.rate = 9;
    
  }
}

class Rainbow extends Particle{
  constructor(image){
    super(image)
    this.speed = 8;
  }
}

class RainbowSystem extends ParticleSystem{
  constructor(image){
    super(image);
    this.Particle = Rainbow;
  }
  emit(pos){
    let particle = new this.Particle(this.image);
    particle.birth(pos);
    this.list.push(particle);
  }
}

class NyanCat{
  constructor(catImg, rbImg){
    this.position = [width * 0.38, height * 0.5]
    this.image = catImg;
    this.rainbow = new RainbowSystem(rbImg);
    this.speed= 30;
    this.emission = 12; 
  }
  run(){
    this.emitRainbow();
    this.showCat();
  }
  emitRainbow(){
    for (let i =0; i< this.emission; i++)
    this.control();
    this.rainbow.emit([this.position[0], this.position[1] + this.oscillate(4, 0.5)]);
    this.rainbow.update();
    this.rainbow.remove();
    this.rainbow.show()
  }
  oscillate(amplitude, omega){
    return Math.round(amplitude * Math.sin(frameCount * omega))
  }
  
  control(){
    if (keyIsPressed) {
      if (key== 'w' || key == 'W') this.position[1] -= this.speed/ this.emission;
      if (key== 'S' || key == 's') this.position[1] += this.speed/ this.emission;
    }
  }
  
  checkEdges(){
    if(this.position[1] > 600) this.position[1] = 600;
    if (this.position[1] < 0) this.position[1] = 0;
  }
  
  showCat() {
    let index = Math.floor( frameCount / 2) % this.image.length;
    imageMode(CENTER)
    image(this.image[index], this.position[0], this.position[1]);  
  }
}


function setup() {
  createCanvas(windowWidth, windowHeight)
  frameRate(30)
  stars = new StarSystem(resources.starImg)
  cat = new NyanCat(resources.catImg, resources.rbImg)
  
  slider = createSlider(0, 1, 0.5, 0.01)
  slider.position(80, 603)
  slider.size(50)
}

function draw() {
  background(255, 192, 203)
  
////////////////////////////splashpage mainpage
  if(mouseIsPressed == true){
    stage = 1;
  }
  if(stage == 1){
    stars.run()
    cat.run()
    
  if(stage == 0){
    music.stop()
    resetSketch()
  }
////////////////////////
  strokeWeight(2)
  rect(20, 20, 50, 30, 15)
  fill(255)
  stroke(88, 57, 39)
  strokeWeight(3)
  textSize(12)
  text('restart',25, 38)
  } else{
   splash()
  }

//////////////////////////music buttom
  
  if (mouseX > 20 && mouseX < 70 && mouseY > 600 && mouseY < 630){
    fill(250, 218, 221)
    cursor(HAND)
  }else{
    fill(255, 239, 222)
    cursor(ARROW)
  }
  strokeWeight(2)
  rect(20, 600, 50, 30, 15)
  fill(255)
  stroke(88, 57, 39)
  strokeWeight(3)
  textSize(12)
  text('music',27, 618)

  music.setVolume(slider.value())

/////////////////////////////restart screen
   if (mouseX > 20 && mouseX < 70 && mouseY > 20 && mouseY < 50){
    fill(250, 218, 221)
    cursor(HAND)
  }else{
    fill(255, 239, 222)
    cursor(ARROW)
  }

}

function mouseClicked(){
  if (mouseX > 20 && mouseX < 70 && mouseY > 600 && mouseY < 630){
    music.play()
  }else
  if (mouseX > 20 && mouseX < 70 && mouseY > 20 && mouseY < 50){
    stage = 0
  }
}