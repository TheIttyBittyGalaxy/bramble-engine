// 2D VECTOR OBJECT //
class Vector {
  /*::
  attribute: x float The x value of the vector
  attribute: y float The y value of the vector
  attribute: m float The magnitude of the vector
  attribute: u Vector The unit vector of vector
  attribute: n Vector The normal to the vector
  2D vector class */

  constructor( x , y ) {
    /*:: Vector
    argument: x int Vector x value
    argument: y int Vector y value */
    this.x = x || 0;
    this.y = y || 0;
  }

  get m() { return Math.sqrt( Math.pow(this.x,2) + Math.pow(this.y,2) ) }
  get u() { return new Vector( this.x/this.m || 0 , this.y/this.m || 0 ) }
  get n() { return new Vector( this.y , -this.x ) }

  add(v) { return new Vector( this.x +v.x , this.y +v.y ) }
  /*:: Vector
  argument: v Vector The vector to be added to the calling vector
  return: r Vector A new vector object resulting from the operation*/
  sub(v) { return new Vector( this.x -v.x , this.y -v.y ) }
  /*:: Vector
  argument: v Vector The vector to be subtracted from the calling vector
  return: r Vector A new vector object resulting from the operation*/
  mul(c) { return new Vector( this.x *c , this.y *c ) }
  /*:: Vector
  argument: v Vector The vector to be multiplied with the calling vector
  return: r Vector A new vector object resulting from the operation*/
  div(c) { return new Vector( this.x /c , this.y /c ) }
  /*:: Vector
  argument: v Vector The vector to divide the calling vector
  return: r Vector A new vector object resulting from the operation*/
  dot(v) { return this.x*v.x + this.y*v.y }
  /*:: Vector
  argument: v Vector The vector to be used in a dot multiplication with the calling vector
  return: r Vector A new vector object resulting from the operation*/

  angleTo(v) { return Math.acos( this.dot(v) / (this.m*v.m) ) }
  /*:: Vector
  Finds the angle between the calling vector and the argument vector
  argument: v Vector The argument vector
  return: angle float The angle between the two vectors*/

}
