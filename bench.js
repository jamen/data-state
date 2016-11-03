var state = require('./')
var Suite = require('benchmark').Benchmark.Suite
var bench = new Suite('data-state')

bench.add('creating state', function () {
  state(function handler () {})
})

var foo = state({ type: Float32Array }, function handler () {})
bench.add('setting', function () {
  foo.set(0, 0.10101)
})

var qux = state({ type: Float32Array }, function handler () {})
bench.add('staging', function () {
  qux.stage(0, 0.10101)
})

var bar = state({ type: Float32Array }, function handler () {})
bench.add('setting 50 times', function () {
  for (var i = 0; i < 50; i++) bar.set(i, 0.10101)
})

var baz = state({ type: Float32Array }, function handler () {})
bench.add('staging 50 times then updating', function () {
  for (var i = 0; i < 50; i++) baz.stage(i, 0.10101)
  baz.update()
})

// Setup logger.
bench.on('cycle', function (event) {
  console.log(String(event.target))
})

bench.run()
