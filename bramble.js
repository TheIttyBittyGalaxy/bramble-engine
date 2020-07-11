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
bramble.assetLoader = {};
bramble.assetLoader.unloadedAssets = [];
bramble.assetLoader.totalAssetCount = 0;
bramble.assetLoader.loadedAssetCount = 0;
bramble.assetLoader.defaultImageType = "png";
bramble.assetLoader.defaultSoundType = "mp3";
bramble.assetLoader.assetLoadCallback = function () {
  bramble.assetLoader.loadedAssetCount++;
  if ( bramble.assetLoader.loadedAssetCount == bramble.assetLoader.totalAssetCount && !bramble.started ) bramble.start();
}
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
}
game.state = {};
game.state.stack = [];
Object.defineProperty( game.state , "current" , { get: function () { return game.state.stack[ game.state.stack.length-1 ] } } );
game.state.triggerEvent = function ( event , ...args ) {
  var n = game.state.stack.length -1;
  var eventCanPass = true;
  while ( n >= 0 && eventCanPass ) {
    var state = game.state.stack[n];
    eventCanPass = state.canEventPass( event );
    n--;
  }
  n++;
  if ( n >= 0 ) {
    while ( n < game.state.stack.length ) {
      if ( state[event] ) { state[event]( ...args ) }
      n++;
    }
  }
}
game.state.end = function () {
  var oldState = game.state.stack.pop();
  if ( oldState ) { oldState.end() }
  var newState = game.state.current;
  if ( newState ) { newState.resume() }
}
game.state.start = function ( state ) {
  var oldState = game.state.current;
  if ( oldState ) { oldState.leave() }
  game.state.stack.push( state );
  state.start();
}
game.state.switch = function ( state ) {
  var oldState = game.state.stack.pop();
  if ( oldState ) { oldState.end() }
  game.state.stack.push( state );
  state.start();
}
bramble.lastTimestamp
bramble.loop = function ( timestamp ) {
  bramble.context.fillStyle = "#000";
  bramble.context.fillRect( 0 , 0 , bramble.canvas.width , bramble.canvas.height );
  var dt = ( timestamp - bramble.lastTimestamp )/1000;
  bramble.lastTimestamp = timestamp;
  game.state.triggerEvent( "update" , dt );
  game.state.triggerEvent( "draw" , dt );
  window.requestAnimationFrame( bramble.loop );
}
bramble.load = function() {
  game.load();
  bramble.canvas.style.width = bramble.canvas.width * bramble.pixelSize + "px";
  bramble.canvas.style.height = bramble.canvas.height * bramble.pixelSize + "px";
  if ( bramble.pixelSize > 1 ) bramble.canvas.style.imageRendering = "crisp-edges";
  document.body.appendChild( bramble.canvas );
  if ( bramble.assetLoader.unloadedAssets.length > 0 ) {
    bramble.assetLoader.loadAssets();
    if ( game.state.stack.length == 0 ) game.state.start( new BrambleLoadingState );
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
game.isKeyHeld = {};
game.keyDown = function( key ) {};
game.keyUp   = function( key ) {};
bramble.canvas.addEventListener( "keydown" , function ( event ) {
  event.preventDefault();
  if ( event.repeat ) return;
  game.isKeyHeld[ event.key ] = true;
  var key = event.key.toLowerCase();
  game.keyDown( key );
  game.state.triggerEvent( "keyDown" , key );
});
bramble.canvas.addEventListener( "keyup", function ( event ) {
  event.preventDefault();
  if ( event.repeat ) return;
  delete game.isKeyHeld[ event.key ];
  var key = event.key.toLowerCase();
  game.keyUp( key );
  game.state.triggerEvent( "keyUp" , key );
});
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
}
class Entity {
  constructor() {
    this.components = [];
    this.indexedComponents = {};
  }
  addComponent( comp ) {
    if ( this.indexedComponents[comp.name] == null ) this.indexedComponents[comp.name] = [];
    this.indexedComponents[comp.name].push( comp );
    this.components.push( comp );
    comp.parent = this;
  }
  removeComponent( comp ) {
    this.components.splice( this.components.indexOf( comp ) , 1 )
    this.indexedComponents[comp.name].splice( this.indexedComponents[comp.name].indexOf( comp ) , 1 )
  }
  forEach( compName ) {
    var compGroups = [];
    for ( var comp of this.getComponents( compName ) ) compGroups.push([comp]);
    return new ComponentGroupList( this , compGroups )
  }
  getComponents( compName ) { return this.indexedComponents[compName] || []; }
  getComponent( compName ) { return this.getComponents[0]; }
}
class Component {
  constructor( name ) {
    this.name = name
  }
}
class ComponentGroupList {
  constructor( parent , componentGroups ) {
    this.parent = parent;
    this.componentGroups = componentGroups || [];
  }
  forEach( compName ) {
    var newGroups = [];
    var newComps = this.parent.getComponents( compName );
    for ( var oldGroup of this.componentGroups ) {
      for ( var newComp of newComps ) {
        var group = []
        for ( var oldComp of oldGroup ) group.push( oldComp )
        group.push( newComp )
        newGroups.push( group )
      }
    }
    return new ComponentGroupList( this.parent , newGroups )
  }
  run( funct ) {
    console.log( this.parent )
    for ( var group of this.componentGroups ) {
      funct.bind(this.parent)( ...group )
    }
  }
}
class PositionComp extends Component {
  constructor( x , y ) {
    super( "position" );
    this.vec = new Vec( x , y );
  }
  get x() { return this.vec.x }
  get y() { return this.vec.y }
  set x(v) { this.vec.x = v }
  set y(v) { this.vec.y = v }
}
class BrambleLoadingState extends GameState {
  constructor() {
    super();
    this.barX = bramble.canvas.width *.2;
    this.barW = bramble.canvas.width *.6;
    this.barY = bramble.canvas.height/2 -2;
    this.barH = 4;
    this.progress = 0;
  }
  update() {
    this.progress = bramble.assetLoader.loadedAssetCount / bramble.assetLoader.totalAssetCount;
    if ( progress == 1 && this.focused ) game.state.end();
  }
  draw() {
    bramble.draw.rectangle( this.barX , this.barY , this.barW , this.barH , "fill" , "#666" );
    bramble.draw.rectangle( this.barX , this.barY , this.barW * progress , this.barH , "fill" , "#EEE" );
  }
}