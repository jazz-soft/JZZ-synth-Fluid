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

  function Synth(port, args) {
    console.log(args);
    var self = this;
    self.fluid = require('child_process').spawn(args.path);
    self.fluid.on('error', function(err) { port._crash('Cannot spawn fluidsynth: ' + err.message); });
    self.fluid.on('spawn', function() {
      if (args.sf) self.fluid.stdin.write('load ' + args.sf + '\n');
      port._resume();
    });
    self.quit = function() { self.fluid.stdin.write('quit\n'); self.fluid.stdin.end(); };

    self.play = function(msg) {
console.log('Playing: ' + msg);
    };
  }

  var _synth = {};
  var _noname = [];

  function engine(args) {
    var _engine = {};
    _engine._info = function(name) {
      if (!name) name = 'JZZ.synth.Fluid';
      return {
        type: 'FluidSynth',
        name: name,
        manufacturer: 'FluidSynth',
        version: _version
      };
    };
    _engine._openOut = function(port, name) {
      var synth;
      if (typeof name !== 'undefined') {
        name = '' + name;
        if (!_synth[name]) _synth[name] = new Synth(port, args);
        synth = _synth[name];
      }
      else {
        synth = new Synth(port, args);
        _noname.push(synth);
      }
      port._info = _engine._info(name);
      port._receive = function(msg) { synth.play(msg); };
      port._close = function() { synth.quit(); };
    };
    return _engine;
  }

  function _args(a) {
    var name, par;
    if (a.length == 2) {
      name = a[0];
      par = a[1];
    }
    else if (a.length == 1) {
      if (typeof a[0] == 'string') name = a[0];
      else par = a[0];
    }
    var args = { path: 'fluidsynth', sf: undefined };
    if (typeof par == 'object') {
      for (var k in args) if (par[k]) args[k] = par[k];
    }
    return [name, args];
  }

  JZZ.synth.Fluid = function() {
    var a = _args(arguments);
    return JZZ.lib.openMidiOut(a[0], engine(a[1]));
  };

  JZZ.synth.Fluid.register = function() {
    var a = _args(arguments);
    JZZ.lib.registerMidiOut(a[0], engine(a[1]));
  };

  JZZ.synth.Fluid.version = function() { return _version; };

});