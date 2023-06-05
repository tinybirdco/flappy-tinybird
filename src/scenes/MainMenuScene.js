import { get_data_from_tinybird } from "../utils/tinybird";
import { addDataToDOM } from "../utils/statBuilder";

export default class MainMenuScene extends Phaser.Scene {
    recent_player_stats_url = new URL(`https://api.tinybird.co/v0/pipes/game_stats.json`);
    top_10_url = new URL(`https://api.tinybird.co/v0/pipes/game_stats.json`);
    recent_player_stats = new URL(`https://api.tinybird.co/v0/pipes/recent_player_stats.json`)

    constructor() {
        super({ key: "MainMenuScene" });
    }

    preload() {
        this.load.html('userForm', 'UserForm.html');
    }

    create() {
        get_data_from_tinybird(this.top_10_url)
            .then(data => addDataToDOM(data, "top_10_leaderboard"))
            .catch(e => e.toString())

        get_data_from_tinybird(this.recent_player_stats)
            .then(data => addDataToDOM(data, "recent_player_stats"))
            .catch(e => e.toString())


        const userForm = this.add.dom(200, 250).createFromCache('userForm');
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
