// ENTITY COMPONENT SYSTEM ENTITY //
class Entity {
  /*:: entityComponentSystem
  An entity represents a game object with a collection of instantiated components. Components can be added and removed at run time. Entities may contain multiple instances of the same component type if that component permits it.
  Unlike traditional game objects, entities should not contain game logic. Instead they should only contain data, which should be processed in a game system.
  incomplete*/

  constructor() {
    /*:: entityComponentSystem/Entity
    Creates a new entity
    incomplete*/

  }

  addComponent( comp ) {
    /*:: entityComponentSystem/Entity
    Adds the given component to the entity
    argument: comp entityComponentSystem/Component The component that will be added to the entity
    incomplete*/
    this[comp.name] = comp;
    comp.parent = this;
  }

  removeComponent( compName ) {
    /*:: entityComponentSystem/Entity
    Removes the specified component from the entity
    argument: comp entityComponentSystem/Component The component that will be removed from the entity
    incomplete*/
    delete this[compName]
  }
}
