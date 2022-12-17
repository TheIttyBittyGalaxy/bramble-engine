class Bitset {
  constructor() {
    this.chunk = [];
  }

  ensureIndex(i) {
    let requiredChunks = Math.floor(i / 32) + 1;
    while (this.chunk.length < requiredChunks) this.chunk.push(0);
  }

  get(i) {
    this.ensureIndex(i);
    let c = this.chunk[Math.floor(i / 32)];
    return (c & Math.pow(2, i % 32)) != 0;
  }

  set(i, v) {
    this.ensureIndex(i);
    let c = Math.floor(i / 32);
    let mask = Math.pow(2, i % 32);

    if (!v) this.chunk[c] = ~this.chunk[c];
    this.chunk[c] = this.chunk[c] | mask;
    if (!v) this.chunk[c] = ~this.chunk[c];
  }

  binaryOp(other, f) {
    let b = new Bitset();
    let l = Math.max(this.chunk.length, other.chunk.length);
    for (var i = 0; i < l; i++) b.chunk[i] = f(this.chunk[i], other.chunk[i]);
    return b
  }

  equals(other) { return this.binaryOp(other, (a, b) => { return a === b }); }
  or(other) { return this.binaryOp(other, (a, b) => { return a | b }); }
  and(other) { return this.binaryOp(other, (a, b) => { return a & b }); }
  xor(other) { return this.binaryOp(other, (a, b) => { return a ^ b }); }
  not() {
    let b = new Bitset(this);
    for (var i = 0; i < this.chunk.length; i++) b.chunk[i] = ~this.chunk[i];
    return b;
  }

  get binaryString() {
    let s = "";
    for (var i = 0; i < this.chunk.length; i++) {
      s = ((this.chunk[i] || 0) >>> 0).toString(2).padStart(32, "0") + s;
    }
    return s;
  }
}
