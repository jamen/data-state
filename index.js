module.exports = createState

var NOOP = function noop () {}
var NODATA = {}

function createState (options, dispatch) {
  // Handle function parameters
  if (typeof options === 'function') {
    dispatch = options
    options = NODATA
  } else if (typeof options === 'undefined') {
    options = NODATA
    dispatch = NOOP
  } else {
    dispatch = dispatch || NOOP
  }

  // State arrays
  var StateArray = options.type || Float32Array
  var data = new StateArray(options.data || options.length || 10000)
  var staging = new StateArray(data.buffer.slice())
  // Block allocation array
  // var alloc = new Uint8Array(100)
  // Data length
  var length = data.length

  // Set data
  function set (index, value) {
    if (index > length) {
      throw new RangeError('Index ' + index + ' is out of range from maximum ' + length)
    }

    var oldValue = data[index]
    staging[index] = data[index] = value
    dispatch(index, value, oldValue)
  }

  // Get data
  function get (index) { return data[index] }

  // Set data in deffered way
  function stage (index, value) { staging[index] = value }

  // Update data to match staging data
  function update () {
    for (var index = 0; index < length; index++) {
      if (staging[index] !== data[index]) {
        var oldValue = data[index]
        var value = data[index] = staging[index]
        dispatch(index, value, oldValue)
      }
    }
  }

  // Get length
  function getLength () { return length }

  // Dump state internals
  function dump () {
    if (!options.lowSecurity) {
      return { data: data, staging: staging, dispatch: dispatch, options: options }
    } else {
      return null
    }
  }

  // Return functions
  return { set: set, stage: stage, update: update, get: get, length: getLength, dump: dump }
}
