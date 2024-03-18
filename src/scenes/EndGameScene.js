import { get_data_from_tinybird } from "../utils/tinybird";
import { endpoints, EVENT_PARAM } from "./../config";

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
        this.load.html("charts", "/charts.html");
        this.load.image("retryBg", "/Retry.png");
        this.load.image("RetryButton", "/RetryButton.png");
    }

    init(data) {
        this.session = data.session;
        this.score = data.score;
    }

    create() {
        this.getDataFromTinybird();
        this.add
            .image(0, 0, "retryBg")
            .setOrigin(0)
            .setScale(0.5);
    }

    retry() {
        this.scene?.start("FlappyTinybirdScene", this.session);
    }

    getDataFromTinybird() {
        endpoints.top_10_url.searchParams.set(
            "player_param",
            this.session.name
        );
        endpoints.top_10_url.searchParams.set(
            "event_param",
            EVENT_PARAM
        );
        
        endpoints.player_stats_url.searchParams.set(
            "player_param",
            this.session.name
        );
        endpoints.player_stats_url.searchParams.set(
            "event_param",
            EVENT_PARAM
        );

        endpoints.recent_player_stats_url.searchParams.set(
            "player_param",
            this.session.name
        );
        endpoints.recent_player_stats_url.searchParams.set(
            "event_param",
            EVENT_PARAM
        );

        const charts = this.add
            .dom(0, 0)
            .createFromCache("charts")
            .setOrigin(0);
        
        // Add link to landing page
        charts.getChildByID("landing-text");
        
        // Set name and score
        charts.getChildByID("title").innerHTML = `${
            this.session.name
        },<br/>you scored ${this.score} point${this.score !== 1 ? "s" : ""}!`;

        // Add event to DOM button
        charts.getChildByID("retry-button").addEventListener("click", () => {
            this.retry();
        });

        charts.getChildByID("offer-button").remove();

        return Promise.all([
            get_data_from_tinybird(endpoints.top_10_url)
                .then((r) => this.buildTopTen(charts, r)),
            get_data_from_tinybird(endpoints.player_stats_url)
                .then((r) => this.buildPlayerStats(charts, r)),
            get_data_from_tinybird(endpoints.recent_player_stats_url)
                .then((r) => this.buildLastPlayed(charts, r)),
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
