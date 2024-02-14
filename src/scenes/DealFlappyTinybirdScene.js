import Phaser from "phaser";
import { v4 as uuidv4 } from "uuid";
import { send_death, send_session_data } from "../utils/tinybird";

export default class DealFlappyTinybirdScene extends Phaser.Scene {
    session = {
        name: "",
        id: "",
    };

    constructor() {
        super({ key: "DealFlappyTinybirdScene" });
        this.currentAdIndex = 0;
    }

    init(player) {
        this.score = 0;
        this.session.name = player.name;
        this.session.id = uuidv4();
        this.ended = false;
    }

    preload() {
        this.load.image("bg", "/bg.png");
        this.load.image("instructions", "/Instructions.png");
        this.load.image("gameOver", "/GameOver.png");
        this.load.image("ad1","/1 ⎯ Message.png");
        this.load.image("ad2","/2 ⎯ Message.png");
        this.load.image("ad3","/3 ⎯ Message.png");
        this.load.image("bird", "/bird.png");
        this.load.image("continue_button", "ContinueButton.png");
        this.load.spritesheet("pipe", "/pipe.png", {
            frameWidth: 80,
            frameHeight: 80,
        });
        this.canvas = this.sys.game.canvas;
    }

    addBird() {
        this.bird = this.physics.add.sprite(100, 245, "bird");
        this.bird.setOrigin(0).setScale(0.45);
        this.physics.world.enable(this.bird);
        this.bird.body.setGravityY(1000);
        this.bird.body.setSize(this.bird.displayWidth, this.bird.displayHeight);
        this.bird.body.enable = false; // Disable physics initially
    }

    jump() {
        this.bird.body.setVelocityY(-350); //Updated this var
        this.bird.scene.tweens.add({
            targets: this.bird,
            props: { angle: -20 },
            duration: 150,
            ease: "Power0",
        });
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

    addPipe(x, y, frame) {
        const pipe = this.physics.add.image(x, y, "pipe", frame);
        this.pipes.add(pipe);
        pipe.setOrigin(0);
        pipe.setScale(0.75);
        this.physics.world.enable(pipe);
        pipe.body.allowGravity = false;
        pipe.body.setVelocityX(-350);
        pipe.body.setSize(80, 80);
        pipe.setActive(true);
    }

    addRowOfPipes() {
        const gap = Math.floor(Math.random() * 5) + 1;

        for (let i = 0; i < 10; i++) {
            // Adjust the gap size to make it bigger
            if (i !== gap && i !== gap + 1 && i !== gap + 2 && i !== gap + 3 && i !== gap + 4) {
                // Check if the current index is not part of the gap range
                if (i === gap - 1) {
                    // Create the pipe just before the gap
                    this.addPipe(400, i * 60, 0);
                } else if (i === gap + 5) {
                    // Create the pipe just after the gap
                    this.addPipe(400, i * 60, 1);
                } else {
                    // Create regular pipes within the range
                    this.addPipe(400, i * 60, 2);
                }
            }
        }

        this.score += 1;
        this.scoreText.text = this.score.toString();
        send_session_data(this.session);
    }

    create() {
        this.ads = ['ad1', 'ad2', 'ad3'];
        this.background = this.add
            .tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, "bg")
            .setOrigin(0);

        this.scoreText = this.add
            .text(20, 20, "0", {
                font: "30px",
                color: '#25283d'
            })
            .setDepth(1);

        this.scoreText.visible = false;

        this.addBird();
        this.addEventListeners();

        this.pipes = this.physics.add.group({
            allowGravity: false,
        });

        // Add a flag to check if the timer is already started
        this.timerStarted = false;
        
        const instructions = this.add.image(0, 0, "instructions").setOrigin(0)

        // Function to start the timer
        const startTimer = () => {
            if (!this.timerStarted) {
                instructions.destroy();
                this.scoreText.visible = true;
                this.bird.body.enable = true; // Enable physics when the timer starts
                this.bird.angle = 0; // Set the bird's angle to 0 to start
                this.timer = this.time.addEvent({
                    delay: 1000,
                    callback: this.addRowOfPipes,
                    callbackScope: this,
                    repeat: -1,
                });
                this.timerStarted = true;
            }
        }

        // Start the timer when the player hits space or enter or clicks
        this.input.keyboard
            .addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
            .on("down", startTimer);

        this.input.keyboard
            .addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
            .on("down", startTimer);

        this.input.on("pointerdown", (pointer) => {
            startTimer();
        });
    }

    update() {
        this.background.tilePositionX += 2;

        if (this.timerStarted) {
            this.updateBird();
        }

        this.physics.overlap(this.bird, this.pipes, () => this.endGame());
    }

    showAd() {
        if (this.ad) {
            this.ad.destroy();
        }
    
        this.ad = this.add.image(0, 0, this.ads[this.currentAdIndex]);
        this.ad.setOrigin(0);
        this.ad.setDisplaySize(Number(this.sys.game.config.width), Number(this.sys.game.config.height));

        this.currentAdIndex = (this.currentAdIndex + 1) % this.ads.length;
        console.log(`Current ad index after increment: ${this.currentAdIndex}`);
    
        this.add
            .image(this.canvas.width / 2, this.canvas.height - 90, 'continue_button')
            .setInteractive()
            .setScale(0.5)
            .on('pointerdown', () => {
                this.ad.destroy();
                this.ad = null;
                const data = {
                    session: this.session,
                    score: this.score,
                };
                this.scene.start("EndGameScene", data);
            });
    }

    async endGame() {
        if (this.ended) return;
        this.ended = true;

        this.timer.remove();

        const data = {
            session: this.session,
            score: this.score,
        };

        send_death(this.session);

        this.scoreText.destroy();

        const gameOver = this.add.image(0, 0, "gameOver").setOrigin(0);

        // Use a timer event to wait for 2 seconds
        this.time.delayedCall(2000, async () => {
            gameOver.destroy();
            this.showAd();
        });
    }

    updateBird() {
        if (this.bird.angle < 30) {
            this.bird.angle += 2;
        }
    
        // Check if the bird's top edge is above the top of the window
        if (this.bird.y <= 0) {
            this.endGame();
        }
    
        // Check if the bird's bottom edge is below the bottom of the window
        if (this.bird.y + this.bird.height/2 >= this.canvas.height) {
            this.endGame();
        }
    
        // Additionally, check for collision with pipes
        if (this.physics.overlap(this.bird, this.pipes)) {
            this.endGame();
        }
    }
}
