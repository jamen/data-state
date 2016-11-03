var test = require('tape')
var createState = require('./')

test('initializes state', function (t) {
  t.plan(12)

  // No params
  var foo = createState()
  foo.set(0, 123123)
  t.is(foo.get(0), 123123, 'initialized properly without options')

  // Length option
  var bar = createState({ length: 10 })
  bar.set(0, 0.007)
  t.is(bar.get(0).toFixed(3), '0.007', 'initializes properly with length')
  try {
    bar.set(11, 101)
  } catch (e) {
    t.is(e.constructor, RangeError, 'throws range error for out of range set')
  }

  // Data option
  var sample1 = new ArrayBuffer(2 * 7)
  var baz = createState({ data: sample1, type: Uint16Array })
  t.is(baz.length(), 7, 'correct state length')
  try {
    baz.set(8, 67)
  } catch (e) {
    t.is(e.constructor, RangeError, 'throws range error for data passed in')
  }

  // Dispatch param
  var qux = createState(function (index, value, oldValue) {
    t.is(qux.get(index), value, 'dispatch #' + index + ' correct')
  })
  qux.stage(0, 101)
  qux.stage(1, 0.20)
  qux.stage(2, 90.7)
  qux.update()

  // Dispatch and options params
  var quz = createState({length: 10}, function (index, value, oldValue) {
    t.is(quz.get(index), value, 'dispatch #' + index + ' second time is correct')
  })
  quz.stage(0, 101)
  quz.stage(1, 0.20)
  quz.stage(2, 90.7)
  quz.update()
  try {
    quz.set(11, 67)
  } catch (e) {
    t.is(e.constructor, RangeError, 'throws range error for data passed in again')
  }
})
