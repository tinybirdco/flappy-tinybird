import Phaser from "phaser";
import { v4 as uuidv4 } from "uuid";
import { addDataToDOM } from "../analytics/statBuilder";
import { get_data_from_tinybird, send_session_data } from "../utils/tinybird";
import { endpoints } from "./../config";

export default class FlappyTinybirdScene extends Phaser.Scene {
    session = {
        name: "",
        id: "",
    };

    constructor() {
        super({ key: "FlappyTinybirdScene" });
    }

    init(player) {
        this.score = 0;
        this.session.name = player.name;
        this.session.id = uuidv4();
    }

    preload() {
        this.load.image("bg", "/bg.png");
        this.load.image("bird", "/bird.png");
        this.load.spritesheet("pipe", "/pipe.png", {
            frameWidth: 20,
            frameHeight: 20,
        });
        this.canvas = this.sys.game.canvas;
    }

    getStatsFromTinybird() {
        endpoints.player_stats_url.searchParams.append(
            "name",
            this.session.name
        );

        get_data_from_tinybird(endpoints.player_stats_url)
            .then((data) => addDataToDOM(data, "player_stats"))
            .catch((e) => e.toString());

        get_data_from_tinybird(endpoints.top_10_url)
            .then((data) => addDataToDOM(data, "top_10_leaderboard"))
            .catch((e) => e.toString());

        get_data_from_tinybird(endpoints.recent_player_stats_url)
            .then((data) => addDataToDOM(data, "recent_player_stats"))
            .catch((e) => e.toString());
    }

    create() {
        this.getStatsFromTinybird();

        this.background = this.add
            .tileSprite(0, 0, 400, 560, "bg")
            .setOrigin(0, 0);

        this.scoreText = this.add
            .text(20, 20, "0", {
                font: "30px",
            })
            .setDepth(1);

        this.addBird();
        this.addEventListeners();

        this.pipes = this.physics.add.group({
            allowGravity: false,
        });

        this.addRowOfPipes();

        this.timer = this.time.addEvent({
            delay: 1250,
            callback: this.addRowOfPipes,
            callbackScope: this,
            repeat: -1,
        });
    }

    update() {
        this.background.tilePositionX += 1;

        this.updateBird();

        this.physics.overlap(this.bird, this.pipes, () => this.endGame());
    }

    updateBird() {
        if (this.bird.angle < 30) {
            this.bird.angle += 2;
        }

        if (
            this.bird.y + this.bird.height > this.canvas.height ||
            this.bird.y + this.bird.height < 0
        ) {
            this.endGame();
        }
    }

    jump() {
        this.bird.body.setVelocityY(-350);
        this.bird.scene.tweens.add({
            targets: this.bird,
            props: { angle: -20 },
            duration: 150,
            ease: "Power0",
        });
    }

    endGame() {
        const data = {
            session: this.session,
            score: this.score,
        };
        this.scene.start("EndGameScene", data);
    }

    addBird() {
        this.bird = this.physics.add.sprite(100, 245, "bird");
        this.bird.setOrigin(0, 0);
        this.physics.world.enable(this.bird);
        this.bird.body.setGravityY(1000);
        this.bird.body.setSize(17, 12);
    }

    addEventListeners() {
        this.input.keyboard
            .addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
            .on("down", (key, event) => {
                this.jump();
            });

        this.input.keyboard
            .addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
            .on("down", (key, event) => {
                this.jump();
            });

        this.input.on("pointerdown", (pointer) => {
            this.jump();
        });
    }

    addRowOfPipes() {
        const gap = Math.floor(Math.random() * 5) + 1;

        for (let i = 0; i < 10; i++) {
            if (i !== gap && i !== gap + 1 && i !== gap + 2) {
                if (i === gap - 1) {
                    this.addPipe(400, i * 60, 0);
                } else if (i === gap + 3) {
                    this.addPipe(400, i * 60, 1);
                } else {
                    this.addPipe(400, i * 60, 2);
                }
            }
        }

        this.score += 1;
        this.scoreText.text = this.score.toString();
        send_session_data(this.session);
    }

    addPipe(x, y, frame) {
        const pipe = this.physics.add.image(x, y, "pipe", frame);
        this.pipes.add(pipe);
        pipe.setOrigin(0, 0);
        pipe.setScale(3);
        this.physics.world.enable(pipe);
        pipe.body.allowGravity = false;
        pipe.body.setVelocityX(-200);
        pipe.body.setSize(20, 20);
        pipe.setActive(true);
    }
}
