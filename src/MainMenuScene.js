export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainMenuScene" });
  }

  preload() {
    this.load.html('userForm', 'UserForm.html');
  }

  create() {
    const userForm = this.add.dom(170, 277.5).createFromCache('userForm');
    const nameElement = userForm.getChildByID('name');
    const emailElement = userForm.getChildByID('email');
    const errorElement = userForm.getChildByID('error');

    const playButton = this.add.graphics();
    playButton.fillStyle(0x1fcc83, 1);
    playButton.fillRect(150, 265, 100, 50);
    playButton.setInteractive(
      new Phaser.Geom.Rectangle(150, 265, 100, 50),
      Phaser.Geom.Rectangle.Contains
    );

    this.add.text(170, 277.5, "Play", {
      fontSize: "24px",
      color: "#ffffff",
    });

    playButton.on(
      "pointerup",
      function () {
        const email = emailElement.value;
        const name = nameElement.value;
        if (email == '' || name == '') {
          errorElement.className = 'error-enable';
        } else {
          this.scene.start("FlappyTinybirdScene", { email: email, name: name });
        }
      },
      this
    );
  }
}
