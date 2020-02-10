// AUDIO LIBRARY //
bramble.audio = {}

// Play sound effect
bramble.audio.play = function( audioObj , volume ) {
	var a = new Audio( audioObj.src )
	a.volume = volume || 1
	a.play()
}

// Create persistent audio object
bramble.audio.create = function( audioObj ) {
	var a = new Audio( audioObj.src )
	return a
}
