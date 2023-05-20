import Phaser from "phaser";

export default class FlappyTinybirdScene extends Phaser.Scene {
  scoreText;
  gameOver = false;
  score = 0;
  pipes;
  bird;
  timer;

  constructor() {
    super({ key: "FlappyTinybirdScene" });
  }

  preload() {
    this.load.image("bird", "assets/bird.png");
    this.load.image("pipe", "assets/pipe.png");
    this.canvas = this.sys.game.canvas;
  }

  create() {
    this.bird = this.physics.add.sprite(100, 245, "bird");

    const spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    spaceKey.on("down", (key, event) => {
      this.jump();
    });

    this.pipes = this.physics.add.group({
      allowGravity: false,
    });

    this.timer = this.time.addEvent({
      delay: 2000,
      callback: this.addRowOfPipes,
      callbackScope: this,
      repeat: -1,
    });

    this.score = 0;
    this.scoreText = this.add.text(20, 20, "0", {
      font: "30px Arial",
    });
  }

  update() {
    this.pipes.children.iterate((pipe) => {
      if (pipe == undefined) return;

      if (pipe.x < -50) pipe.destroy();
      else pipe.setVelocityX(-100);
    });
    if (this.bird.y > this.canvas.height) this.restartGame();
    if (this.bird.y < 35) this.bird.setY(35);
  }

  jump() {
    if (this.bird.alive == false) return;
    this.bird.body.velocity.y = -350;
  }

  restartGame() {
    this.scene.restart();
  }

  hitPipe() {
    this.restartGame();
    this.timer.remove();
  }

  addOnePipe(x, y) {
    var pipe = this.physics.add.sprite(x, y, "pipe");
    this.pipes.add(pipe);
    this.physics.add.overlap(this.bird, pipe, this.hitPipe, null, this);
    pipe.setActive(true);
  }

  addRowOfPipes() {
    const middleGapStart = this.getRandomInt(2, 6);

    for (var i = 0; i < 9; i++)
      if (
        i != middleGapStart &&
        i != middleGapStart + 1 &&
        i != middleGapStart - 1
      ) {
        this.addOnePipe(450, i * 60 + 35);
      }

    this.score += 1;
    this.scoreText.text = this.score;
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
