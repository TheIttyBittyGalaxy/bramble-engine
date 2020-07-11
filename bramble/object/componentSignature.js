class ComponentSignature {
  constructor(...compClasses) {
    if (compClasses.length == 0) throw 'Component signature must be constructed with one or more components. No arguments were given';

    this.comps = [];
    for (let compClass of compClasses) {
      if (typeof compClass != 'function' || !Component.isPrototypeOf(compClass)) {
        throw 'Component signature must be constructed with one or more compoents. Value "' + compClass + '" is not a Compoent.';
      }
      this.comps.push(compClass._brambleID);
    }

    this.comps.sort();
  }

  is(other) {
    if (other.length != this.length) return false
    for (var i = 0; i < this.length; i++) {
      if (this.comps[i] != other.comps[i]) return false
    }
    return true
  }

  get length() {
    return this.comps.length;
  }
}
