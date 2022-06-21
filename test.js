const JZZ = require('jzz');
require('.')(JZZ);

JZZ.synth.Fluid()
  .or(function() {
    console.log('Cannot open MIDI-Out!');
    console.log(this._err());
  })
  .noteOn(0, 'C5', 127).wait(500).noteOff(0, 'C5').close();