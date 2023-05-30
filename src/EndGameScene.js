export default class EndGameScene extends Phaser.Scene {

  session = {
    email: '',
    name: '',
    id: ''
  };

  constructor() {
    super({ key: "EndGameScene" });
  }

  init(session) {
    this.session = session;
  }

  create() {

    const homeButton = this.add.graphics();
    homeButton.fillStyle(0x1fcc83, 1);
    homeButton.fillRect(150, 235, 100, 50);
    homeButton.setInteractive(
      new Phaser.Geom.Rectangle(150, 235, 100, 50),
      Phaser.Geom.Rectangle.Contains
    );

    this.add.text(170, 247.5, "Home", {
      fontSize: "24px",
      color: "#ffffff",
    });

    homeButton.on(
      "pointerup",
      function () {
        this.scene.start("MainMenuScene");
      },
      this
    );

    const retryButton = this.add.graphics();
    retryButton.fillStyle(0x1fcc83, 1);
    retryButton.fillRect(150, 290, 100, 50);
    retryButton.setInteractive(
      new Phaser.Geom.Rectangle(150, 290, 100, 50),
      Phaser.Geom.Rectangle.Contains
    );

    this.add.text(165, 303, "Retry", {
      fontSize: "24px",
      color: "#ffffff",
    });

    retryButton.on(
      "pointerup",
      function () {
        this.scene.start("FlappyTinybirdScene", this.session);
      },
      this
    );


  }
}
