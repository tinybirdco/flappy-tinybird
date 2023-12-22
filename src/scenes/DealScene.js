import { addDataToDOM } from "../analytics/statBuilder";
import { get_data_from_tinybird, send_data_to_tinybird } from "../utils/tinybird";
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
        this.load.html("leaderboard", "/Leaderboard.html");
        this.load.image("RetryButton", "/RetryButton.png");
        this.load.image("OfferButton", "/buy_now.png"); // Load the image for the offer button
    }

    init(data) {
        this.session = data.session;
        this.score = data.score;
    }


    create() {
        // Position the offer button under the retry button
        const offerButton = this.add.image(200, 200, 'OfferButton');
        offerButton.setInteractive({ cursor: 'pointer' });
        
        // Set the scale of the offer button to match the retry button
        offerButton.setScale(0.5); // Adjust this value as needed
        
        offerButton.on('pointerup', () => {
            this.buyPowerUp();
        });

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

    buyPowerUp() {    
        console.log('Power up bought! Game speed has been reduced.');
        console.log(this.session.name + ' bought a power up!'); // Log the event to the console
        const payload_purchase = {
            session_id: this.session.id,
            name: this.session.name,
            timestamp: Date.now().toString(),
            type: "purchase",
        }

        send_data_to_tinybird("events_api", payload_purchase)
        
        this.scene.start("SlowFlappyTinybirdScene", this.session);
        };

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


