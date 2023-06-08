import Phaser from "phaser";
import { config } from "./config";

import FlappyTinybirdScene from "./scenes/FlappyTinybirdScene";
import MainMenuScene from "./scenes/MainMenuScene";
import EndGameScene from "./scenes/EndGameScene";

export default new Phaser.Game(Object.assign(config, {
    scene: [MainMenuScene, EndGameScene, FlappyTinybirdScene]
}));