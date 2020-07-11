// BRAMBLE START //
bramble.start = function() {
  bramble.started = true;
  game.start();
  window.requestAnimationFrame(bramble.loop);
}
