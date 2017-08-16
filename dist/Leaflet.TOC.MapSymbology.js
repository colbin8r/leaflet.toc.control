export default class MapSymbology {

  constructor(symbols = []) {
    this._symbols = symbols;
  }

  get symbols() {
    return this._symbols;
  }
  addSymbol(symbol) {
    this._symbols.push(symbol);
  }

  get isSingle() {
    return this.symbols.length == 1;
  }

}
