// ENTITY COMPONENT SYSTEM ENTITY //
// Entity objects are *not* persistent, and are not used to store it's components.
// Instead, instances of the class are simply used to interface with the ECS
class Entity {
  constructor(id) {
    if (id) {
      this.id = id;
    } else {
      this.id = Entity.freeIDs.pop();
      if (Entity.freeIDs.length == 0) Entity.freeIDs.push(this.id + 1);
    }
  }

  destroy() {
    Entity.freeIDs.push(this.id);
  }

  addComponent(compClass, ...compArgs) {
    if (!Component.isPrototypeOf(compClass)) throw 'Argument to add component must be a Component class'
    let comp = new compClass(...compArgs);
    bramble.componentManager.addComponent(comp, this.id);
    return comp;
  }

  removeComponent(comp) {
    bramble.componentManager.removeComponent(comp, this.id);
  }

}
Entity.freeIDs = [0];
