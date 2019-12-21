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
