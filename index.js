window.onload = function() {
  const CELL_SIZE = 25;
  const GRID_WIDTH = 30;
  const GRID_HEIGHT = 30;
  const FONT_FAMILY = "Courier";
  const STROKE_COLOR = "#222222";
  const SCENE_COLOR = "#111111";
  const NUM_ORBS = 100;
  const orbs = [];
  const canvasStyles = {
    color: "#000000",
    border: { width: 0, color: "#222222", radius: 20 }
  };
  const colors = [ "#111111", "orange", "blue", "#2277FF", "#FF4488", "#4FCC28" ];
  const attractor = new Orb(GRID_WIDTH * CELL_SIZE / 2, GRID_HEIGHT * CELL_SIZE / 2, 150, "#111111");
  const mouse = { x: attractor.x, y: attractor.y, speed: 5 };

  const canvas = document.createElement("CANVAS");
  const context = canvas.getContext("2d");

  const random = (min, max) => Math.random() * (max - min) + min;

  for (let i = 0; i < NUM_ORBS; i ++) {
    const angle = random(0, 4);
    const x = Math.cos(angle) * attractor.size + attractor.x;
    const y = Math.sin(angle) * attractor.size + attractor.y;
    const dx = attractor.x - x;
    const dy = attractor.y - y;
    const dst = Math.sqrt(dx * dx + dy * dy);

    orbs.push(
      new Orb(
          Math.cos(angle) * attractor.size + attractor.x,
          Math.sin(angle) * attractor.size + attractor.y,
          random(2, 10),
          colors[Math.round(random(0, colors.length))],
          { x: dx / dst, y: dy / dst },
          random(1, 10)
        )
      );
  }

  function Orb(x, y, size, color, vel, speed) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.vel = vel;
    this.speed = speed;
  }

  const setupScene = function() {
    document.body.style.background = SCENE_COLOR;
    canvas.style.background = canvasStyles.color;
    canvas.style.border = `solid ${canvasStyles.border.width}px
      ${canvasStyles.border.color}`;
    canvas.style.borderRadius = `${canvasStyles.border.radius}px`;
    canvas.style.display = "block";
    canvas.style.margin = "0 auto";
    canvas.width = GRID_WIDTH * CELL_SIZE;
    canvas.height = GRID_HEIGHT * CELL_SIZE;
    canvas.style.marginTop = `${((window.innerHeight / 2) - (canvas.height / 2))}px`;
  };

  const updateOrbs = function() {
    orbs.forEach(orb => {
      const dx = attractor.x - orb.x;
      const dy = attractor.y - orb.y;
      const dst = Math.sqrt(dx * dx + dy * dy);
      const size = dst * 0.06;
      orb.size = size;

      if (dst >= (attractor.size + orb.size)) {
        orb.vel.x *= -1;
        orb.vel.y *= -1;
        // orb.x = attractor.x;
        // orb.y = attractor.y;
      }
      
      orb.x += orb.vel.x * orb.speed;
      orb.y += orb.vel.y * orb.speed;
    });
  };

  const renderGrid = function(matrix) {
    for (let i = 0; i < matrix.length; i ++) {
      for (let j = 0; j < matrix[i].length; j ++) {
        context.lineWidth = 4;
        context.strokeStyle = STROKE_COLOR;
        context.strokeRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        if (matrix[i][j] > 0) {
          context.fillStyle = colorMap[matrix[i][j]];
          context.fillRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
      }
    }
  };

  const renderTitle = function(title) {
    context.fillStyle = '#DDDDDD'; context.fillText(title, 5, CELL_SIZE * 1);
  };

  const renderattractor = function() {
    context.beginPath();
    context.fillStyle = attractor.color;
    context.strokeStyle = STROKE_COLOR;
    context.arc(attractor.x, attractor.y, attractor.size, 0, 2 * Math.PI);
    context.fill();
    context.closePath();
  };

  const renderOrbs = function() {
    orbs.forEach(orb => {
      context.beginPath();
      context.fillStyle = orb.color;
      context.arc(orb.x, orb.y, orb.size, 0, 2 * Math.PI);
      context.fill();
      context.closePath();
    });
  }

  const update = function() {
    if (attractor.x < mouse.x) attractor.x += mouse.speed;
    else attractor.x -= mouse.speed;

    if (attractor.y < mouse.y) attractor.y += mouse.speed;
    else attractor.y -= mouse.speed;

    updateOrbs();
  };

  const draw = function() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    // renderGrid(grid);
    renderattractor();
    renderOrbs();
    renderTitle("___O.R.B.S___");
  };

  document.body.onmousedown = function({offsetX, offsetY}) {
    mouse.x = offsetX;
    mouse.y = offsetY;
  };

  const tick = () => { update(); draw(); requestAnimationFrame(tick); };

  document.body.appendChild(canvas);

  setupScene();

  context.font = `${CELL_SIZE * 0.8}px ${FONT_FAMILY}`;

  tick();
}