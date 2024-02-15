export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: "MainMenuScene" });
    }

    preload() {
        this.load.image("login", "/login.png");
        this.load.image("PlayButton", "/PlayButton.png");
        this.load.html("userForm", "/UserForm.html");
    }

    submitForm(nameElement, errorElement) {
        const name = nameElement.value.toLowerCase();

        if (name === "") {
            errorElement.setAttribute("data-enabled", true);
        } else {
            this.scene.start("FlappyTinybirdScene", { name });
        }
    }

    create() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        const userForm = this.add
            .dom(centerX, centerY - 50)
            .createFromCache("userForm");
        const nameElement = userForm.getChildByID("name");
        const errorElement = userForm.getChildByID("error");

        this.add.image(0, 0, "login").setOrigin(0).setScale(0.5);

        this.add
            .text(this.cameras.main.width / 2, 470, "tinybird.co", {
                fontFamily: "Pixel Operator Bold",
                fontSize: 22,
                resolution: 10,
                align: "center",
                color: "#b2e2f1",
            })
            .setOrigin(0.5)
            .setInteractive({ cursor: "pointer" })
            .on("pointerup", () => {
                window.open("https://www.tinybird.co/", "_blank");
            });

        this.add
            .image(centerX, centerY + 45, "PlayButton")
            .setScale(0.5)
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
