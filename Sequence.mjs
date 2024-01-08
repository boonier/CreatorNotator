// class Note {
//   constructor(frequency, velocity, timeStamp) {
//     this.frequency = frequency;
//     this.velocity = velocity;
//     this.timeStamp = timeStamp;
//   }
// }

export default class Sequence {
  constructor(length) {
    console.log('Sequence created')
    /* holds Events
    {
      frequency: 0..127 or 0..16383,
      velocity: 0..127 or 0..1
      timeStamp: something relative to the start of the audio context time
    }
    */
    this.length = length;
    this.events = [];
    this.counter = 0;
  }

  accumClock() {
    // accummulate the internal count
    // console.log(this.counter);
    console.log(this.readEvent());
    this.counter = (this.counter + 1) % this.length;
  }

  readEvent() {
    // read the next event
    return this.events[this.counter];
  }

  addEvent(ev) {
    this.events.push(ev);
  }

  removeEvent() {
    this.events.splice(idx, 1);
  }

  //
  setAllEvents(seq) {
    this.events = seq;
  }

  printSequence() {
    console.log(this.events);
  }

  playEvent(idx) {
    console.log(this.events[idx]);
  }

}