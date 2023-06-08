import Phaser from 'phaser';

export default {
    type: Phaser.AUTO,
    parent: "app",
    width: 400,
    height: 560,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 1000 },
            debug: import.meta.env.DEV,
        },
    },
    dom: {
        createContainer: true
    },
    backgroundColor: "rgba(113, 197, 207,0)",
}