// INPUT HANDLING //

// Keyboard input
game.isKeyHeld = {};
bramble.onKeyDown = new Event();
bramble.onKeyUp = new Event();

bramble.canvas.addEventListener( "keydown" , function ( event ) {
  event.preventDefault();
  if ( event.repeat ) return;

  game.isKeyHeld[ event.key ] = true;
  bramble.onKeyDown.invoke( event.key.toLowerCase() );
});

bramble.canvas.addEventListener( "keyup", function ( event ) {
  event.preventDefault();
  if ( event.repeat ) return;

  delete game.isKeyHeld[ event.key ];
  bramble.onKeyUp.invoke( event.key.toLowerCase() );
});

// Mouse input
bramble.onMouseMove = new Event(); // Parameters: x, y
bramble.onMouseDown = new Event(); // Parameters: x, y, button
bramble.onMouseUp = new Event(); // Parameters: x, y, button

bramble._eventPointToCanvas = function(event) {
  return event.pageX - bramble.canvas.offsetLeft, event.pageY - bramble.canvas.offsetTop;
}

bramble.canvas.addEventListener( "mousemove" , function ( event ) {
  event.preventDefault();
  bramble.onMouseMove.invoke( ...bramble._eventPointToCanvas( event ) );
});

bramble.canvas.addEventListener( "mousedown" , function ( event ) {
  event.preventDefault();
  bramble.onMouseDown.invoke( ...bramble._eventPointToCanvas( event ) , event.button );
});

bramble.canvas.addEventListener( "mouseup" , function ( event ) {
  event.preventDefault();
  bramble.onMouseUp.invoke( ...bramble._eventPointToCanvas( event ) , event.button );
});
