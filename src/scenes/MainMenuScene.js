import { addDataToDOM } from "../analytics/statBuilder";
import { get_data_from_tinybird } from "../utils/tinybird";
import { endpoints } from "./../config";

export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: "MainMenuScene" });
    }

    preload() {
        this.load.image("bg", "/bg.png");
        this.load.image("PlayButton", "/PlayButton.png");
        this.load.html("userForm", "/UserForm.html");
    }

    submitForm(nameElement, errorElement) {
        const name = nameElement.value;

        if (name === "") {
            errorElement.setAttribute("data-enabled", true);
        } else {
            this.scene.start("FlappyTinybirdScene", { name });
        }
    }

    getDataFromTinybird() {
        get_data_from_tinybird(endpoints.top_10_url)
            .then((data) => addDataToDOM(data, "top_10_leaderboard"))
            .catch((e) => e.toString());

        get_data_from_tinybird(endpoints.recent_player_stats_url)
            .then((data) => addDataToDOM(data, "recent_player_stats"))
            .catch((e) => e.toString());
    }

    create() {
        this.getDataFromTinybird();

        const userForm = this.add.dom(140, 175).createFromCache("userForm");
        const nameElement = userForm.getChildByID("name");
        const errorElement = userForm.getChildByID("error");

        this.add.tileSprite(0, 0, 400, 560, "bg").setOrigin(0, 0);

        this.add
            .image(200, 290, "PlayButton")
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

        this.input.on("pointerdown", () => {
            this.submitForm(nameElement, errorElement);
        });
    }
}
