import EndGameScene from "./scenes/EndGameScene";
import FlappyTinybirdScene from "./scenes/FlappyTinybirdScene";
import MainMenuScene from "./scenes/MainMenuScene";
import DealScene from "./scenes/DealScene";
import SlowFlappyTinybirdScene from "./scenes/SlowFlappyTinybirdScene";

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
    backgroundColor: "rgba(134, 182, 226,0)",
    scene: [MainMenuScene, EndGameScene, FlappyTinybirdScene, DealScene, SlowFlappyTinybirdScene],
};

export const TINYBIRD_HOST = import.meta.env.VITE_TINYBIRD_HOST;
export const TINYBIRD_READ_TOKEN = import.meta.env.VITE_TINYBIRD_READ_TOKEN;
export const TINYBIRD_APPEND_TOKEN = import.meta.env.VITE_TINYBIRD_APPEND_TOKEN;
export const KAFKA_API_SECRET = import.meta.env.KAFKA_API_SECRET;
export const KAFKA_API_KEY = import.meta.env.KAFKA_API_KEY;

export const EVENTS_URL = `https://${TINYBIRD_HOST}/v0/events`;

export const endpoints = {
    top_10_url: new URL(
        `https://${TINYBIRD_HOST}/v0/pipes/api_leaderboard.json`
    ),
    recent_player_stats_url: new URL(
        `https://${TINYBIRD_HOST}/v0/pipes/api_last_played_games.json`
    ),
    player_stats_url: new URL(
        `https://${TINYBIRD_HOST}/v0/pipes/api_player_stats.json`
    ),
    segmentation_url: new URL(
        `https://${TINYBIRD_HOST}/v0/pipes/api_segmentation.json`
    ),
};
