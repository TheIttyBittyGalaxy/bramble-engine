// BRAMBLE LOAD //
bramble.load = function() {

  // Load game
  game.load();

  // Append canvas to page
  bramble.canvas.style.width = bramble.canvas.width * bramble.pixelSize + "px";
  bramble.canvas.style.height = bramble.canvas.height * bramble.pixelSize + "px";
  if ( bramble.pixelSize > 1 ) bramble.canvas.style.imageRendering = "crisp-edges";
  document.body.appendChild( bramble.canvas );

  // Load assets
  if ( bramble.assetLoader.unloadedAssets.length > 0 ) {
    bramble.assetLoader.loadAssets();
    if ( game.state.stack.length == 0 ) game.state.start( new BrambleLoadingState );
  } else {
    bramble.start();
  }
  
}
