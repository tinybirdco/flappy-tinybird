import { get_data_from_tinybird } from "../utils/tinybird";
import { addDataToDOM } from "../analytics/statBuilder";
import { endpoints } from "./../config";


export default class EndGameScene extends Phaser.Scene {

    session = {
        name: '',
        id: ''
    };

    constructor() {
        super({ key: "EndGameScene" });
    }

    preload() {
        this.load.html('leaderboard', 'Leaderboard.html');
    }

    init(session) {
        this.session = session;
    }

    create() {
        this.getDataFromTinybird();
        const button_height = 100;
        this.buildHomeButton(button_height);
        this.buildRetryButton(button_height);
    }

    getDataFromTinybird() {
        get_data_from_tinybird(endpoints.top_10_url)
            .then(r => this.buildTopTen(r))
            .then(data => addDataToDOM(data, "top_10_leaderboard"))
            .catch(e => e.toString())

        get_data_from_tinybird(endpoints.recent_player_stats_url)
            .then(data => addDataToDOM(data, "recent_player_stats"))
            .catch(e => e.toString())
    }

    buildHomeButton(base_height) {
        const homeButton = this.add.graphics();
        homeButton.fillStyle(0x1fcc83, 1);
        homeButton.fillRect(85, base_height, 100, 50);
        homeButton.setInteractive(
            new Phaser.Geom.Rectangle(85, base_height, 100, 50),
            Phaser.Geom.Rectangle.Contains
        );

        this.add.text(107.5, base_height + 12.5, "Home", {
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

        const spaceKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );

        spaceKey.on("down", () => {
            this.scene.start("FlappyTinybirdScene");
        });
        this.input.on('pointerdown', () => {
            this.scene.start("FlappyTinybirdScene");
        });
    }

    buildRetryButton(base_height) {
        const retryButton = this.add.graphics();
        retryButton.fillStyle(0x1fcc83, 1);
        retryButton.fillRect(195, base_height, 100, 50);
        retryButton.setInteractive(
            new Phaser.Geom.Rectangle(195, base_height, 100, 50),
            Phaser.Geom.Rectangle.Contains
        );

        this.add.text(210, base_height + 12.5, "Retry", {
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

    buildTopTen(top10_result) {
        let y = 300;
        let position = 1;

        const leaderboard = this.add.dom(200, 350).createFromCache('leaderboard');

        top10_result.data.forEach(entry => {
            const score = leaderboard.getChildByID(`tr${position}-score`);
            const name = leaderboard.getChildByID(`tr${position}-name`);
            score.innerHTML = entry.score;
            name.innerHTML = entry.name;
            position++;
        });
        return top10_result
    }
}
