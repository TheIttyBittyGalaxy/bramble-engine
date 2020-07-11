// ENTITY COMPONENT SYSTEM  COMPONENT MANAGER //
bramble.componentManager = {};
bramble.componentManager.components = []
bramble.componentManager.nextID = 0;

bramble.componentManager.registerComponent = function(compClass) {
  if (!Component.isComponentClass(compClass)) throw 'Component classes must extend the "Component" class';
  compClass._brambleID = this.nextID;
  this.nextID++;
}

bramble.componentManager.addComponent = function(comp, ent) {
  let c = ensureValue(this.components, comp._brambleID, []);
  ensureValue(c, ent, []).push(comp);
}

bramble.componentManager.removeComponent = function(comp, ent) {
  removeValue(this.components[comp._brambleID][ent], comp)
}

bramble.componentManager.getComponents = function(compClass, ent) {
  return this.components[compClass._brambleID][ent]
}
