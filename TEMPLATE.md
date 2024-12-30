Thi Flappy Tinybird template contains a clone of the famous Flappy Bird game, which sends events to Tinybird.

## Set up the game

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

