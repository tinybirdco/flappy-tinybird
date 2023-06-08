import { get_data_from_tinybird } from "../utils/tinybird";
import { addDataToDOM } from "../analytics/statBuilder";
import { endpoints } from "./../config";

export default class MainMenuScene extends Phaser.Scene {

    constructor() {
        super({ key: "MainMenuScene" });
    }

    preload() {
        this.load.html('userForm', 'UserForm.html');
    }

    submitForm(nameElement, errorElement) {
        const name = nameElement.value;
        if (name == '') {
            errorElement.className = 'error-enable';
        } else {
            this.scene.start("FlappyTinybirdScene", { name: name });
        }
    }

    getDataFromTinybird() {
        get_data_from_tinybird(endpoints.top_10_url)
            .then(data => addDataToDOM(data, "top_10_leaderboard"))
            .catch(e => e.toString())

        get_data_from_tinybird(endpoints.recent_player_stats_url)
            .then(data => addDataToDOM(data, "recent_player_stats"))
            .catch(e => e.toString())
    }

    create() {
        this.getDataFromTinybird();

        const userForm = this.add.dom(200, 250).createFromCache('userForm');
        const nameElement = userForm.getChildByID('name');
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

        const spaceKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );

        spaceKey.on("down", () => {
            this.submitForm(nameElement, errorElement)
        });

        const enterKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.ENTER
        );

        enterKey.on("down", () => {
            this.submitForm(nameElement, errorElement)
        });


        this.input.on('pointerdown', () => {
            this.submitForm(nameElement, errorElement)
        });

        playButton.on(
            "pointerup", () => {
                this.submitForm(nameElement, errorElement)
            }
        );
    }
}
