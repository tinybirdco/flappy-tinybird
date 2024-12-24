This template contains a clone of Flappy Bird. It was built using the Phaser 3 game framework, JavaScript, and [Tinybird](https://www.tinybird.co/).

## 1. Set up the game

Fork the GitHub repository and deploy the data project to Tinybird.

To run it locally:

```bash
npm install
```

Duplicate the `.env.example` file and change the extension to `.env`.

Copy the [tokens](https://app.tinybird.co/tokens) `app_read_token` and `app_append_token` and paste them in the `.env` file. You will also need to add the host (refer to the URL to select the correct region).

```
VITE_TINYBIRD_HOST=api.[us-east. | us-east.aws. | eu-central-1.aws.]tinybird.co
VITE_TINYBIRD_READ_TOKEN=[app_read_token]
VITE_TINYBIRD_APPEND_TOKEN=[app_append_token]
```

In the terminal, run the following command to start the game:

```bash
npm start
```

Open your web browser, go to `http://localhost:3000`, and play!

## 2. How to play

Test your skills by playing 🎮🐥 [Flappy Tinybird](https://tbrd.co/flappybird)!

The goal of the game is to maneuver the bird through a challenging array of pipes, avoiding any collisions. The bird propels itself forward automatically, and you control its flight by either pressing the space bar, enter, or clicking on the screen to flap its wings. If you collide with a pipe, the ground, or the sky, it's game over!

## 3. How the analytics work

Each game event - 'score', 'game over', and 'purchase' - is streamed to Tinybird using the [Events API](https://www.tinybird.co/docs/ingest/events-api.html). As the data arrives, it gets transformed and aggregated in real-time and published as API Endpoints. These APIs power two use cases in the game: **user-facing analytics** and **real-time personalization**.

## 4. Learn more

To learn more about this template check out the [README](https://github.com/tinybirdco/flappy-tinybird/blob/main/README.md).

## 5. Support

If you have any questions or need help, please reach out to us on [Slack](https://www.tinybird.co/join-our-slack-community) or [email](mailto:support@tinybird.co).
