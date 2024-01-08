


export default class Event {
  constructor(type=NOTE, frequency, velocity, timeStamp) {
    this.type = type;
    this.frequency = frequency;
    this.velocity = velocity;
    this.timeStamp = timeStamp;
  }
}