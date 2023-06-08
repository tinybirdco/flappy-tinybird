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
        createContainer: true
    },
    backgroundColor: "rgba(113, 197, 207,0)",
}

export const endpoints = {
    top_10_url: new URL(`https://api.tinybird.co/v0/pipes/top_10_leaderboard.json`),
    recent_player_stats_url: new URL(`https://api.tinybird.co/v0/pipes/recent_player_stats.json`),
    player_stats_url: new URL(`https://api.tinybird.co/v0/pipes/player_stats.json`),
}