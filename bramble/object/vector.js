// 2D VECTOR OBJECT //
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
