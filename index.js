(function(global, factory) {
  /* istanbul ignore next */
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory;
  }
  else if (typeof define === 'function' && define.amd) {
    define('JZZ.synth.Fluid', ['JZZ'], factory);
  }
  else {
    factory(JZZ);
  }
})(this, function(JZZ) {

  /* istanbul ignore next */
  if (!JZZ) return;
  /* istanbul ignore next */
  if (!JZZ.synth) JZZ.synth = {};
  /* istanbul ignore next */
  if (JZZ.synth.Fluid) return;

  var _version = '0.0.0';

  function Synth(port) {
    this.fluid = require('child_process').spawn('fluidsynth');
    this.fluid.on('error', function(err) { port._crash('Cannot spawn fluidsynth: ' + err.message); });
    this.fluid.on('spawn', function() { port._resume(); });
    this.quit = function() { this.fluid.stdin.write('quit'); this.fluid.stdin.end(); };

    this.play = function(msg) {
console.log('Playing: ' + msg);
    };
  }

  var _synth = {};
  var _noname = [];
  var _engine = {};

  _engine._info = function(name) {
    if (!name) name = 'JZZ.synth.Fluid';
    return {
      type: 'Web Audio',
      name: name,
      manufacturer: 'virtual',
      version: _version
    };
  };

  _engine._openOut = function(port, name) {
    var synth;
    if (typeof name !== 'undefined') {
      name = '' + name;
      if (!_synth[name]) _synth[name] = new Synth(port);
      synth = _synth[name];
    }
    else {
      synth = new Synth(port);
      _noname.push(synth);
    }
    port._info = _engine._info(name);
    port._receive = function(msg) { synth.play(msg); };
    port._close = function() { synth.quit(); };
  };

  JZZ.synth.Fluid = function(name) {
    return JZZ.lib.openMidiOut(name, _engine);
  };

  JZZ.synth.Fluid.register = function(name) {
    JZZ.lib.registerMidiOut(name, _engine);
  };

  JZZ.synth.Fluid.version = function() { return _version; };

});