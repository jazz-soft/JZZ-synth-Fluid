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

  var _version = '0.0.4';

  function _esc(s) { return s.replace(/\\/g, "\\\\").replace(/\$/g, "\\$").replace(/'/g, "\\'").replace(/"/g, "\\\"").replace(/ /g, "\\ "); }
  function Synth(port, args) {
    var self = this;
    self.fluid = require('child_process').spawn(args.path, args.args);
    self.fluid.on('error', function(err) { port._crash('Cannot spawn fluidsynth: ' + err.message); });
    self.fluid.on('spawn', function() {
      if (args.sf) self.loadSF(args.sf);
      port._resume();
    });
    self.quit = function() { self.fluid.stdin.write('quit\n'); self.fluid.stdin.end(); };
    self.loadSF = function(sf) { self.fluid.stdin.write('load ' + _esc(sf) + '\n'); };

    self.play = function(msg) {
      if (msg.length) {
        var code = msg[0] >> 4;
        var chan = msg[0] & 15;
        var cmd;
        if (code == 8 && msg.length >= 2) cmd = ['noteoff', chan, msg[1]].join(' ');
        if (code == 9 && msg.length >= 3) cmd = ['noteon', chan, msg[1], msg[2]].join(' ');
        if (code == 11 && msg.length >= 3) cmd = ['cc', chan, msg[1], msg[2]].join(' ');
        if (code == 12 && msg.length >= 2) cmd = ['prog', chan, msg[1]].join(' ');
        if (code == 14 && msg.length >= 3) cmd = ['pitch_bend', chan, msg[2] * 128 + msg[1]].join(' ');
      }
      if (cmd) self.fluid.stdin.write(cmd + '\n');
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
      port.loadSF = function(sf) { return this.and(function() { synth.loadSF(sf); }); };
      port.stdin = synth.fluid.stdin;
      port.stdout = synth.fluid.stdout;
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
    var args = { path: 'fluidsynth', sf: undefined, args: [] };
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