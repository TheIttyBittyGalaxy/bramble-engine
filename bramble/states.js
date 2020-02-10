// STANDARD STATES //

// Bramble Loading State
// Used as the default loading screen when loading the game's assets
class BrambleLoadingState extends GameState {
  constructor() {
    super();
    this.barX = bramble.canvas.width *.2;
    this.barW = bramble.canvas.width *.6;
    this.barY = bramble.canvas.height/2 -2;
    this.barH = 4;
    this.progress = 0;
  }

  update() {
    this.progress = assets.loader.loadedAssetCount / assets.loader.totalAssetCount;
    if ( progress == 1 && this.focused ) game.state.end();
  }

  draw() {
    bramble.draw.rectangle( this.barX , this.barY , this.barW , this.barH , "fill" , "#666" );
    bramble.draw.rectangle( this.barX , this.barY , this.barW * progress , this.barH , "fill" , "#EEE" );
  }
}
