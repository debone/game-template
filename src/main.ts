import "./style.css";

import Phaser from "phaser";

import { SceneWorld } from "./scenes/world";

import { GAME_CONFIG } from "./consts";
import PhaserGamebus from "./gamebus";

export const config = {
  ...GAME_CONFIG,
  plugins: {
    global: [
      {
        key: "PhaserGamebus",
        plugin: PhaserGamebus,
        start: true,
        mapping: "gamebus",
      },
    ],
  },
  scene: [SceneWorld],
};

new Phaser.Game(config);
