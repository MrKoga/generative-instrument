import * as Tone from "tone";

class AudioPlayer {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.player = new Tone.Player();
    this.w = 90;
    this.h = 90;
  }

  load(url) {
    this.player.load(url);
  }

  hitTest(x, y) {
    return x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h;
  }

  play() {
    this.player.start();
  }
}

export default AudioPlayer;