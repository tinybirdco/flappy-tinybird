export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: "MainMenuScene" });
    }

    preload() {
        this.load.image("bg", "/bg.png");
        this.load.image("PlayButton", "/PlayButton.png");
        this.load.image("Logo", "/Imagotype-Main.png");
        this.load.html("userForm", "/UserForm.html");
    }

    submitForm(nameElement, errorElement) {
        const name = nameElement.value;

        if (name === "" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(name)) {
            errorElement.setAttribute("data-enabled", true);
        } else {
            this.scene.start("FlappyTinybirdScene", { name });
        }
    }

    create() {

        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        const userForm = this.add.dom(centerX, centerY - 80).createFromCache("userForm");
        const nameElement = userForm.getChildByID("name");
        const errorElement = userForm.getChildByID("error");

        this.add.tileSprite(0, 0, 400, 560, "bg").setOrigin(0, 0);

        this.add
            .image(centerX, centerY + 230, "Logo").setScale(0.025)
            .setInteractive({ cursor: "pointer" })
            .on("pointerup", () => {
                window.open('https://faster.tinybird.co/flappybird-gko', '_blank');
            });

        this.add
            .image(centerX, centerY, "PlayButton")
            .setScale(.5)
            .setInteractive({ cursor: "pointer" })
            .on("pointerup", () => {
                this.submitForm(nameElement, errorElement);
            });

        this.input.keyboard
            .addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
            .on("down", () => {
                this.submitForm(nameElement, errorElement);
            });

        this.input.keyboard
            .addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
            .on("down", () => {
                this.submitForm(nameElement, errorElement);
            });
    }
}
