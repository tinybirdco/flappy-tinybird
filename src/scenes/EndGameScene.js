import { addDataToDOM } from "../analytics/statBuilder";
import { get_data_from_tinybird, send_death } from "../utils/tinybird";
import { endpoints } from "./../config";

export default class EndGameScene extends Phaser.Scene {
    session = {
        name: "",
        id: "",
    };
    score = 0;

    constructor() {
        super({ key: "EndGameScene" });
    }

    preload() {
        this.load.html("leaderboard", "/Leaderboard.html");
        this.load.image("RetryButton", "/RetryButton.png");
    }

    init(data) {
        this.session = data.session;
        this.score = data.score;
    }

    create() {
        send_death(this.session, this.score)
            .then(() => this.getDataFromTinybird())
            .catch((e) => e.toString());

        this.add.text(
            115,
            50,
            `You scored ${this.score} point${this.score > 1 ? "s" : ""}!`
        );

        this.add
            .image(200, 125, "RetryButton")
            .setInteractive({ cursor: "pointer" })
            .on("pointerup", () => {
                this.retry();
            });

        this.input.keyboard
            .addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
            .on("down", () => {
                this.retry();
            });

        this.input.keyboard
            .addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
            .on("down", () => {
                this.retry();
            });

        this.input.on("pointerdown", () => {
            this.retry();
        });
    }

    retry() {
        this.scene?.start("FlappyTinybirdScene", this.session);
    }

    getDataFromTinybird() {
        get_data_from_tinybird(endpoints.top_10_url)
            .then((r) => this.buildTopTen(r))
            .then((data) => addDataToDOM(data, "top_10_leaderboard"))
            .catch((e) => e.toString());

        get_data_from_tinybird(endpoints.recent_player_stats_url)
            .then((data) => addDataToDOM(data, "recent_player_stats"))
            .catch((e) => e.toString());
    }

    buildTopTen(top10_result) {
        if (!this.scene.isActive()) return;

        const leaderboard = this.add
            .dom(200, 350)
            .createFromCache("leaderboard");

        top10_result.data.forEach((entry, index) => {
            const score = leaderboard.getChildByID(`tr${index + 1}-score`);
            const name = leaderboard.getChildByID(`tr${index + 1}-name`);
            score.innerHTML = entry.total_score;
            name.innerHTML = entry.player_id;
        });

        return top10_result;
    }
}
