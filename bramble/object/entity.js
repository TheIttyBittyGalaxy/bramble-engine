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

  addComponent(comp, ...compArgs) {
    if (!Component.isPrototypeOf(comp)) throw 'Argument to add component must be a Component class'
    if (!bramble._components[comp.name]) bramble._components[comp.name] = [];
    let c = new comp(...compArgs);
    bramble._components[comp.name][this.id] = c;
    return c
  }

  removeComponent(comp) {
    if (bramble._components[comp.name]) delete bramble._components[comp.name][this.id];
  }

}
Entity.freeIDs = [0];
