class ComponentSignature extends Bitset {
  constructor(...compClasses) {

    // Validate arguments
    if (compClasses.length == 0) throw 'Component signature must be constructed with one or more components. No arguments were given';
    for (let compClass of compClasses) {
      if (typeof compClass != 'function' || !Component.isPrototypeOf(compClass)) {
        throw 'Component signature must be constructed with one or more compoents. Value "' + compClass + '" is not a Compoent.';
      }
    }

    // Initalise bitset
    for (var i = 0; i < compClasses.length; i++) this.set(compClasses[i],true);
  }

  is(other) {
    return this.equals(other);
  }

  includes(other) {
    
  }
}
