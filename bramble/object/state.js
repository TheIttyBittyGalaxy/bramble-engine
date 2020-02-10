// GAME STATE SYSTEM STATE //
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
  // update( dt ) {}
  // draw() {}

  // keyDown( key ) {}
  // keyUp( key ) {}
  // mouseDown( x , y , button ) {}
  // mouseUp( x , y , button ) {}
  // mouseMove( x , y ) {}
}
