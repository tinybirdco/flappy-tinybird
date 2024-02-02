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
        this.getDataFromTinybird();
    }

    buyPowerUp() {
        console.log(this.session.name + " bought a power up!"); // Log the event to the console

        send_purchase(this.session);

        this.scene.start("DealFlappyTinybirdScene", this.session);
    }

    getDataFromTinybird() {
        endpoints.top_10_url.searchParams.append(
            "player_param",
            this.session.name
        );
        
        endpoints.player_stats_url.searchParams.append(
            "player_param",
            this.session.name
        );

        endpoints.recent_player_stats_url.searchParams.append(
            "player_param",
            this.session.name
        );

        const charts = this.add
            .dom(0, 0)
            .createFromCache("charts")
            .setOrigin(0, 0);

        // Add link to landing page
        charts.getChildByID("landing-text");
        
        // Set title
        charts.getChildByID('title').innerHTML = `${this.session.name},<br/><br/>Flappy is tired of dying :(<br/><br/>Purchase this power-up to<br/>activate easy mode!`
        
        // Add event to DOM button
        charts.getChildByID("offer-button").addEventListener("click", () => {
            this.buyPowerUp();
        });

        charts.getChildByID("retry-button").remove();

        
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
            const rank = leaderboard.querySelector(`#tr${index + 1}-rank`);
            
            // Check if the current row's player_id matches this.session.name
            if (entry.player_id === this.session.name) {
                // Set font style to bold for the matched row
                name.style.fontWeight = 'bold';
                score.style.fontWeight = 'bold';
                rank.style.fontWeight = 'bold';
            }

            score.innerHTML = entry.total_score;
            name.innerHTML = entry.player_id;
            rank.innerHTML = entry.rank;
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
