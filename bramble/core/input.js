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
