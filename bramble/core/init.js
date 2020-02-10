// INITALISE BRAMBLE //
bramble = {};
bramble.started = false;

// Create game canvas
bramble.canvas = document.createElement( "canvas" );
bramble.context = bramble.canvas.getContext( "2d" );

bramble.pixelSize = 1;
bramble.canvas.width = 800;
bramble.canvas.height = 600;

// INITALISE GAME OBJECT //
game = {};
game.load = function() {};
game.start = function() {};
