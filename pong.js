import {
  pointerPrototype,
  pointers,
  resizeCanvas,
  updatePointerDownData,
  updatePointerMoveData,
} from "./script.js";

const canvas = document.getElementById("pong-canvas");
resizeCanvas(canvas);
addEventListener("resize", () => resizeCanvas(canvas));
const ctx = canvas.getContext("2d");

pointers.push(new pointerPrototype());
updatePointerDownData(pointers[1], 0, 200, 100);

const defaultWidth = 20;
function createRectangle(xPos, yPos) {
  const rectangle = {
    xPos,
    yPos,
    width: defaultWidth,
    height: 250,
    draw() {
      ctx.beginPath();
      ctx.rect(this.xPos, this.yPos, this.width, this.height);
      ctx.fillStyle = "#fff";
      ctx.fill();
    },
  };
  return rectangle;
}

const paddleLeft = createRectangle(200, 100);
const paddleRight = createRectangle(canvas.width - 200 - defaultWidth, 100);
export { paddleLeft, paddleRight };

const ball = {
  xPos: 250,
  yPos: 100,
  radius: 15,
  vx: 12,
  vy: 12,
  draw() {
    ctx.beginPath();
    ctx.arc(this.xPos, this.yPos, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = "#fff";
    ctx.fill();
    if (this.xPos >= canvas.width - this.radius || this.xPos <= this.radius) {
      this.vx *= -1;
    }

    // Left paddle
    if (
      this.xPos <= paddleLeft.xPos + defaultWidth &&
      this.xPos > paddleLeft.xPos &&
      this.yPos > paddleLeft.yPos &&
      this.yPos < paddleLeft.yPos + paddleLeft.height
    ) {
      this.vx *= -1;
    }

    // Right paddle
    if (
      this.xPos <= paddleRight.xPos + defaultWidth &&
      this.xPos > paddleRight.xPos &&
      this.yPos > paddleRight.yPos &&
      this.yPos < paddleRight.yPos + paddleRight.height
    ) {
      this.vx *= -1;
    }

    if (this.yPos >= canvas.height - this.radius || this.yPos <= this.radius) {
      this.vy *= -1;
    }

    this.xPos += this.vx;
    this.yPos += this.vy;

    updatePointerMoveData(pointers[1], this.xPos, this.yPos);
  },
};

window.requestAnimationFrame(animateCircle);
function animateCircle() {
  ctx.globalCompositeOperation = "destination-over";
  ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas

  ctx.save();
  ball.draw();
  ctx.restore();

  paddleLeft.draw();
  paddleRight.draw();

  window.requestAnimationFrame(animateCircle);
}
