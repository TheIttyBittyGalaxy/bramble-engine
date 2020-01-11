// ENTITY COMPONENT SYSTEM ENTITY //
/*::entityComponentSystem
An entity represents a game object with a collection of instansiated components. Components can be added and removed at run time. Entities may contain multiple instances of the same component type if that component permits it. Unlike traditional game objects, entities should not contain game logic. Instead they should only contain data, which should be processed in a game system.
implementation: partial
*/
class Entity {

  /*::entityComponentSystem/Entity
  Creates a new entity
  */
  constructor() {}

  /*::entityComponentSystem/Entity
  Adds the given component to the entiy
  argument: comp entityComponentSystem/Component The component that will be added to the entity
  implementation: partial
  */
  addComponent( comp ) {
    this[comp.name] = comp;
    comp.parent = this;
  }

  /*::entityComponentSystem/Entity
  Removes the specified component from the entity
  argument: comp entityComponentSystem/Component The component that will be removed from the entity
  implementation: partial
  */
  removeComponent( compName ) { delete this[compName] }
}
