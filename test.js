var JZZ = require('jzz');
require('.')(JZZ);

if (process.argv.length != 4) {
  console.log('Usage: node test.js </path/to/fluidsynth> </path/to/soundfont.sf2>');
  process.exit();
}

JZZ.synth.Fluid({ path: process.argv[2], sf: process.argv[3] })
  .or(function() {
    console.log('Cannot open MIDI-Out!');
    console.log(this._err());
  })
  .noteOn(0, 'C5', 127).wait(1000).noteOff(0, 'C5').close();