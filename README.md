<p>
  <a href="https://www.tinybird.co/join-our-slack-community"><img alt="Slack Status" src="https://img.shields.io/badge/slack-chat-1FCC83?style=flat&logo=slack"></a>
</p>

# Flappy Tinybird

This repository contains a clone of the popular game "Flappy Bird". It was built using the Phaser 3 game framework and JavaScript.

## How to Play

The objective of the game is to guide the bird through a series of pipes without hitting them. The bird automatically moves forward, and the player can make it flap its wings to move upward by pressing the space bar or clicking on the screen. The game ends when the bird collides with a pipe or the ground.
How to Run

## Setup

To run the game, you'll need to have Node.js and npm installed on your computer. Then, follow these steps:

1. Setup your Tinybird account

Click this button to deploy the data project to Tinybird 👇

[![Deploy to Tinybird](https://cdn.tinybird.co/button)](https://ui.tinybird.co/workspaces/new?name=flappy_tinybird)

Follow the guided process, and your Tinybird workspace is now ready to start receiving events.

2. Setup this repository locally

```bash
git clone https://github.com/tinybirdco/flappy-tinybird.git
cd flappy-tinybird
```

3. Install dependencies

```bash
npm install
```

4. Install and configure the Tinybird CLI

To start working with data projects as if they were software projects, First, install the Tinybird CLI in a virtual environment.
You'll need python3 installed.

Check the [Tinybird CLI documentation](https://docs.tinybird.co/cli.html) for other installation options and troubleshooting tips.

```bash
python3 -mvenv .e
. .e/bin/activate
pip install tinybird-cli
tb auth --interactive
```

Choose your region: 1 for `us-east`, 2 for `eu`. A new `.tinyb` file will be created.

Go to [https://ui.tinybird.co/tokens](https://ui.tinybird.co/tokens) and copy the token with admin rights into the `.env` file.

⚠️Warning! The Admin token, the one you copied following this guide, is your admin token. Don't share it or publish it in your application. You can manage your tokens via API or using the Auth Tokens section in the UI. More detailed info at [Auth Tokens management](https://www.tinybird.co/docs/api-reference/token-api.html)

5. Start the game!

In the terminal, run the following command:

```bash
npm run start
```

Then open your web browser and go to `http://localhost:3000`.

### Credits

This game was built by [Joe Karlsson](https://github.com/JoeKarlsson) and [Alasdair Brown](https://github.com/sdairs) based on the original game by Dong Nguyen.

### License

This project is licensed under the MIT License.
