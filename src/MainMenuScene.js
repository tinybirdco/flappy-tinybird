export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainMenu" });
  }

  create() {
    const graphics = this.add.graphics();
    graphics.fillStyle(0x1fcc83, 1);
    graphics.fillRect(150, 265, 100, 50);
    graphics.setInteractive(
      new Phaser.Geom.Rectangle(150, 265, 100, 50),
      Phaser.Geom.Rectangle.Contains
    );

    this.add.text(170, 277.5, "Play", {
      fontSize: "24px",
      color: "#ffffff",
    });

    graphics.on(
      "pointerup",
      function () {
        this.scene.start("FlappyTinybirdScene");
      },
      this
    );
  }
}
