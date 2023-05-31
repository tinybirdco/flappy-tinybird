export default class EndGameScene extends Phaser.Scene {

  session = {
    email: '',
    name: '',
    id: ''
  };
  top_10_url = new URL(`https://api.tinybird.co/v0/pipes/top_10_sessions.json`);
  top_10_read_token = 'p.eyJ1IjogIjYwOTQyZDQ5LTU1NzYtNDIyMC04YTRjLTZhOTVlMmU1N2RlNCIsICJpZCI6ICI1ODRmMWJhZi1lZTc4LTQ5MmUtOWIxYS1iZjcyNjk4MGFkZjAifQ.xZJUmNrN0f9MFO91-i-eA9_iJH25nFYeNruTn55SqQI';

  constructor() {
    super({ key: "EndGameScene" });
  }

  preload() {
    this.load.html('leaderboard', 'Leaderboard.html');
  }

  init(session) {
    this.session = session;
  }

  create() {

    const top_10_result = fetch(this.top_10_url, {
      headers: {
        Authorization: `Bearer ${this.top_10_read_token}`
      }
    })
      .then(r => r.json())
      .then(r => this.buildTopTen(r))
      .catch(e => e.toString())

    const base_y = 155;

    this.buildHomeButton(base_y);
    this.buildRetryButton(base_y);
  }

  buildHomeButton(base_y) {
    const homeButton = this.add.graphics();
    homeButton.fillStyle(0x1fcc83, 1);
    homeButton.fillRect(150, base_y, 100, 50);
    homeButton.setInteractive(
      new Phaser.Geom.Rectangle(150, base_y, 100, 50),
      Phaser.Geom.Rectangle.Contains
    );

    this.add.text(170, base_y + 12.5, "Home", {
      fontSize: "24px",
      color: "#ffffff",
    });

    homeButton.on(
      "pointerup",
      function () {
        this.scene.start("MainMenuScene");
      },
      this
    );
  }

  buildRetryButton(base_y) {
    const retryButton = this.add.graphics();
    retryButton.fillStyle(0x1fcc83, 1);
    retryButton.fillRect(150, base_y + 55, 100, 50);
    retryButton.setInteractive(
      new Phaser.Geom.Rectangle(150, base_y + 55, 100, 50),
      Phaser.Geom.Rectangle.Contains
    );

    this.add.text(165, base_y + 55 + 12.5, "Retry", {
      fontSize: "24px",
      color: "#ffffff",
    });

    retryButton.on(
      "pointerup",
      function () {
        this.scene.start("FlappyTinybirdScene", this.session);
      },
      this
    );
  }

  buildTopTen(top10_result) {
    let y = 300;
    let position = 1;

    const leaderboard = this.add.dom(170, 277.5).createFromCache('leaderboard');

    top10_result.data.forEach(entry => {
      const score = leaderboard.getChildByID(`tr${position}-score`);
      const name = leaderboard.getChildByID(`tr${position}-name`);
      score.innerHTML = entry.score;
      name.innerHTML = entry.name;
      position++;
    });

  }
}
