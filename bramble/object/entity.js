// ENTITY COMPONENT SYSTEM ENTITY //
class Entity {
  constructor() {
    this.components = [];
    this.indexedComponents = {};
  }

  // Add a given component to the entity
  addComponent( comp ) {
    if ( this.indexedComponents[comp.name] == null ) this.indexedComponents[comp.name] = [];
    this.indexedComponents[comp.name].push( comp );
    this.components.push( comp );
    comp.parent = this;
  }

  // Remove a given component from the entity
  removeComponent( comp ) {
    this.components.splice( this.components.indexOf( comp ) , 1 )
    this.indexedComponents[comp.name].splice( this.indexedComponents[comp.name].indexOf( comp ) , 1 )
  }

  // Generate a component group list for a certian type of component
  forEach( compName ) {
    var compGroups = [];
    for ( var comp of this.getComponents( compName ) ) compGroups.push([comp]);
    return new ComponentGroupList( this , compGroups )
  }

  // Component getters
  getComponents( compName ) { return this.indexedComponents[compName] || []; }
  getComponent( compName ) { return this.getComponents[0]; }

}
