import Sequence from './Sequence.mjs';

// Contains a sequence
export default class Track {
  constructor() {
    console.log('Track created')
    this.sequence = new Sequence(16);
  }
}