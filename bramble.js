class Event {
  constructor() {
    this.functs = [];
  }
  static _deriveFunctionFromObject(obj) {
    if (obj instanceof Function) return obj
    else if (obj instanceof System) return obj.invoke;
    throw 'Event listener must be either a Function or a System';
  }
  addListener(listener) {
    this.functs.push(Event._deriveFunctionFromObject(listener));
  }
  removeListener(listener) {
    let index = this.functs.indexOf(Event._deriveFunctionFromObject(listener));
    if (index > -1) array.splice(index, 1);
  }
  invoke() {
    for (const f of this.functs) f(...arguments);
  }
}
class Entity {
  constructor() {}
  addComponent() {}
  removeComponent() {}
}
class Component {}
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
bramble = {};
bramble.started = false;
bramble.canvas = document.createElement( "canvas" );
bramble.context = bramble.canvas.getContext( "2d" );
bramble.pixelSize = 1;
bramble.canvas.width = 800;
bramble.canvas.height = 600;
game = {};
game.asset = {};
game.load = function() {};
game.start = function() {};
game.loop = function() {};
bramble.assetLoader = {};
bramble.assetLoader.unloadedAssets = [];
bramble.assetLoader.totalAssetCount = 0;
bramble.assetLoader.loadedAssetCount = 0;
bramble.assetLoader.onComplete = new Event();
bramble.assetLoader.defaultImageType = "png";
bramble.assetLoader.defaultSoundType = "mp3";
bramble.assetLoader.loadImages = function( assetNames , fileType ) {
  var fileType = fileType || bramble.assetLoader.defaultImageType;
  bramble.assetLoader.totalAssetCount += assetNames.length;
  for ( var assetName of assetNames ) {
    bramble.assetLoader.unloadedAssets.push({
      "name": assetName,
      "fileType": fileType,
      "objectClass": Image,
      "src": "assets/" + assetName + "." + fileType,
      "loadEvent": "load",
      "container": game.asset,
    });
  }
}
bramble.assetLoader.loadSounds = function( assetNames , fileType ) {
  var fileType = fileType || bramble.assetLoader.defaultSoundType;
  bramble.assetLoader.totalAssetCount += assetNames.length;
  for ( var assetName of assetNames ) {
    bramble.assetLoader.unloadedAssets.push({
      "name": assetName,
      "fileType": fileType,
      "objectClass": Audio,
      "src": "assets/" + assetName + "." + fileType,
      "loadEvent": "canplaythrough",
      "container": game.asset,
    });
  }
}
bramble.assetLoader.loadAssets = function() {
  while ( bramble.assetLoader.unloadedAssets.length > 0 ) {
    let assetInfo = bramble.assetLoader.unloadedAssets.pop();
    while ( assetInfo.name.search( /[\\/]/ ) > -1 ) {
      var slashPos = assetInfo.name.search( /[\\/]/ );
      var subContainerName = assetInfo.name.charAt(0).toLowerCase() + assetInfo.name.substr( 1 , slashPos-1 );
      if ( assetInfo.container[ subContainerName ] == null ) assetInfo.container[ subContainerName ] = {};
      assetInfo.container = assetInfo.container[ subContainerName ];
      assetInfo.name = assetInfo.name.slice( slashPos+1 );
    }
    assetInfo.name = assetInfo.name.charAt(0).toLowerCase() + assetInfo.name.slice( 1 );
    let obj = new assetInfo.objectClass;
    obj.addEventListener( assetInfo.loadEvent , function() {
      bramble.assetLoader.loadedAssetCount++;
      assetInfo.container[ assetInfo.name ] = obj;
    });
    obj.src = assetInfo.src;
  }
  bramble.assetLoader.onComplete.invoke();
}
bramble.lastTimestamp
bramble.loop = function ( timestamp ) {
  bramble.context.fillStyle = "#000";
  bramble.context.fillRect( 0 , 0 , bramble.canvas.width , bramble.canvas.height );
  var dt = ( timestamp - bramble.lastTimestamp )/1000;
  bramble.lastTimestamp = timestamp;
  game.loop(dt);
  window.requestAnimationFrame( bramble.loop );
}
bramble.load = function() {
  game.load(); 
  bramble.canvas.style.width = bramble.canvas.width * bramble.pixelSize + "px";
  bramble.canvas.style.height = bramble.canvas.height * bramble.pixelSize + "px";
  if ( bramble.pixelSize > 1 ) bramble.canvas.style.imageRendering = "crisp-edges";
  document.body.appendChild( bramble.canvas );
  if ( bramble.assetLoader.unloadedAssets.length > 0 ) {
    bramble.assetLoader.onComplete.addListener(bramble.start);
    bramble.assetLoader.loadAssets();
  } else {
    bramble.start();
  }
}
bramble.start = function() {
  bramble.started = true;
  game.start();
  window.requestAnimationFrame( bramble.loop );
}
bramble.draw = {}
bramble.draw.setColor = function ( color ) {
	bramble.context.strokeStyle = color;
	bramble.context.fillStyle   = color;
}
bramble.draw.rectangle = function( x , y , w , h , mode , color ) {
	bramble.draw.setColor( color )
	switch ( mode ) {
		case "line": bramble.context.strokeRect( x , y , w , h ); break;
		case "fill": bramble.context.fillRect( x , y , w , h );   break;
		default: throw new Error( "Mode '" + mode + "' is not a valid draw mode" );
	}
}
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
bramble.draw.line = function ( x1 , y1 , x2 , y2 , color ) {
	bramble.draw.setColor( color )
  bramble.context.beginPath();
  bramble.context.moveTo( x1 , y1 );
  bramble.context.lineTo( x2 , y2 );
  bramble.context.stroke();
  bramble.context.closePath();
}
bramble.draw.vec = function ( v , color , x , y ) {
	x = x || 0;
	y = y || 0;
	bramble.draw.line( x , y , x+v.x , y+v.y , color );
}
bramble.draw.image = function ( img , x , y ) {
	bramble.context.drawImage( img , x , y );
}
bramble.audio = {}
bramble.audio.play = function( audioObj , volume ) {
	var a = new Audio( audioObj.src )
	a.volume = volume || 1
	a.play()
}
bramble.audio.create = function( audioObj ) {
	var a = new Audio( audioObj.src )
	return a
}
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
bramble.onMouseMove = new Event(); 
bramble.onMouseDown = new Event(); 
bramble.onMouseUp = new Event(); 
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
class CPosition extends Component {
  constructor( x , y ) {
    super();
    this.vec = new Vec( x , y );
  }
  get x() { return this.vec.x }
  get y() { return this.vec.y }
  set x(v) { this.vec.x = v }
  set y(v) { this.vec.y = v }
}