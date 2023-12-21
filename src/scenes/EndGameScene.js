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
        this.load.html("leaderboard", "/chartLeaderboard.html");
        this.load.html("playerStats", "/chartPlayerStats.html");
        this.load.html("lastPlayed", "/chartLastPlayed.html");
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
            110,
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

        const topLimit = 0;  // Set the top limit for scrolling

        // Enable vertical scrolling for the entire scene
        this.input.on('wheel', (pointer, currentlyOver, deltaX, deltaY, deltaZ) => {
            // Prevent the default behavior to avoid conflicts
            pointer.event.preventDefault();

            // Adjust the scrolling speed as needed
            this.cameras.main.scrollY = Phaser.Math.Clamp(
                this.cameras.main.scrollY + deltaY * 0.5,
                topLimit,
                Number.MAX_SAFE_INTEGER  // Set a large positive value for the maximum scroll
            );
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
        
        get_data_from_tinybird(endpoints.player_stats_url)
            .then((r) => this.buildPlayerStats(r))
            .then((data) => addDataToDOM(data, "player_stats"))
            .catch((e) => e.toString());
        
        get_data_from_tinybird(endpoints.recent_player_stats_url)
            .then((r) => this.buildLastPlayed(r))
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

    buildPlayerStats(playerStats_result) {
        if (!this.scene.isActive()) return;

        const playerStats = this.add
            .dom(200, 610)
            .createFromCache("playerStats");

        playerStats_result.data.forEach((entry, index) => {
            const n_games = playerStats.getChildByID('n_games');
            const total_score = playerStats.getChildByID('total_score');
            const avg_score = playerStats.getChildByID('avg_score');
            const seconds_played = playerStats.getChildByID('seconds_played');
            
            n_games.innerHTML = entry.n_games;
            total_score.innerHTML = entry.total_score;
            avg_score.innerHTML = entry.avg_score;
            seconds_played.innerHTML = entry.seconds_played;
        });

        return playerStats_result;
    }

    buildLastPlayed(lastPlayed_result) {
        if (!this.scene.isActive()) return;

        const lastPlayed = this.add
            .dom(200, 860)
            .createFromCache("lastPlayed");

        lastPlayed_result.data.forEach((entry, index) => {
            const time = lastPlayed.getChildByID(`tr${index + 1}-time`);
            const score = lastPlayed.getChildByID(`tr${index + 1}-score`);
            time.innerHTML = entry.t;
            score.innerHTML = entry.total_score;
        });

        return lastPlayed_result;
    }
}
