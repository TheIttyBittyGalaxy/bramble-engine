class System {
  constructor(...comps) {
    this.signature = new ComponentSignature(...comps);
    this.enabled = true;
    this.f = undefined;
  }

  setFunction(f) {
    this.f = f;
  }

  invoke() {
    if (!this.f) throw "Attempt to invoke system before defining its' function (Do this using system.setFuntion(Function f))"
    if (this.enabled) this.f();
  }
}
