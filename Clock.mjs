export default class Clock {
  constructor(audioContext, callback) {
    console.log('Clock created');
    this.audioContext = audioContext;
    console.log(this.audioContext)
    this.callback = callback;

    this.unlocked = false;
    this.isPlaying = false;      // Are we currently playing?
    this.startTime;              // The start time of the entire sequence.
    this.current16thNote;        // What note is currently last scheduled?
    this.tempo = 120.0;          // tempo (in beats per minute)
    this.lookahead = 25.0;       // How frequently to call scheduling function (in milliseconds)
    this.scheduleAheadTime = 0.1;    // How far ahead to schedule audio (sec)
    // This is calculated from lookahead, and overlaps 
    // with next interval (in case the timer is late)
    this.nextNoteTime = 0.0;     // when the next note is due.
    this.noteResolution = 0;     // 0 == 16th, 1 == 8th, 2 == quarter note
    this.noteLength = 0.05;      // length of "beep" (in seconds)

    this.last16thNoteDrawn = -1; // the last "box" we drew on the screen
    this.notesInQueue = [];      // the notes that have been put into the web audio,
    // and may or may not have played yet. {note, time}

    this.timerID = null;
    this.interval = 100;
  }

  nextNote() {
    // console.log('nextNote');
    // Advance current note and time by a 16th note...
    const secondsPerBeat = 60.0 / this.tempo;    // Notice this picks up the CURRENT 
    // tempo value to calculate beat length.
    this.nextNoteTime += 0.25 * secondsPerBeat;    // Add beat length to last beat time

    this.current16thNote++;    // Advance the beat number, wrap to zero
    if (this.current16thNote == 16) {
      this.current16thNote = 0;
    }
  }

  scheduleNote(beatNumber, time) {
    // console.log('scheduleNote');
    // push the note on the queue, even if we're not playing.
    this.notesInQueue.push({ note: beatNumber, time: time });

    if ((this.noteResolution == 1) && (beatNumber % 2))
      return; // we're not playing non-8th 16th notes
    if ((this.noteResolution == 2) && (beatNumber % 4))
      return; // we're not playing non-quarter 8th notes

    // create an oscillator
    const osc = this.audioContext.createOscillator();
    osc.connect(this.audioContext.destination);
    if (beatNumber % 16 === 0)    // beat 0 == high pitch
      osc.frequency.value = 880.0;
    else if (beatNumber % 4 === 0)    // quarter notes = medium pitch
      osc.frequency.value = 440.0;
    else                        // other 16th notes = low pitch
      osc.frequency.value = 220.0;

    osc.start(time);
    osc.stop(time + this.noteLength);

    this.callback();
  }

  scheduler() {
    // while there are notes that will need to play before the next interval, 
    // schedule them and advance the pointer.
    while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.current16thNote, this.nextNoteTime);
      this.nextNote();
    }
  }

  play() {
    // console.log('Play the Clock', this.audioContext);111111111qwewqwqwew
    if (!this.audioContext)
      return;

    if (!this.unlocked) {
      console.log('Clock is locked');

      // play silent buffer to unlock the audio
      const buffer = this.audioContext.createBuffer(1, 1, 22050);
      const node = this.audioContext.createBufferSource();
      node.buffer = buffer;
      node.start(0);
      this.unlocked = true;
    }

    this.isPlaying = !this.isPlaying;

    if (this.isPlaying) { // start playing
      console.log('Playing')
      this.current16thNote = 0;
      this.nextNoteTime = this.audioContext.currentTime;
      this.timerID = setInterval(() => { this.scheduler() }, this.interval)
    } else { //stop
      console.log('Stopping')
      clearInterval(this.timerID);
      this.timerID = null;
      // timerWorker.postMessage("stop");
      // return "play";
    }
  }

  setTempo(tempo) {
    this.tempo = tempo;
  }

}