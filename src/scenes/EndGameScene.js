import { get_data_from_tinybird } from "../utils/tinybird";

export default class EndGameScene extends Phaser.Scene {

    session = {
        email: '',
        name: '',
        id: ''
    };
    top_10_url = new URL(`https://api.tinybird.co/v0/pipes/game_stats.json`);
    TOP_10_READ_TOKEN = import.meta.env.VITE_TOP_10_READ_TOKEN;

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
        get_data_from_tinybird(this.top_10_url, this.TOP_10_READ_TOKEN)
            .then(r => this.buildTopTen(r))
            .catch(e => e.toString())

        const button_height = 100;
        this.buildHomeButton(button_height);
        this.buildRetryButton(button_height);
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

    }
}
