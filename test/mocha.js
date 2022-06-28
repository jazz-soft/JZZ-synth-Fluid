const assert = require('assert');
var readline = require('readline');
var JZZ = require('jzz');
require('..')(JZZ);

var version = require('../package.json').version;
var synth;
var queue = [];
var rdline;

function expect(str) {
  return new Promise(function(resolve, reject) { queue.push([str, resolve, reject]); });
}

before(function(done) {
  synth = JZZ.synth.Fluid({ path: 'node', args: [__dirname + '/echo.js'] });
  synth.and(function() {
    rdline = readline.createInterface({ input: synth.stdout });
    rdline.on('line', function(line) {
      if (queue.length) {
        var x = queue.shift();
        if (line == x[0]) x[1]();
        else throw line + ' != ' + x[0];
      }
    })
    done();
  });
});

after(function() {
  synth.close();
});

describe('Fluid Synth', function() {
  it('register', function() {
    JZZ.synth.Fluid.register();
    JZZ.synth.Fluid.register('dummy');
    JZZ.synth.Fluid.register('dummy', {});
  });
  it('version', function() {
    assert.equal(JZZ.synth.Fluid.version(), version);
  });
  it('load SF', function(done) {
    synth.loadSF('dummy');
    expect('load dummy').then(done).catch(function (err) { throw err; });
  });
  it('note_on', function(done) {
    synth.noteOn(0, 1, 2);
    expect('noteon 0 1 2').then(done).catch(function (err) { throw err; });
  });
  it('note_off', function(done) {
    synth.noteOff(0, 1, 2);
    expect('noteoff 0 1').then(done);
  });
  it('program', function(done) {
    synth.program(0, 1);
    expect('prog 0 1').then(done);
  });
  it('control', function(done) {
    synth.control(0, 1, 2);
    expect('cc 0 1 2').then(done);
  });
  it('pitch_bend', function(done) {
    synth.pitchBendF(0, 0);
    expect('pitch_bend 0 8192').then(done);
  });
  it('aftertouch', function() {
    synth.aftertouch(0, 1, 2);
  });
  it('pressure', function() {
    synth.pressure(0, 1);
  });
  it('smf', function() {
    synth.smfText('dummy');
  });
});
