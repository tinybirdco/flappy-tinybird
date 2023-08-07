import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [],
    server: { host: "0.0.0.0", port: 8000 },
    clearScreen: false,
    build: {
        rollupOptions: {
            input: {
                index: resolve(__dirname, "index.html"),
                game: resolve(__dirname, "game/index.html"),
            },
        },
    },
});
