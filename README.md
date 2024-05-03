<p>
  <a href="https://www.tinybird.co/join-our-slack-community"><img alt="Slack Status" src="https://img.shields.io/badge/slack-chat-1FCC83?style=flat&logo=slack"></a>
</p>

# <img src="public/bird.png" alt="tinybird" width="25"/> Flappy Tinybird

This repository contains a clone of Flappy Bird. It was built using the Phaser 3 game framework, JavaScript, and [Tinybird](https://www.tinybird.co/), the real-time data platform for data and engineering teams.

## How to play

Test your skills by playing 🎮🐥 [Flappy Tinybird](https://tbrd.co/flappybird)!

The goal of the game is to maneuver the bird through a challenging array of pipes, avoiding any collisions. The bird propels itself forward automatically, and you control its flight by either pressing the space bar, enter, or clicking on the screen to flap its wings. If you collide with a pipe, the ground, or the sky, it's game over!

## How the analytics work

Each game event - 'score', 'game over', and 'purchase' - is streamed to Tinybird using the [Events API](https://www.tinybird.co/docs/ingest/events-api.html). As the data arrives, it gets transformed and aggregated in real-time and published as API Endpoints. These APIs power two use cases in the game: **user-facing analytics** and **real-time personalization**.

### User-facing analytics 📈

After each game, you are presented with a screen that contains a live leaderboard, stats about your historical performance, and scores for your most recently played games. You can evaluate your performance and see how you stack up to other players from around the world!

These stats are powered by Tinybird API Endpoints that query fresh and historical game events and return results in milliseconds.

### Real-time personalization 💸

This game can be challenging, which risks players churning due to a bad experience. But, with a personalized offer delivered at the right moment, we can improve the gamer experience and keep players coming back for more.

At the end of each round, the game makes an API request to Tinybird to evaluate your performance and determine whether or not to provide an offer. In milliseconds, Tinybird decides if you meet the criteria for an offer to make the next round easier, incentivizing you to keep playing.

In a real-world scenario, there are critical moments when a player decides what to do - stop playing, watch an ad to get a power-up, make an in-game purchase, and so on. Personalized offers at those critical moments can dramatically increase retention and drive a game's monetization strategy.

## How to run the game locally

To run your own version of the game, you'll need to create a Tinybird Workspace and install Node.js and npm on your computer.

1. [Sign up for Tinybird](https://ui.tinybird.co/signup) and follow the guided process to create an empty Workspace in the provider/region of your choosing.

2. Clone this repository locally

```bash
git clone https://github.com/tinybirdco/flappy-tinybird.git
cd flappy-tinybird
```

3. Install dependencies

```bash
npm install
```

4. Install and configure the Tinybird CLI

> Note: Alternatively, you can sync your Tinybird Workspace with a remote Git repository. Go to [Tinybird's docs](https://www.tinybird.co/docs/version-control/introduction.html) to learn more.

First, install the Tinybird CLI in a virtual environment. You'll need Python 3 installed.

Check the [Tinybird CLI documentation](https://docs.tinybird.co/cli.html) for other installation options and troubleshooting tips.

```bash
cd tinybird/
python3 -m venv .venv
source .venv/bin/activate
pip install tinybird-cli
tb auth --interactive
```

In the Tinybird UI, navigate to Tokens page in the left navigation pane and copy the token with admin rights. Paste it in the terminal and hit enter/return.

> ⚠️Warning! This is your admin token. Don't share it or publish it in your application. You can manage your tokens via API or using the Auth Tokens section in the UI. More detailed info at [Auth Tokens management](https://www.tinybird.co/docs/api-reference/token-api.html).

Choose your region. A new `.tinyb` file will be created in the `tinybird/` folder.

5. Push the Data Project to your Tinybird Workspace

```bash
tb push
```

All of the Data Sources, Pipes, and Tokens are now available in your Tinybird Workspace.

6. Add Tinybird variables to the `.env` file

Duplicate the `.env.example` file and change the extension to `.env`.

Back in the Tinybird UI, navigate to the Tokens page. copy the tokens `app_read_token` and `app_append_token` and paste them in the `.env` file. You will also need to add the host (refer to the URL to select the correct region).

```
VITE_TINYBIRD_HOST=api.[us-east. | us-east.aws. | eu-central-1.aws.]tinybird.co
VITE_TINYBIRD_READ_TOKEN=[app_read_token]
VITE_TINYBIRD_APPEND_TOKEN=[app_append_token]
```

7. Start the game!

In the terminal, run the following command:

```bash
npm start
```

Open your web browser, go to `http://localhost:3000`, and play!

## Credits

This game was built by [Joe Karlsson](https://github.com/JoeKarlsson), [Alasdair Brown](https://github.com/sdairs), [Joe Krawiec](https://github.com/simply-joe), [David Margulies](https://github.com/davidnmargulies), [Rafa Moreno](https://github.com/rmorehig), [Julia Vallina](https://github.com/juliavallina), and [Juanma Jimenez](https://github.com/juanma-tinybird) based on the original game by Dong Nguyen.

## License

This project is licensed under the MIT License.
