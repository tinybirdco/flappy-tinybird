import { addDataToDOM } from "../analytics/statBuilder";
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
        this.load.html("leaderboard", "/chartLeaderboard.html");
        this.load.html("playerStats", "/chartPlayerStats.html");
        this.load.html("lastPlayed", "/chartLastPlayed.html");
        this.load.image("OfferButton", "/OfferButton.png"); // Load the image for the offer button
    }

    init(data) {
        this.session = data.session;
        this.score = data.score;
    }

    create() {

        this.getDataFromTinybird()

        const text = this.add.text(
            this.cameras.main.width / 2,
            100,
            "Flappy is tired of dying :(\n\nPurchase this power-up to\nactivate slow-mo!",
            {
                align: 'center',
            }
        );

        // Set origin to center for proper alignment
        text.setOrigin(0.5);

        this.add
            .image(200, 200, "OfferButton")
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

    buyPowerUp() {
        console.log(this.session.name + ' bought a power up!'); // Log the event to the console

        send_purchase(this.session);

        this.scene.start("SlowFlappyTinybirdScene", this.session);
    };

    getDataFromTinybird() {
        endpoints.player_stats_url.searchParams.append(
            "player_param",
            this.session.name
        );

        endpoints.recent_player_stats_url.searchParams.append(
            "player_param",
            this.session.name
        );

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

        console.log("Building TopTen");

        const leaderboard = this.add
            .dom(200, 450)
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

        console.log("Building PlayerStats");

        const playerStats = this.add
            .dom(200, 710)
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

        console.log("Building LastStats");

        const lastPlayed = this.add
            .dom(200, 960)
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


