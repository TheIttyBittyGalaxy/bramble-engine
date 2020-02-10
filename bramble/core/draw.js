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
		case "line": bramble.context.strokeRect( x , y , w , h ); break;
		case "fill": bramble.context.fillRect( x , y , w , h );   break;
		default: throw new Error( "Mode '" + mode + "' is not a valid draw mode" );
	}
}

// Circle
bramble.draw.circle = function ( x , y , r , mode , color ) {
	bramble.draw.setColor( color )
	bramble.context.beginPath();
	bramble.context.arc( x , y , r , 0 , 2*Math.PI );
	switch ( mode ) {
		case "line": bramble.context.stroke(); break;
		case "fill": bramble.context.fill();   break;
		default: throw new Error( "Mode '" + mode + "' is not a valid draw mode" );
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
bramble.draw.vec = function ( v , color , x , y ) {
	x = x || 0;
	y = y || 0;
	bramble.draw.line( x , y , x+v.x , y+v.y , color );
}

// Image
bramble.draw.image = function ( img , x , y ) {
	bramble.context.drawImage( img , x , y );
}
