import Phaser from "phaser";

function arrHex(color: number[]) {
  return `#${color
    .map((value) => value.toString(16))
    .map((value) => (value.length < 2 ? `0${value}` : value))
    .join("")}`;
}

function hexToRgb(hex: number) {
  return [(hex >> 16) & 255, (hex >> 8) & 255, hex & 255];
}

export class SceneMain extends Phaser.Scene {
  map!: Phaser.Textures.CanvasTexture;
  image!: Phaser.Textures.CanvasTexture;
  final!: Phaser.Textures.CanvasTexture;
  graphics!: Phaser.GameObjects.Graphics;

  colorMap = {
    color1: [10, 250, 0],
    color2: [30, 225, 1],
    color3: [50, 200, 2],
    color4: [70, 175, 3],
    color5: [90, 150, 4],
    color6: [110, 125, 5],
    color7: [130, 100, 6],
    color8: [150, 75, 7],
    color9: [170, 50, 8],
    color10: [190, 25, 9],
  };
  currentColor: keyof SceneMain["colorMap"] = "color1";

  constructor() {
    super({ key: "SceneMain" });
  }

  preload() {}

  create() {
    this.add.text(100, 100, "Main", {
      font: "15vw verdana",
      color: "white",
    });

    this.map = this.textures.createCanvas("map", 32, 32);
    this.image = this.textures.createCanvas("image", 32, 32);
    this.final = this.textures.createCanvas("final", 64, 64);

    Object.entries(this.colorMap).map((color, i) => {
      let texture = this.textures.createCanvas(color[0], 3, 3);

      let that = this;

      this.add
        .image(45 + i * 4, 10, color[0])
        .setName(color[0])
        .setInteractive()
        .on("pointerdown", function (this: Phaser.GameObjects.Image) {
          that.currentColor = this.name as keyof SceneMain["colorMap"];
        });

      texture.context.fillStyle = arrHex(color[1]);
      texture.context.fillRect(0, 0, 3, 3);
      texture.refresh();
    });

    this.add.image(21, 21, "map").setName("map").setInteractive();
    this.add
      .image(21, 21 + 32 + 5, "image")
      .setName("image")
      .setInteractive();

    this.add
      .image(76, 21 + 32 + 5, "final")
      .setName("final")
      .setInteractive();

    this.graphics = this.add.graphics();

    for (var y = 0; y < 32; y++) {
      for (var x = 0; x < 32; x++) {
        this.map.setPixel(x, y, this.colorMap.color1[0], this.colorMap.color1[1], this.colorMap.color1[2]);
        this.image.setPixel(x, y, 255, 200, 0);
      }
    }

    this.image.context.fillStyle = "#ff00dd";
    this.image.context.fillRect(0, 0, 1, 32);

    for (var y = 0; y < 64; y++) {
      for (var x = 0; x < 64; x++) {
        this.final.setPixel(x, y, 100, 0, 100);
      }
    }

    this.map.update();
    this.image.update();

    this.image.getPixels(0, 0, 32, 32).map((height) =>
      height.map((pixel) => {
        let color = hexToRgb(pixel.color);
        console.log(pixel.x, pixel.y, color);
        this.final.setPixel(pixel.x + 16, pixel.y + 16, color[0], color[1], color[2]);
      })
    );

    this.final.update();
  }

  wasMouseDown = false;
  whereMouseDown: string | undefined;

  update(/*time, delta*/) {
    this.graphics.clear();

    this.graphics.lineStyle(1, 0xffffff);
    this.graphics.strokeRect(
      Math.floor(this.input.activePointer.x) + 0.5,
      Math.floor(this.input.activePointer.y) + 0.5,
      0,
      0
    );

    if (this.input.activePointer.isDown && !this.wasMouseDown) {
      this.wasMouseDown = true;

      let gameObject = this.input.hitTestPointer(this.input.activePointer)?.[0];
      console.log("mouse down game object", gameObject);
      if (gameObject) {
        this.whereMouseDown = gameObject.name;
      }
    } else if (this.input.activePointer.isDown) {
      const leftTopX = Math.floor(Math.min(this.input.activePointer.downX, this.input.activePointer.x));
      const leftTopY = Math.floor(Math.min(this.input.activePointer.downY, this.input.activePointer.y));

      const rightBottomX = Math.floor(Math.max(this.input.activePointer.downX, this.input.activePointer.x));
      const rightBottomY = Math.floor(Math.max(this.input.activePointer.downY, this.input.activePointer.y));

      //this.map.setPixel(this.input.activePointer.x - 5, this.input.activePointer.y - 5, 0, 225, 0);

      this.graphics.fillStyle(0x0000ff);
      this.graphics.fillRect(leftTopX, leftTopY, rightBottomX - leftTopX + 1, rightBottomY - leftTopY + 1);
    } else if (this.wasMouseDown) {
      const leftTopX = Math.floor(Math.min(this.input.activePointer.downX, this.input.activePointer.x));
      const leftTopY = Math.floor(Math.min(this.input.activePointer.downY, this.input.activePointer.y));

      const rightBottomX = Math.floor(Math.max(this.input.activePointer.downX, this.input.activePointer.x));
      const rightBottomY = Math.floor(Math.max(this.input.activePointer.downY, this.input.activePointer.y));

      console.log(
        "x",
        leftTopX,
        "y",
        leftTopY,
        "w",
        rightBottomX - leftTopX,
        "h",
        rightBottomY - leftTopY,
        "x2",
        rightBottomX,
        "y2",
        rightBottomY
      );

      //this.map.setPixel(x - 5, y - 5, 0, 200, 0);
      if (this.whereMouseDown === "map") {
        let color = arrHex(this.colorMap[this.currentColor]);
        console.log(color);
        this.map.context.fillStyle = color;
        this.map.context.fillRect(leftTopX - 5, leftTopY - 5, rightBottomX - leftTopX + 1, rightBottomY - leftTopY + 1);
        this.map.update();
      }

      this.wasMouseDown = false;
      this.whereMouseDown = undefined;
    }
  }
}
