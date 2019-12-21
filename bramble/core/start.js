// BRAMBLE START //
bramble.start = function() {

  // Load game
  game.load();

  // Append canvas to page
  bramble.canvas.style.width = bramble.canvas.width * bramble.pixelSize + "px";
  bramble.canvas.style.height = bramble.canvas.height * bramble.pixelSize + "px";
  if ( bramble.pixelSize > 1 ) { bramble.canvas.style.imageRendering = "pixelated" }
  document.body.appendChild( bramble.canvas );

  // Load assets
	if ( assets.loader.unloadedAssets.length > 0 ) {
		assets.loader.loadAssets();
		game.state.start( new BrambleLoadingState );
	}

  // Start game
  game.start();
	window.requestAnimationFrame( bramble.loop );
}
