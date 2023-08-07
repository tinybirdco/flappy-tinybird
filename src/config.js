import EndGameScene from "./scenes/EndGameScene";
import FlappyTinybirdScene from "./scenes/FlappyTinybirdScene";
import MainMenuScene from "./scenes/MainMenuScene";

/** @type {import("phaser").Types.Core.GameConfig} */
export const config = {
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
        createContainer: true,
    },
    render: { pixelArt: true },
    backgroundColor: "rgba(113, 197, 207,0)",
    scene: [MainMenuScene, EndGameScene, FlappyTinybirdScene],
};

export const TINYBIRD_TOKEN = import.meta.env.VITE_TINYBIRD_TOKEN;

export const EVENTS_URL = "https://api.tinybird.co/v0/events";

export const endpoints = {
    top_10_url: new URL(
        `https://api.tinybird.co/v0/pipes/top_10_leaderboard.json`
    ),
    recent_player_stats_url: new URL(
        `https://api.tinybird.co/v0/pipes/recent_player_stats.json`
    ),
    player_stats_url: new URL(
        `https://api.tinybird.co/v0/pipes/player_stats.json`
    ),
};
