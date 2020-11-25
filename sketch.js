//This is a slight modification of Adam Ferriss' example: 
// 6-2_vertexDisplacement: 
// https://github.com/aferriss/p5jsShaderExamples/tree/gh-pages/6_3d/6-2_vertexDisplacement

/// <reference path="../../node_modules/@types/p5/global.d.ts" />
//this variable will hold our shader object

let myShader;

//a disturbance, 0-1 which we pass to the shader to affect amplitude of oscillation
//Increases with user activity, and decays over time.
let disturbance = 0.0;

function preload() {
  // a shader is composed of two parts, a vertex shader, and a fragment shader
  // the vertex shader prepares the vertices and geometry to be drawn
  // the fragment shader renders the actual pixel colors
  // loadShader() is asynchronous so it needs to be in preload
  // loadShader() first takes the filename of a vertex shader, and then a frag shader
  // these file types are usually .vert and .frag, but you can actually use anything. .glsl is another common one
  myShader = loadShader("shader.vert", "shader.frag");
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  mouseX = width / 2;
  mouseY = height / 2;

}

function draw() {
  background(0);
  orbitControl(1, 1, 0.02);
  // shader() sets the active shader with our shader
  shader(myShader);

  // Send the frameCount to the shader
  myShader.setUniform("uFrameCount", frameCount);
  //Send a disturbance value (0-1) to the shader (we decay this each frame)
  myShader.setUniform("uDisturbance", disturbance);

  // Animate rotate of our geometry on the X and Y axes
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.005);

  // Draw some geometry to the screen
  // We're going to tessellate the sphere a bit so we have some more geometry to work with
  const detail = 200;
  sphere(width / 5, detail, detail);
  //Decay the disturbance a little so that it calms over time
  disturbance = max(0.0, disturbance - 0.003);
}

function mouseMoved() {
  //increase disturbance when the mouse is moved, proportional to the size of movement.
  const dst = dist(pmouseX, pmouseY, mouseX, mouseY);
  const minDim = min(width, height);
  const moveFrac = dst / minDim; //last frame's mouse movement as fraction of smaller screen dimension.
  disturbance = min(1.0, disturbance + moveFrac / 5);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
