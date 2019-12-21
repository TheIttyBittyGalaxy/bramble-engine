// ENTITY COMPONENT SYSTEM ENTITY //
class Entity {
  constructor() {}

  addComponent( comp ) {
    this[comp.name] = comp;
    comp.parent = this;
  }

  removeComponent( compName ) { delete this[compName] }
}
