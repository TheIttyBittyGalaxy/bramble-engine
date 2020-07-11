// ENTITY COMPONENT SYSTEM COMPONENT //
class Component {

  static isComponentClass(x) {
    return typeof x == "Function" && Component.isPrototypeOf(x);
  }

  get brambleID() {
    if (!_brambleID) bramble.componentManager.registerComponent(this.__proto__);
    return _brambleID;
  }
}
