import Phaser from "phaser";

export class SceneWorld extends Phaser.Scene {
  constructor() {
    super({ key: "SceneWorld" });
  }

  preload() {}

  create() {
    this.add.text(100, 100, "Main", {
      font: "15vw verdana",
      color: "white",
    });
  }

  update(/*time, delta*/) {}
}
