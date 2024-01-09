import { get_data_from_tinybird, send_purchase } from "../utils/tinybird";
import { endpoints } from "./../config";

export default class DealScene extends Phaser.Scene {
    session = {
        name: "",
        id: "",
    };
    score = 0;

    constructor() {
        super({ key: "DealScene" });
    }

    preload() {
        this.load.html("charts", "/charts.html");
        this.load.image("OfferButton", "/OfferButton.png"); // Load the image for the offer button
    }

    init(data) {
        this.session = data.session;
        this.score = data.score;
    }

    create() {
        this.getDataFromTinybird().then(() => {
            const text = this.add.text(
                this.cameras.main.width / 2,
                100,
                `${this.session.name},\n\nFlappy is tired of dying :(\n\nPurchase this power-up to\nactivate easy mode!`,
                {
                    align: "center",
                }
            );

            // Set origin to center for proper alignment
            text.setOrigin(0.5);

            this.add
                .image(200, 220, "OfferButton")
                .setInteractive({ cursor: "pointer" })
                .on("pointerup", () => {
                    this.buyPowerUp();
                });

            this.input.keyboard
                .addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
                .on("down", () => {
                    this.buyPowerUp();
                });

            this.input.keyboard
                .addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
                .on("down", () => {
                    this.buyPowerUp();
                });

            const topLimit = 0; // Set the top limit for scrolling

            //Enable scrolling
            const handleScroll = (deltaY) => {
                this.cameras.main.scrollY = Phaser.Math.Clamp(
                    this.cameras.main.scrollY + (deltaY * 0.5),
                    topLimit,
                    Number.MAX_SAFE_INTEGER
                );
            };

            // Mouse wheel scrolling
            this.input.on("wheel", (pointer, currentlyOver, deltaX, deltaY, deltaZ) => {
                pointer.event.preventDefault();
                handleScroll(deltaY);
            });

            // Touch scrolling
            this.input.on("pointermove", (pointer) => {
                if (pointer.isDown) {
                    const deltaY = pointer.velocity.y * 0.5;
                    handleScroll(-deltaY);
                }
            });
        });
    }

    buyPowerUp() {
        console.log(this.session.name + " bought a power up!"); // Log the event to the console

        send_purchase(this.session);

        this.scene.start("SlowFlappyTinybirdScene", this.session);
    }

    getDataFromTinybird() {
        endpoints.player_stats_url.searchParams.append(
            "player_param",
            this.session.name
        );

        endpoints.recent_player_stats_url.searchParams.append(
            "player_param",
            this.session.name
        );

        const charts = this.add
            .dom(50, 300)
            .createFromCache("charts")
            .setOrigin(0, 0);
        return Promise.all([
            get_data_from_tinybird(endpoints.top_10_url)
                .then((r) => this.buildTopTen(charts, r))
                .catch((e) => e.toString()),
            get_data_from_tinybird(endpoints.player_stats_url)
                .then((r) => this.buildPlayerStats(charts, r))
                .catch((e) => e.toString()),
            get_data_from_tinybird(endpoints.recent_player_stats_url)
                .then((r) => this.buildLastPlayed(charts, r))
                .catch((e) => e.toString()),
        ]);
    }

    buildTopTen(charts, top10_result) {
        if (!this.scene.isActive()) return;

        console.log("Building TopTen");
        const leaderboard = charts.getChildByID("leaderboard");
        top10_result.data.forEach((entry, index) => {
            const score = leaderboard.querySelector(`#tr${index + 1}-score`);
            const name = leaderboard.querySelector(`#tr${index + 1}-name`);
            score.innerHTML = entry.total_score;
            name.innerHTML = entry.player_id;
        });

        return top10_result;
    }

    buildPlayerStats(charts, playerStats_result) {
        if (!this.scene.isActive()) return;

        console.log("Building PlayerStats");
        const playerStats = charts.getChildByID("playerStats");

        playerStats_result.data.forEach((entry, index) => {
            const n_games = playerStats.querySelector("#n_games");
            const total_score = playerStats.querySelector("#total_score");
            const avg_score = playerStats.querySelector("#avg_score");
            const max_score = playerStats.querySelector("#max_score");

            n_games.innerHTML = entry.n_games;
            total_score.innerHTML = entry.total_score;
            avg_score.innerHTML = entry.avg_score;
            max_score.innerHTML = entry.max_score;
        });

        return playerStats_result;
    }

    buildLastPlayed(charts, lastPlayed_result) {
        if (!this.scene.isActive()) return;

        console.log("Building LastStats");
        const lastPlayed = charts.getChildByID("lastPlayed");

        lastPlayed_result.data.forEach((entry, index) => {
            const time = lastPlayed.querySelector(`#tr${index + 1}-time`);
            const score = lastPlayed.querySelector(`#tr${index + 1}-score`);
            time.innerHTML = entry.t;
            score.innerHTML = entry.total_score;
        });

        return lastPlayed_result;
    }
}
