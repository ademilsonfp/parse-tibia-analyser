
export class ParseError extends Error {
  scored: boolean;

  constructor(message: string, scored?: false) {
    super(message);
    this.scored = scored === false ? false : true;
  }
}
