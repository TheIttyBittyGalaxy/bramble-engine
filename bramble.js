// INITALISE BRAMBLE //
bramble = {};

// Create game canvas
bramble.canvas = document.createElement( 'canvas' );
bramble.context = bramble.canvas.getContext( '2d' );

bramble.pixelSize = 1;
bramble.canvas.width = 800;
bramble.canvas.height = 600;

// INITALISE GAME OBJECT //
game = {};
game.load = function() {};
game.start = function() {};

// ASSET LOADER //
assets = {};
assets.image = {};
assets.sound = {};

assets.loader = {};
assets.loader.complete = false;
assets.loader.totalAssetCount = 0;
assets.loader.loadedAssetCount = 0;

assets.loader.unloadedAssets = [];

// Callback function used by an asset when it loads
assets.loader.assetLoadCallback = function () {
  assets.loader.loadedAssetCount++;
  if ( assets.loader.loadedAssetCount == assets.loader.totalAssetCount ) assets.loader.complete = true
}

// Functions used to declare assets
assets.loader.loadImages = function( assetNames , fileType ) {
  var fileType = fileType || 'png';
  assets.loader.totalAssetCount += assetNames.length;
  for ( var assetName of assetNames ) {
    assets.loader.unloadedAssets.push({
      "name": assetName,
      "fileType": fileType,
      "objectClass": Image,
      "src": "assets/images/" + assetName + "." + fileType,
      "container": assets.image,
    });
  }
}

assets.loader.loadSounds = function( assetNames , fileType ) {
  var fileType = fileType || 'mp3';
  assets.loader.totalAssetCount += assetNames.length;
  for ( var assetName of assetNames ) {
    assets.loader.unloadedAssets.push({
      "name": assetName,
      "fileType": fileType,
      "objectClass": Audio,
      "src": "assets/sounds/" + assetName + "." + fileType,
      "container": assets.image,
    });
  }
}

// Function used to load assets
assets.loader.loadAssets = function() {
  while ( assets.loader.unloadedAssets.length > 0 ) {

    // Get asset info
    let assetInfo = assets.loader.unloadedAssets.pop();

    // Create the asset's DOM object
    let obj = new assetInfo.objectClass;
    obj.addEventListener( "load" , function() {
      assets.loader.loadedAssetCount++;
      assetInfo.container[ assetInfo.name ] = obj;
    });
    // obj.addEventListener( "error" , function() {});

    // Trigger the asset to load
    obj.src = assetInfo.src
  }
}

// GAME STATE SYSTEM //
game.state = {};
game.state.stack = [];

Object.defineProperty( game.state , "current" , { get: function () { return game.state.stack[ game.state.stack.length-1 ] } } );

// Function used to cascade an event down the stack
game.state.triggerEvent = function ( event , ...args ) {

  // Find lowest state from the top of the stack that is allowed to execute on the event
  var n = game.state.stack.length -1;
  var eventCanPass = true;
  while ( n >= 0 && eventCanPass ) {
    var state = game.state.stack[n];
    eventCanPass = state.canEventPass( event );
    n--;
  }
  n++;

  // Execute the event from that state up to the top of the stack
  if ( n >= 0 ) {
    while ( n < game.state.stack.length ) {
      if ( state[event] ) { state[event]( ...args ) }
      n++;
    }
  }
}

// Functions used to manipulate the state stack
game.state.end = function () {
  // End and remove the state on the top of the stack
  var oldState = game.state.stack.pop();
  if ( oldState ) { oldState.end() }

  // Resume the state now on the top of the stack
  var newState = game.state.current;
  if ( newState ) { newState.resume() }
}

game.state.start = function ( state ) {
  // Leave the state on the top of the stack
  var oldState = game.state.current;
  if ( oldState ) { oldState.leave() }

  // Start and push to the stack the given state
  game.state.stack.push( state );
  state.start();
}

game.state.switch = function ( state ) {
  // End and remove the state on the top of the stack
  var oldState = game.state.stack.pop();
  if ( oldState ) { oldState.end() }

  // Start and push to the stack the given state
  game.state.stack.push( state );
  state.start();
}

// Generic game state object
class GameState {
  constructor() {
    this._eventCanPass = {};
  }

  enableEventPass( event )  { this._eventCanPass[event] = true }
  disableEventPass( event ) { delete this._eventCanPass[event] }
  canEventPass( event )     { return this._eventCanPass[event] }

  get focused() { return game.state.current == this }

  start() {}
  resume() {}
  leave() {}
  end() {}

  // Bramble event callbacks //
  // keyDown( key ) {}
  // keyUp( key ) {}
  // mouseDown( x , y , button ) {}
  // mouseUp( x , y , button ) {}
  // mouseMove( x , y ) {}
  // update( dt ) {}
}

// Game state used for the generic loading screen
class BrambleLoadingState extends GameState {
  constructor() {
    super();
    this.barX = bramble.canvas.width *.2;
    this.barW = bramble.canvas.width *.6;
    this.barY = bramble.canvas.height/2 -2;
    this.barH = 4;
  }

  update() {
    var progress = assets.loader.loadedAssetCount / assets.loader.totalAssetCount;
    bramble.draw.rectangle( this.barX , this.barY , this.barW , this.barH , "fill" , "#666" );
    bramble.draw.rectangle( this.barX , this.barY , this.barW * progress , this.barH , "fill" , "#EEE" );
    if ( progress == 1 && this.focused ) game.state.end();
  }
}

// MAIN LOOP //
bramble.lastTimestamp
bramble.loop = function ( timestamp ) {
  bramble.context.fillStyle = '#000';
  bramble.context.fillRect( 0 , 0 , bramble.canvas.width , bramble.canvas.height );

  var dt = ( timestamp - bramble.lastTimestamp )/1000;
  bramble.lastTimestamp = timestamp;
  game.state.triggerEvent( "update" , dt );

  window.requestAnimationFrame( bramble.loop );
}

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

// DRAWING LIBRARY //
bramble.draw = {}

// Set color
bramble.draw.setColor = function ( color ) {
	bramble.context.strokeStyle = color;
	bramble.context.fillStyle   = color;
}

// Rectangle
bramble.draw.rectangle = function( x , y , w , h , mode , color ) {
	bramble.draw.setColor( color )
	switch ( mode ) {
		case 'line': bramble.context.strokeRect( x , y , w , h ); break;
		case 'fill': bramble.context.fillRect( x , y , w , h );   break;
		default: throw new Error( 'Mode "' + mode + '" is not a valid draw mode' );
	}
}

// Circle
bramble.draw.circle = function ( x , y , r , mode , color ) {
	bramble.draw.setColor( color )
	bramble.context.beginPath();
	bramble.context.arc( x , y , r , 0 , 2*Math.PI );
	switch ( mode ) {
		case 'line': bramble.context.stroke(); break;
		case 'fill': bramble.context.fill();   break;
		default: throw new Error( 'Mode "' + mode + '" is not a valid draw mode' );
	}
	bramble.context.closePath();
}

// Line
bramble.draw.line = function ( x1 , y1 , x2 , y2 , color ) {
	bramble.draw.setColor( color )
  bramble.context.beginPath();
  bramble.context.moveTo( x1 , y1 );
  bramble.context.lineTo( x2 , y2 );
  bramble.context.stroke();
  bramble.context.closePath();
}

// Vector
bramble.draw.vector = function ( v , color , x , y ) {
	x = x || 0;
	y = y || 0;
	bramble.draw.line( x , y , x+v.x , y+v.y , color );
}

// Image
bramble.draw.image = function ( img , x , y ) {
	bramble.context.drawImage( img , x , y );
}

// INPUT HANDLING //

// Keyboard input
game.keyIsHeld = {};
game.keyDown = function( key ) {};
game.keyUp   = function( key ) {};

bramble.canvas.addEventListener( "keydown" , function ( event ) {
  game.keyIsHeld[ event.key ] = true;
  if ( [32, 37, 38, 39, 40].indexOf( event.keyCode ) > -1 ) event.preventDefault(); // Prevent the default action of the space bar and arrow keys
  if ( !event.repeat ) {
    var key = event.key.toLowerCase();
    game.keyDown( key );
    game.state.triggerEvent( "keyDown" , key );
  }
});

bramble.canvas.addEventListener( "keyup", function ( event ) {
  game.keyIsHeld[ event.key ] = undefined;
	if ( !event.repeat ) {
    var key = event.key.toLowerCase();
    game.keyUp( key );
    game.state.triggerEvent( "keyUp" , key );
  }
});

// Mouse input
game.mouseDown = function( x , y , button ) {};
game.mouseUp   = function( x , y , button ) {};
game.mouseMove = function( x , y ) {};

bramble.canvas.addEventListener( "mousedown" , function ( event ) {
  var x = event.pageX - bramble.canvas.offsetLeft;
  var y = event.pageY - bramble.canvas.offsetTop;
  game.mouseDown( x , y , event.button );
  game.state.triggerEvent( "mouseDown" , x , y , event.button );
});

bramble.canvas.addEventListener( "mouseup" , function ( event ) {
  var x = event.pageX - bramble.canvas.offsetLeft;
  var y = event.pageY - bramble.canvas.offsetTop;
  game.mouseUp( x , y , event.button );
  game.state.triggerEvent( "mouseUp" , x , y , event.button );
});

bramble.canvas.addEventListener( "mousemove" , function ( event ) {
  var x = event.pageX - bramble.canvas.offsetLeft;
  var y = event.pageY - bramble.canvas.offsetTop;
  game.mouseMove( x , y );
  game.state.triggerEvent( "mouseMove" , x , y );

});

// ENTITY COMPONENT SYSTEM //
class Entity {
  constructor() {}

  addComponent( comp ) {
    this[comp.name] = comp;
    comp.parent = this;
  }

  removeComponent( compName ) { delete this[compName] }
}

class Component {
  constructor( name ) { this.name = name }
}

// Standard components
class PositionComp extends Component {
  constructor( x , y ) {
    super( "pos" );
    this.vec = new Vec( x , y );
  }

  get x() { return this.vec.x }
  get y() { return this.vec.y }
  set x(v) { this.vec.x = v }
  set y(v) { this.vec.y = v }
}

// 2D VECTOR OBJECT //
class Vec {
  constructor( x , y ) {
    this.x = x || 0;
    this.y = y || 0;
  }

  get m() { return Math.sqrt( Math.pow(this.x,2) + Math.pow(this.y,2) ) }
  get u() { return new Vec( this.x/this.m || 0 , this.y/this.m || 0 ) }
  get n() { return new Vec( this.y , -this.x ) }

  add(v) { return new Vec( this.x +v.x , this.y +v.y ) }
  sub(v) { return new Vec( this.x -v.x , this.y -v.y ) }
  mul(c) { return new Vec( this.x *c , this.y *c ) }
  div(c) { return new Vec( this.x /c , this.y /c ) }
  dot(v) { return this.x*v.x + this.y*v.y }

  angleTo(v) { return Math.acos( this.dot(v) / (this.m*v.m) ) }
}

