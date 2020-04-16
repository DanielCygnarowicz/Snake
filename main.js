const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
const btn = document.querySelector("button");
const score = document.querySelector(".score");
const scale = 10;
let gameSpeed = 50;
const rows = canvas.height / scale;
const columns = canvas.width / scale;
let isOn = false;
let interval;
let snake = null;

function Snake() {
  this.x = 0;
  this.y = 0;
  this.xSpeed = scale * 1;
  this.ySpeed = 0;
  this.total = 0;
  this.tail = [];
  this.draw = function () {
    ctx.fillStyle = "#000";

    for (let i = 0; i < this.tail.length; i++) {
      ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
    }
    ctx.fillRect(this.x, this.y, scale, scale);
  };
  this.update = function () {
    for (let i = 0; i < this.tail.length - 1; i++) {
      this.tail[i] = this.tail[i + 1];
    }
    this.tail[this.total - 1] = { x: this.x, y: this.y };
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    if (this.x > canvas.width - scale) {
      this.x = 0;
    }
    if (this.x < 0) {
      this.x = canvas.width;
    }
    if (this.y > canvas.height - scale) {
      this.y = 0;
    }
    if (this.y < 0) {
      this.y = canvas.height;
    }
  };
  this.changeDirection = function (direction) {
    switch (direction) {
      case "Up":
        this.xSpeed = 0;
        this.ySpeed = -scale * 1;
        break;

      case "Down":
        this.xSpeed = 0;
        this.ySpeed = scale * 1;
        break;
      case "Left":
        this.xSpeed = -scale * 1;
        this.ySpeed = 0;
        break;
      case "Right":
        this.xSpeed = scale * 1;
        this.ySpeed = 0;
        break;
    }
  };
  this.eat = function (fruit) {
    if (this.x === fruit.x && this.y === fruit.y) {
      this.total++;
      score.innerHTML = this.total;
      return true;
    }
    return false;
  };
  this.dead = function () {
    for (let i = 0; i < this.tail.length; i++) {
      if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
        score.innerHTML = `You are dead! Your score: ${this.total}`;
        this.total = 0;
        this.tail = [];
        let rank;
        clearInterval(interval);
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        isOn = false;
      }
    }
  };
}

function Fruit() {
  this.x;
  this.y;

  this.pickLocation = function () {
    this.x = (Math.floor(Math.random() * rows - 1) + 1) * scale;
    this.y = (Math.floor(Math.random() * columns - 1) + 1) * scale;
  };

  this.draw = function () {
    ctx.fillStyle = "red";

    ctx.fillRect(this.x, this.y, scale, scale);
  };
}
btn.addEventListener("click", () => {
  if (!isOn) {
    score.innerHTML = 0;
    isOn = true;
    (function setup() {
      snake = new Snake();
      fruit = new Fruit();
      fruit.pickLocation();

      interval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        fruit.draw();
        snake.update();
        snake.draw();

        if (snake.eat(fruit)) {
          fruit.pickLocation();
        }
        if (snake.dead()) {
          snake.total = 0;
          snake.tail = 0;
        }
      }, gameSpeed);
    })();
  }
});

window.addEventListener("keydown", (e) => {
  const direction = e.key.replace("Arrow", "");
  snake.changeDirection(direction);
});
