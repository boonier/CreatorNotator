import Clock from './Clock.mjs';
import Sequence from './Sequence.mjs';

import Event from './Event.mjs';
import Track from './Track.mjs';

const NOTE = 'NOTE'

// is counter useful or is is better to send an event of some kind?
let mstrCount = 0;

// create global AudioContext
const audioContext = new AudioContext();

// First, let's shim the requestAnimationFrame API, with a setTimeout fallback
window.requestAnimFrame = window.requestAnimationFrame;

const countAccum = () => {
  // console.log(mstrCount)
  counterLabel.textContent = `${mstrCount} : ${mstrCount % seqLen}`;
  mstrCount++;

  sequence.accumClock()
}

// Clock generates the ticks for all the Patterns/Tracks/Sequences
const mainClock = new Clock(audioContext, countAccum);

// Sequence contains the list of events, could be 
// and array or Map...
const seqLen = 32
let sequence = new Sequence(seqLen);
for (let i = 0; i < seqLen; i++) {
  sequence.addEvent(new Event(NOTE, 60 + i, Math.random() * 0.5 + 0.5, i));
}
console.log(sequence);

//TODO: class Track { }

// instance of Pattern contains X tracks
//TODO: class Pattern { }

//handles the sequencing of patterns
//TODO: class Sequencer { }

// UI stufffff
const startStopBtn = document.getElementById('startstop');
startStopBtn.addEventListener('click', (ev) => {
  if (ev.target.textContent === 'START') {
    mstrCount = 0;
    mainClock.play();
    ev.target.textContent = 'STOP';
  } else {
    mainClock.play();
    ev.target.textContent = 'START';
  };
  // mainClock.play();
})

const printSeqBtn = document.getElementById('printseq');
printSeqBtn.addEventListener('click', () => {
  sequence.printSequence();
})


const tempoSlider = document.getElementById('tempo');
const bpmVal = document.getElementById('bpmval');
tempoSlider.addEventListener('input', (ev, val) => {
  bpmVal.textContent = `${ev.target.value}bpm`;
  mainClock.setTempo(ev.target.value);
})

const counterLabel = document.getElementById('counter');