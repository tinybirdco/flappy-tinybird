import Phaser from "phaser";
import { send_score, send_death, get_data_from_tinybird } from "../utils/tinybird";
import { addDataToDOM } from "../utils/statBuilder";

import { v4 as uuidv4 } from "uuid";

export default class FlappyTinybirdScene extends Phaser.Scene {
    scoreText;
    score = 0;
    pipes;
    bird;
    timer;
    session = {
        email: '',
        name: '',
        id: ''
    };
    player_stats_url = new URL(`https://api.tinybird.co/v0/pipes/player_stats.json`);

    constructor() {
        super({ key: "FlappyTinybirdScene" });

    }

    init(player) {
        this.session.email = player.email;
        this.session.name = player.name;
        this.session.id = uuidv4();
    }

    preload() {
        this.load.image("bird", "bird.png");
        this.load.image("pipe", "pipe.png");
        this.canvas = this.sys.game.canvas;
    }

    create() {
        this.player_stats_url.searchParams.append('email', this.session.email);
        get_data_from_tinybird(this.player_stats_url)
            .then(data => addDataToDOM(data, "player_stats"))
            .catch(e => e.toString())

        this.bird = this.physics.add.sprite(100, 245, "bird");

        const spaceKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );

        spaceKey.on("down", (key, event) => {
            this.jump();
        });
        this.input.on('pointerdown', (pointer) => {
            this.jump();
        });

        this.pipes = this.physics.add.group({
            allowGravity: false,
        });

        this.timer = this.time.addEvent({
            delay: 2000,
            callback: this.addRowOfPipes,
            callbackScope: this,
            repeat: -1,
        });

        this.score = 0;
        this.scoreText = this.add.text(20, 20, "0", {
            font: "30px Arial",
        });
        this.scoreText.setDepth(1);
    }

    update() {
        this.pipes.children.iterate((pipe) => {
            if (pipe == undefined) return;

            if (pipe.x < -50) pipe.destroy();
            else pipe.setVelocityX(-100);
        });
        if (this.bird.y > this.canvas.height) this.endGame();
        if (this.bird.y < 35) this.bird.setY(35);
    }

    jump() {
        if (this.bird.alive == false) return;
        this.bird.body.velocity.y = -350;
    }

    endGame() {
        send_death(this.session, this.score);
        this.scene.start("EndGameScene", this.session);
    }

    addOnePipe(x, y) {
        const pipe = this.physics.add.sprite(x, y, "pipe");
        this.pipes.add(pipe);
        this.physics.add.overlap(this.bird, pipe, this.endGame, null, this);
        pipe.setActive(true);
    }

    addRowOfPipes() {
        const middleGapStart = this.getRandomInt(2, 6);

        for (let i = 0; i < 9; i++)
            if (
                i != middleGapStart &&
                i != middleGapStart + 1 &&
                i != middleGapStart - 1
            ) {
                this.addOnePipe(450, i * 60 + 35);
            }

        this.score += 1;
        this.scoreText.text = this.score;
        send_score(this.session, this.score);
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
