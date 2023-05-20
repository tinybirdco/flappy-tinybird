import Phaser from "phaser";

import FlappyTinybirdScene from "./FlappyTinybirdScene";

const config = {
  type: Phaser.AUTO,
  parent: "app",
  width: 400,
  height: 560,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 1000 },
      debug: true,
    },
  },
  backgroundColor: "rgba(113, 197, 207,0)",
  scene: [FlappyTinybirdScene],
};

export default new Phaser.Game(config);
