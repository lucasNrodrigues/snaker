let snake;
let rez = 20;
let food;
let w;
let h;
let score = 0;
let level = 1;
let obstacles = [];

let xdir = 0;
let ydir = 0;

function setup() {
  createCanvas(600, 600);
  w = floor(width / rez);
  h = floor(height / rez);
  frameRate(10);
  snake = new Snake();
  foodLocation();
  criarBotoesControle();
}

function foodLocation() {
  let x = floor(random(w));
  let y = floor(random(h));
  food = createVector(x, y);
}

function draw() {
  background(51);
  scale(rez);

  snake.update();
  snake.show();

  if (snake.eat(food)) {
    foodLocation();
    score++;

    // Nível sobe a cada 5 pontos
    if (score % 5 === 0) {
      level++;
      snake.speed++;
      criarObstaculo();
    }
  }

  noStroke();
  fill(255, 0, 0);
  rect(food.x, food.y, 1, 1);

  mostrarObstaculos();

  if (snake.endGame()) {
    print("END GAME");
    background(200, 0, 0);
    noLoop();
    textSize(3);
    fill(255);
    text("Fim de Jogo", 6, 15);
    text("Placar: " + score, 6, 18);
    return;
  }

  // Placar e nível
  fill(255);
  textSize(1.2);
  text("Placar: " + score, 1, 1.5);
  text("Nível: " + level, 1, 3);
}

function keyPressed() {
  if (keyCode === LEFT_ARROW && xdir !== 1) {
    xdir = -1;
    ydir = 0;
  } else if (keyCode === RIGHT_ARROW && xdir !== -1) {
    xdir = 1;
    ydir = 0;
  } else if (keyCode === DOWN_ARROW && ydir !== -1) {
    xdir = 0;
    ydir = 1;
  } else if (keyCode === UP_ARROW && ydir !== 1) {
    xdir = 0;
    ydir = -1;
  }
}

function criarObstaculo() {
  let x = floor(random(w));
  let y = floor(random(h));
  obstacles.push(createVector(x, y));
}

function mostrarObstaculos() {
  fill(200, 100, 0);
  for (let obs of obstacles) {
    rect(obs.x, obs.y, 1, 1);
  }
}

// Botões de controle para celular
function criarBotoesControle() {
  const botoes = [
    { label: "↑", dx: 0, dy: -1 },
    { label: "↓", dx: 0, dy: 1 },
    { label: "←", dx: -1, dy: 0 },
    { label: "→", dx: 1, dy: 0 },
  ];

  botoes.forEach((botao) => {
    let btn = createButton(botao.label);
    btn.style("font-size", "24px");
    btn.style("margin", "5px");
    btn.style("width", "50px");
    btn.style("height", "50px");

    if (botao.label === "↑") btn.position(width / 2 - 25, height + 10);
    if (botao.label === "←") btn.position(width / 2 - 80, height + 65);
    if (botao.label === "↓") btn.position(width / 2 - 25, height + 65);
    if (botao.label === "→") btn.position(width / 2 + 30, height + 65);

    btn.mousePressed(() => {
      if (!(xdir === -botao.dx && ydir === -botao.dy)) {
        xdir = botao.dx;
        ydir = botao.dy;
      }
    });
  });

  resizeCanvas(width, height + 130);
}

// Classe Snake
class Snake {
  constructor() {
    this.body = [];
    this.body[0] = createVector(floor(w / 2), floor(h / 2));
    this.len = 0;
    this.speed = 10;
  }

  setDir(x, y) {
    xdir = x;
    ydir = y;
  }

  update() {
    let head = this.body[this.body.length - 1].copy();

    head.x += xdir;
    head.y += ydir;
    this.body.shift();
    this.body.push(head);
  }

  grow() {
    let head = this.body[this.body.length - 1].copy();
    this.len++;
    this.body.push(head);
  }

  endGame() {
    let x = this.body[this.body.length - 1].x;
    let y = this.body[this.body.length - 1].y;

    // Parede
    if (x < 0 || x >= w || y < 0 || y >= h) {
      return true;
    }

    // Colisão com corpo
    for (let i = 0; i < this.body.length - 1; i++) {
      let part = this.body[i];
      if (part.x === x && part.y === y) {
        return true;
      }
    }

    // Colisão com obstáculo
    for (let obs of obstacles) {
      if (obs.x === x && obs.y === y) {
        return true;
      }
    }

    return false;
  }

  eat(pos) {
    let x = this.body[this.body.length - 1].x;
    let y = this.body[this.body.length - 1].y;
    if (x === pos.x && y === pos.y) {
      this.grow();
      return true;
    }
    return false;
  }

  show() {
    for (let i = 0; i < this.body.length; i++) {
      fill(i === this.body.length - 1 ? 0 : 100);
      noStroke();
      rect(this.body[i].x, this.body[i].y, 1, 1);
    }
  }
}
