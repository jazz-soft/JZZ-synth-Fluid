# JZZ-synth-Fluid

[![npm](https://img.shields.io/npm/v/jzz-synth-fluid.svg)](https://www.npmjs.com/package/jzz-synth-fluid)
[![npm](https://img.shields.io/npm/dt/jzz-synth-fluid.svg)](https://www.npmjs.com/package/jzz-synth-fluid)
[![build](https://github.com/jazz-soft/JZZ-synth-Fluid/actions/workflows/build.yml/badge.svg)](https://github.com/jazz-soft/JZZ-synth-Fluid/actions)
[![Coverage Status](https://coveralls.io/repos/github/jazz-soft/JZZ-synth-Fluid/badge.svg?branch=main)](https://coveralls.io/github/jazz-soft/JZZ-synth-Fluid?branch=main)

A [JZZ](https://github.com/jazz-soft/JZZ) wrapper for [FluidSynth](https://github.com/FluidSynth/fluidsynth)

## Install

`npm install jzz-synth-fluid`

You also need to have [FluidSynth](https://github.com/FluidSynth/fluidsynth) installed in your computer.

## Usage

##### Play directly

```js
var JZZ = require('jzz');
require('jzz-synth-fluid')(JZZ);

JZZ.synth.Fluid({ path: '/path/to/my/fluidsynth', sf: '/path/to/my/soundfont.sf2' })
   .noteOn(0, 'C5', 127)
   .wait(500).noteOn(0, 'E5', 127)
   .wait(500).noteOn(0, 'G5', 127)
   .wait(500).noteOff(0, 'C5').noteOff(0, 'E5').noteOff(0, 'G5')
   .close();
```

##### Register as a MIDI port

```js
var JZZ = require('jzz');
require('jzz-synth-fluid')(JZZ);

JZZ.synth.Fluid.register('Fluid Synth', { path: '/path/to/my/fluidsynth', sf: '/path/to/my/soundfont.sf2' });

JZZ().openMidiOut('Fluid Synth')
   .noteOn(0, 'C5', 127)
   .wait(500).noteOn(0, 'E5', 127)
   .wait(500).noteOn(0, 'G5', 127)
   .wait(500).noteOff(0, 'C5').noteOff(0, 'E5').noteOff(0, 'G5')
   .close();
```

## More information

Please visit [**https://jazz-soft.net**](https://jazz-soft.net) for more information.  
