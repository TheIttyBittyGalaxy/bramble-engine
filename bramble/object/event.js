// EVENT OBJECT OVERRIDE //
class Event {
  constructor() {
    this.functs = [];
  }

  static _deriveFunctionFromObject(obj) {
    if (obj instanceof Function) return obj
    else if (obj instanceof System) return obj.invoke;
    throw 'Event listener must be either a Function or a System';
  }

  addListener(listener) {
    this.functs.push(Event._deriveFunctionFromObject(listener));
  }

  removeListener(listener) {
    let index = this.functs.indexOf(Event._deriveFunctionFromObject(listener));
    if (index > -1) array.splice(index, 1);
  }

  invoke() {
    for (const f of this.functs) f(...arguments);
  }
}
