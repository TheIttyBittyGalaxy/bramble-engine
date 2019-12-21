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
