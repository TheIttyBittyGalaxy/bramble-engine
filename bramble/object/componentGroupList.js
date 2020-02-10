// ENTITY COMPONENT SYSTEM COMPONENT LIST //
class ComponentGroupList {
  constructor( parent , componentGroups ) {
    this.parent = parent;
    this.componentGroups = componentGroups || [];
  }

  // Generate a new component group list wherein for every component of a certian type is appened to a copy of every existing group
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

  // Execute a function on each group of components
  run( funct ) {
    console.log( this.parent )
    for ( var group of this.componentGroups ) {
      funct.bind(this.parent)( ...group )
    }
  }
}
