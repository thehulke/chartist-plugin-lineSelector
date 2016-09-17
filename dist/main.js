(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
'use strict';

var Chartist = require('chartist');
var lineSelector = require('chartist-plugins-line_selector');

var data = {
	labels: ['', '1d', '2d', '3d', '4d', '5d', '6d', '7d', '8d'],
	series: [[0, 5, 8, 10, 7, 6, 5, 5, 4], [4, 8, 3, 5, 7, 9, 12, 6, 5], [4, 8, 3, 2, 7, 9, 12, 9, 5]]
};

var options = {
	low: 0,
	high: 15,
	showArea: true,
	plugins: [Chartist.plugins.lineSelector()],
	axisY: {
		onlyInteger: true,
		offset: 20
	}
};

var lineChart = new Chartist.Line('.line-chart', data, options);

lineChart.on('draw', function (data) {
	if (data.type === 'line' || data.type === 'area') {
		data.element.animate({
			d: {
				begin: 700 * data.index,
				dur: 1000,
				from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
				to: data.path.clone().stringify(),
				easing: Chartist.Svg.Easing.easeOutQuint
			}
		});
	}
});
}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_eb812fed.js","/")
},{"buffer":3,"chartist":5,"chartist-plugins-line_selector":4,"rH1JPG":7}],2:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/base64-js/lib/b64.js","/../../node_modules/base64-js/lib")
},{"buffer":3,"rH1JPG":7}],3:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `Buffer._useTypedArrays`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
Buffer._useTypedArrays = (function () {
  // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
  // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
  // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
  // because we need to be able to add all the node Buffer API methods. This is an issue
  // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() &&
        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Workaround: node's base64 implementation allows for non-padded strings
  // while base64-js does not.
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // assume that object is array-like
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (Buffer._useTypedArrays) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer)
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' +
      'list should be an Array.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

// BUFFER INSTANCE METHODS
// =======================

function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  assert(strLen % 2 === 0, 'Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    assert(!isNaN(byte), 'Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function _asciiWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function _utf16leWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = _asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = _binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = _base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leWrite(this, string, offset, length)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexSlice(self, start, end)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Slice(self, start, end)
      break
    case 'ascii':
      ret = _asciiSlice(self, start, end)
      break
    case 'binary':
      ret = _binarySlice(self, start, end)
      break
    case 'base64':
      ret = _base64Slice(self, start, end)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leSlice(self, start, end)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart')
  assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 100 || !Buffer._useTypedArrays) {
    for (var i = 0; i < len; i++)
      target[i + target_start] = this[i + start]
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

function _base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function _utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++)
    ret += String.fromCharCode(buf[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function _utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i+1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (Buffer._useTypedArrays) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  return this[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    val = buf[offset]
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
  } else {
    val = buf[offset] << 8
    if (offset + 1 < len)
      val |= buf[offset + 1]
  }
  return val
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    if (offset + 2 < len)
      val = buf[offset + 2] << 16
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
    val |= buf[offset]
    if (offset + 3 < len)
      val = val + (buf[offset + 3] << 24 >>> 0)
  } else {
    if (offset + 1 < len)
      val = buf[offset + 1] << 16
    if (offset + 2 < len)
      val |= buf[offset + 2] << 8
    if (offset + 3 < len)
      val |= buf[offset + 3]
    val = val + (buf[offset] << 24 >>> 0)
  }
  return val
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  var neg = this[offset] & 0x80
  if (neg)
    return (0xff - this[offset] + 1) * -1
  else
    return this[offset]
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt16(buf, offset, littleEndian, true)
  var neg = val & 0x8000
  if (neg)
    return (0xffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt32(buf, offset, littleEndian, true)
  var neg = val & 0x80000000
  if (neg)
    return (0xffffffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4)
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= this.length) return

  this[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= this.length)
    return

  if (value >= 0)
    this.writeUInt8(value, offset, noAssert)
  else
    this.writeUInt8(0xff + value + 1, offset, noAssert)
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt16(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt32(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  assert(typeof value === 'number' && !isNaN(value), 'value is not a number')
  assert(end >= start, 'end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  assert(start >= 0 && start < this.length, 'start out of bounds')
  assert(end >= 0 && end <= this.length, 'end out of bounds')

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer._useTypedArrays) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1)
        buf[i] = this[i]
      return buf.buffer
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value >= 0, 'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754 (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/buffer/index.js","/../../node_modules/buffer")
},{"base64-js":2,"buffer":3,"ieee754":6,"rH1JPG":7}],4:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var Chartist=require("chartist");Chartist.plugins=Chartist.plugins||{},Chartist.plugins.lineSelector=function(){return function(t){t instanceof Chartist.Line&&t.on("draw",function(t){"line"!==t.type&&"point"!==t.type||(t.element._node.onclick=function(t){var n=t.target.parentNode,e=n.parentNode;e.removeChild(n),e.appendChild(n)})})}};
}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/chartist-plugins-line_selector/dist/chartist-plugin-lineSelector.js","/../../node_modules/chartist-plugins-line_selector/dist")
},{"buffer":3,"chartist":5,"rH1JPG":7}],5:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define([], function () {
      return (root['Chartist'] = factory());
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    root['Chartist'] = factory();
  }
}(this, function () {

/* Chartist.js 0.9.8
 * Copyright © 2016 Gion Kunz
 * Free to use under either the WTFPL license or the MIT license.
 * https://raw.githubusercontent.com/gionkunz/chartist-js/master/LICENSE-WTFPL
 * https://raw.githubusercontent.com/gionkunz/chartist-js/master/LICENSE-MIT
 */
/**
 * The core module of Chartist that is mainly providing static functions and higher level functions for chart modules.
 *
 * @module Chartist.Core
 */
var Chartist = {
  version: '0.9.8'
};

(function (window, document, Chartist) {
  'use strict';

  /**
   * This object contains all namespaces used within Chartist.
   *
   * @memberof Chartist.Core
   * @type {{svg: string, xmlns: string, xhtml: string, xlink: string, ct: string}}
   */
  Chartist.namespaces = {
    svg: 'http://www.w3.org/2000/svg',
    xmlns: 'http://www.w3.org/2000/xmlns/',
    xhtml: 'http://www.w3.org/1999/xhtml',
    xlink: 'http://www.w3.org/1999/xlink',
    ct: 'http://gionkunz.github.com/chartist-js/ct'
  };

  /**
   * Helps to simplify functional style code
   *
   * @memberof Chartist.Core
   * @param {*} n This exact value will be returned by the noop function
   * @return {*} The same value that was provided to the n parameter
   */
  Chartist.noop = function (n) {
    return n;
  };

  /**
   * Generates a-z from a number 0 to 26
   *
   * @memberof Chartist.Core
   * @param {Number} n A number from 0 to 26 that will result in a letter a-z
   * @return {String} A character from a-z based on the input number n
   */
  Chartist.alphaNumerate = function (n) {
    // Limit to a-z
    return String.fromCharCode(97 + n % 26);
  };

  /**
   * Simple recursive object extend
   *
   * @memberof Chartist.Core
   * @param {Object} target Target object where the source will be merged into
   * @param {Object...} sources This object (objects) will be merged into target and then target is returned
   * @return {Object} An object that has the same reference as target but is extended and merged with the properties of source
   */
  Chartist.extend = function (target) {
    target = target || {};

    var sources = Array.prototype.slice.call(arguments, 1);
    sources.forEach(function(source) {
      for (var prop in source) {
        if (typeof source[prop] === 'object' && source[prop] !== null && !(source[prop] instanceof Array)) {
          target[prop] = Chartist.extend({}, target[prop], source[prop]);
        } else {
          target[prop] = source[prop];
        }
      }
    });

    return target;
  };

  /**
   * Replaces all occurrences of subStr in str with newSubStr and returns a new string.
   *
   * @memberof Chartist.Core
   * @param {String} str
   * @param {String} subStr
   * @param {String} newSubStr
   * @return {String}
   */
  Chartist.replaceAll = function(str, subStr, newSubStr) {
    return str.replace(new RegExp(subStr, 'g'), newSubStr);
  };

  /**
   * Converts a number to a string with a unit. If a string is passed then this will be returned unmodified.
   *
   * @memberof Chartist.Core
   * @param {Number} value
   * @param {String} unit
   * @return {String} Returns the passed number value with unit.
   */
  Chartist.ensureUnit = function(value, unit) {
    if(typeof value === 'number') {
      value = value + unit;
    }

    return value;
  };

  /**
   * Converts a number or string to a quantity object.
   *
   * @memberof Chartist.Core
   * @param {String|Number} input
   * @return {Object} Returns an object containing the value as number and the unit as string.
   */
  Chartist.quantity = function(input) {
    if (typeof input === 'string') {
      var match = (/^(\d+)\s*(.*)$/g).exec(input);
      return {
        value : +match[1],
        unit: match[2] || undefined
      };
    }
    return { value: input };
  };

  /**
   * This is a wrapper around document.querySelector that will return the query if it's already of type Node
   *
   * @memberof Chartist.Core
   * @param {String|Node} query The query to use for selecting a Node or a DOM node that will be returned directly
   * @return {Node}
   */
  Chartist.querySelector = function(query) {
    return query instanceof Node ? query : document.querySelector(query);
  };

  /**
   * Functional style helper to produce array with given length initialized with undefined values
   *
   * @memberof Chartist.Core
   * @param length
   * @return {Array}
   */
  Chartist.times = function(length) {
    return Array.apply(null, new Array(length));
  };

  /**
   * Sum helper to be used in reduce functions
   *
   * @memberof Chartist.Core
   * @param previous
   * @param current
   * @return {*}
   */
  Chartist.sum = function(previous, current) {
    return previous + (current ? current : 0);
  };

  /**
   * Multiply helper to be used in `Array.map` for multiplying each value of an array with a factor.
   *
   * @memberof Chartist.Core
   * @param {Number} factor
   * @returns {Function} Function that can be used in `Array.map` to multiply each value in an array
   */
  Chartist.mapMultiply = function(factor) {
    return function(num) {
      return num * factor;
    };
  };

  /**
   * Add helper to be used in `Array.map` for adding a addend to each value of an array.
   *
   * @memberof Chartist.Core
   * @param {Number} addend
   * @returns {Function} Function that can be used in `Array.map` to add a addend to each value in an array
   */
  Chartist.mapAdd = function(addend) {
    return function(num) {
      return num + addend;
    };
  };

  /**
   * Map for multi dimensional arrays where their nested arrays will be mapped in serial. The output array will have the length of the largest nested array. The callback function is called with variable arguments where each argument is the nested array value (or undefined if there are no more values).
   *
   * @memberof Chartist.Core
   * @param arr
   * @param cb
   * @return {Array}
   */
  Chartist.serialMap = function(arr, cb) {
    var result = [],
        length = Math.max.apply(null, arr.map(function(e) {
          return e.length;
        }));

    Chartist.times(length).forEach(function(e, index) {
      var args = arr.map(function(e) {
        return e[index];
      });

      result[index] = cb.apply(null, args);
    });

    return result;
  };

  /**
   * This helper function can be used to round values with certain precision level after decimal. This is used to prevent rounding errors near float point precision limit.
   *
   * @memberof Chartist.Core
   * @param {Number} value The value that should be rounded with precision
   * @param {Number} [digits] The number of digits after decimal used to do the rounding
   * @returns {number} Rounded value
   */
  Chartist.roundWithPrecision = function(value, digits) {
    var precision = Math.pow(10, digits || Chartist.precision);
    return Math.round(value * precision) / precision;
  };

  /**
   * Precision level used internally in Chartist for rounding. If you require more decimal places you can increase this number.
   *
   * @memberof Chartist.Core
   * @type {number}
   */
  Chartist.precision = 8;

  /**
   * A map with characters to escape for strings to be safely used as attribute values.
   *
   * @memberof Chartist.Core
   * @type {Object}
   */
  Chartist.escapingMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#039;'
  };

  /**
   * This function serializes arbitrary data to a string. In case of data that can't be easily converted to a string, this function will create a wrapper object and serialize the data using JSON.stringify. The outcoming string will always be escaped using Chartist.escapingMap.
   * If called with null or undefined the function will return immediately with null or undefined.
   *
   * @memberof Chartist.Core
   * @param {Number|String|Object} data
   * @return {String}
   */
  Chartist.serialize = function(data) {
    if(data === null || data === undefined) {
      return data;
    } else if(typeof data === 'number') {
      data = ''+data;
    } else if(typeof data === 'object') {
      data = JSON.stringify({data: data});
    }

    return Object.keys(Chartist.escapingMap).reduce(function(result, key) {
      return Chartist.replaceAll(result, key, Chartist.escapingMap[key]);
    }, data);
  };

  /**
   * This function de-serializes a string previously serialized with Chartist.serialize. The string will always be unescaped using Chartist.escapingMap before it's returned. Based on the input value the return type can be Number, String or Object. JSON.parse is used with try / catch to see if the unescaped string can be parsed into an Object and this Object will be returned on success.
   *
   * @memberof Chartist.Core
   * @param {String} data
   * @return {String|Number|Object}
   */
  Chartist.deserialize = function(data) {
    if(typeof data !== 'string') {
      return data;
    }

    data = Object.keys(Chartist.escapingMap).reduce(function(result, key) {
      return Chartist.replaceAll(result, Chartist.escapingMap[key], key);
    }, data);

    try {
      data = JSON.parse(data);
      data = data.data !== undefined ? data.data : data;
    } catch(e) {}

    return data;
  };

  /**
   * Create or reinitialize the SVG element for the chart
   *
   * @memberof Chartist.Core
   * @param {Node} container The containing DOM Node object that will be used to plant the SVG element
   * @param {String} width Set the width of the SVG element. Default is 100%
   * @param {String} height Set the height of the SVG element. Default is 100%
   * @param {String} className Specify a class to be added to the SVG element
   * @return {Object} The created/reinitialized SVG element
   */
  Chartist.createSvg = function (container, width, height, className) {
    var svg;

    width = width || '100%';
    height = height || '100%';

    // Check if there is a previous SVG element in the container that contains the Chartist XML namespace and remove it
    // Since the DOM API does not support namespaces we need to manually search the returned list http://www.w3.org/TR/selectors-api/
    Array.prototype.slice.call(container.querySelectorAll('svg')).filter(function filterChartistSvgObjects(svg) {
      return svg.getAttributeNS(Chartist.namespaces.xmlns, 'ct');
    }).forEach(function removePreviousElement(svg) {
      container.removeChild(svg);
    });

    // Create svg object with width and height or use 100% as default
    svg = new Chartist.Svg('svg').attr({
      width: width,
      height: height
    }).addClass(className).attr({
      style: 'width: ' + width + '; height: ' + height + ';'
    });

    // Add the DOM node to our container
    container.appendChild(svg._node);

    return svg;
  };

  /**
   * Ensures that the data object passed as second argument to the charts is present and correctly initialized.
   *
   * @param  {Object} data The data object that is passed as second argument to the charts
   * @return {Object} The normalized data object
   */
  Chartist.normalizeData = function(data) {
    // Ensure data is present otherwise enforce
    data = data || {series: [], labels: []};
    data.series = data.series || [];
    data.labels = data.labels || [];

    // Check if we should generate some labels based on existing series data
    if (data.series.length > 0 && data.labels.length === 0) {
      var normalized = Chartist.getDataArray(data),
          labelCount;

      // If all elements of the normalized data array are arrays we're dealing with
      // data from Bar or Line charts and we need to find the largest series if they are un-even
      if (normalized.every(function(value) {
        return value instanceof Array;
      })) {
        // Getting the series with the the most elements
        labelCount = Math.max.apply(null, normalized.map(function(series) {
          return series.length;
        }));
      } else {
        // We're dealing with Pie data so we just take the normalized array length
        labelCount = normalized.length;
      }

      // Setting labels to an array with emptry strings using our labelCount estimated above
      data.labels = Chartist.times(labelCount).map(function() {
        return '';
      });
    }
    return data;
  };

  /**
   * Reverses the series, labels and series data arrays.
   *
   * @memberof Chartist.Core
   * @param data
   */
  Chartist.reverseData = function(data) {
    data.labels.reverse();
    data.series.reverse();
    for (var i = 0; i < data.series.length; i++) {
      if(typeof(data.series[i]) === 'object' && data.series[i].data !== undefined) {
        data.series[i].data.reverse();
      } else if(data.series[i] instanceof Array) {
        data.series[i].reverse();
      }
    }
  };

  /**
   * Convert data series into plain array
   *
   * @memberof Chartist.Core
   * @param {Object} data The series object that contains the data to be visualized in the chart
   * @param {Boolean} reverse If true the whole data is reversed by the getDataArray call. This will modify the data object passed as first parameter. The labels as well as the series order is reversed. The whole series data arrays are reversed too.
   * @param {Boolean} multi Create a multi dimensional array from a series data array where a value object with `x` and `y` values will be created.
   * @return {Array} A plain array that contains the data to be visualized in the chart
   */
  Chartist.getDataArray = function (data, reverse, multi) {
    // If the data should be reversed but isn't we need to reverse it
    // If it's reversed but it shouldn't we need to reverse it back
    // That's required to handle data updates correctly and to reflect the responsive configurations
    if(reverse && !data.reversed || !reverse && data.reversed) {
      Chartist.reverseData(data);
      data.reversed = !data.reversed;
    }

    // Recursively walks through nested arrays and convert string values to numbers and objects with value properties
    // to values. Check the tests in data core -> data normalization for a detailed specification of expected values
    function recursiveConvert(value) {
      if(Chartist.isFalseyButZero(value)) {
        // This is a hole in data and we should return undefined
        return undefined;
      } else if((value.data || value) instanceof Array) {
        return (value.data || value).map(recursiveConvert);
      } else if(value.hasOwnProperty('value')) {
        return recursiveConvert(value.value);
      } else {
        if(multi) {
          var multiValue = {};

          // Single series value arrays are assumed to specify the Y-Axis value
          // For example: [1, 2] => [{x: undefined, y: 1}, {x: undefined, y: 2}]
          // If multi is a string then it's assumed that it specified which dimension should be filled as default
          if(typeof multi === 'string') {
            multiValue[multi] = Chartist.getNumberOrUndefined(value);
          } else {
            multiValue.y = Chartist.getNumberOrUndefined(value);
          }

          multiValue.x = value.hasOwnProperty('x') ? Chartist.getNumberOrUndefined(value.x) : multiValue.x;
          multiValue.y = value.hasOwnProperty('y') ? Chartist.getNumberOrUndefined(value.y) : multiValue.y;

          return multiValue;

        } else {
          return Chartist.getNumberOrUndefined(value);
        }
      }
    }

    return data.series.map(recursiveConvert);
  };

  /**
   * Converts a number into a padding object.
   *
   * @memberof Chartist.Core
   * @param {Object|Number} padding
   * @param {Number} [fallback] This value is used to fill missing values if a incomplete padding object was passed
   * @returns {Object} Returns a padding object containing top, right, bottom, left properties filled with the padding number passed in as argument. If the argument is something else than a number (presumably already a correct padding object) then this argument is directly returned.
   */
  Chartist.normalizePadding = function(padding, fallback) {
    fallback = fallback || 0;

    return typeof padding === 'number' ? {
      top: padding,
      right: padding,
      bottom: padding,
      left: padding
    } : {
      top: typeof padding.top === 'number' ? padding.top : fallback,
      right: typeof padding.right === 'number' ? padding.right : fallback,
      bottom: typeof padding.bottom === 'number' ? padding.bottom : fallback,
      left: typeof padding.left === 'number' ? padding.left : fallback
    };
  };

  Chartist.getMetaData = function(series, index) {
    var value = series.data ? series.data[index] : series[index];
    return value ? Chartist.serialize(value.meta) : undefined;
  };

  /**
   * Calculate the order of magnitude for the chart scale
   *
   * @memberof Chartist.Core
   * @param {Number} value The value Range of the chart
   * @return {Number} The order of magnitude
   */
  Chartist.orderOfMagnitude = function (value) {
    return Math.floor(Math.log(Math.abs(value)) / Math.LN10);
  };

  /**
   * Project a data length into screen coordinates (pixels)
   *
   * @memberof Chartist.Core
   * @param {Object} axisLength The svg element for the chart
   * @param {Number} length Single data value from a series array
   * @param {Object} bounds All the values to set the bounds of the chart
   * @return {Number} The projected data length in pixels
   */
  Chartist.projectLength = function (axisLength, length, bounds) {
    return length / bounds.range * axisLength;
  };

  /**
   * Get the height of the area in the chart for the data series
   *
   * @memberof Chartist.Core
   * @param {Object} svg The svg element for the chart
   * @param {Object} options The Object that contains all the optional values for the chart
   * @return {Number} The height of the area in the chart for the data series
   */
  Chartist.getAvailableHeight = function (svg, options) {
    return Math.max((Chartist.quantity(options.height).value || svg.height()) - (options.chartPadding.top +  options.chartPadding.bottom) - options.axisX.offset, 0);
  };

  /**
   * Get highest and lowest value of data array. This Array contains the data that will be visualized in the chart.
   *
   * @memberof Chartist.Core
   * @param {Array} data The array that contains the data to be visualized in the chart
   * @param {Object} options The Object that contains the chart options
   * @param {String} dimension Axis dimension 'x' or 'y' used to access the correct value and high / low configuration
   * @return {Object} An object that contains the highest and lowest value that will be visualized on the chart.
   */
  Chartist.getHighLow = function (data, options, dimension) {
    // TODO: Remove workaround for deprecated global high / low config. Axis high / low configuration is preferred
    options = Chartist.extend({}, options, dimension ? options['axis' + dimension.toUpperCase()] : {});

    var highLow = {
        high: options.high === undefined ? -Number.MAX_VALUE : +options.high,
        low: options.low === undefined ? Number.MAX_VALUE : +options.low
      };
    var findHigh = options.high === undefined;
    var findLow = options.low === undefined;

    // Function to recursively walk through arrays and find highest and lowest number
    function recursiveHighLow(data) {
      if(data === undefined) {
        return undefined;
      } else if(data instanceof Array) {
        for (var i = 0; i < data.length; i++) {
          recursiveHighLow(data[i]);
        }
      } else {
        var value = dimension ? +data[dimension] : +data;

        if (findHigh && value > highLow.high) {
          highLow.high = value;
        }

        if (findLow && value < highLow.low) {
          highLow.low = value;
        }
      }
    }

    // Start to find highest and lowest number recursively
    if(findHigh || findLow) {
      recursiveHighLow(data);
    }

    // Overrides of high / low based on reference value, it will make sure that the invisible reference value is
    // used to generate the chart. This is useful when the chart always needs to contain the position of the
    // invisible reference value in the view i.e. for bipolar scales.
    if (options.referenceValue || options.referenceValue === 0) {
      highLow.high = Math.max(options.referenceValue, highLow.high);
      highLow.low = Math.min(options.referenceValue, highLow.low);
    }

    // If high and low are the same because of misconfiguration or flat data (only the same value) we need
    // to set the high or low to 0 depending on the polarity
    if (highLow.high <= highLow.low) {
      // If both values are 0 we set high to 1
      if (highLow.low === 0) {
        highLow.high = 1;
      } else if (highLow.low < 0) {
        // If we have the same negative value for the bounds we set bounds.high to 0
        highLow.high = 0;
      } else if (highLow.high > 0) {
        // If we have the same positive value for the bounds we set bounds.low to 0
        highLow.low = 0;
      } else {
        // If data array was empty, values are Number.MAX_VALUE and -Number.MAX_VALUE. Set bounds to prevent errors
        highLow.high = 1;
        highLow.low = 0;
      }
    }

    return highLow;
  };

  /**
   * Checks if the value is a valid number or string with a number.
   *
   * @memberof Chartist.Core
   * @param value
   * @returns {Boolean}
   */
  Chartist.isNum = function(value) {
    return !isNaN(value) && isFinite(value);
  };

  /**
   * Returns true on all falsey values except the numeric value 0.
   *
   * @memberof Chartist.Core
   * @param value
   * @returns {boolean}
   */
  Chartist.isFalseyButZero = function(value) {
    return !value && value !== 0;
  };

  /**
   * Returns a number if the passed parameter is a valid number or the function will return undefined. On all other values than a valid number, this function will return undefined.
   *
   * @memberof Chartist.Core
   * @param value
   * @returns {*}
   */
  Chartist.getNumberOrUndefined = function(value) {
    return isNaN(+value) ? undefined : +value;
  };

  /**
   * Gets a value from a dimension `value.x` or `value.y` while returning value directly if it's a valid numeric value. If the value is not numeric and it's falsey this function will return undefined.
   *
   * @param value
   * @param dimension
   * @returns {*}
   */
  Chartist.getMultiValue = function(value, dimension) {
    if(Chartist.isNum(value)) {
      return +value;
    } else if(value) {
      return value[dimension || 'y'] || 0;
    } else {
      return 0;
    }
  };

  /**
   * Pollard Rho Algorithm to find smallest factor of an integer value. There are more efficient algorithms for factorization, but this one is quite efficient and not so complex.
   *
   * @memberof Chartist.Core
   * @param {Number} num An integer number where the smallest factor should be searched for
   * @returns {Number} The smallest integer factor of the parameter num.
   */
  Chartist.rho = function(num) {
    if(num === 1) {
      return num;
    }

    function gcd(p, q) {
      if (p % q === 0) {
        return q;
      } else {
        return gcd(q, p % q);
      }
    }

    function f(x) {
      return x * x + 1;
    }

    var x1 = 2, x2 = 2, divisor;
    if (num % 2 === 0) {
      return 2;
    }

    do {
      x1 = f(x1) % num;
      x2 = f(f(x2)) % num;
      divisor = gcd(Math.abs(x1 - x2), num);
    } while (divisor === 1);

    return divisor;
  };

  /**
   * Calculate and retrieve all the bounds for the chart and return them in one array
   *
   * @memberof Chartist.Core
   * @param {Number} axisLength The length of the Axis used for
   * @param {Object} highLow An object containing a high and low property indicating the value range of the chart.
   * @param {Number} scaleMinSpace The minimum projected length a step should result in
   * @param {Boolean} onlyInteger
   * @return {Object} All the values to set the bounds of the chart
   */
  Chartist.getBounds = function (axisLength, highLow, scaleMinSpace, onlyInteger) {
    var i,
      optimizationCounter = 0,
      newMin,
      newMax,
      bounds = {
        high: highLow.high,
        low: highLow.low
      };

    bounds.valueRange = bounds.high - bounds.low;
    bounds.oom = Chartist.orderOfMagnitude(bounds.valueRange);
    bounds.step = Math.pow(10, bounds.oom);
    bounds.min = Math.floor(bounds.low / bounds.step) * bounds.step;
    bounds.max = Math.ceil(bounds.high / bounds.step) * bounds.step;
    bounds.range = bounds.max - bounds.min;
    bounds.numberOfSteps = Math.round(bounds.range / bounds.step);

    // Optimize scale step by checking if subdivision is possible based on horizontalGridMinSpace
    // If we are already below the scaleMinSpace value we will scale up
    var length = Chartist.projectLength(axisLength, bounds.step, bounds);
    var scaleUp = length < scaleMinSpace;
    var smallestFactor = onlyInteger ? Chartist.rho(bounds.range) : 0;

    // First check if we should only use integer steps and if step 1 is still larger than scaleMinSpace so we can use 1
    if(onlyInteger && Chartist.projectLength(axisLength, 1, bounds) >= scaleMinSpace) {
      bounds.step = 1;
    } else if(onlyInteger && smallestFactor < bounds.step && Chartist.projectLength(axisLength, smallestFactor, bounds) >= scaleMinSpace) {
      // If step 1 was too small, we can try the smallest factor of range
      // If the smallest factor is smaller than the current bounds.step and the projected length of smallest factor
      // is larger than the scaleMinSpace we should go for it.
      bounds.step = smallestFactor;
    } else {
      // Trying to divide or multiply by 2 and find the best step value
      while (true) {
        if (scaleUp && Chartist.projectLength(axisLength, bounds.step, bounds) <= scaleMinSpace) {
          bounds.step *= 2;
        } else if (!scaleUp && Chartist.projectLength(axisLength, bounds.step / 2, bounds) >= scaleMinSpace) {
          bounds.step /= 2;
          if(onlyInteger && bounds.step % 1 !== 0) {
            bounds.step *= 2;
            break;
          }
        } else {
          break;
        }

        if(optimizationCounter++ > 1000) {
          throw new Error('Exceeded maximum number of iterations while optimizing scale step!');
        }
      }
    }

    // step must not be less than EPSILON to create values that can be represented as floating number.
    var EPSILON = 2.221E-16;
    bounds.step = Math.max(bounds.step, EPSILON);

    // Narrow min and max based on new step
    newMin = bounds.min;
    newMax = bounds.max;
    while(newMin + bounds.step <= bounds.low) {
      newMin += bounds.step;
    }
    while(newMax - bounds.step >= bounds.high) {
      newMax -= bounds.step;
    }
    bounds.min = newMin;
    bounds.max = newMax;
    bounds.range = bounds.max - bounds.min;

    var values = [];
    for (i = bounds.min; i <= bounds.max; i += bounds.step) {
      var value = Chartist.roundWithPrecision(i);
      if (value !== values[values.length - 1]) {
        values.push(i);
      }
    }
    bounds.values = values;
    return bounds;
  };

  /**
   * Calculate cartesian coordinates of polar coordinates
   *
   * @memberof Chartist.Core
   * @param {Number} centerX X-axis coordinates of center point of circle segment
   * @param {Number} centerY X-axis coordinates of center point of circle segment
   * @param {Number} radius Radius of circle segment
   * @param {Number} angleInDegrees Angle of circle segment in degrees
   * @return {{x:Number, y:Number}} Coordinates of point on circumference
   */
  Chartist.polarToCartesian = function (centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  /**
   * Initialize chart drawing rectangle (area where chart is drawn) x1,y1 = bottom left / x2,y2 = top right
   *
   * @memberof Chartist.Core
   * @param {Object} svg The svg element for the chart
   * @param {Object} options The Object that contains all the optional values for the chart
   * @param {Number} [fallbackPadding] The fallback padding if partial padding objects are used
   * @return {Object} The chart rectangles coordinates inside the svg element plus the rectangles measurements
   */
  Chartist.createChartRect = function (svg, options, fallbackPadding) {
    var hasAxis = !!(options.axisX || options.axisY);
    var yAxisOffset = hasAxis ? options.axisY.offset : 0;
    var xAxisOffset = hasAxis ? options.axisX.offset : 0;
    // If width or height results in invalid value (including 0) we fallback to the unitless settings or even 0
    var width = svg.width() || Chartist.quantity(options.width).value || 0;
    var height = svg.height() || Chartist.quantity(options.height).value || 0;
    var normalizedPadding = Chartist.normalizePadding(options.chartPadding, fallbackPadding);

    // If settings were to small to cope with offset (legacy) and padding, we'll adjust
    width = Math.max(width, yAxisOffset + normalizedPadding.left + normalizedPadding.right);
    height = Math.max(height, xAxisOffset + normalizedPadding.top + normalizedPadding.bottom);

    var chartRect = {
      padding: normalizedPadding,
      width: function () {
        return this.x2 - this.x1;
      },
      height: function () {
        return this.y1 - this.y2;
      }
    };

    if(hasAxis) {
      if (options.axisX.position === 'start') {
        chartRect.y2 = normalizedPadding.top + xAxisOffset;
        chartRect.y1 = Math.max(height - normalizedPadding.bottom, chartRect.y2 + 1);
      } else {
        chartRect.y2 = normalizedPadding.top;
        chartRect.y1 = Math.max(height - normalizedPadding.bottom - xAxisOffset, chartRect.y2 + 1);
      }

      if (options.axisY.position === 'start') {
        chartRect.x1 = normalizedPadding.left + yAxisOffset;
        chartRect.x2 = Math.max(width - normalizedPadding.right, chartRect.x1 + 1);
      } else {
        chartRect.x1 = normalizedPadding.left;
        chartRect.x2 = Math.max(width - normalizedPadding.right - yAxisOffset, chartRect.x1 + 1);
      }
    } else {
      chartRect.x1 = normalizedPadding.left;
      chartRect.x2 = Math.max(width - normalizedPadding.right, chartRect.x1 + 1);
      chartRect.y2 = normalizedPadding.top;
      chartRect.y1 = Math.max(height - normalizedPadding.bottom, chartRect.y2 + 1);
    }

    return chartRect;
  };

  /**
   * Creates a grid line based on a projected value.
   *
   * @memberof Chartist.Core
   * @param position
   * @param index
   * @param axis
   * @param offset
   * @param length
   * @param group
   * @param classes
   * @param eventEmitter
   */
  Chartist.createGrid = function(position, index, axis, offset, length, group, classes, eventEmitter) {
    var positionalData = {};
    positionalData[axis.units.pos + '1'] = position;
    positionalData[axis.units.pos + '2'] = position;
    positionalData[axis.counterUnits.pos + '1'] = offset;
    positionalData[axis.counterUnits.pos + '2'] = offset + length;

    var gridElement = group.elem('line', positionalData, classes.join(' '));

    // Event for grid draw
    eventEmitter.emit('draw',
      Chartist.extend({
        type: 'grid',
        axis: axis,
        index: index,
        group: group,
        element: gridElement
      }, positionalData)
    );
  };

  /**
   * Creates a label based on a projected value and an axis.
   *
   * @memberof Chartist.Core
   * @param position
   * @param length
   * @param index
   * @param labels
   * @param axis
   * @param axisOffset
   * @param labelOffset
   * @param group
   * @param classes
   * @param useForeignObject
   * @param eventEmitter
   */
  Chartist.createLabel = function(position, length, index, labels, axis, axisOffset, labelOffset, group, classes, useForeignObject, eventEmitter) {
    var labelElement;
    var positionalData = {};

    positionalData[axis.units.pos] = position + labelOffset[axis.units.pos];
    positionalData[axis.counterUnits.pos] = labelOffset[axis.counterUnits.pos];
    positionalData[axis.units.len] = length;
    positionalData[axis.counterUnits.len] = Math.max(0, axisOffset - 10);

    if(useForeignObject) {
      // We need to set width and height explicitly to px as span will not expand with width and height being
      // 100% in all browsers
      var content = '<span class="' + classes.join(' ') + '" style="' +
        axis.units.len + ': ' + Math.round(positionalData[axis.units.len]) + 'px; ' +
        axis.counterUnits.len + ': ' + Math.round(positionalData[axis.counterUnits.len]) + 'px">' +
        labels[index] + '</span>';

      labelElement = group.foreignObject(content, Chartist.extend({
        style: 'overflow: visible;'
      }, positionalData));
    } else {
      labelElement = group.elem('text', positionalData, classes.join(' ')).text(labels[index]);
    }

    eventEmitter.emit('draw', Chartist.extend({
      type: 'label',
      axis: axis,
      index: index,
      group: group,
      element: labelElement,
      text: labels[index]
    }, positionalData));
  };

  /**
   * Helper to read series specific options from options object. It automatically falls back to the global option if
   * there is no option in the series options.
   *
   * @param {Object} series Series object
   * @param {Object} options Chartist options object
   * @param {string} key The options key that should be used to obtain the options
   * @returns {*}
   */
  Chartist.getSeriesOption = function(series, options, key) {
    if(series.name && options.series && options.series[series.name]) {
      var seriesOptions = options.series[series.name];
      return seriesOptions.hasOwnProperty(key) ? seriesOptions[key] : options[key];
    } else {
      return options[key];
    }
  };

  /**
   * Provides options handling functionality with callback for options changes triggered by responsive options and media query matches
   *
   * @memberof Chartist.Core
   * @param {Object} options Options set by user
   * @param {Array} responsiveOptions Optional functions to add responsive behavior to chart
   * @param {Object} eventEmitter The event emitter that will be used to emit the options changed events
   * @return {Object} The consolidated options object from the defaults, base and matching responsive options
   */
  Chartist.optionsProvider = function (options, responsiveOptions, eventEmitter) {
    var baseOptions = Chartist.extend({}, options),
      currentOptions,
      mediaQueryListeners = [],
      i;

    function updateCurrentOptions(mediaEvent) {
      var previousOptions = currentOptions;
      currentOptions = Chartist.extend({}, baseOptions);

      if (responsiveOptions) {
        for (i = 0; i < responsiveOptions.length; i++) {
          var mql = window.matchMedia(responsiveOptions[i][0]);
          if (mql.matches) {
            currentOptions = Chartist.extend(currentOptions, responsiveOptions[i][1]);
          }
        }
      }

      if(eventEmitter && mediaEvent) {
        eventEmitter.emit('optionsChanged', {
          previousOptions: previousOptions,
          currentOptions: currentOptions
        });
      }
    }

    function removeMediaQueryListeners() {
      mediaQueryListeners.forEach(function(mql) {
        mql.removeListener(updateCurrentOptions);
      });
    }

    if (!window.matchMedia) {
      throw 'window.matchMedia not found! Make sure you\'re using a polyfill.';
    } else if (responsiveOptions) {

      for (i = 0; i < responsiveOptions.length; i++) {
        var mql = window.matchMedia(responsiveOptions[i][0]);
        mql.addListener(updateCurrentOptions);
        mediaQueryListeners.push(mql);
      }
    }
    // Execute initially without an event argument so we get the correct options
    updateCurrentOptions();

    return {
      removeMediaQueryListeners: removeMediaQueryListeners,
      getCurrentOptions: function getCurrentOptions() {
        return Chartist.extend({}, currentOptions);
      }
    };
  };


  /**
   * Splits a list of coordinates and associated values into segments. Each returned segment contains a pathCoordinates
   * valueData property describing the segment.
   *
   * With the default options, segments consist of contiguous sets of points that do not have an undefined value. Any
   * points with undefined values are discarded.
   *
   * **Options**
   * The following options are used to determine how segments are formed
   * ```javascript
   * var options = {
   *   // If fillHoles is true, undefined values are simply discarded without creating a new segment. Assuming other options are default, this returns single segment.
   *   fillHoles: false,
   *   // If increasingX is true, the coordinates in all segments have strictly increasing x-values.
   *   increasingX: false
   * };
   * ```
   *
   * @memberof Chartist.Core
   * @param {Array} pathCoordinates List of point coordinates to be split in the form [x1, y1, x2, y2 ... xn, yn]
   * @param {Array} values List of associated point values in the form [v1, v2 .. vn]
   * @param {Object} options Options set by user
   * @return {Array} List of segments, each containing a pathCoordinates and valueData property.
   */
  Chartist.splitIntoSegments = function(pathCoordinates, valueData, options) {
    var defaultOptions = {
      increasingX: false,
      fillHoles: false
    };

    options = Chartist.extend({}, defaultOptions, options);

    var segments = [];
    var hole = true;

    for(var i = 0; i < pathCoordinates.length; i += 2) {
      // If this value is a "hole" we set the hole flag
      if(valueData[i / 2].value === undefined) {
        if(!options.fillHoles) {
          hole = true;
        }
      } else {
        if(options.increasingX && i >= 2 && pathCoordinates[i] <= pathCoordinates[i-2]) {
          // X is not increasing, so we need to make sure we start a new segment
          hole = true;
        }


        // If it's a valid value we need to check if we're coming out of a hole and create a new empty segment
        if(hole) {
          segments.push({
            pathCoordinates: [],
            valueData: []
          });
          // As we have a valid value now, we are not in a "hole" anymore
          hole = false;
        }

        // Add to the segment pathCoordinates and valueData
        segments[segments.length - 1].pathCoordinates.push(pathCoordinates[i], pathCoordinates[i + 1]);
        segments[segments.length - 1].valueData.push(valueData[i / 2]);
      }
    }

    return segments;
  };
}(window, document, Chartist));
;/**
 * Chartist path interpolation functions.
 *
 * @module Chartist.Interpolation
 */
/* global Chartist */
(function(window, document, Chartist) {
  'use strict';

  Chartist.Interpolation = {};

  /**
   * This interpolation function does not smooth the path and the result is only containing lines and no curves.
   *
   * @example
   * var chart = new Chartist.Line('.ct-chart', {
   *   labels: [1, 2, 3, 4, 5],
   *   series: [[1, 2, 8, 1, 7]]
   * }, {
   *   lineSmooth: Chartist.Interpolation.none({
   *     fillHoles: false
   *   })
   * });
   *
   *
   * @memberof Chartist.Interpolation
   * @return {Function}
   */
  Chartist.Interpolation.none = function(options) {
    var defaultOptions = {
      fillHoles: false
    };
    options = Chartist.extend({}, defaultOptions, options);
    return function none(pathCoordinates, valueData) {
      var path = new Chartist.Svg.Path();
      var hole = true;

      for(var i = 0; i < pathCoordinates.length; i += 2) {
        var currX = pathCoordinates[i];
        var currY = pathCoordinates[i + 1];
        var currData = valueData[i / 2];

        if(currData.value !== undefined) {

          if(hole) {
            path.move(currX, currY, false, currData);
          } else {
            path.line(currX, currY, false, currData);
          }

          hole = false;
        } else if(!options.fillHoles) {
          hole = true;
        }
      }

      return path;
    };
  };

  /**
   * Simple smoothing creates horizontal handles that are positioned with a fraction of the length between two data points. You can use the divisor option to specify the amount of smoothing.
   *
   * Simple smoothing can be used instead of `Chartist.Smoothing.cardinal` if you'd like to get rid of the artifacts it produces sometimes. Simple smoothing produces less flowing lines but is accurate by hitting the points and it also doesn't swing below or above the given data point.
   *
   * All smoothing functions within Chartist are factory functions that accept an options parameter. The simple interpolation function accepts one configuration parameter `divisor`, between 1 and ∞, which controls the smoothing characteristics.
   *
   * @example
   * var chart = new Chartist.Line('.ct-chart', {
   *   labels: [1, 2, 3, 4, 5],
   *   series: [[1, 2, 8, 1, 7]]
   * }, {
   *   lineSmooth: Chartist.Interpolation.simple({
   *     divisor: 2,
   *     fillHoles: false
   *   })
   * });
   *
   *
   * @memberof Chartist.Interpolation
   * @param {Object} options The options of the simple interpolation factory function.
   * @return {Function}
   */
  Chartist.Interpolation.simple = function(options) {
    var defaultOptions = {
      divisor: 2,
      fillHoles: false
    };
    options = Chartist.extend({}, defaultOptions, options);

    var d = 1 / Math.max(1, options.divisor);

    return function simple(pathCoordinates, valueData) {
      var path = new Chartist.Svg.Path();
      var prevX, prevY, prevData;

      for(var i = 0; i < pathCoordinates.length; i += 2) {
        var currX = pathCoordinates[i];
        var currY = pathCoordinates[i + 1];
        var length = (currX - prevX) * d;
        var currData = valueData[i / 2];

        if(currData.value !== undefined) {

          if(prevData === undefined) {
            path.move(currX, currY, false, currData);
          } else {
            path.curve(
              prevX + length,
              prevY,
              currX - length,
              currY,
              currX,
              currY,
              false,
              currData
            );
          }

          prevX = currX;
          prevY = currY;
          prevData = currData;
        } else if(!options.fillHoles) {
          prevX = currX = prevData = undefined;
        }
      }

      return path;
    };
  };

  /**
   * Cardinal / Catmull-Rome spline interpolation is the default smoothing function in Chartist. It produces nice results where the splines will always meet the points. It produces some artifacts though when data values are increased or decreased rapidly. The line may not follow a very accurate path and if the line should be accurate this smoothing function does not produce the best results.
   *
   * Cardinal splines can only be created if there are more than two data points. If this is not the case this smoothing will fallback to `Chartist.Smoothing.none`.
   *
   * All smoothing functions within Chartist are factory functions that accept an options parameter. The cardinal interpolation function accepts one configuration parameter `tension`, between 0 and 1, which controls the smoothing intensity.
   *
   * @example
   * var chart = new Chartist.Line('.ct-chart', {
   *   labels: [1, 2, 3, 4, 5],
   *   series: [[1, 2, 8, 1, 7]]
   * }, {
   *   lineSmooth: Chartist.Interpolation.cardinal({
   *     tension: 1,
   *     fillHoles: false
   *   })
   * });
   *
   * @memberof Chartist.Interpolation
   * @param {Object} options The options of the cardinal factory function.
   * @return {Function}
   */
  Chartist.Interpolation.cardinal = function(options) {
    var defaultOptions = {
      tension: 1,
      fillHoles: false
    };

    options = Chartist.extend({}, defaultOptions, options);

    var t = Math.min(1, Math.max(0, options.tension)),
      c = 1 - t;

    return function cardinal(pathCoordinates, valueData) {
      // First we try to split the coordinates into segments
      // This is necessary to treat "holes" in line charts
      var segments = Chartist.splitIntoSegments(pathCoordinates, valueData, {
        fillHoles: options.fillHoles
      });

      if(!segments.length) {
        // If there were no segments return 'Chartist.Interpolation.none'
        return Chartist.Interpolation.none()([]);
      } else if(segments.length > 1) {
        // If the split resulted in more that one segment we need to interpolate each segment individually and join them
        // afterwards together into a single path.
          var paths = [];
        // For each segment we will recurse the cardinal function
        segments.forEach(function(segment) {
          paths.push(cardinal(segment.pathCoordinates, segment.valueData));
        });
        // Join the segment path data into a single path and return
        return Chartist.Svg.Path.join(paths);
      } else {
        // If there was only one segment we can proceed regularly by using pathCoordinates and valueData from the first
        // segment
        pathCoordinates = segments[0].pathCoordinates;
        valueData = segments[0].valueData;

        // If less than two points we need to fallback to no smoothing
        if(pathCoordinates.length <= 4) {
          return Chartist.Interpolation.none()(pathCoordinates, valueData);
        }

        var path = new Chartist.Svg.Path().move(pathCoordinates[0], pathCoordinates[1], false, valueData[0]),
          z;

        for (var i = 0, iLen = pathCoordinates.length; iLen - 2 * !z > i; i += 2) {
          var p = [
            {x: +pathCoordinates[i - 2], y: +pathCoordinates[i - 1]},
            {x: +pathCoordinates[i], y: +pathCoordinates[i + 1]},
            {x: +pathCoordinates[i + 2], y: +pathCoordinates[i + 3]},
            {x: +pathCoordinates[i + 4], y: +pathCoordinates[i + 5]}
          ];
          if (z) {
            if (!i) {
              p[0] = {x: +pathCoordinates[iLen - 2], y: +pathCoordinates[iLen - 1]};
            } else if (iLen - 4 === i) {
              p[3] = {x: +pathCoordinates[0], y: +pathCoordinates[1]};
            } else if (iLen - 2 === i) {
              p[2] = {x: +pathCoordinates[0], y: +pathCoordinates[1]};
              p[3] = {x: +pathCoordinates[2], y: +pathCoordinates[3]};
            }
          } else {
            if (iLen - 4 === i) {
              p[3] = p[2];
            } else if (!i) {
              p[0] = {x: +pathCoordinates[i], y: +pathCoordinates[i + 1]};
            }
          }

          path.curve(
            (t * (-p[0].x + 6 * p[1].x + p[2].x) / 6) + (c * p[2].x),
            (t * (-p[0].y + 6 * p[1].y + p[2].y) / 6) + (c * p[2].y),
            (t * (p[1].x + 6 * p[2].x - p[3].x) / 6) + (c * p[2].x),
            (t * (p[1].y + 6 * p[2].y - p[3].y) / 6) + (c * p[2].y),
            p[2].x,
            p[2].y,
            false,
            valueData[(i + 2) / 2]
          );
        }

        return path;
      }
    };
  };

  /**
   * Monotone Cubic spline interpolation produces a smooth curve which preserves monotonicity. Unlike cardinal splines, the curve will not extend beyond the range of y-values of the original data points.
   *
   * Monotone Cubic splines can only be created if there are more than two data points. If this is not the case this smoothing will fallback to `Chartist.Smoothing.none`.
   *
   * The x-values of subsequent points must be increasing to fit a Monotone Cubic spline. If this condition is not met for a pair of adjacent points, then there will be a break in the curve between those data points.
   *
   * All smoothing functions within Chartist are factory functions that accept an options parameter.
   *
   * @example
   * var chart = new Chartist.Line('.ct-chart', {
   *   labels: [1, 2, 3, 4, 5],
   *   series: [[1, 2, 8, 1, 7]]
   * }, {
   *   lineSmooth: Chartist.Interpolation.monotoneCubic({
   *     fillHoles: false
   *   })
   * });
   *
   * @memberof Chartist.Interpolation
   * @param {Object} options The options of the monotoneCubic factory function.
   * @return {Function}
   */
  Chartist.Interpolation.monotoneCubic = function(options) {
    var defaultOptions = {
      fillHoles: false
    };

    options = Chartist.extend({}, defaultOptions, options);

    return function monotoneCubic(pathCoordinates, valueData) {
      // First we try to split the coordinates into segments
      // This is necessary to treat "holes" in line charts
      var segments = Chartist.splitIntoSegments(pathCoordinates, valueData, {
        fillHoles: options.fillHoles,
        increasingX: true
      });

      if(!segments.length) {
        // If there were no segments return 'Chartist.Interpolation.none'
        return Chartist.Interpolation.none()([]);
      } else if(segments.length > 1) {
        // If the split resulted in more that one segment we need to interpolate each segment individually and join them
        // afterwards together into a single path.
          var paths = [];
        // For each segment we will recurse the monotoneCubic fn function
        segments.forEach(function(segment) {
          paths.push(monotoneCubic(segment.pathCoordinates, segment.valueData));
        });
        // Join the segment path data into a single path and return
        return Chartist.Svg.Path.join(paths);
      } else {
        // If there was only one segment we can proceed regularly by using pathCoordinates and valueData from the first
        // segment
        pathCoordinates = segments[0].pathCoordinates;
        valueData = segments[0].valueData;

        // If less than three points we need to fallback to no smoothing
        if(pathCoordinates.length <= 4) {
          return Chartist.Interpolation.none()(pathCoordinates, valueData);
        }

        var xs = [],
          ys = [],
          i,
          n = pathCoordinates.length / 2,
          ms = [],
          ds = [], dys = [], dxs = [],
          path;

        // Populate x and y coordinates into separate arrays, for readability

        for(i = 0; i < n; i++) {
          xs[i] = pathCoordinates[i * 2];
          ys[i] = pathCoordinates[i * 2 + 1];
        }

        // Calculate deltas and derivative

        for(i = 0; i < n - 1; i++) {
          dys[i] = ys[i + 1] - ys[i];
          dxs[i] = xs[i + 1] - xs[i];
          ds[i] = dys[i] / dxs[i];
        }

        // Determine desired slope (m) at each point using Fritsch-Carlson method
        // See: http://math.stackexchange.com/questions/45218/implementation-of-monotone-cubic-interpolation

        ms[0] = ds[0];
        ms[n - 1] = ds[n - 2];

        for(i = 1; i < n - 1; i++) {
          if(ds[i] === 0 || ds[i - 1] === 0 || (ds[i - 1] > 0) !== (ds[i] > 0)) {
            ms[i] = 0;
          } else {
            ms[i] = 3 * (dxs[i - 1] + dxs[i]) / (
              (2 * dxs[i] + dxs[i - 1]) / ds[i - 1] +
              (dxs[i] + 2 * dxs[i - 1]) / ds[i]);

            if(!isFinite(ms[i])) {
              ms[i] = 0;
            }
          }
        }

        // Now build a path from the slopes

        path = new Chartist.Svg.Path().move(xs[0], ys[0], false, valueData[0]);

        for(i = 0; i < n - 1; i++) {
          path.curve(
            // First control point
            xs[i] + dxs[i] / 3,
            ys[i] + ms[i] * dxs[i] / 3,
            // Second control point
            xs[i + 1] - dxs[i] / 3,
            ys[i + 1] - ms[i + 1] * dxs[i] / 3,
            // End point
            xs[i + 1],
            ys[i + 1],

            false,
            valueData[i + 1]
          );
        }

        return path;
      }
    };
  };

  /**
   * Step interpolation will cause the line chart to move in steps rather than diagonal or smoothed lines. This interpolation will create additional points that will also be drawn when the `showPoint` option is enabled.
   *
   * All smoothing functions within Chartist are factory functions that accept an options parameter. The step interpolation function accepts one configuration parameter `postpone`, that can be `true` or `false`. The default value is `true` and will cause the step to occur where the value actually changes. If a different behaviour is needed where the step is shifted to the left and happens before the actual value, this option can be set to `false`.
   *
   * @example
   * var chart = new Chartist.Line('.ct-chart', {
   *   labels: [1, 2, 3, 4, 5],
   *   series: [[1, 2, 8, 1, 7]]
   * }, {
   *   lineSmooth: Chartist.Interpolation.step({
   *     postpone: true,
   *     fillHoles: false
   *   })
   * });
   *
   * @memberof Chartist.Interpolation
   * @param options
   * @returns {Function}
   */
  Chartist.Interpolation.step = function(options) {
    var defaultOptions = {
      postpone: true,
      fillHoles: false
    };

    options = Chartist.extend({}, defaultOptions, options);

    return function step(pathCoordinates, valueData) {
      var path = new Chartist.Svg.Path();

      var prevX, prevY, prevData;

      for (var i = 0; i < pathCoordinates.length; i += 2) {
        var currX = pathCoordinates[i];
        var currY = pathCoordinates[i + 1];
        var currData = valueData[i / 2];

        // If the current point is also not a hole we can draw the step lines
        if(currData.value !== undefined) {
          if(prevData === undefined) {
            path.move(currX, currY, false, currData);
          } else {
            if(options.postpone) {
              // If postponed we should draw the step line with the value of the previous value
              path.line(currX, prevY, false, prevData);
            } else {
              // If not postponed we should draw the step line with the value of the current value
              path.line(prevX, currY, false, currData);
            }
            // Line to the actual point (this should only be a Y-Axis movement
            path.line(currX, currY, false, currData);
          }

          prevX = currX;
          prevY = currY;
          prevData = currData;
        } else if(!options.fillHoles) {
          prevX = prevY = prevData = undefined;
        }
      }

      return path;
    };
  };

}(window, document, Chartist));
;/**
 * A very basic event module that helps to generate and catch events.
 *
 * @module Chartist.Event
 */
/* global Chartist */
(function (window, document, Chartist) {
  'use strict';

  Chartist.EventEmitter = function () {
    var handlers = [];

    /**
     * Add an event handler for a specific event
     *
     * @memberof Chartist.Event
     * @param {String} event The event name
     * @param {Function} handler A event handler function
     */
    function addEventHandler(event, handler) {
      handlers[event] = handlers[event] || [];
      handlers[event].push(handler);
    }

    /**
     * Remove an event handler of a specific event name or remove all event handlers for a specific event.
     *
     * @memberof Chartist.Event
     * @param {String} event The event name where a specific or all handlers should be removed
     * @param {Function} [handler] An optional event handler function. If specified only this specific handler will be removed and otherwise all handlers are removed.
     */
    function removeEventHandler(event, handler) {
      // Only do something if there are event handlers with this name existing
      if(handlers[event]) {
        // If handler is set we will look for a specific handler and only remove this
        if(handler) {
          handlers[event].splice(handlers[event].indexOf(handler), 1);
          if(handlers[event].length === 0) {
            delete handlers[event];
          }
        } else {
          // If no handler is specified we remove all handlers for this event
          delete handlers[event];
        }
      }
    }

    /**
     * Use this function to emit an event. All handlers that are listening for this event will be triggered with the data parameter.
     *
     * @memberof Chartist.Event
     * @param {String} event The event name that should be triggered
     * @param {*} data Arbitrary data that will be passed to the event handler callback functions
     */
    function emit(event, data) {
      // Only do something if there are event handlers with this name existing
      if(handlers[event]) {
        handlers[event].forEach(function(handler) {
          handler(data);
        });
      }

      // Emit event to star event handlers
      if(handlers['*']) {
        handlers['*'].forEach(function(starHandler) {
          starHandler(event, data);
        });
      }
    }

    return {
      addEventHandler: addEventHandler,
      removeEventHandler: removeEventHandler,
      emit: emit
    };
  };

}(window, document, Chartist));
;/**
 * This module provides some basic prototype inheritance utilities.
 *
 * @module Chartist.Class
 */
/* global Chartist */
(function(window, document, Chartist) {
  'use strict';

  function listToArray(list) {
    var arr = [];
    if (list.length) {
      for (var i = 0; i < list.length; i++) {
        arr.push(list[i]);
      }
    }
    return arr;
  }

  /**
   * Method to extend from current prototype.
   *
   * @memberof Chartist.Class
   * @param {Object} properties The object that serves as definition for the prototype that gets created for the new class. This object should always contain a constructor property that is the desired constructor for the newly created class.
   * @param {Object} [superProtoOverride] By default extens will use the current class prototype or Chartist.class. With this parameter you can specify any super prototype that will be used.
   * @return {Function} Constructor function of the new class
   *
   * @example
   * var Fruit = Class.extend({
     * color: undefined,
     *   sugar: undefined,
     *
     *   constructor: function(color, sugar) {
     *     this.color = color;
     *     this.sugar = sugar;
     *   },
     *
     *   eat: function() {
     *     this.sugar = 0;
     *     return this;
     *   }
     * });
   *
   * var Banana = Fruit.extend({
     *   length: undefined,
     *
     *   constructor: function(length, sugar) {
     *     Banana.super.constructor.call(this, 'Yellow', sugar);
     *     this.length = length;
     *   }
     * });
   *
   * var banana = new Banana(20, 40);
   * console.log('banana instanceof Fruit', banana instanceof Fruit);
   * console.log('Fruit is prototype of banana', Fruit.prototype.isPrototypeOf(banana));
   * console.log('bananas prototype is Fruit', Object.getPrototypeOf(banana) === Fruit.prototype);
   * console.log(banana.sugar);
   * console.log(banana.eat().sugar);
   * console.log(banana.color);
   */
  function extend(properties, superProtoOverride) {
    var superProto = superProtoOverride || this.prototype || Chartist.Class;
    var proto = Object.create(superProto);

    Chartist.Class.cloneDefinitions(proto, properties);

    var constr = function() {
      var fn = proto.constructor || function () {},
        instance;

      // If this is linked to the Chartist namespace the constructor was not called with new
      // To provide a fallback we will instantiate here and return the instance
      instance = this === Chartist ? Object.create(proto) : this;
      fn.apply(instance, Array.prototype.slice.call(arguments, 0));

      // If this constructor was not called with new we need to return the instance
      // This will not harm when the constructor has been called with new as the returned value is ignored
      return instance;
    };

    constr.prototype = proto;
    constr.super = superProto;
    constr.extend = this.extend;

    return constr;
  }

  // Variable argument list clones args > 0 into args[0] and retruns modified args[0]
  function cloneDefinitions() {
    var args = listToArray(arguments);
    var target = args[0];

    args.splice(1, args.length - 1).forEach(function (source) {
      Object.getOwnPropertyNames(source).forEach(function (propName) {
        // If this property already exist in target we delete it first
        delete target[propName];
        // Define the property with the descriptor from source
        Object.defineProperty(target, propName,
          Object.getOwnPropertyDescriptor(source, propName));
      });
    });

    return target;
  }

  Chartist.Class = {
    extend: extend,
    cloneDefinitions: cloneDefinitions
  };

}(window, document, Chartist));
;/**
 * Base for all chart types. The methods in Chartist.Base are inherited to all chart types.
 *
 * @module Chartist.Base
 */
/* global Chartist */
(function(window, document, Chartist) {
  'use strict';

  // TODO: Currently we need to re-draw the chart on window resize. This is usually very bad and will affect performance.
  // This is done because we can't work with relative coordinates when drawing the chart because SVG Path does not
  // work with relative positions yet. We need to check if we can do a viewBox hack to switch to percentage.
  // See http://mozilla.6506.n7.nabble.com/Specyfing-paths-with-percentages-unit-td247474.html
  // Update: can be done using the above method tested here: http://codepen.io/gionkunz/pen/KDvLj
  // The problem is with the label offsets that can't be converted into percentage and affecting the chart container
  /**
   * Updates the chart which currently does a full reconstruction of the SVG DOM
   *
   * @param {Object} [data] Optional data you'd like to set for the chart before it will update. If not specified the update method will use the data that is already configured with the chart.
   * @param {Object} [options] Optional options you'd like to add to the previous options for the chart before it will update. If not specified the update method will use the options that have been already configured with the chart.
   * @param {Boolean} [override] If set to true, the passed options will be used to extend the options that have been configured already. Otherwise the chart default options will be used as the base
   * @memberof Chartist.Base
   */
  function update(data, options, override) {
    if(data) {
      this.data = data;
      // Event for data transformation that allows to manipulate the data before it gets rendered in the charts
      this.eventEmitter.emit('data', {
        type: 'update',
        data: this.data
      });
    }

    if(options) {
      this.options = Chartist.extend({}, override ? this.options : this.defaultOptions, options);

      // If chartist was not initialized yet, we just set the options and leave the rest to the initialization
      // Otherwise we re-create the optionsProvider at this point
      if(!this.initializeTimeoutId) {
        this.optionsProvider.removeMediaQueryListeners();
        this.optionsProvider = Chartist.optionsProvider(this.options, this.responsiveOptions, this.eventEmitter);
      }
    }

    // Only re-created the chart if it has been initialized yet
    if(!this.initializeTimeoutId) {
      this.createChart(this.optionsProvider.getCurrentOptions());
    }

    // Return a reference to the chart object to chain up calls
    return this;
  }

  /**
   * This method can be called on the API object of each chart and will un-register all event listeners that were added to other components. This currently includes a window.resize listener as well as media query listeners if any responsive options have been provided. Use this function if you need to destroy and recreate Chartist charts dynamically.
   *
   * @memberof Chartist.Base
   */
  function detach() {
    // Only detach if initialization already occurred on this chart. If this chart still hasn't initialized (therefore
    // the initializationTimeoutId is still a valid timeout reference, we will clear the timeout
    if(!this.initializeTimeoutId) {
      window.removeEventListener('resize', this.resizeListener);
      this.optionsProvider.removeMediaQueryListeners();
    } else {
      window.clearTimeout(this.initializeTimeoutId);
    }

    return this;
  }

  /**
   * Use this function to register event handlers. The handler callbacks are synchronous and will run in the main thread rather than the event loop.
   *
   * @memberof Chartist.Base
   * @param {String} event Name of the event. Check the examples for supported events.
   * @param {Function} handler The handler function that will be called when an event with the given name was emitted. This function will receive a data argument which contains event data. See the example for more details.
   */
  function on(event, handler) {
    this.eventEmitter.addEventHandler(event, handler);
    return this;
  }

  /**
   * Use this function to un-register event handlers. If the handler function parameter is omitted all handlers for the given event will be un-registered.
   *
   * @memberof Chartist.Base
   * @param {String} event Name of the event for which a handler should be removed
   * @param {Function} [handler] The handler function that that was previously used to register a new event handler. This handler will be removed from the event handler list. If this parameter is omitted then all event handlers for the given event are removed from the list.
   */
  function off(event, handler) {
    this.eventEmitter.removeEventHandler(event, handler);
    return this;
  }

  function initialize() {
    // Add window resize listener that re-creates the chart
    window.addEventListener('resize', this.resizeListener);

    // Obtain current options based on matching media queries (if responsive options are given)
    // This will also register a listener that is re-creating the chart based on media changes
    this.optionsProvider = Chartist.optionsProvider(this.options, this.responsiveOptions, this.eventEmitter);
    // Register options change listener that will trigger a chart update
    this.eventEmitter.addEventHandler('optionsChanged', function() {
      this.update();
    }.bind(this));

    // Before the first chart creation we need to register us with all plugins that are configured
    // Initialize all relevant plugins with our chart object and the plugin options specified in the config
    if(this.options.plugins) {
      this.options.plugins.forEach(function(plugin) {
        if(plugin instanceof Array) {
          plugin[0](this, plugin[1]);
        } else {
          plugin(this);
        }
      }.bind(this));
    }

    // Event for data transformation that allows to manipulate the data before it gets rendered in the charts
    this.eventEmitter.emit('data', {
      type: 'initial',
      data: this.data
    });

    // Create the first chart
    this.createChart(this.optionsProvider.getCurrentOptions());

    // As chart is initialized from the event loop now we can reset our timeout reference
    // This is important if the chart gets initialized on the same element twice
    this.initializeTimeoutId = undefined;
  }

  /**
   * Constructor of chart base class.
   *
   * @param query
   * @param data
   * @param defaultOptions
   * @param options
   * @param responsiveOptions
   * @constructor
   */
  function Base(query, data, defaultOptions, options, responsiveOptions) {
    this.container = Chartist.querySelector(query);
    this.data = data;
    this.defaultOptions = defaultOptions;
    this.options = options;
    this.responsiveOptions = responsiveOptions;
    this.eventEmitter = Chartist.EventEmitter();
    this.supportsForeignObject = Chartist.Svg.isSupported('Extensibility');
    this.supportsAnimations = Chartist.Svg.isSupported('AnimationEventsAttribute');
    this.resizeListener = function resizeListener(){
      this.update();
    }.bind(this);

    if(this.container) {
      // If chartist was already initialized in this container we are detaching all event listeners first
      if(this.container.__chartist__) {
        this.container.__chartist__.detach();
      }

      this.container.__chartist__ = this;
    }

    // Using event loop for first draw to make it possible to register event listeners in the same call stack where
    // the chart was created.
    this.initializeTimeoutId = setTimeout(initialize.bind(this), 0);
  }

  // Creating the chart base class
  Chartist.Base = Chartist.Class.extend({
    constructor: Base,
    optionsProvider: undefined,
    container: undefined,
    svg: undefined,
    eventEmitter: undefined,
    createChart: function() {
      throw new Error('Base chart type can\'t be instantiated!');
    },
    update: update,
    detach: detach,
    on: on,
    off: off,
    version: Chartist.version,
    supportsForeignObject: false
  });

}(window, document, Chartist));
;/**
 * Chartist SVG module for simple SVG DOM abstraction
 *
 * @module Chartist.Svg
 */
/* global Chartist */
(function(window, document, Chartist) {
  'use strict';

  /**
   * Chartist.Svg creates a new SVG object wrapper with a starting element. You can use the wrapper to fluently create sub-elements and modify them.
   *
   * @memberof Chartist.Svg
   * @constructor
   * @param {String|Element} name The name of the SVG element to create or an SVG dom element which should be wrapped into Chartist.Svg
   * @param {Object} attributes An object with properties that will be added as attributes to the SVG element that is created. Attributes with undefined values will not be added.
   * @param {String} className This class or class list will be added to the SVG element
   * @param {Object} parent The parent SVG wrapper object where this newly created wrapper and it's element will be attached to as child
   * @param {Boolean} insertFirst If this param is set to true in conjunction with a parent element the newly created element will be added as first child element in the parent element
   */
  function Svg(name, attributes, className, parent, insertFirst) {
    // If Svg is getting called with an SVG element we just return the wrapper
    if(name instanceof Element) {
      this._node = name;
    } else {
      this._node = document.createElementNS(Chartist.namespaces.svg, name);

      // If this is an SVG element created then custom namespace
      if(name === 'svg') {
        this.attr({
          'xmlns:ct': Chartist.namespaces.ct
        });
      }
    }

    if(attributes) {
      this.attr(attributes);
    }

    if(className) {
      this.addClass(className);
    }

    if(parent) {
      if (insertFirst && parent._node.firstChild) {
        parent._node.insertBefore(this._node, parent._node.firstChild);
      } else {
        parent._node.appendChild(this._node);
      }
    }
  }

  /**
   * Set attributes on the current SVG element of the wrapper you're currently working on.
   *
   * @memberof Chartist.Svg
   * @param {Object|String} attributes An object with properties that will be added as attributes to the SVG element that is created. Attributes with undefined values will not be added. If this parameter is a String then the function is used as a getter and will return the attribute value.
   * @param {String} ns If specified, the attribute will be obtained using getAttributeNs. In order to write namepsaced attributes you can use the namespace:attribute notation within the attributes object.
   * @return {Object|String} The current wrapper object will be returned so it can be used for chaining or the attribute value if used as getter function.
   */
  function attr(attributes, ns) {
    if(typeof attributes === 'string') {
      if(ns) {
        return this._node.getAttributeNS(ns, attributes);
      } else {
        return this._node.getAttribute(attributes);
      }
    }

    Object.keys(attributes).forEach(function(key) {
      // If the attribute value is undefined we can skip this one
      if(attributes[key] === undefined) {
        return;
      }

      if (key.indexOf(':') !== -1) {
        var namespacedAttribute = key.split(':');
        this._node.setAttributeNS(Chartist.namespaces[namespacedAttribute[0]], key, attributes[key]);
      } else {
        this._node.setAttribute(key, attributes[key]);
      }
    }.bind(this));

    return this;
  }

  /**
   * Create a new SVG element whose wrapper object will be selected for further operations. This way you can also create nested groups easily.
   *
   * @memberof Chartist.Svg
   * @param {String} name The name of the SVG element that should be created as child element of the currently selected element wrapper
   * @param {Object} [attributes] An object with properties that will be added as attributes to the SVG element that is created. Attributes with undefined values will not be added.
   * @param {String} [className] This class or class list will be added to the SVG element
   * @param {Boolean} [insertFirst] If this param is set to true in conjunction with a parent element the newly created element will be added as first child element in the parent element
   * @return {Chartist.Svg} Returns a Chartist.Svg wrapper object that can be used to modify the containing SVG data
   */
  function elem(name, attributes, className, insertFirst) {
    return new Chartist.Svg(name, attributes, className, this, insertFirst);
  }

  /**
   * Returns the parent Chartist.SVG wrapper object
   *
   * @memberof Chartist.Svg
   * @return {Chartist.Svg} Returns a Chartist.Svg wrapper around the parent node of the current node. If the parent node is not existing or it's not an SVG node then this function will return null.
   */
  function parent() {
    return this._node.parentNode instanceof SVGElement ? new Chartist.Svg(this._node.parentNode) : null;
  }

  /**
   * This method returns a Chartist.Svg wrapper around the root SVG element of the current tree.
   *
   * @memberof Chartist.Svg
   * @return {Chartist.Svg} The root SVG element wrapped in a Chartist.Svg element
   */
  function root() {
    var node = this._node;
    while(node.nodeName !== 'svg') {
      node = node.parentNode;
    }
    return new Chartist.Svg(node);
  }

  /**
   * Find the first child SVG element of the current element that matches a CSS selector. The returned object is a Chartist.Svg wrapper.
   *
   * @memberof Chartist.Svg
   * @param {String} selector A CSS selector that is used to query for child SVG elements
   * @return {Chartist.Svg} The SVG wrapper for the element found or null if no element was found
   */
  function querySelector(selector) {
    var foundNode = this._node.querySelector(selector);
    return foundNode ? new Chartist.Svg(foundNode) : null;
  }

  /**
   * Find the all child SVG elements of the current element that match a CSS selector. The returned object is a Chartist.Svg.List wrapper.
   *
   * @memberof Chartist.Svg
   * @param {String} selector A CSS selector that is used to query for child SVG elements
   * @return {Chartist.Svg.List} The SVG wrapper list for the element found or null if no element was found
   */
  function querySelectorAll(selector) {
    var foundNodes = this._node.querySelectorAll(selector);
    return foundNodes.length ? new Chartist.Svg.List(foundNodes) : null;
  }

  /**
   * This method creates a foreignObject (see https://developer.mozilla.org/en-US/docs/Web/SVG/Element/foreignObject) that allows to embed HTML content into a SVG graphic. With the help of foreignObjects you can enable the usage of regular HTML elements inside of SVG where they are subject for SVG positioning and transformation but the Browser will use the HTML rendering capabilities for the containing DOM.
   *
   * @memberof Chartist.Svg
   * @param {Node|String} content The DOM Node, or HTML string that will be converted to a DOM Node, that is then placed into and wrapped by the foreignObject
   * @param {String} [attributes] An object with properties that will be added as attributes to the foreignObject element that is created. Attributes with undefined values will not be added.
   * @param {String} [className] This class or class list will be added to the SVG element
   * @param {Boolean} [insertFirst] Specifies if the foreignObject should be inserted as first child
   * @return {Chartist.Svg} New wrapper object that wraps the foreignObject element
   */
  function foreignObject(content, attributes, className, insertFirst) {
    // If content is string then we convert it to DOM
    // TODO: Handle case where content is not a string nor a DOM Node
    if(typeof content === 'string') {
      var container = document.createElement('div');
      container.innerHTML = content;
      content = container.firstChild;
    }

    // Adding namespace to content element
    content.setAttribute('xmlns', Chartist.namespaces.xmlns);

    // Creating the foreignObject without required extension attribute (as described here
    // http://www.w3.org/TR/SVG/extend.html#ForeignObjectElement)
    var fnObj = this.elem('foreignObject', attributes, className, insertFirst);

    // Add content to foreignObjectElement
    fnObj._node.appendChild(content);

    return fnObj;
  }

  /**
   * This method adds a new text element to the current Chartist.Svg wrapper.
   *
   * @memberof Chartist.Svg
   * @param {String} t The text that should be added to the text element that is created
   * @return {Chartist.Svg} The same wrapper object that was used to add the newly created element
   */
  function text(t) {
    this._node.appendChild(document.createTextNode(t));
    return this;
  }

  /**
   * This method will clear all child nodes of the current wrapper object.
   *
   * @memberof Chartist.Svg
   * @return {Chartist.Svg} The same wrapper object that got emptied
   */
  function empty() {
    while (this._node.firstChild) {
      this._node.removeChild(this._node.firstChild);
    }

    return this;
  }

  /**
   * This method will cause the current wrapper to remove itself from its parent wrapper. Use this method if you'd like to get rid of an element in a given DOM structure.
   *
   * @memberof Chartist.Svg
   * @return {Chartist.Svg} The parent wrapper object of the element that got removed
   */
  function remove() {
    this._node.parentNode.removeChild(this._node);
    return this.parent();
  }

  /**
   * This method will replace the element with a new element that can be created outside of the current DOM.
   *
   * @memberof Chartist.Svg
   * @param {Chartist.Svg} newElement The new Chartist.Svg object that will be used to replace the current wrapper object
   * @return {Chartist.Svg} The wrapper of the new element
   */
  function replace(newElement) {
    this._node.parentNode.replaceChild(newElement._node, this._node);
    return newElement;
  }

  /**
   * This method will append an element to the current element as a child.
   *
   * @memberof Chartist.Svg
   * @param {Chartist.Svg} element The Chartist.Svg element that should be added as a child
   * @param {Boolean} [insertFirst] Specifies if the element should be inserted as first child
   * @return {Chartist.Svg} The wrapper of the appended object
   */
  function append(element, insertFirst) {
    if(insertFirst && this._node.firstChild) {
      this._node.insertBefore(element._node, this._node.firstChild);
    } else {
      this._node.appendChild(element._node);
    }

    return this;
  }

  /**
   * Returns an array of class names that are attached to the current wrapper element. This method can not be chained further.
   *
   * @memberof Chartist.Svg
   * @return {Array} A list of classes or an empty array if there are no classes on the current element
   */
  function classes() {
    return this._node.getAttribute('class') ? this._node.getAttribute('class').trim().split(/\s+/) : [];
  }

  /**
   * Adds one or a space separated list of classes to the current element and ensures the classes are only existing once.
   *
   * @memberof Chartist.Svg
   * @param {String} names A white space separated list of class names
   * @return {Chartist.Svg} The wrapper of the current element
   */
  function addClass(names) {
    this._node.setAttribute('class',
      this.classes(this._node)
        .concat(names.trim().split(/\s+/))
        .filter(function(elem, pos, self) {
          return self.indexOf(elem) === pos;
        }).join(' ')
    );

    return this;
  }

  /**
   * Removes one or a space separated list of classes from the current element.
   *
   * @memberof Chartist.Svg
   * @param {String} names A white space separated list of class names
   * @return {Chartist.Svg} The wrapper of the current element
   */
  function removeClass(names) {
    var removedClasses = names.trim().split(/\s+/);

    this._node.setAttribute('class', this.classes(this._node).filter(function(name) {
      return removedClasses.indexOf(name) === -1;
    }).join(' '));

    return this;
  }

  /**
   * Removes all classes from the current element.
   *
   * @memberof Chartist.Svg
   * @return {Chartist.Svg} The wrapper of the current element
   */
  function removeAllClasses() {
    this._node.setAttribute('class', '');

    return this;
  }

  /**
   * Get element height using `getBoundingClientRect`
   *
   * @memberof Chartist.Svg
   * @return {Number} The elements height in pixels
   */
  function height() {
    return this._node.getBoundingClientRect().height;
  }

  /**
   * Get element width using `getBoundingClientRect`
   *
   * @memberof Chartist.Core
   * @return {Number} The elements width in pixels
   */
  function width() {
    return this._node.getBoundingClientRect().width;
  }

  /**
   * The animate function lets you animate the current element with SMIL animations. You can add animations for multiple attributes at the same time by using an animation definition object. This object should contain SMIL animation attributes. Please refer to http://www.w3.org/TR/SVG/animate.html for a detailed specification about the available animation attributes. Additionally an easing property can be passed in the animation definition object. This can be a string with a name of an easing function in `Chartist.Svg.Easing` or an array with four numbers specifying a cubic Bézier curve.
   * **An animations object could look like this:**
   * ```javascript
   * element.animate({
   *   opacity: {
   *     dur: 1000,
   *     from: 0,
   *     to: 1
   *   },
   *   x1: {
   *     dur: '1000ms',
   *     from: 100,
   *     to: 200,
   *     easing: 'easeOutQuart'
   *   },
   *   y1: {
   *     dur: '2s',
   *     from: 0,
   *     to: 100
   *   }
   * });
   * ```
   * **Automatic unit conversion**
   * For the `dur` and the `begin` animate attribute you can also omit a unit by passing a number. The number will automatically be converted to milli seconds.
   * **Guided mode**
   * The default behavior of SMIL animations with offset using the `begin` attribute is that the attribute will keep it's original value until the animation starts. Mostly this behavior is not desired as you'd like to have your element attributes already initialized with the animation `from` value even before the animation starts. Also if you don't specify `fill="freeze"` on an animate element or if you delete the animation after it's done (which is done in guided mode) the attribute will switch back to the initial value. This behavior is also not desired when performing simple one-time animations. For one-time animations you'd want to trigger animations immediately instead of relative to the document begin time. That's why in guided mode Chartist.Svg will also use the `begin` property to schedule a timeout and manually start the animation after the timeout. If you're using multiple SMIL definition objects for an attribute (in an array), guided mode will be disabled for this attribute, even if you explicitly enabled it.
   * If guided mode is enabled the following behavior is added:
   * - Before the animation starts (even when delayed with `begin`) the animated attribute will be set already to the `from` value of the animation
   * - `begin` is explicitly set to `indefinite` so it can be started manually without relying on document begin time (creation)
   * - The animate element will be forced to use `fill="freeze"`
   * - The animation will be triggered with `beginElement()` in a timeout where `begin` of the definition object is interpreted in milli seconds. If no `begin` was specified the timeout is triggered immediately.
   * - After the animation the element attribute value will be set to the `to` value of the animation
   * - The animate element is deleted from the DOM
   *
   * @memberof Chartist.Svg
   * @param {Object} animations An animations object where the property keys are the attributes you'd like to animate. The properties should be objects again that contain the SMIL animation attributes (usually begin, dur, from, and to). The property begin and dur is auto converted (see Automatic unit conversion). You can also schedule multiple animations for the same attribute by passing an Array of SMIL definition objects. Attributes that contain an array of SMIL definition objects will not be executed in guided mode.
   * @param {Boolean} guided Specify if guided mode should be activated for this animation (see Guided mode). If not otherwise specified, guided mode will be activated.
   * @param {Object} eventEmitter If specified, this event emitter will be notified when an animation starts or ends.
   * @return {Chartist.Svg} The current element where the animation was added
   */
  function animate(animations, guided, eventEmitter) {
    if(guided === undefined) {
      guided = true;
    }

    Object.keys(animations).forEach(function createAnimateForAttributes(attribute) {

      function createAnimate(animationDefinition, guided) {
        var attributeProperties = {},
          animate,
          timeout,
          easing;

        // Check if an easing is specified in the definition object and delete it from the object as it will not
        // be part of the animate element attributes.
        if(animationDefinition.easing) {
          // If already an easing Bézier curve array we take it or we lookup a easing array in the Easing object
          easing = animationDefinition.easing instanceof Array ?
            animationDefinition.easing :
            Chartist.Svg.Easing[animationDefinition.easing];
          delete animationDefinition.easing;
        }

        // If numeric dur or begin was provided we assume milli seconds
        animationDefinition.begin = Chartist.ensureUnit(animationDefinition.begin, 'ms');
        animationDefinition.dur = Chartist.ensureUnit(animationDefinition.dur, 'ms');

        if(easing) {
          animationDefinition.calcMode = 'spline';
          animationDefinition.keySplines = easing.join(' ');
          animationDefinition.keyTimes = '0;1';
        }

        // Adding "fill: freeze" if we are in guided mode and set initial attribute values
        if(guided) {
          animationDefinition.fill = 'freeze';
          // Animated property on our element should already be set to the animation from value in guided mode
          attributeProperties[attribute] = animationDefinition.from;
          this.attr(attributeProperties);

          // In guided mode we also set begin to indefinite so we can trigger the start manually and put the begin
          // which needs to be in ms aside
          timeout = Chartist.quantity(animationDefinition.begin || 0).value;
          animationDefinition.begin = 'indefinite';
        }

        animate = this.elem('animate', Chartist.extend({
          attributeName: attribute
        }, animationDefinition));

        if(guided) {
          // If guided we take the value that was put aside in timeout and trigger the animation manually with a timeout
          setTimeout(function() {
            // If beginElement fails we set the animated attribute to the end position and remove the animate element
            // This happens if the SMIL ElementTimeControl interface is not supported or any other problems occured in
            // the browser. (Currently FF 34 does not support animate elements in foreignObjects)
            try {
              animate._node.beginElement();
            } catch(err) {
              // Set animated attribute to current animated value
              attributeProperties[attribute] = animationDefinition.to;
              this.attr(attributeProperties);
              // Remove the animate element as it's no longer required
              animate.remove();
            }
          }.bind(this), timeout);
        }

        if(eventEmitter) {
          animate._node.addEventListener('beginEvent', function handleBeginEvent() {
            eventEmitter.emit('animationBegin', {
              element: this,
              animate: animate._node,
              params: animationDefinition
            });
          }.bind(this));
        }

        animate._node.addEventListener('endEvent', function handleEndEvent() {
          if(eventEmitter) {
            eventEmitter.emit('animationEnd', {
              element: this,
              animate: animate._node,
              params: animationDefinition
            });
          }

          if(guided) {
            // Set animated attribute to current animated value
            attributeProperties[attribute] = animationDefinition.to;
            this.attr(attributeProperties);
            // Remove the animate element as it's no longer required
            animate.remove();
          }
        }.bind(this));
      }

      // If current attribute is an array of definition objects we create an animate for each and disable guided mode
      if(animations[attribute] instanceof Array) {
        animations[attribute].forEach(function(animationDefinition) {
          createAnimate.bind(this)(animationDefinition, false);
        }.bind(this));
      } else {
        createAnimate.bind(this)(animations[attribute], guided);
      }

    }.bind(this));

    return this;
  }

  Chartist.Svg = Chartist.Class.extend({
    constructor: Svg,
    attr: attr,
    elem: elem,
    parent: parent,
    root: root,
    querySelector: querySelector,
    querySelectorAll: querySelectorAll,
    foreignObject: foreignObject,
    text: text,
    empty: empty,
    remove: remove,
    replace: replace,
    append: append,
    classes: classes,
    addClass: addClass,
    removeClass: removeClass,
    removeAllClasses: removeAllClasses,
    height: height,
    width: width,
    animate: animate
  });

  /**
   * This method checks for support of a given SVG feature like Extensibility, SVG-animation or the like. Check http://www.w3.org/TR/SVG11/feature for a detailed list.
   *
   * @memberof Chartist.Svg
   * @param {String} feature The SVG 1.1 feature that should be checked for support.
   * @return {Boolean} True of false if the feature is supported or not
   */
  Chartist.Svg.isSupported = function(feature) {
    return document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#' + feature, '1.1');
  };

  /**
   * This Object contains some standard easing cubic bezier curves. Then can be used with their name in the `Chartist.Svg.animate`. You can also extend the list and use your own name in the `animate` function. Click the show code button to see the available bezier functions.
   *
   * @memberof Chartist.Svg
   */
  var easingCubicBeziers = {
    easeInSine: [0.47, 0, 0.745, 0.715],
    easeOutSine: [0.39, 0.575, 0.565, 1],
    easeInOutSine: [0.445, 0.05, 0.55, 0.95],
    easeInQuad: [0.55, 0.085, 0.68, 0.53],
    easeOutQuad: [0.25, 0.46, 0.45, 0.94],
    easeInOutQuad: [0.455, 0.03, 0.515, 0.955],
    easeInCubic: [0.55, 0.055, 0.675, 0.19],
    easeOutCubic: [0.215, 0.61, 0.355, 1],
    easeInOutCubic: [0.645, 0.045, 0.355, 1],
    easeInQuart: [0.895, 0.03, 0.685, 0.22],
    easeOutQuart: [0.165, 0.84, 0.44, 1],
    easeInOutQuart: [0.77, 0, 0.175, 1],
    easeInQuint: [0.755, 0.05, 0.855, 0.06],
    easeOutQuint: [0.23, 1, 0.32, 1],
    easeInOutQuint: [0.86, 0, 0.07, 1],
    easeInExpo: [0.95, 0.05, 0.795, 0.035],
    easeOutExpo: [0.19, 1, 0.22, 1],
    easeInOutExpo: [1, 0, 0, 1],
    easeInCirc: [0.6, 0.04, 0.98, 0.335],
    easeOutCirc: [0.075, 0.82, 0.165, 1],
    easeInOutCirc: [0.785, 0.135, 0.15, 0.86],
    easeInBack: [0.6, -0.28, 0.735, 0.045],
    easeOutBack: [0.175, 0.885, 0.32, 1.275],
    easeInOutBack: [0.68, -0.55, 0.265, 1.55]
  };

  Chartist.Svg.Easing = easingCubicBeziers;

  /**
   * This helper class is to wrap multiple `Chartist.Svg` elements into a list where you can call the `Chartist.Svg` functions on all elements in the list with one call. This is helpful when you'd like to perform calls with `Chartist.Svg` on multiple elements.
   * An instance of this class is also returned by `Chartist.Svg.querySelectorAll`.
   *
   * @memberof Chartist.Svg
   * @param {Array<Node>|NodeList} nodeList An Array of SVG DOM nodes or a SVG DOM NodeList (as returned by document.querySelectorAll)
   * @constructor
   */
  function SvgList(nodeList) {
    var list = this;

    this.svgElements = [];
    for(var i = 0; i < nodeList.length; i++) {
      this.svgElements.push(new Chartist.Svg(nodeList[i]));
    }

    // Add delegation methods for Chartist.Svg
    Object.keys(Chartist.Svg.prototype).filter(function(prototypeProperty) {
      return ['constructor',
          'parent',
          'querySelector',
          'querySelectorAll',
          'replace',
          'append',
          'classes',
          'height',
          'width'].indexOf(prototypeProperty) === -1;
    }).forEach(function(prototypeProperty) {
      list[prototypeProperty] = function() {
        var args = Array.prototype.slice.call(arguments, 0);
        list.svgElements.forEach(function(element) {
          Chartist.Svg.prototype[prototypeProperty].apply(element, args);
        });
        return list;
      };
    });
  }

  Chartist.Svg.List = Chartist.Class.extend({
    constructor: SvgList
  });
}(window, document, Chartist));
;/**
 * Chartist SVG path module for SVG path description creation and modification.
 *
 * @module Chartist.Svg.Path
 */
/* global Chartist */
(function(window, document, Chartist) {
  'use strict';

  /**
   * Contains the descriptors of supported element types in a SVG path. Currently only move, line and curve are supported.
   *
   * @memberof Chartist.Svg.Path
   * @type {Object}
   */
  var elementDescriptions = {
    m: ['x', 'y'],
    l: ['x', 'y'],
    c: ['x1', 'y1', 'x2', 'y2', 'x', 'y'],
    a: ['rx', 'ry', 'xAr', 'lAf', 'sf', 'x', 'y']
  };

  /**
   * Default options for newly created SVG path objects.
   *
   * @memberof Chartist.Svg.Path
   * @type {Object}
   */
  var defaultOptions = {
    // The accuracy in digit count after the decimal point. This will be used to round numbers in the SVG path. If this option is set to false then no rounding will be performed.
    accuracy: 3
  };

  function element(command, params, pathElements, pos, relative, data) {
    var pathElement = Chartist.extend({
      command: relative ? command.toLowerCase() : command.toUpperCase()
    }, params, data ? { data: data } : {} );

    pathElements.splice(pos, 0, pathElement);
  }

  function forEachParam(pathElements, cb) {
    pathElements.forEach(function(pathElement, pathElementIndex) {
      elementDescriptions[pathElement.command.toLowerCase()].forEach(function(paramName, paramIndex) {
        cb(pathElement, paramName, pathElementIndex, paramIndex, pathElements);
      });
    });
  }

  /**
   * Used to construct a new path object.
   *
   * @memberof Chartist.Svg.Path
   * @param {Boolean} close If set to true then this path will be closed when stringified (with a Z at the end)
   * @param {Object} options Options object that overrides the default objects. See default options for more details.
   * @constructor
   */
  function SvgPath(close, options) {
    this.pathElements = [];
    this.pos = 0;
    this.close = close;
    this.options = Chartist.extend({}, defaultOptions, options);
  }

  /**
   * Gets or sets the current position (cursor) inside of the path. You can move around the cursor freely but limited to 0 or the count of existing elements. All modifications with element functions will insert new elements at the position of this cursor.
   *
   * @memberof Chartist.Svg.Path
   * @param {Number} [pos] If a number is passed then the cursor is set to this position in the path element array.
   * @return {Chartist.Svg.Path|Number} If the position parameter was passed then the return value will be the path object for easy call chaining. If no position parameter was passed then the current position is returned.
   */
  function position(pos) {
    if(pos !== undefined) {
      this.pos = Math.max(0, Math.min(this.pathElements.length, pos));
      return this;
    } else {
      return this.pos;
    }
  }

  /**
   * Removes elements from the path starting at the current position.
   *
   * @memberof Chartist.Svg.Path
   * @param {Number} count Number of path elements that should be removed from the current position.
   * @return {Chartist.Svg.Path} The current path object for easy call chaining.
   */
  function remove(count) {
    this.pathElements.splice(this.pos, count);
    return this;
  }

  /**
   * Use this function to add a new move SVG path element.
   *
   * @memberof Chartist.Svg.Path
   * @param {Number} x The x coordinate for the move element.
   * @param {Number} y The y coordinate for the move element.
   * @param {Boolean} [relative] If set to true the move element will be created with relative coordinates (lowercase letter)
   * @param {*} [data] Any data that should be stored with the element object that will be accessible in pathElement
   * @return {Chartist.Svg.Path} The current path object for easy call chaining.
   */
  function move(x, y, relative, data) {
    element('M', {
      x: +x,
      y: +y
    }, this.pathElements, this.pos++, relative, data);
    return this;
  }

  /**
   * Use this function to add a new line SVG path element.
   *
   * @memberof Chartist.Svg.Path
   * @param {Number} x The x coordinate for the line element.
   * @param {Number} y The y coordinate for the line element.
   * @param {Boolean} [relative] If set to true the line element will be created with relative coordinates (lowercase letter)
   * @param {*} [data] Any data that should be stored with the element object that will be accessible in pathElement
   * @return {Chartist.Svg.Path} The current path object for easy call chaining.
   */
  function line(x, y, relative, data) {
    element('L', {
      x: +x,
      y: +y
    }, this.pathElements, this.pos++, relative, data);
    return this;
  }

  /**
   * Use this function to add a new curve SVG path element.
   *
   * @memberof Chartist.Svg.Path
   * @param {Number} x1 The x coordinate for the first control point of the bezier curve.
   * @param {Number} y1 The y coordinate for the first control point of the bezier curve.
   * @param {Number} x2 The x coordinate for the second control point of the bezier curve.
   * @param {Number} y2 The y coordinate for the second control point of the bezier curve.
   * @param {Number} x The x coordinate for the target point of the curve element.
   * @param {Number} y The y coordinate for the target point of the curve element.
   * @param {Boolean} [relative] If set to true the curve element will be created with relative coordinates (lowercase letter)
   * @param {*} [data] Any data that should be stored with the element object that will be accessible in pathElement
   * @return {Chartist.Svg.Path} The current path object for easy call chaining.
   */
  function curve(x1, y1, x2, y2, x, y, relative, data) {
    element('C', {
      x1: +x1,
      y1: +y1,
      x2: +x2,
      y2: +y2,
      x: +x,
      y: +y
    }, this.pathElements, this.pos++, relative, data);
    return this;
  }

  /**
   * Use this function to add a new non-bezier curve SVG path element.
   *
   * @memberof Chartist.Svg.Path
   * @param {Number} rx The radius to be used for the x-axis of the arc.
   * @param {Number} ry The radius to be used for the y-axis of the arc.
   * @param {Number} xAr Defines the orientation of the arc
   * @param {Number} lAf Large arc flag
   * @param {Number} sf Sweep flag
   * @param {Number} x The x coordinate for the target point of the curve element.
   * @param {Number} y The y coordinate for the target point of the curve element.
   * @param {Boolean} [relative] If set to true the curve element will be created with relative coordinates (lowercase letter)
   * @param {*} [data] Any data that should be stored with the element object that will be accessible in pathElement
   * @return {Chartist.Svg.Path} The current path object for easy call chaining.
   */
  function arc(rx, ry, xAr, lAf, sf, x, y, relative, data) {
    element('A', {
      rx: +rx,
      ry: +ry,
      xAr: +xAr,
      lAf: +lAf,
      sf: +sf,
      x: +x,
      y: +y
    }, this.pathElements, this.pos++, relative, data);
    return this;
  }

  /**
   * Parses an SVG path seen in the d attribute of path elements, and inserts the parsed elements into the existing path object at the current cursor position. Any closing path indicators (Z at the end of the path) will be ignored by the parser as this is provided by the close option in the options of the path object.
   *
   * @memberof Chartist.Svg.Path
   * @param {String} path Any SVG path that contains move (m), line (l) or curve (c) components.
   * @return {Chartist.Svg.Path} The current path object for easy call chaining.
   */
  function parse(path) {
    // Parsing the SVG path string into an array of arrays [['M', '10', '10'], ['L', '100', '100']]
    var chunks = path.replace(/([A-Za-z])([0-9])/g, '$1 $2')
      .replace(/([0-9])([A-Za-z])/g, '$1 $2')
      .split(/[\s,]+/)
      .reduce(function(result, element) {
        if(element.match(/[A-Za-z]/)) {
          result.push([]);
        }

        result[result.length - 1].push(element);
        return result;
      }, []);

    // If this is a closed path we remove the Z at the end because this is determined by the close option
    if(chunks[chunks.length - 1][0].toUpperCase() === 'Z') {
      chunks.pop();
    }

    // Using svgPathElementDescriptions to map raw path arrays into objects that contain the command and the parameters
    // For example {command: 'M', x: '10', y: '10'}
    var elements = chunks.map(function(chunk) {
        var command = chunk.shift(),
          description = elementDescriptions[command.toLowerCase()];

        return Chartist.extend({
          command: command
        }, description.reduce(function(result, paramName, index) {
          result[paramName] = +chunk[index];
          return result;
        }, {}));
      });

    // Preparing a splice call with the elements array as var arg params and insert the parsed elements at the current position
    var spliceArgs = [this.pos, 0];
    Array.prototype.push.apply(spliceArgs, elements);
    Array.prototype.splice.apply(this.pathElements, spliceArgs);
    // Increase the internal position by the element count
    this.pos += elements.length;

    return this;
  }

  /**
   * This function renders to current SVG path object into a final SVG string that can be used in the d attribute of SVG path elements. It uses the accuracy option to round big decimals. If the close parameter was set in the constructor of this path object then a path closing Z will be appended to the output string.
   *
   * @memberof Chartist.Svg.Path
   * @return {String}
   */
  function stringify() {
    var accuracyMultiplier = Math.pow(10, this.options.accuracy);

    return this.pathElements.reduce(function(path, pathElement) {
        var params = elementDescriptions[pathElement.command.toLowerCase()].map(function(paramName) {
          return this.options.accuracy ?
            (Math.round(pathElement[paramName] * accuracyMultiplier) / accuracyMultiplier) :
            pathElement[paramName];
        }.bind(this));

        return path + pathElement.command + params.join(',');
      }.bind(this), '') + (this.close ? 'Z' : '');
  }

  /**
   * Scales all elements in the current SVG path object. There is an individual parameter for each coordinate. Scaling will also be done for control points of curves, affecting the given coordinate.
   *
   * @memberof Chartist.Svg.Path
   * @param {Number} x The number which will be used to scale the x, x1 and x2 of all path elements.
   * @param {Number} y The number which will be used to scale the y, y1 and y2 of all path elements.
   * @return {Chartist.Svg.Path} The current path object for easy call chaining.
   */
  function scale(x, y) {
    forEachParam(this.pathElements, function(pathElement, paramName) {
      pathElement[paramName] *= paramName[0] === 'x' ? x : y;
    });
    return this;
  }

  /**
   * Translates all elements in the current SVG path object. The translation is relative and there is an individual parameter for each coordinate. Translation will also be done for control points of curves, affecting the given coordinate.
   *
   * @memberof Chartist.Svg.Path
   * @param {Number} x The number which will be used to translate the x, x1 and x2 of all path elements.
   * @param {Number} y The number which will be used to translate the y, y1 and y2 of all path elements.
   * @return {Chartist.Svg.Path} The current path object for easy call chaining.
   */
  function translate(x, y) {
    forEachParam(this.pathElements, function(pathElement, paramName) {
      pathElement[paramName] += paramName[0] === 'x' ? x : y;
    });
    return this;
  }

  /**
   * This function will run over all existing path elements and then loop over their attributes. The callback function will be called for every path element attribute that exists in the current path.
   * The method signature of the callback function looks like this:
   * ```javascript
   * function(pathElement, paramName, pathElementIndex, paramIndex, pathElements)
   * ```
   * If something else than undefined is returned by the callback function, this value will be used to replace the old value. This allows you to build custom transformations of path objects that can't be achieved using the basic transformation functions scale and translate.
   *
   * @memberof Chartist.Svg.Path
   * @param {Function} transformFnc The callback function for the transformation. Check the signature in the function description.
   * @return {Chartist.Svg.Path} The current path object for easy call chaining.
   */
  function transform(transformFnc) {
    forEachParam(this.pathElements, function(pathElement, paramName, pathElementIndex, paramIndex, pathElements) {
      var transformed = transformFnc(pathElement, paramName, pathElementIndex, paramIndex, pathElements);
      if(transformed || transformed === 0) {
        pathElement[paramName] = transformed;
      }
    });
    return this;
  }

  /**
   * This function clones a whole path object with all its properties. This is a deep clone and path element objects will also be cloned.
   *
   * @memberof Chartist.Svg.Path
   * @param {Boolean} [close] Optional option to set the new cloned path to closed. If not specified or false, the original path close option will be used.
   * @return {Chartist.Svg.Path}
   */
  function clone(close) {
    var c = new Chartist.Svg.Path(close || this.close);
    c.pos = this.pos;
    c.pathElements = this.pathElements.slice().map(function cloneElements(pathElement) {
      return Chartist.extend({}, pathElement);
    });
    c.options = Chartist.extend({}, this.options);
    return c;
  }

  /**
   * Split a Svg.Path object by a specific command in the path chain. The path chain will be split and an array of newly created paths objects will be returned. This is useful if you'd like to split an SVG path by it's move commands, for example, in order to isolate chunks of drawings.
   *
   * @memberof Chartist.Svg.Path
   * @param {String} command The command you'd like to use to split the path
   * @return {Array<Chartist.Svg.Path>}
   */
  function splitByCommand(command) {
    var split = [
      new Chartist.Svg.Path()
    ];

    this.pathElements.forEach(function(pathElement) {
      if(pathElement.command === command.toUpperCase() && split[split.length - 1].pathElements.length !== 0) {
        split.push(new Chartist.Svg.Path());
      }

      split[split.length - 1].pathElements.push(pathElement);
    });

    return split;
  }

  /**
   * This static function on `Chartist.Svg.Path` is joining multiple paths together into one paths.
   *
   * @memberof Chartist.Svg.Path
   * @param {Array<Chartist.Svg.Path>} paths A list of paths to be joined together. The order is important.
   * @param {boolean} close If the newly created path should be a closed path
   * @param {Object} options Path options for the newly created path.
   * @return {Chartist.Svg.Path}
   */

  function join(paths, close, options) {
    var joinedPath = new Chartist.Svg.Path(close, options);
    for(var i = 0; i < paths.length; i++) {
      var path = paths[i];
      for(var j = 0; j < path.pathElements.length; j++) {
        joinedPath.pathElements.push(path.pathElements[j]);
      }
    }
    return joinedPath;
  }

  Chartist.Svg.Path = Chartist.Class.extend({
    constructor: SvgPath,
    position: position,
    remove: remove,
    move: move,
    line: line,
    curve: curve,
    arc: arc,
    scale: scale,
    translate: translate,
    transform: transform,
    parse: parse,
    stringify: stringify,
    clone: clone,
    splitByCommand: splitByCommand
  });

  Chartist.Svg.Path.elementDescriptions = elementDescriptions;
  Chartist.Svg.Path.join = join;
}(window, document, Chartist));
;/* global Chartist */
(function (window, document, Chartist) {
  'use strict';

  var axisUnits = {
    x: {
      pos: 'x',
      len: 'width',
      dir: 'horizontal',
      rectStart: 'x1',
      rectEnd: 'x2',
      rectOffset: 'y2'
    },
    y: {
      pos: 'y',
      len: 'height',
      dir: 'vertical',
      rectStart: 'y2',
      rectEnd: 'y1',
      rectOffset: 'x1'
    }
  };

  function Axis(units, chartRect, ticks, options) {
    this.units = units;
    this.counterUnits = units === axisUnits.x ? axisUnits.y : axisUnits.x;
    this.chartRect = chartRect;
    this.axisLength = chartRect[units.rectEnd] - chartRect[units.rectStart];
    this.gridOffset = chartRect[units.rectOffset];
    this.ticks = ticks;
    this.options = options;
  }

  function createGridAndLabels(gridGroup, labelGroup, useForeignObject, chartOptions, eventEmitter) {
    var axisOptions = chartOptions['axis' + this.units.pos.toUpperCase()];
    var projectedValues = this.ticks.map(this.projectValue.bind(this));
    var labelValues = this.ticks.map(axisOptions.labelInterpolationFnc);

    projectedValues.forEach(function(projectedValue, index) {
      var labelOffset = {
        x: 0,
        y: 0
      };

      // TODO: Find better solution for solving this problem
      // Calculate how much space we have available for the label
      var labelLength;
      if(projectedValues[index + 1]) {
        // If we still have one label ahead, we can calculate the distance to the next tick / label
        labelLength = projectedValues[index + 1] - projectedValue;
      } else {
        // If we don't have a label ahead and we have only two labels in total, we just take the remaining distance to
        // on the whole axis length. We limit that to a minimum of 30 pixel, so that labels close to the border will
        // still be visible inside of the chart padding.
        labelLength = Math.max(this.axisLength - projectedValue, 30);
      }

      // Skip grid lines and labels where interpolated label values are falsey (execpt for 0)
      if(Chartist.isFalseyButZero(labelValues[index]) && labelValues[index] !== '') {
        return;
      }

      // Transform to global coordinates using the chartRect
      // We also need to set the label offset for the createLabel function
      if(this.units.pos === 'x') {
        projectedValue = this.chartRect.x1 + projectedValue;
        labelOffset.x = chartOptions.axisX.labelOffset.x;

        // If the labels should be positioned in start position (top side for vertical axis) we need to set a
        // different offset as for positioned with end (bottom)
        if(chartOptions.axisX.position === 'start') {
          labelOffset.y = this.chartRect.padding.top + chartOptions.axisX.labelOffset.y + (useForeignObject ? 5 : 20);
        } else {
          labelOffset.y = this.chartRect.y1 + chartOptions.axisX.labelOffset.y + (useForeignObject ? 5 : 20);
        }
      } else {
        projectedValue = this.chartRect.y1 - projectedValue;
        labelOffset.y = chartOptions.axisY.labelOffset.y - (useForeignObject ? labelLength : 0);

        // If the labels should be positioned in start position (left side for horizontal axis) we need to set a
        // different offset as for positioned with end (right side)
        if(chartOptions.axisY.position === 'start') {
          labelOffset.x = useForeignObject ? this.chartRect.padding.left + chartOptions.axisY.labelOffset.x : this.chartRect.x1 - 10;
        } else {
          labelOffset.x = this.chartRect.x2 + chartOptions.axisY.labelOffset.x + 10;
        }
      }

      if(axisOptions.showGrid) {
        Chartist.createGrid(projectedValue, index, this, this.gridOffset, this.chartRect[this.counterUnits.len](), gridGroup, [
          chartOptions.classNames.grid,
          chartOptions.classNames[this.units.dir]
        ], eventEmitter);
      }

      if(axisOptions.showLabel) {
        Chartist.createLabel(projectedValue, labelLength, index, labelValues, this, axisOptions.offset, labelOffset, labelGroup, [
          chartOptions.classNames.label,
          chartOptions.classNames[this.units.dir],
          chartOptions.classNames[axisOptions.position]
        ], useForeignObject, eventEmitter);
      }
    }.bind(this));
  }

  Chartist.Axis = Chartist.Class.extend({
    constructor: Axis,
    createGridAndLabels: createGridAndLabels,
    projectValue: function(value, index, data) {
      throw new Error('Base axis can\'t be instantiated!');
    }
  });

  Chartist.Axis.units = axisUnits;

}(window, document, Chartist));
;/**
 * The auto scale axis uses standard linear scale projection of values along an axis. It uses order of magnitude to find a scale automatically and evaluates the available space in order to find the perfect amount of ticks for your chart.
 * **Options**
 * The following options are used by this axis in addition to the default axis options outlined in the axis configuration of the chart default settings.
 * ```javascript
 * var options = {
 *   // If high is specified then the axis will display values explicitly up to this value and the computed maximum from the data is ignored
 *   high: 100,
 *   // If low is specified then the axis will display values explicitly down to this value and the computed minimum from the data is ignored
 *   low: 0,
 *   // This option will be used when finding the right scale division settings. The amount of ticks on the scale will be determined so that as many ticks as possible will be displayed, while not violating this minimum required space (in pixel).
 *   scaleMinSpace: 20,
 *   // Can be set to true or false. If set to true, the scale will be generated with whole numbers only.
 *   onlyInteger: true,
 *   // The reference value can be used to make sure that this value will always be on the chart. This is especially useful on bipolar charts where the bipolar center always needs to be part of the chart.
 *   referenceValue: 5
 * };
 * ```
 *
 * @module Chartist.AutoScaleAxis
 */
/* global Chartist */
(function (window, document, Chartist) {
  'use strict';

  function AutoScaleAxis(axisUnit, data, chartRect, options) {
    // Usually we calculate highLow based on the data but this can be overriden by a highLow object in the options
    var highLow = options.highLow || Chartist.getHighLow(data.normalized, options, axisUnit.pos);
    this.bounds = Chartist.getBounds(chartRect[axisUnit.rectEnd] - chartRect[axisUnit.rectStart], highLow, options.scaleMinSpace || 20, options.onlyInteger);
    this.range = {
      min: this.bounds.min,
      max: this.bounds.max
    };

    Chartist.AutoScaleAxis.super.constructor.call(this,
      axisUnit,
      chartRect,
      this.bounds.values,
      options);
  }

  function projectValue(value) {
    return this.axisLength * (+Chartist.getMultiValue(value, this.units.pos) - this.bounds.min) / this.bounds.range;
  }

  Chartist.AutoScaleAxis = Chartist.Axis.extend({
    constructor: AutoScaleAxis,
    projectValue: projectValue
  });

}(window, document, Chartist));
;/**
 * The fixed scale axis uses standard linear projection of values along an axis. It makes use of a divisor option to divide the range provided from the minimum and maximum value or the options high and low that will override the computed minimum and maximum.
 * **Options**
 * The following options are used by this axis in addition to the default axis options outlined in the axis configuration of the chart default settings.
 * ```javascript
 * var options = {
 *   // If high is specified then the axis will display values explicitly up to this value and the computed maximum from the data is ignored
 *   high: 100,
 *   // If low is specified then the axis will display values explicitly down to this value and the computed minimum from the data is ignored
 *   low: 0,
 *   // If specified then the value range determined from minimum to maximum (or low and high) will be divided by this number and ticks will be generated at those division points. The default divisor is 1.
 *   divisor: 4,
 *   // If ticks is explicitly set, then the axis will not compute the ticks with the divisor, but directly use the data in ticks to determine at what points on the axis a tick need to be generated.
 *   ticks: [1, 10, 20, 30]
 * };
 * ```
 *
 * @module Chartist.FixedScaleAxis
 */
/* global Chartist */
(function (window, document, Chartist) {
  'use strict';

  function FixedScaleAxis(axisUnit, data, chartRect, options) {
    var highLow = options.highLow || Chartist.getHighLow(data.normalized, options, axisUnit.pos);
    this.divisor = options.divisor || 1;
    this.ticks = options.ticks || Chartist.times(this.divisor).map(function(value, index) {
      return highLow.low + (highLow.high - highLow.low) / this.divisor * index;
    }.bind(this));
    this.ticks.sort(function(a, b) {
      return a - b;
    });
    this.range = {
      min: highLow.low,
      max: highLow.high
    };

    Chartist.FixedScaleAxis.super.constructor.call(this,
      axisUnit,
      chartRect,
      this.ticks,
      options);

    this.stepLength = this.axisLength / this.divisor;
  }

  function projectValue(value) {
    return this.axisLength * (+Chartist.getMultiValue(value, this.units.pos) - this.range.min) / (this.range.max - this.range.min);
  }

  Chartist.FixedScaleAxis = Chartist.Axis.extend({
    constructor: FixedScaleAxis,
    projectValue: projectValue
  });

}(window, document, Chartist));
;/**
 * The step axis for step based charts like bar chart or step based line charts. It uses a fixed amount of ticks that will be equally distributed across the whole axis length. The projection is done using the index of the data value rather than the value itself and therefore it's only useful for distribution purpose.
 * **Options**
 * The following options are used by this axis in addition to the default axis options outlined in the axis configuration of the chart default settings.
 * ```javascript
 * var options = {
 *   // Ticks to be used to distribute across the axis length. As this axis type relies on the index of the value rather than the value, arbitrary data that can be converted to a string can be used as ticks.
 *   ticks: ['One', 'Two', 'Three'],
 *   // If set to true the full width will be used to distribute the values where the last value will be at the maximum of the axis length. If false the spaces between the ticks will be evenly distributed instead.
 *   stretch: true
 * };
 * ```
 *
 * @module Chartist.StepAxis
 */
/* global Chartist */
(function (window, document, Chartist) {
  'use strict';

  function StepAxis(axisUnit, data, chartRect, options) {
    Chartist.StepAxis.super.constructor.call(this,
      axisUnit,
      chartRect,
      options.ticks,
      options);

    this.stepLength = this.axisLength / (options.ticks.length - (options.stretch ? 1 : 0));
  }

  function projectValue(value, index) {
    return this.stepLength * index;
  }

  Chartist.StepAxis = Chartist.Axis.extend({
    constructor: StepAxis,
    projectValue: projectValue
  });

}(window, document, Chartist));
;/**
 * The Chartist line chart can be used to draw Line or Scatter charts. If used in the browser you can access the global `Chartist` namespace where you find the `Line` function as a main entry point.
 *
 * For examples on how to use the line chart please check the examples of the `Chartist.Line` method.
 *
 * @module Chartist.Line
 */
/* global Chartist */
(function(window, document, Chartist){
  'use strict';

  /**
   * Default options in line charts. Expand the code view to see a detailed list of options with comments.
   *
   * @memberof Chartist.Line
   */
  var defaultOptions = {
    // Options for X-Axis
    axisX: {
      // The offset of the labels to the chart area
      offset: 30,
      // Position where labels are placed. Can be set to `start` or `end` where `start` is equivalent to left or top on vertical axis and `end` is equivalent to right or bottom on horizontal axis.
      position: 'end',
      // Allows you to correct label positioning on this axis by positive or negative x and y offset.
      labelOffset: {
        x: 0,
        y: 0
      },
      // If labels should be shown or not
      showLabel: true,
      // If the axis grid should be drawn or not
      showGrid: true,
      // Interpolation function that allows you to intercept the value from the axis label
      labelInterpolationFnc: Chartist.noop,
      // Set the axis type to be used to project values on this axis. If not defined, Chartist.StepAxis will be used for the X-Axis, where the ticks option will be set to the labels in the data and the stretch option will be set to the global fullWidth option. This type can be changed to any axis constructor available (e.g. Chartist.FixedScaleAxis), where all axis options should be present here.
      type: undefined
    },
    // Options for Y-Axis
    axisY: {
      // The offset of the labels to the chart area
      offset: 40,
      // Position where labels are placed. Can be set to `start` or `end` where `start` is equivalent to left or top on vertical axis and `end` is equivalent to right or bottom on horizontal axis.
      position: 'start',
      // Allows you to correct label positioning on this axis by positive or negative x and y offset.
      labelOffset: {
        x: 0,
        y: 0
      },
      // If labels should be shown or not
      showLabel: true,
      // If the axis grid should be drawn or not
      showGrid: true,
      // Interpolation function that allows you to intercept the value from the axis label
      labelInterpolationFnc: Chartist.noop,
      // Set the axis type to be used to project values on this axis. If not defined, Chartist.AutoScaleAxis will be used for the Y-Axis, where the high and low options will be set to the global high and low options. This type can be changed to any axis constructor available (e.g. Chartist.FixedScaleAxis), where all axis options should be present here.
      type: undefined,
      // This value specifies the minimum height in pixel of the scale steps
      scaleMinSpace: 20,
      // Use only integer values (whole numbers) for the scale steps
      onlyInteger: false
    },
    // Specify a fixed width for the chart as a string (i.e. '100px' or '50%')
    width: undefined,
    // Specify a fixed height for the chart as a string (i.e. '100px' or '50%')
    height: undefined,
    // If the line should be drawn or not
    showLine: true,
    // If dots should be drawn or not
    showPoint: true,
    // If the line chart should draw an area
    showArea: false,
    // The base for the area chart that will be used to close the area shape (is normally 0)
    areaBase: 0,
    // Specify if the lines should be smoothed. This value can be true or false where true will result in smoothing using the default smoothing interpolation function Chartist.Interpolation.cardinal and false results in Chartist.Interpolation.none. You can also choose other smoothing / interpolation functions available in the Chartist.Interpolation module, or write your own interpolation function. Check the examples for a brief description.
    lineSmooth: true,
    // Overriding the natural low of the chart allows you to zoom in or limit the charts lowest displayed value
    low: undefined,
    // Overriding the natural high of the chart allows you to zoom in or limit the charts highest displayed value
    high: undefined,
    // Padding of the chart drawing area to the container element and labels as a number or padding object {top: 5, right: 5, bottom: 5, left: 5}
    chartPadding: {
      top: 15,
      right: 15,
      bottom: 5,
      left: 10
    },
    // When set to true, the last grid line on the x-axis is not drawn and the chart elements will expand to the full available width of the chart. For the last label to be drawn correctly you might need to add chart padding or offset the last label with a draw event handler.
    fullWidth: false,
    // If true the whole data is reversed including labels, the series order as well as the whole series data arrays.
    reverseData: false,
    // Override the class names that get used to generate the SVG structure of the chart
    classNames: {
      chart: 'ct-chart-line',
      label: 'ct-label',
      labelGroup: 'ct-labels',
      series: 'ct-series',
      line: 'ct-line',
      point: 'ct-point',
      area: 'ct-area',
      grid: 'ct-grid',
      gridGroup: 'ct-grids',
      vertical: 'ct-vertical',
      horizontal: 'ct-horizontal',
      start: 'ct-start',
      end: 'ct-end'
    }
  };

  /**
   * Creates a new chart
   *
   */
  function createChart(options) {
    this.data = Chartist.normalizeData(this.data);
    var data = {
      raw: this.data,
      normalized: Chartist.getDataArray(this.data, options.reverseData, true)
    };

    // Create new svg object
    this.svg = Chartist.createSvg(this.container, options.width, options.height, options.classNames.chart);
    // Create groups for labels, grid and series
    var gridGroup = this.svg.elem('g').addClass(options.classNames.gridGroup);
    var seriesGroup = this.svg.elem('g');
    var labelGroup = this.svg.elem('g').addClass(options.classNames.labelGroup);

    var chartRect = Chartist.createChartRect(this.svg, options, defaultOptions.padding);
    var axisX, axisY;

    if(options.axisX.type === undefined) {
      axisX = new Chartist.StepAxis(Chartist.Axis.units.x, data, chartRect, Chartist.extend({}, options.axisX, {
        ticks: data.raw.labels,
        stretch: options.fullWidth
      }));
    } else {
      axisX = options.axisX.type.call(Chartist, Chartist.Axis.units.x, data, chartRect, options.axisX);
    }

    if(options.axisY.type === undefined) {
      axisY = new Chartist.AutoScaleAxis(Chartist.Axis.units.y, data, chartRect, Chartist.extend({}, options.axisY, {
        high: Chartist.isNum(options.high) ? options.high : options.axisY.high,
        low: Chartist.isNum(options.low) ? options.low : options.axisY.low
      }));
    } else {
      axisY = options.axisY.type.call(Chartist, Chartist.Axis.units.y, data, chartRect, options.axisY);
    }

    axisX.createGridAndLabels(gridGroup, labelGroup, this.supportsForeignObject, options, this.eventEmitter);
    axisY.createGridAndLabels(gridGroup, labelGroup, this.supportsForeignObject, options, this.eventEmitter);

    // Draw the series
    data.raw.series.forEach(function(series, seriesIndex) {
      var seriesElement = seriesGroup.elem('g');

      // Write attributes to series group element. If series name or meta is undefined the attributes will not be written
      seriesElement.attr({
        'ct:series-name': series.name,
        'ct:meta': Chartist.serialize(series.meta)
      });

      // Use series class from series data or if not set generate one
      seriesElement.addClass([
        options.classNames.series,
        (series.className || options.classNames.series + '-' + Chartist.alphaNumerate(seriesIndex))
      ].join(' '));

      var pathCoordinates = [],
        pathData = [];

      data.normalized[seriesIndex].forEach(function(value, valueIndex) {
        var p = {
          x: chartRect.x1 + axisX.projectValue(value, valueIndex, data.normalized[seriesIndex]),
          y: chartRect.y1 - axisY.projectValue(value, valueIndex, data.normalized[seriesIndex])
        };
        pathCoordinates.push(p.x, p.y);
        pathData.push({
          value: value,
          valueIndex: valueIndex,
          meta: Chartist.getMetaData(series, valueIndex)
        });
      }.bind(this));

      var seriesOptions = {
        lineSmooth: Chartist.getSeriesOption(series, options, 'lineSmooth'),
        showPoint: Chartist.getSeriesOption(series, options, 'showPoint'),
        showLine: Chartist.getSeriesOption(series, options, 'showLine'),
        showArea: Chartist.getSeriesOption(series, options, 'showArea'),
        areaBase: Chartist.getSeriesOption(series, options, 'areaBase')
      };

      var smoothing = typeof seriesOptions.lineSmooth === 'function' ?
        seriesOptions.lineSmooth : (seriesOptions.lineSmooth ? Chartist.Interpolation.monotoneCubic() : Chartist.Interpolation.none());
      // Interpolating path where pathData will be used to annotate each path element so we can trace back the original
      // index, value and meta data
      var path = smoothing(pathCoordinates, pathData);

      // If we should show points we need to create them now to avoid secondary loop
      // Points are drawn from the pathElements returned by the interpolation function
      // Small offset for Firefox to render squares correctly
      if (seriesOptions.showPoint) {

        path.pathElements.forEach(function(pathElement) {
          var point = seriesElement.elem('line', {
            x1: pathElement.x,
            y1: pathElement.y,
            x2: pathElement.x + 0.01,
            y2: pathElement.y
          }, options.classNames.point).attr({
            'ct:value': [pathElement.data.value.x, pathElement.data.value.y].filter(Chartist.isNum).join(','),
            'ct:meta': pathElement.data.meta
          });

          this.eventEmitter.emit('draw', {
            type: 'point',
            value: pathElement.data.value,
            index: pathElement.data.valueIndex,
            meta: pathElement.data.meta,
            series: series,
            seriesIndex: seriesIndex,
            axisX: axisX,
            axisY: axisY,
            group: seriesElement,
            element: point,
            x: pathElement.x,
            y: pathElement.y
          });
        }.bind(this));
      }

      if(seriesOptions.showLine) {
        var line = seriesElement.elem('path', {
          d: path.stringify()
        }, options.classNames.line, true);

        this.eventEmitter.emit('draw', {
          type: 'line',
          values: data.normalized[seriesIndex],
          path: path.clone(),
          chartRect: chartRect,
          index: seriesIndex,
          series: series,
          seriesIndex: seriesIndex,
          axisX: axisX,
          axisY: axisY,
          group: seriesElement,
          element: line
        });
      }

      // Area currently only works with axes that support a range!
      if(seriesOptions.showArea && axisY.range) {
        // If areaBase is outside the chart area (< min or > max) we need to set it respectively so that
        // the area is not drawn outside the chart area.
        var areaBase = Math.max(Math.min(seriesOptions.areaBase, axisY.range.max), axisY.range.min);

        // We project the areaBase value into screen coordinates
        var areaBaseProjected = chartRect.y1 - axisY.projectValue(areaBase);

        // In order to form the area we'll first split the path by move commands so we can chunk it up into segments
        path.splitByCommand('M').filter(function onlySolidSegments(pathSegment) {
          // We filter only "solid" segments that contain more than one point. Otherwise there's no need for an area
          return pathSegment.pathElements.length > 1;
        }).map(function convertToArea(solidPathSegments) {
          // Receiving the filtered solid path segments we can now convert those segments into fill areas
          var firstElement = solidPathSegments.pathElements[0];
          var lastElement = solidPathSegments.pathElements[solidPathSegments.pathElements.length - 1];

          // Cloning the solid path segment with closing option and removing the first move command from the clone
          // We then insert a new move that should start at the area base and draw a straight line up or down
          // at the end of the path we add an additional straight line to the projected area base value
          // As the closing option is set our path will be automatically closed
          return solidPathSegments.clone(true)
            .position(0)
            .remove(1)
            .move(firstElement.x, areaBaseProjected)
            .line(firstElement.x, firstElement.y)
            .position(solidPathSegments.pathElements.length + 1)
            .line(lastElement.x, areaBaseProjected);

        }).forEach(function createArea(areaPath) {
          // For each of our newly created area paths, we'll now create path elements by stringifying our path objects
          // and adding the created DOM elements to the correct series group
          var area = seriesElement.elem('path', {
            d: areaPath.stringify()
          }, options.classNames.area, true);

          // Emit an event for each area that was drawn
          this.eventEmitter.emit('draw', {
            type: 'area',
            values: data.normalized[seriesIndex],
            path: areaPath.clone(),
            series: series,
            seriesIndex: seriesIndex,
            axisX: axisX,
            axisY: axisY,
            chartRect: chartRect,
            index: seriesIndex,
            group: seriesElement,
            element: area
          });
        }.bind(this));
      }
    }.bind(this));

    this.eventEmitter.emit('created', {
      bounds: axisY.bounds,
      chartRect: chartRect,
      axisX: axisX,
      axisY: axisY,
      svg: this.svg,
      options: options
    });
  }

  /**
   * This method creates a new line chart.
   *
   * @memberof Chartist.Line
   * @param {String|Node} query A selector query string or directly a DOM element
   * @param {Object} data The data object that needs to consist of a labels and a series array
   * @param {Object} [options] The options object with options that override the default options. Check the examples for a detailed list.
   * @param {Array} [responsiveOptions] Specify an array of responsive option arrays which are a media query and options object pair => [[mediaQueryString, optionsObject],[more...]]
   * @return {Object} An object which exposes the API for the created chart
   *
   * @example
   * // Create a simple line chart
   * var data = {
   *   // A labels array that can contain any sort of values
   *   labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
   *   // Our series array that contains series objects or in this case series data arrays
   *   series: [
   *     [5, 2, 4, 2, 0]
   *   ]
   * };
   *
   * // As options we currently only set a static size of 300x200 px
   * var options = {
   *   width: '300px',
   *   height: '200px'
   * };
   *
   * // In the global name space Chartist we call the Line function to initialize a line chart. As a first parameter we pass in a selector where we would like to get our chart created. Second parameter is the actual data object and as a third parameter we pass in our options
   * new Chartist.Line('.ct-chart', data, options);
   *
   * @example
   * // Use specific interpolation function with configuration from the Chartist.Interpolation module
   *
   * var chart = new Chartist.Line('.ct-chart', {
   *   labels: [1, 2, 3, 4, 5],
   *   series: [
   *     [1, 1, 8, 1, 7]
   *   ]
   * }, {
   *   lineSmooth: Chartist.Interpolation.cardinal({
   *     tension: 0.2
   *   })
   * });
   *
   * @example
   * // Create a line chart with responsive options
   *
   * var data = {
   *   // A labels array that can contain any sort of values
   *   labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
   *   // Our series array that contains series objects or in this case series data arrays
   *   series: [
   *     [5, 2, 4, 2, 0]
   *   ]
   * };
   *
   * // In addition to the regular options we specify responsive option overrides that will override the default configutation based on the matching media queries.
   * var responsiveOptions = [
   *   ['screen and (min-width: 641px) and (max-width: 1024px)', {
   *     showPoint: false,
   *     axisX: {
   *       labelInterpolationFnc: function(value) {
   *         // Will return Mon, Tue, Wed etc. on medium screens
   *         return value.slice(0, 3);
   *       }
   *     }
   *   }],
   *   ['screen and (max-width: 640px)', {
   *     showLine: false,
   *     axisX: {
   *       labelInterpolationFnc: function(value) {
   *         // Will return M, T, W etc. on small screens
   *         return value[0];
   *       }
   *     }
   *   }]
   * ];
   *
   * new Chartist.Line('.ct-chart', data, null, responsiveOptions);
   *
   */
  function Line(query, data, options, responsiveOptions) {
    Chartist.Line.super.constructor.call(this,
      query,
      data,
      defaultOptions,
      Chartist.extend({}, defaultOptions, options),
      responsiveOptions);
  }

  // Creating line chart type in Chartist namespace
  Chartist.Line = Chartist.Base.extend({
    constructor: Line,
    createChart: createChart
  });

}(window, document, Chartist));
;/**
 * The bar chart module of Chartist that can be used to draw unipolar or bipolar bar and grouped bar charts.
 *
 * @module Chartist.Bar
 */
/* global Chartist */
(function(window, document, Chartist){
  'use strict';

  /**
   * Default options in bar charts. Expand the code view to see a detailed list of options with comments.
   *
   * @memberof Chartist.Bar
   */
  var defaultOptions = {
    // Options for X-Axis
    axisX: {
      // The offset of the chart drawing area to the border of the container
      offset: 30,
      // Position where labels are placed. Can be set to `start` or `end` where `start` is equivalent to left or top on vertical axis and `end` is equivalent to right or bottom on horizontal axis.
      position: 'end',
      // Allows you to correct label positioning on this axis by positive or negative x and y offset.
      labelOffset: {
        x: 0,
        y: 0
      },
      // If labels should be shown or not
      showLabel: true,
      // If the axis grid should be drawn or not
      showGrid: true,
      // Interpolation function that allows you to intercept the value from the axis label
      labelInterpolationFnc: Chartist.noop,
      // This value specifies the minimum width in pixel of the scale steps
      scaleMinSpace: 30,
      // Use only integer values (whole numbers) for the scale steps
      onlyInteger: false
    },
    // Options for Y-Axis
    axisY: {
      // The offset of the chart drawing area to the border of the container
      offset: 40,
      // Position where labels are placed. Can be set to `start` or `end` where `start` is equivalent to left or top on vertical axis and `end` is equivalent to right or bottom on horizontal axis.
      position: 'start',
      // Allows you to correct label positioning on this axis by positive or negative x and y offset.
      labelOffset: {
        x: 0,
        y: 0
      },
      // If labels should be shown or not
      showLabel: true,
      // If the axis grid should be drawn or not
      showGrid: true,
      // Interpolation function that allows you to intercept the value from the axis label
      labelInterpolationFnc: Chartist.noop,
      // This value specifies the minimum height in pixel of the scale steps
      scaleMinSpace: 20,
      // Use only integer values (whole numbers) for the scale steps
      onlyInteger: false
    },
    // Specify a fixed width for the chart as a string (i.e. '100px' or '50%')
    width: undefined,
    // Specify a fixed height for the chart as a string (i.e. '100px' or '50%')
    height: undefined,
    // Overriding the natural high of the chart allows you to zoom in or limit the charts highest displayed value
    high: undefined,
    // Overriding the natural low of the chart allows you to zoom in or limit the charts lowest displayed value
    low: undefined,
    // Padding of the chart drawing area to the container element and labels as a number or padding object {top: 5, right: 5, bottom: 5, left: 5}
    chartPadding: {
      top: 15,
      right: 15,
      bottom: 5,
      left: 10
    },
    // Specify the distance in pixel of bars in a group
    seriesBarDistance: 15,
    // If set to true this property will cause the series bars to be stacked. Check the `stackMode` option for further stacking options.
    stackBars: false,
    // If set to 'overlap' this property will force the stacked bars to draw from the zero line.
    // If set to 'accumulate' this property will form a total for each series point. This will also influence the y-axis and the overall bounds of the chart. In stacked mode the seriesBarDistance property will have no effect.
    stackMode: 'accumulate',
    // Inverts the axes of the bar chart in order to draw a horizontal bar chart. Be aware that you also need to invert your axis settings as the Y Axis will now display the labels and the X Axis the values.
    horizontalBars: false,
    // If set to true then each bar will represent a series and the data array is expected to be a one dimensional array of data values rather than a series array of series. This is useful if the bar chart should represent a profile rather than some data over time.
    distributeSeries: false,
    // If true the whole data is reversed including labels, the series order as well as the whole series data arrays.
    reverseData: false,
    // Override the class names that get used to generate the SVG structure of the chart
    classNames: {
      chart: 'ct-chart-bar',
      horizontalBars: 'ct-horizontal-bars',
      label: 'ct-label',
      labelGroup: 'ct-labels',
      series: 'ct-series',
      bar: 'ct-bar',
      grid: 'ct-grid',
      gridGroup: 'ct-grids',
      vertical: 'ct-vertical',
      horizontal: 'ct-horizontal',
      start: 'ct-start',
      end: 'ct-end'
    }
  };

  /**
   * Creates a new chart
   *
   */
  function createChart(options) {
    this.data = Chartist.normalizeData(this.data);
    var data = {
      raw: this.data,
      normalized: options.distributeSeries ? Chartist.getDataArray(this.data, options.reverseData, options.horizontalBars ? 'x' : 'y').map(function(value) {
        return [value];
      }) : Chartist.getDataArray(this.data, options.reverseData, options.horizontalBars ? 'x' : 'y')
    };

    var highLow;

    // Create new svg element
    this.svg = Chartist.createSvg(
      this.container,
      options.width,
      options.height,
      options.classNames.chart + (options.horizontalBars ? ' ' + options.classNames.horizontalBars : '')
    );

    // Drawing groups in correct order
    var gridGroup = this.svg.elem('g').addClass(options.classNames.gridGroup);
    var seriesGroup = this.svg.elem('g');
    var labelGroup = this.svg.elem('g').addClass(options.classNames.labelGroup);

    if(options.stackBars && data.normalized.length !== 0) {
      // If stacked bars we need to calculate the high low from stacked values from each series
      var serialSums = Chartist.serialMap(data.normalized, function serialSums() {
        return Array.prototype.slice.call(arguments).map(function(value) {
          return value;
        }).reduce(function(prev, curr) {
          return {
            x: prev.x + (curr && curr.x) || 0,
            y: prev.y + (curr && curr.y) || 0
          };
        }, {x: 0, y: 0});
      });

      highLow = Chartist.getHighLow([serialSums], Chartist.extend({}, options, {
        referenceValue: 0
      }), options.horizontalBars ? 'x' : 'y');
    } else {
      highLow = Chartist.getHighLow(data.normalized, Chartist.extend({}, options, {
        referenceValue: 0
      }), options.horizontalBars ? 'x' : 'y');
    }
    // Overrides of high / low from settings
    highLow.high = +options.high || (options.high === 0 ? 0 : highLow.high);
    highLow.low = +options.low || (options.low === 0 ? 0 : highLow.low);

    var chartRect = Chartist.createChartRect(this.svg, options, defaultOptions.padding);

    var valueAxis,
      labelAxisTicks,
      labelAxis,
      axisX,
      axisY;

    // We need to set step count based on some options combinations
    if(options.distributeSeries && options.stackBars) {
      // If distributed series are enabled and bars need to be stacked, we'll only have one bar and therefore should
      // use only the first label for the step axis
      labelAxisTicks = data.raw.labels.slice(0, 1);
    } else {
      // If distributed series are enabled but stacked bars aren't, we should use the series labels
      // If we are drawing a regular bar chart with two dimensional series data, we just use the labels array
      // as the bars are normalized
      labelAxisTicks = data.raw.labels;
    }

    // Set labelAxis and valueAxis based on the horizontalBars setting. This setting will flip the axes if necessary.
    if(options.horizontalBars) {
      if(options.axisX.type === undefined) {
        valueAxis = axisX = new Chartist.AutoScaleAxis(Chartist.Axis.units.x, data, chartRect, Chartist.extend({}, options.axisX, {
          highLow: highLow,
          referenceValue: 0
        }));
      } else {
        valueAxis = axisX = options.axisX.type.call(Chartist, Chartist.Axis.units.x, data, chartRect, Chartist.extend({}, options.axisX, {
          highLow: highLow,
          referenceValue: 0
        }));
      }

      if(options.axisY.type === undefined) {
        labelAxis = axisY = new Chartist.StepAxis(Chartist.Axis.units.y, data, chartRect, {
          ticks: labelAxisTicks
        });
      } else {
        labelAxis = axisY = options.axisY.type.call(Chartist, Chartist.Axis.units.y, data, chartRect, options.axisY);
      }
    } else {
      if(options.axisX.type === undefined) {
        labelAxis = axisX = new Chartist.StepAxis(Chartist.Axis.units.x, data, chartRect, {
          ticks: labelAxisTicks
        });
      } else {
        labelAxis = axisX = options.axisX.type.call(Chartist, Chartist.Axis.units.x, data, chartRect, options.axisX);
      }

      if(options.axisY.type === undefined) {
        valueAxis = axisY = new Chartist.AutoScaleAxis(Chartist.Axis.units.y, data, chartRect, Chartist.extend({}, options.axisY, {
          highLow: highLow,
          referenceValue: 0
        }));
      } else {
        valueAxis = axisY = options.axisY.type.call(Chartist, Chartist.Axis.units.y, data, chartRect, Chartist.extend({}, options.axisY, {
          highLow: highLow,
          referenceValue: 0
        }));
      }
    }

    // Projected 0 point
    var zeroPoint = options.horizontalBars ? (chartRect.x1 + valueAxis.projectValue(0)) : (chartRect.y1 - valueAxis.projectValue(0));
    // Used to track the screen coordinates of stacked bars
    var stackedBarValues = [];

    labelAxis.createGridAndLabels(gridGroup, labelGroup, this.supportsForeignObject, options, this.eventEmitter);
    valueAxis.createGridAndLabels(gridGroup, labelGroup, this.supportsForeignObject, options, this.eventEmitter);

    // Draw the series
    data.raw.series.forEach(function(series, seriesIndex) {
      // Calculating bi-polar value of index for seriesOffset. For i = 0..4 biPol will be -1.5, -0.5, 0.5, 1.5 etc.
      var biPol = seriesIndex - (data.raw.series.length - 1) / 2;
      // Half of the period width between vertical grid lines used to position bars
      var periodHalfLength;
      // Current series SVG element
      var seriesElement;

      // We need to set periodHalfLength based on some options combinations
      if(options.distributeSeries && !options.stackBars) {
        // If distributed series are enabled but stacked bars aren't, we need to use the length of the normaizedData array
        // which is the series count and divide by 2
        periodHalfLength = labelAxis.axisLength / data.normalized.length / 2;
      } else if(options.distributeSeries && options.stackBars) {
        // If distributed series and stacked bars are enabled we'll only get one bar so we should just divide the axis
        // length by 2
        periodHalfLength = labelAxis.axisLength / 2;
      } else {
        // On regular bar charts we should just use the series length
        periodHalfLength = labelAxis.axisLength / data.normalized[seriesIndex].length / 2;
      }

      // Adding the series group to the series element
      seriesElement = seriesGroup.elem('g');

      // Write attributes to series group element. If series name or meta is undefined the attributes will not be written
      seriesElement.attr({
        'ct:series-name': series.name,
        'ct:meta': Chartist.serialize(series.meta)
      });

      // Use series class from series data or if not set generate one
      seriesElement.addClass([
        options.classNames.series,
        (series.className || options.classNames.series + '-' + Chartist.alphaNumerate(seriesIndex))
      ].join(' '));

      data.normalized[seriesIndex].forEach(function(value, valueIndex) {
        var projected,
          bar,
          previousStack,
          labelAxisValueIndex;

        // We need to set labelAxisValueIndex based on some options combinations
        if(options.distributeSeries && !options.stackBars) {
          // If distributed series are enabled but stacked bars aren't, we can use the seriesIndex for later projection
          // on the step axis for label positioning
          labelAxisValueIndex = seriesIndex;
        } else if(options.distributeSeries && options.stackBars) {
          // If distributed series and stacked bars are enabled, we will only get one bar and therefore always use
          // 0 for projection on the label step axis
          labelAxisValueIndex = 0;
        } else {
          // On regular bar charts we just use the value index to project on the label step axis
          labelAxisValueIndex = valueIndex;
        }

        // We need to transform coordinates differently based on the chart layout
        if(options.horizontalBars) {
          projected = {
            x: chartRect.x1 + valueAxis.projectValue(value && value.x ? value.x : 0, valueIndex, data.normalized[seriesIndex]),
            y: chartRect.y1 - labelAxis.projectValue(value && value.y ? value.y : 0, labelAxisValueIndex, data.normalized[seriesIndex])
          };
        } else {
          projected = {
            x: chartRect.x1 + labelAxis.projectValue(value && value.x ? value.x : 0, labelAxisValueIndex, data.normalized[seriesIndex]),
            y: chartRect.y1 - valueAxis.projectValue(value && value.y ? value.y : 0, valueIndex, data.normalized[seriesIndex])
          }
        }

        // If the label axis is a step based axis we will offset the bar into the middle of between two steps using
        // the periodHalfLength value. Also we do arrange the different series so that they align up to each other using
        // the seriesBarDistance. If we don't have a step axis, the bar positions can be chosen freely so we should not
        // add any automated positioning.
        if(labelAxis instanceof Chartist.StepAxis) {
          // Offset to center bar between grid lines, but only if the step axis is not stretched
          if(!labelAxis.options.stretch) {
            projected[labelAxis.units.pos] += periodHalfLength * (options.horizontalBars ? -1 : 1);
          }
          // Using bi-polar offset for multiple series if no stacked bars or series distribution is used
          projected[labelAxis.units.pos] += (options.stackBars || options.distributeSeries) ? 0 : biPol * options.seriesBarDistance * (options.horizontalBars ? -1 : 1);
        }

        // Enter value in stacked bar values used to remember previous screen value for stacking up bars
        previousStack = stackedBarValues[valueIndex] || zeroPoint;
        stackedBarValues[valueIndex] = previousStack - (zeroPoint - projected[labelAxis.counterUnits.pos]);

        // Skip if value is undefined
        if(value === undefined) {
          return;
        }

        var positions = {};
        positions[labelAxis.units.pos + '1'] = projected[labelAxis.units.pos];
        positions[labelAxis.units.pos + '2'] = projected[labelAxis.units.pos];

        if(options.stackBars && (options.stackMode === 'accumulate' || !options.stackMode)) {
          // Stack mode: accumulate (default)
          // If bars are stacked we use the stackedBarValues reference and otherwise base all bars off the zero line
          // We want backwards compatibility, so the expected fallback without the 'stackMode' option
          // to be the original behaviour (accumulate)
          positions[labelAxis.counterUnits.pos + '1'] = previousStack;
          positions[labelAxis.counterUnits.pos + '2'] = stackedBarValues[valueIndex];
        } else {
          // Draw from the zero line normally
          // This is also the same code for Stack mode: overlap
          positions[labelAxis.counterUnits.pos + '1'] = zeroPoint;
          positions[labelAxis.counterUnits.pos + '2'] = projected[labelAxis.counterUnits.pos];
        }

        // Limit x and y so that they are within the chart rect
        positions.x1 = Math.min(Math.max(positions.x1, chartRect.x1), chartRect.x2);
        positions.x2 = Math.min(Math.max(positions.x2, chartRect.x1), chartRect.x2);
        positions.y1 = Math.min(Math.max(positions.y1, chartRect.y2), chartRect.y1);
        positions.y2 = Math.min(Math.max(positions.y2, chartRect.y2), chartRect.y1);

        // Create bar element
        bar = seriesElement.elem('line', positions, options.classNames.bar).attr({
          'ct:value': [value.x, value.y].filter(Chartist.isNum).join(','),
          'ct:meta': Chartist.getMetaData(series, valueIndex)
        });

        this.eventEmitter.emit('draw', Chartist.extend({
          type: 'bar',
          value: value,
          index: valueIndex,
          meta: Chartist.getMetaData(series, valueIndex),
          series: series,
          seriesIndex: seriesIndex,
          axisX: axisX,
          axisY: axisY,
          chartRect: chartRect,
          group: seriesElement,
          element: bar
        }, positions));
      }.bind(this));
    }.bind(this));

    this.eventEmitter.emit('created', {
      bounds: valueAxis.bounds,
      chartRect: chartRect,
      axisX: axisX,
      axisY: axisY,
      svg: this.svg,
      options: options
    });
  }

  /**
   * This method creates a new bar chart and returns API object that you can use for later changes.
   *
   * @memberof Chartist.Bar
   * @param {String|Node} query A selector query string or directly a DOM element
   * @param {Object} data The data object that needs to consist of a labels and a series array
   * @param {Object} [options] The options object with options that override the default options. Check the examples for a detailed list.
   * @param {Array} [responsiveOptions] Specify an array of responsive option arrays which are a media query and options object pair => [[mediaQueryString, optionsObject],[more...]]
   * @return {Object} An object which exposes the API for the created chart
   *
   * @example
   * // Create a simple bar chart
   * var data = {
   *   labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
   *   series: [
   *     [5, 2, 4, 2, 0]
   *   ]
   * };
   *
   * // In the global name space Chartist we call the Bar function to initialize a bar chart. As a first parameter we pass in a selector where we would like to get our chart created and as a second parameter we pass our data object.
   * new Chartist.Bar('.ct-chart', data);
   *
   * @example
   * // This example creates a bipolar grouped bar chart where the boundaries are limitted to -10 and 10
   * new Chartist.Bar('.ct-chart', {
   *   labels: [1, 2, 3, 4, 5, 6, 7],
   *   series: [
   *     [1, 3, 2, -5, -3, 1, -6],
   *     [-5, -2, -4, -1, 2, -3, 1]
   *   ]
   * }, {
   *   seriesBarDistance: 12,
   *   low: -10,
   *   high: 10
   * });
   *
   */
  function Bar(query, data, options, responsiveOptions) {
    Chartist.Bar.super.constructor.call(this,
      query,
      data,
      defaultOptions,
      Chartist.extend({}, defaultOptions, options),
      responsiveOptions);
  }

  // Creating bar chart type in Chartist namespace
  Chartist.Bar = Chartist.Base.extend({
    constructor: Bar,
    createChart: createChart
  });

}(window, document, Chartist));
;/**
 * The pie chart module of Chartist that can be used to draw pie, donut or gauge charts
 *
 * @module Chartist.Pie
 */
/* global Chartist */
(function(window, document, Chartist) {
  'use strict';

  /**
   * Default options in line charts. Expand the code view to see a detailed list of options with comments.
   *
   * @memberof Chartist.Pie
   */
  var defaultOptions = {
    // Specify a fixed width for the chart as a string (i.e. '100px' or '50%')
    width: undefined,
    // Specify a fixed height for the chart as a string (i.e. '100px' or '50%')
    height: undefined,
    // Padding of the chart drawing area to the container element and labels as a number or padding object {top: 5, right: 5, bottom: 5, left: 5}
    chartPadding: 5,
    // Override the class names that are used to generate the SVG structure of the chart
    classNames: {
      chartPie: 'ct-chart-pie',
      chartDonut: 'ct-chart-donut',
      series: 'ct-series',
      slicePie: 'ct-slice-pie',
      sliceDonut: 'ct-slice-donut',
      label: 'ct-label'
    },
    // The start angle of the pie chart in degrees where 0 points north. A higher value offsets the start angle clockwise.
    startAngle: 0,
    // An optional total you can specify. By specifying a total value, the sum of the values in the series must be this total in order to draw a full pie. You can use this parameter to draw only parts of a pie or gauge charts.
    total: undefined,
    // If specified the donut CSS classes will be used and strokes will be drawn instead of pie slices.
    donut: false,
    // Specify the donut stroke width, currently done in javascript for convenience. May move to CSS styles in the future.
    // This option can be set as number or string to specify a relative width (i.e. 100 or '30%').
    donutWidth: 60,
    // If a label should be shown or not
    showLabel: true,
    // Label position offset from the standard position which is half distance of the radius. This value can be either positive or negative. Positive values will position the label away from the center.
    labelOffset: 0,
    // This option can be set to 'inside', 'outside' or 'center'. Positioned with 'inside' the labels will be placed on half the distance of the radius to the border of the Pie by respecting the 'labelOffset'. The 'outside' option will place the labels at the border of the pie and 'center' will place the labels in the absolute center point of the chart. The 'center' option only makes sense in conjunction with the 'labelOffset' option.
    labelPosition: 'inside',
    // An interpolation function for the label value
    labelInterpolationFnc: Chartist.noop,
    // Label direction can be 'neutral', 'explode' or 'implode'. The labels anchor will be positioned based on those settings as well as the fact if the labels are on the right or left side of the center of the chart. Usually explode is useful when labels are positioned far away from the center.
    labelDirection: 'neutral',
    // If true the whole data is reversed including labels, the series order as well as the whole series data arrays.
    reverseData: false,
    // If true empty values will be ignored to avoid drawing unncessary slices and labels
    ignoreEmptyValues: false
  };

  /**
   * Determines SVG anchor position based on direction and center parameter
   *
   * @param center
   * @param label
   * @param direction
   * @return {string}
   */
  function determineAnchorPosition(center, label, direction) {
    var toTheRight = label.x > center.x;

    if(toTheRight && direction === 'explode' ||
      !toTheRight && direction === 'implode') {
      return 'start';
    } else if(toTheRight && direction === 'implode' ||
      !toTheRight && direction === 'explode') {
      return 'end';
    } else {
      return 'middle';
    }
  }

  /**
   * Creates the pie chart
   *
   * @param options
   */
  function createChart(options) {
    this.data = Chartist.normalizeData(this.data);
    var seriesGroups = [],
      labelsGroup,
      chartRect,
      radius,
      labelRadius,
      totalDataSum,
      startAngle = options.startAngle,
      dataArray = Chartist.getDataArray(this.data, options.reverseData);

    // Create SVG.js draw
    this.svg = Chartist.createSvg(this.container, options.width, options.height,options.donut ? options.classNames.chartDonut : options.classNames.chartPie);
    // Calculate charting rect
    chartRect = Chartist.createChartRect(this.svg, options, defaultOptions.padding);
    // Get biggest circle radius possible within chartRect
    radius = Math.min(chartRect.width() / 2, chartRect.height() / 2);
    // Calculate total of all series to get reference value or use total reference from optional options
    totalDataSum = options.total || dataArray.reduce(function(previousValue, currentValue) {
      return previousValue + currentValue;
    }, 0);

    var donutWidth = Chartist.quantity(options.donutWidth);
    if (donutWidth.unit === '%') {
      donutWidth.value *= radius / 100;
    }

    // If this is a donut chart we need to adjust our radius to enable strokes to be drawn inside
    // Unfortunately this is not possible with the current SVG Spec
    // See this proposal for more details: http://lists.w3.org/Archives/Public/www-svg/2003Oct/0000.html
    radius -= options.donut ? donutWidth.value / 2  : 0;

    // If labelPosition is set to `outside` or a donut chart is drawn then the label position is at the radius,
    // if regular pie chart it's half of the radius
    if(options.labelPosition === 'outside' || options.donut) {
      labelRadius = radius;
    } else if(options.labelPosition === 'center') {
      // If labelPosition is center we start with 0 and will later wait for the labelOffset
      labelRadius = 0;
    } else {
      // Default option is 'inside' where we use half the radius so the label will be placed in the center of the pie
      // slice
      labelRadius = radius / 2;
    }
    // Add the offset to the labelRadius where a negative offset means closed to the center of the chart
    labelRadius += options.labelOffset;

    // Calculate end angle based on total sum and current data value and offset with padding
    var center = {
      x: chartRect.x1 + chartRect.width() / 2,
      y: chartRect.y2 + chartRect.height() / 2
    };

    // Check if there is only one non-zero value in the series array.
    var hasSingleValInSeries = this.data.series.filter(function(val) {
      return val.hasOwnProperty('value') ? val.value !== 0 : val !== 0;
    }).length === 1;

    //if we need to show labels we create the label group now
    if(options.showLabel) {
      labelsGroup = this.svg.elem('g', null, null, true);
    }

    // Draw the series
    // initialize series groups
    for (var i = 0; i < this.data.series.length; i++) {
      // If current value is zero and we are ignoring empty values then skip to next value
      if (dataArray[i] === 0 && options.ignoreEmptyValues) continue;

      var series = this.data.series[i];
      seriesGroups[i] = this.svg.elem('g', null, null, true);

      // If the series is an object and contains a name or meta data we add a custom attribute
      seriesGroups[i].attr({
        'ct:series-name': series.name
      });

      // Use series class from series data or if not set generate one
      seriesGroups[i].addClass([
        options.classNames.series,
        (series.className || options.classNames.series + '-' + Chartist.alphaNumerate(i))
      ].join(' '));

      var endAngle = startAngle + dataArray[i] / totalDataSum * 360;

      // Use slight offset so there are no transparent hairline issues
      var overlappigStartAngle = Math.max(0, startAngle - (i === 0 || hasSingleValInSeries ? 0 : 0.2));

      // If we need to draw the arc for all 360 degrees we need to add a hack where we close the circle
      // with Z and use 359.99 degrees
      if(endAngle - overlappigStartAngle >= 359.99) {
        endAngle = overlappigStartAngle + 359.99;
      }

      var start = Chartist.polarToCartesian(center.x, center.y, radius, overlappigStartAngle),
        end = Chartist.polarToCartesian(center.x, center.y, radius, endAngle);

      // Create a new path element for the pie chart. If this isn't a donut chart we should close the path for a correct stroke
      var path = new Chartist.Svg.Path(!options.donut)
        .move(end.x, end.y)
        .arc(radius, radius, 0, endAngle - startAngle > 180, 0, start.x, start.y);

      // If regular pie chart (no donut) we add a line to the center of the circle for completing the pie
      if(!options.donut) {
        path.line(center.x, center.y);
      }

      // Create the SVG path
      // If this is a donut chart we add the donut class, otherwise just a regular slice
      var pathElement = seriesGroups[i].elem('path', {
        d: path.stringify()
      }, options.donut ? options.classNames.sliceDonut : options.classNames.slicePie);

      // Adding the pie series value to the path
      pathElement.attr({
        'ct:value': dataArray[i],
        'ct:meta': Chartist.serialize(series.meta)
      });

      // If this is a donut, we add the stroke-width as style attribute
      if(options.donut) {
        pathElement.attr({
          'style': 'stroke-width: ' + donutWidth.value + 'px'
        });
      }

      // Fire off draw event
      this.eventEmitter.emit('draw', {
        type: 'slice',
        value: dataArray[i],
        totalDataSum: totalDataSum,
        index: i,
        meta: series.meta,
        series: series,
        group: seriesGroups[i],
        element: pathElement,
        path: path.clone(),
        center: center,
        radius: radius,
        startAngle: startAngle,
        endAngle: endAngle
      });

      // If we need to show labels we need to add the label for this slice now
      if(options.showLabel) {
        // Position at the labelRadius distance from center and between start and end angle
        var labelPosition = Chartist.polarToCartesian(center.x, center.y, labelRadius, startAngle + (endAngle - startAngle) / 2),
          interpolatedValue = options.labelInterpolationFnc(this.data.labels && !Chartist.isFalseyButZero(this.data.labels[i]) ? this.data.labels[i] : dataArray[i], i);

        if(interpolatedValue || interpolatedValue === 0) {
          var labelElement = labelsGroup.elem('text', {
            dx: labelPosition.x,
            dy: labelPosition.y,
            'text-anchor': determineAnchorPosition(center, labelPosition, options.labelDirection)
          }, options.classNames.label).text('' + interpolatedValue);

          // Fire off draw event
          this.eventEmitter.emit('draw', {
            type: 'label',
            index: i,
            group: labelsGroup,
            element: labelElement,
            text: '' + interpolatedValue,
            x: labelPosition.x,
            y: labelPosition.y
          });
        }
      }

      // Set next startAngle to current endAngle.
      // (except for last slice)
      startAngle = endAngle;
    }

    this.eventEmitter.emit('created', {
      chartRect: chartRect,
      svg: this.svg,
      options: options
    });
  }

  /**
   * This method creates a new pie chart and returns an object that can be used to redraw the chart.
   *
   * @memberof Chartist.Pie
   * @param {String|Node} query A selector query string or directly a DOM element
   * @param {Object} data The data object in the pie chart needs to have a series property with a one dimensional data array. The values will be normalized against each other and don't necessarily need to be in percentage. The series property can also be an array of value objects that contain a value property and a className property to override the CSS class name for the series group.
   * @param {Object} [options] The options object with options that override the default options. Check the examples for a detailed list.
   * @param {Array} [responsiveOptions] Specify an array of responsive option arrays which are a media query and options object pair => [[mediaQueryString, optionsObject],[more...]]
   * @return {Object} An object with a version and an update method to manually redraw the chart
   *
   * @example
   * // Simple pie chart example with four series
   * new Chartist.Pie('.ct-chart', {
   *   series: [10, 2, 4, 3]
   * });
   *
   * @example
   * // Drawing a donut chart
   * new Chartist.Pie('.ct-chart', {
   *   series: [10, 2, 4, 3]
   * }, {
   *   donut: true
   * });
   *
   * @example
   * // Using donut, startAngle and total to draw a gauge chart
   * new Chartist.Pie('.ct-chart', {
   *   series: [20, 10, 30, 40]
   * }, {
   *   donut: true,
   *   donutWidth: 20,
   *   startAngle: 270,
   *   total: 200
   * });
   *
   * @example
   * // Drawing a pie chart with padding and labels that are outside the pie
   * new Chartist.Pie('.ct-chart', {
   *   series: [20, 10, 30, 40]
   * }, {
   *   chartPadding: 30,
   *   labelOffset: 50,
   *   labelDirection: 'explode'
   * });
   *
   * @example
   * // Overriding the class names for individual series as well as a name and meta data.
   * // The name will be written as ct:series-name attribute and the meta data will be serialized and written
   * // to a ct:meta attribute.
   * new Chartist.Pie('.ct-chart', {
   *   series: [{
   *     value: 20,
   *     name: 'Series 1',
   *     className: 'my-custom-class-one',
   *     meta: 'Meta One'
   *   }, {
   *     value: 10,
   *     name: 'Series 2',
   *     className: 'my-custom-class-two',
   *     meta: 'Meta Two'
   *   }, {
   *     value: 70,
   *     name: 'Series 3',
   *     className: 'my-custom-class-three',
   *     meta: 'Meta Three'
   *   }]
   * });
   */
  function Pie(query, data, options, responsiveOptions) {
    Chartist.Pie.super.constructor.call(this,
      query,
      data,
      defaultOptions,
      Chartist.extend({}, defaultOptions, options),
      responsiveOptions);
  }

  // Creating pie chart type in Chartist namespace
  Chartist.Pie = Chartist.Base.extend({
    constructor: Pie,
    createChart: createChart,
    determineAnchorPosition: determineAnchorPosition
  });

}(window, document, Chartist));

return Chartist;

}));

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/chartist/dist/chartist.js","/../../node_modules/chartist/dist")
},{"buffer":3,"rH1JPG":7}],6:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/ieee754/index.js","/../../node_modules/ieee754")
},{"buffer":3,"rH1JPG":7}],7:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

}).call(this,require("rH1JPG"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../node_modules/process/browser.js","/../../node_modules/process")
},{"buffer":3,"rH1JPG":7}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9saW9yLmdlcnN0ZWluL0Rldi9kZW1vQ2hhcnRpc3Qvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9saW9yLmdlcnN0ZWluL0Rldi9kZW1vQ2hhcnRpc3QvYXBwL2pzL2Zha2VfZWI4MTJmZWQuanMiLCIvVXNlcnMvbGlvci5nZXJzdGVpbi9EZXYvZGVtb0NoYXJ0aXN0L25vZGVfbW9kdWxlcy9iYXNlNjQtanMvbGliL2I2NC5qcyIsIi9Vc2Vycy9saW9yLmdlcnN0ZWluL0Rldi9kZW1vQ2hhcnRpc3Qvbm9kZV9tb2R1bGVzL2J1ZmZlci9pbmRleC5qcyIsIi9Vc2Vycy9saW9yLmdlcnN0ZWluL0Rldi9kZW1vQ2hhcnRpc3Qvbm9kZV9tb2R1bGVzL2NoYXJ0aXN0LXBsdWdpbnMtbGluZV9zZWxlY3Rvci9kaXN0L2NoYXJ0aXN0LXBsdWdpbi1saW5lU2VsZWN0b3IuanMiLCIvVXNlcnMvbGlvci5nZXJzdGVpbi9EZXYvZGVtb0NoYXJ0aXN0L25vZGVfbW9kdWxlcy9jaGFydGlzdC9kaXN0L2NoYXJ0aXN0LmpzIiwiL1VzZXJzL2xpb3IuZ2Vyc3RlaW4vRGV2L2RlbW9DaGFydGlzdC9ub2RlX21vZHVsZXMvaWVlZTc1NC9pbmRleC5qcyIsIi9Vc2Vycy9saW9yLmdlcnN0ZWluL0Rldi9kZW1vQ2hhcnRpc3Qvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZsQ0E7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN3VJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBDaGFydGlzdCA9IHJlcXVpcmUoJ2NoYXJ0aXN0Jyk7XG52YXIgbGluZVNlbGVjdG9yID0gcmVxdWlyZSgnY2hhcnRpc3QtcGx1Z2lucy1saW5lX3NlbGVjdG9yJyk7XG5cbnZhciBkYXRhID0ge1xuXHRsYWJlbHM6IFsnJywgJzFkJywgJzJkJywgJzNkJywgJzRkJywgJzVkJywgJzZkJywgJzdkJywgJzhkJ10sXG5cdHNlcmllczogW1swLCA1LCA4LCAxMCwgNywgNiwgNSwgNSwgNF0sIFs0LCA4LCAzLCA1LCA3LCA5LCAxMiwgNiwgNV0sIFs0LCA4LCAzLCAyLCA3LCA5LCAxMiwgOSwgNV1dXG59O1xuXG52YXIgb3B0aW9ucyA9IHtcblx0bG93OiAwLFxuXHRoaWdoOiAxNSxcblx0c2hvd0FyZWE6IHRydWUsXG5cdHBsdWdpbnM6IFtDaGFydGlzdC5wbHVnaW5zLmxpbmVTZWxlY3RvcigpXSxcblx0YXhpc1k6IHtcblx0XHRvbmx5SW50ZWdlcjogdHJ1ZSxcblx0XHRvZmZzZXQ6IDIwXG5cdH1cbn07XG5cbnZhciBsaW5lQ2hhcnQgPSBuZXcgQ2hhcnRpc3QuTGluZSgnLmxpbmUtY2hhcnQnLCBkYXRhLCBvcHRpb25zKTtcblxubGluZUNoYXJ0Lm9uKCdkcmF3JywgZnVuY3Rpb24gKGRhdGEpIHtcblx0aWYgKGRhdGEudHlwZSA9PT0gJ2xpbmUnIHx8IGRhdGEudHlwZSA9PT0gJ2FyZWEnKSB7XG5cdFx0ZGF0YS5lbGVtZW50LmFuaW1hdGUoe1xuXHRcdFx0ZDoge1xuXHRcdFx0XHRiZWdpbjogNzAwICogZGF0YS5pbmRleCxcblx0XHRcdFx0ZHVyOiAxMDAwLFxuXHRcdFx0XHRmcm9tOiBkYXRhLnBhdGguY2xvbmUoKS5zY2FsZSgxLCAwKS50cmFuc2xhdGUoMCwgZGF0YS5jaGFydFJlY3QuaGVpZ2h0KCkpLnN0cmluZ2lmeSgpLFxuXHRcdFx0XHR0bzogZGF0YS5wYXRoLmNsb25lKCkuc3RyaW5naWZ5KCksXG5cdFx0XHRcdGVhc2luZzogQ2hhcnRpc3QuU3ZnLkVhc2luZy5lYXNlT3V0UXVpbnRcblx0XHRcdH1cblx0XHR9KTtcblx0fVxufSk7XG59KS5jYWxsKHRoaXMscmVxdWlyZShcInJIMUpQR1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL2Zha2VfZWI4MTJmZWQuanNcIixcIi9cIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG52YXIgbG9va3VwID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nO1xuXG47KGZ1bmN0aW9uIChleHBvcnRzKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuICB2YXIgQXJyID0gKHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJylcbiAgICA/IFVpbnQ4QXJyYXlcbiAgICA6IEFycmF5XG5cblx0dmFyIFBMVVMgICA9ICcrJy5jaGFyQ29kZUF0KDApXG5cdHZhciBTTEFTSCAgPSAnLycuY2hhckNvZGVBdCgwKVxuXHR2YXIgTlVNQkVSID0gJzAnLmNoYXJDb2RlQXQoMClcblx0dmFyIExPV0VSICA9ICdhJy5jaGFyQ29kZUF0KDApXG5cdHZhciBVUFBFUiAgPSAnQScuY2hhckNvZGVBdCgwKVxuXHR2YXIgUExVU19VUkxfU0FGRSA9ICctJy5jaGFyQ29kZUF0KDApXG5cdHZhciBTTEFTSF9VUkxfU0FGRSA9ICdfJy5jaGFyQ29kZUF0KDApXG5cblx0ZnVuY3Rpb24gZGVjb2RlIChlbHQpIHtcblx0XHR2YXIgY29kZSA9IGVsdC5jaGFyQ29kZUF0KDApXG5cdFx0aWYgKGNvZGUgPT09IFBMVVMgfHxcblx0XHQgICAgY29kZSA9PT0gUExVU19VUkxfU0FGRSlcblx0XHRcdHJldHVybiA2MiAvLyAnKydcblx0XHRpZiAoY29kZSA9PT0gU0xBU0ggfHxcblx0XHQgICAgY29kZSA9PT0gU0xBU0hfVVJMX1NBRkUpXG5cdFx0XHRyZXR1cm4gNjMgLy8gJy8nXG5cdFx0aWYgKGNvZGUgPCBOVU1CRVIpXG5cdFx0XHRyZXR1cm4gLTEgLy9ubyBtYXRjaFxuXHRcdGlmIChjb2RlIDwgTlVNQkVSICsgMTApXG5cdFx0XHRyZXR1cm4gY29kZSAtIE5VTUJFUiArIDI2ICsgMjZcblx0XHRpZiAoY29kZSA8IFVQUEVSICsgMjYpXG5cdFx0XHRyZXR1cm4gY29kZSAtIFVQUEVSXG5cdFx0aWYgKGNvZGUgPCBMT1dFUiArIDI2KVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBMT1dFUiArIDI2XG5cdH1cblxuXHRmdW5jdGlvbiBiNjRUb0J5dGVBcnJheSAoYjY0KSB7XG5cdFx0dmFyIGksIGosIGwsIHRtcCwgcGxhY2VIb2xkZXJzLCBhcnJcblxuXHRcdGlmIChiNjQubGVuZ3RoICUgNCA+IDApIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzdHJpbmcuIExlbmd0aCBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNCcpXG5cdFx0fVxuXG5cdFx0Ly8gdGhlIG51bWJlciBvZiBlcXVhbCBzaWducyAocGxhY2UgaG9sZGVycylcblx0XHQvLyBpZiB0aGVyZSBhcmUgdHdvIHBsYWNlaG9sZGVycywgdGhhbiB0aGUgdHdvIGNoYXJhY3RlcnMgYmVmb3JlIGl0XG5cdFx0Ly8gcmVwcmVzZW50IG9uZSBieXRlXG5cdFx0Ly8gaWYgdGhlcmUgaXMgb25seSBvbmUsIHRoZW4gdGhlIHRocmVlIGNoYXJhY3RlcnMgYmVmb3JlIGl0IHJlcHJlc2VudCAyIGJ5dGVzXG5cdFx0Ly8gdGhpcyBpcyBqdXN0IGEgY2hlYXAgaGFjayB0byBub3QgZG8gaW5kZXhPZiB0d2ljZVxuXHRcdHZhciBsZW4gPSBiNjQubGVuZ3RoXG5cdFx0cGxhY2VIb2xkZXJzID0gJz0nID09PSBiNjQuY2hhckF0KGxlbiAtIDIpID8gMiA6ICc9JyA9PT0gYjY0LmNoYXJBdChsZW4gLSAxKSA/IDEgOiAwXG5cblx0XHQvLyBiYXNlNjQgaXMgNC8zICsgdXAgdG8gdHdvIGNoYXJhY3RlcnMgb2YgdGhlIG9yaWdpbmFsIGRhdGFcblx0XHRhcnIgPSBuZXcgQXJyKGI2NC5sZW5ndGggKiAzIC8gNCAtIHBsYWNlSG9sZGVycylcblxuXHRcdC8vIGlmIHRoZXJlIGFyZSBwbGFjZWhvbGRlcnMsIG9ubHkgZ2V0IHVwIHRvIHRoZSBsYXN0IGNvbXBsZXRlIDQgY2hhcnNcblx0XHRsID0gcGxhY2VIb2xkZXJzID4gMCA/IGI2NC5sZW5ndGggLSA0IDogYjY0Lmxlbmd0aFxuXG5cdFx0dmFyIEwgPSAwXG5cblx0XHRmdW5jdGlvbiBwdXNoICh2KSB7XG5cdFx0XHRhcnJbTCsrXSA9IHZcblx0XHR9XG5cblx0XHRmb3IgKGkgPSAwLCBqID0gMDsgaSA8IGw7IGkgKz0gNCwgaiArPSAzKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDE4KSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpIDw8IDEyKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMikpIDw8IDYpIHwgZGVjb2RlKGI2NC5jaGFyQXQoaSArIDMpKVxuXHRcdFx0cHVzaCgodG1wICYgMHhGRjAwMDApID4+IDE2KVxuXHRcdFx0cHVzaCgodG1wICYgMHhGRjAwKSA+PiA4KVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH1cblxuXHRcdGlmIChwbGFjZUhvbGRlcnMgPT09IDIpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMikgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA+PiA0KVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH0gZWxzZSBpZiAocGxhY2VIb2xkZXJzID09PSAxKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDEwKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpIDw8IDQpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAyKSkgPj4gMilcblx0XHRcdHB1c2goKHRtcCA+PiA4KSAmIDB4RkYpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fVxuXG5cdFx0cmV0dXJuIGFyclxuXHR9XG5cblx0ZnVuY3Rpb24gdWludDhUb0Jhc2U2NCAodWludDgpIHtcblx0XHR2YXIgaSxcblx0XHRcdGV4dHJhQnl0ZXMgPSB1aW50OC5sZW5ndGggJSAzLCAvLyBpZiB3ZSBoYXZlIDEgYnl0ZSBsZWZ0LCBwYWQgMiBieXRlc1xuXHRcdFx0b3V0cHV0ID0gXCJcIixcblx0XHRcdHRlbXAsIGxlbmd0aFxuXG5cdFx0ZnVuY3Rpb24gZW5jb2RlIChudW0pIHtcblx0XHRcdHJldHVybiBsb29rdXAuY2hhckF0KG51bSlcblx0XHR9XG5cblx0XHRmdW5jdGlvbiB0cmlwbGV0VG9CYXNlNjQgKG51bSkge1xuXHRcdFx0cmV0dXJuIGVuY29kZShudW0gPj4gMTggJiAweDNGKSArIGVuY29kZShudW0gPj4gMTIgJiAweDNGKSArIGVuY29kZShudW0gPj4gNiAmIDB4M0YpICsgZW5jb2RlKG51bSAmIDB4M0YpXG5cdFx0fVxuXG5cdFx0Ly8gZ28gdGhyb3VnaCB0aGUgYXJyYXkgZXZlcnkgdGhyZWUgYnl0ZXMsIHdlJ2xsIGRlYWwgd2l0aCB0cmFpbGluZyBzdHVmZiBsYXRlclxuXHRcdGZvciAoaSA9IDAsIGxlbmd0aCA9IHVpbnQ4Lmxlbmd0aCAtIGV4dHJhQnl0ZXM7IGkgPCBsZW5ndGg7IGkgKz0gMykge1xuXHRcdFx0dGVtcCA9ICh1aW50OFtpXSA8PCAxNikgKyAodWludDhbaSArIDFdIDw8IDgpICsgKHVpbnQ4W2kgKyAyXSlcblx0XHRcdG91dHB1dCArPSB0cmlwbGV0VG9CYXNlNjQodGVtcClcblx0XHR9XG5cblx0XHQvLyBwYWQgdGhlIGVuZCB3aXRoIHplcm9zLCBidXQgbWFrZSBzdXJlIHRvIG5vdCBmb3JnZXQgdGhlIGV4dHJhIGJ5dGVzXG5cdFx0c3dpdGNoIChleHRyYUJ5dGVzKSB7XG5cdFx0XHRjYXNlIDE6XG5cdFx0XHRcdHRlbXAgPSB1aW50OFt1aW50OC5sZW5ndGggLSAxXVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKHRlbXAgPj4gMilcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA8PCA0KSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSAnPT0nXG5cdFx0XHRcdGJyZWFrXG5cdFx0XHRjYXNlIDI6XG5cdFx0XHRcdHRlbXAgPSAodWludDhbdWludDgubGVuZ3RoIC0gMl0gPDwgOCkgKyAodWludDhbdWludDgubGVuZ3RoIC0gMV0pXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUodGVtcCA+PiAxMClcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA+PiA0KSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPDwgMikgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gJz0nXG5cdFx0XHRcdGJyZWFrXG5cdFx0fVxuXG5cdFx0cmV0dXJuIG91dHB1dFxuXHR9XG5cblx0ZXhwb3J0cy50b0J5dGVBcnJheSA9IGI2NFRvQnl0ZUFycmF5XG5cdGV4cG9ydHMuZnJvbUJ5dGVBcnJheSA9IHVpbnQ4VG9CYXNlNjRcbn0odHlwZW9mIGV4cG9ydHMgPT09ICd1bmRlZmluZWQnID8gKHRoaXMuYmFzZTY0anMgPSB7fSkgOiBleHBvcnRzKSlcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJySDFKUEdcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2xpYi9iNjQuanNcIixcIi8uLi8uLi9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2xpYlwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qIVxuICogVGhlIGJ1ZmZlciBtb2R1bGUgZnJvbSBub2RlLmpzLCBmb3IgdGhlIGJyb3dzZXIuXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cblxudmFyIGJhc2U2NCA9IHJlcXVpcmUoJ2Jhc2U2NC1qcycpXG52YXIgaWVlZTc1NCA9IHJlcXVpcmUoJ2llZWU3NTQnKVxuXG5leHBvcnRzLkJ1ZmZlciA9IEJ1ZmZlclxuZXhwb3J0cy5TbG93QnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTID0gNTBcbkJ1ZmZlci5wb29sU2l6ZSA9IDgxOTJcblxuLyoqXG4gKiBJZiBgQnVmZmVyLl91c2VUeXBlZEFycmF5c2A6XG4gKiAgID09PSB0cnVlICAgIFVzZSBVaW50OEFycmF5IGltcGxlbWVudGF0aW9uIChmYXN0ZXN0KVxuICogICA9PT0gZmFsc2UgICBVc2UgT2JqZWN0IGltcGxlbWVudGF0aW9uIChjb21wYXRpYmxlIGRvd24gdG8gSUU2KVxuICovXG5CdWZmZXIuX3VzZVR5cGVkQXJyYXlzID0gKGZ1bmN0aW9uICgpIHtcbiAgLy8gRGV0ZWN0IGlmIGJyb3dzZXIgc3VwcG9ydHMgVHlwZWQgQXJyYXlzLiBTdXBwb3J0ZWQgYnJvd3NlcnMgYXJlIElFIDEwKywgRmlyZWZveCA0KyxcbiAgLy8gQ2hyb21lIDcrLCBTYWZhcmkgNS4xKywgT3BlcmEgMTEuNissIGlPUyA0LjIrLiBJZiB0aGUgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IGFkZGluZ1xuICAvLyBwcm9wZXJ0aWVzIHRvIGBVaW50OEFycmF5YCBpbnN0YW5jZXMsIHRoZW4gdGhhdCdzIHRoZSBzYW1lIGFzIG5vIGBVaW50OEFycmF5YCBzdXBwb3J0XG4gIC8vIGJlY2F1c2Ugd2UgbmVlZCB0byBiZSBhYmxlIHRvIGFkZCBhbGwgdGhlIG5vZGUgQnVmZmVyIEFQSSBtZXRob2RzLiBUaGlzIGlzIGFuIGlzc3VlXG4gIC8vIGluIEZpcmVmb3ggNC0yOS4gTm93IGZpeGVkOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD02OTU0MzhcbiAgdHJ5IHtcbiAgICB2YXIgYnVmID0gbmV3IEFycmF5QnVmZmVyKDApXG4gICAgdmFyIGFyciA9IG5ldyBVaW50OEFycmF5KGJ1ZilcbiAgICBhcnIuZm9vID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gNDIgfVxuICAgIHJldHVybiA0MiA9PT0gYXJyLmZvbygpICYmXG4gICAgICAgIHR5cGVvZiBhcnIuc3ViYXJyYXkgPT09ICdmdW5jdGlvbicgLy8gQ2hyb21lIDktMTAgbGFjayBgc3ViYXJyYXlgXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufSkoKVxuXG4vKipcbiAqIENsYXNzOiBCdWZmZXJcbiAqID09PT09PT09PT09PT1cbiAqXG4gKiBUaGUgQnVmZmVyIGNvbnN0cnVjdG9yIHJldHVybnMgaW5zdGFuY2VzIG9mIGBVaW50OEFycmF5YCB0aGF0IGFyZSBhdWdtZW50ZWRcbiAqIHdpdGggZnVuY3Rpb24gcHJvcGVydGllcyBmb3IgYWxsIHRoZSBub2RlIGBCdWZmZXJgIEFQSSBmdW5jdGlvbnMuIFdlIHVzZVxuICogYFVpbnQ4QXJyYXlgIHNvIHRoYXQgc3F1YXJlIGJyYWNrZXQgbm90YXRpb24gd29ya3MgYXMgZXhwZWN0ZWQgLS0gaXQgcmV0dXJuc1xuICogYSBzaW5nbGUgb2N0ZXQuXG4gKlxuICogQnkgYXVnbWVudGluZyB0aGUgaW5zdGFuY2VzLCB3ZSBjYW4gYXZvaWQgbW9kaWZ5aW5nIHRoZSBgVWludDhBcnJheWBcbiAqIHByb3RvdHlwZS5cbiAqL1xuZnVuY3Rpb24gQnVmZmVyIChzdWJqZWN0LCBlbmNvZGluZywgbm9aZXJvKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBCdWZmZXIpKVxuICAgIHJldHVybiBuZXcgQnVmZmVyKHN1YmplY3QsIGVuY29kaW5nLCBub1plcm8pXG5cbiAgdmFyIHR5cGUgPSB0eXBlb2Ygc3ViamVjdFxuXG4gIC8vIFdvcmthcm91bmQ6IG5vZGUncyBiYXNlNjQgaW1wbGVtZW50YXRpb24gYWxsb3dzIGZvciBub24tcGFkZGVkIHN0cmluZ3NcbiAgLy8gd2hpbGUgYmFzZTY0LWpzIGRvZXMgbm90LlxuICBpZiAoZW5jb2RpbmcgPT09ICdiYXNlNjQnICYmIHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgc3ViamVjdCA9IHN0cmluZ3RyaW0oc3ViamVjdClcbiAgICB3aGlsZSAoc3ViamVjdC5sZW5ndGggJSA0ICE9PSAwKSB7XG4gICAgICBzdWJqZWN0ID0gc3ViamVjdCArICc9J1xuICAgIH1cbiAgfVxuXG4gIC8vIEZpbmQgdGhlIGxlbmd0aFxuICB2YXIgbGVuZ3RoXG4gIGlmICh0eXBlID09PSAnbnVtYmVyJylcbiAgICBsZW5ndGggPSBjb2VyY2Uoc3ViamVjdClcbiAgZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycpXG4gICAgbGVuZ3RoID0gQnVmZmVyLmJ5dGVMZW5ndGgoc3ViamVjdCwgZW5jb2RpbmcpXG4gIGVsc2UgaWYgKHR5cGUgPT09ICdvYmplY3QnKVxuICAgIGxlbmd0aCA9IGNvZXJjZShzdWJqZWN0Lmxlbmd0aCkgLy8gYXNzdW1lIHRoYXQgb2JqZWN0IGlzIGFycmF5LWxpa2VcbiAgZWxzZVxuICAgIHRocm93IG5ldyBFcnJvcignRmlyc3QgYXJndW1lbnQgbmVlZHMgdG8gYmUgYSBudW1iZXIsIGFycmF5IG9yIHN0cmluZy4nKVxuXG4gIHZhciBidWZcbiAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICAvLyBQcmVmZXJyZWQ6IFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlIGZvciBiZXN0IHBlcmZvcm1hbmNlXG4gICAgYnVmID0gQnVmZmVyLl9hdWdtZW50KG5ldyBVaW50OEFycmF5KGxlbmd0aCkpXG4gIH0gZWxzZSB7XG4gICAgLy8gRmFsbGJhY2s6IFJldHVybiBUSElTIGluc3RhbmNlIG9mIEJ1ZmZlciAoY3JlYXRlZCBieSBgbmV3YClcbiAgICBidWYgPSB0aGlzXG4gICAgYnVmLmxlbmd0aCA9IGxlbmd0aFxuICAgIGJ1Zi5faXNCdWZmZXIgPSB0cnVlXG4gIH1cblxuICB2YXIgaVxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cyAmJiB0eXBlb2Ygc3ViamVjdC5ieXRlTGVuZ3RoID09PSAnbnVtYmVyJykge1xuICAgIC8vIFNwZWVkIG9wdGltaXphdGlvbiAtLSB1c2Ugc2V0IGlmIHdlJ3JlIGNvcHlpbmcgZnJvbSBhIHR5cGVkIGFycmF5XG4gICAgYnVmLl9zZXQoc3ViamVjdClcbiAgfSBlbHNlIGlmIChpc0FycmF5aXNoKHN1YmplY3QpKSB7XG4gICAgLy8gVHJlYXQgYXJyYXktaXNoIG9iamVjdHMgYXMgYSBieXRlIGFycmF5XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoQnVmZmVyLmlzQnVmZmVyKHN1YmplY3QpKVxuICAgICAgICBidWZbaV0gPSBzdWJqZWN0LnJlYWRVSW50OChpKVxuICAgICAgZWxzZVxuICAgICAgICBidWZbaV0gPSBzdWJqZWN0W2ldXG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgYnVmLndyaXRlKHN1YmplY3QsIDAsIGVuY29kaW5nKVxuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdudW1iZXInICYmICFCdWZmZXIuX3VzZVR5cGVkQXJyYXlzICYmICFub1plcm8pIHtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGJ1ZltpXSA9IDBcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnVmXG59XG5cbi8vIFNUQVRJQyBNRVRIT0RTXG4vLyA9PT09PT09PT09PT09PVxuXG5CdWZmZXIuaXNFbmNvZGluZyA9IGZ1bmN0aW9uIChlbmNvZGluZykge1xuICBzd2l0Y2ggKFN0cmluZyhlbmNvZGluZykudG9Mb3dlckNhc2UoKSkge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgY2FzZSAncmF3JzpcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0dXJuIHRydWVcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuQnVmZmVyLmlzQnVmZmVyID0gZnVuY3Rpb24gKGIpIHtcbiAgcmV0dXJuICEhKGIgIT09IG51bGwgJiYgYiAhPT0gdW5kZWZpbmVkICYmIGIuX2lzQnVmZmVyKVxufVxuXG5CdWZmZXIuYnl0ZUxlbmd0aCA9IGZ1bmN0aW9uIChzdHIsIGVuY29kaW5nKSB7XG4gIHZhciByZXRcbiAgc3RyID0gc3RyICsgJydcbiAgc3dpdGNoIChlbmNvZGluZyB8fCAndXRmOCcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aCAvIDJcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0ID0gdXRmOFRvQnl0ZXMoc3RyKS5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAncmF3JzpcbiAgICAgIHJldCA9IHN0ci5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IGJhc2U2NFRvQnl0ZXMoc3RyKS5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldCA9IHN0ci5sZW5ndGggKiAyXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLmNvbmNhdCA9IGZ1bmN0aW9uIChsaXN0LCB0b3RhbExlbmd0aCkge1xuICBhc3NlcnQoaXNBcnJheShsaXN0KSwgJ1VzYWdlOiBCdWZmZXIuY29uY2F0KGxpc3QsIFt0b3RhbExlbmd0aF0pXFxuJyArXG4gICAgICAnbGlzdCBzaG91bGQgYmUgYW4gQXJyYXkuJylcblxuICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcigwKVxuICB9IGVsc2UgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIGxpc3RbMF1cbiAgfVxuXG4gIHZhciBpXG4gIGlmICh0eXBlb2YgdG90YWxMZW5ndGggIT09ICdudW1iZXInKSB7XG4gICAgdG90YWxMZW5ndGggPSAwXG4gICAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRvdGFsTGVuZ3RoICs9IGxpc3RbaV0ubGVuZ3RoXG4gICAgfVxuICB9XG5cbiAgdmFyIGJ1ZiA9IG5ldyBCdWZmZXIodG90YWxMZW5ndGgpXG4gIHZhciBwb3MgPSAwXG4gIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldXG4gICAgaXRlbS5jb3B5KGJ1ZiwgcG9zKVxuICAgIHBvcyArPSBpdGVtLmxlbmd0aFxuICB9XG4gIHJldHVybiBidWZcbn1cblxuLy8gQlVGRkVSIElOU1RBTkNFIE1FVEhPRFNcbi8vID09PT09PT09PT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIF9oZXhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IGJ1Zi5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuXG4gIC8vIG11c3QgYmUgYW4gZXZlbiBudW1iZXIgb2YgZGlnaXRzXG4gIHZhciBzdHJMZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGFzc2VydChzdHJMZW4gJSAyID09PSAwLCAnSW52YWxpZCBoZXggc3RyaW5nJylcblxuICBpZiAobGVuZ3RoID4gc3RyTGVuIC8gMikge1xuICAgIGxlbmd0aCA9IHN0ckxlbiAvIDJcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGJ5dGUgPSBwYXJzZUludChzdHJpbmcuc3Vic3RyKGkgKiAyLCAyKSwgMTYpXG4gICAgYXNzZXJ0KCFpc05hTihieXRlKSwgJ0ludmFsaWQgaGV4IHN0cmluZycpXG4gICAgYnVmW29mZnNldCArIGldID0gYnl0ZVxuICB9XG4gIEJ1ZmZlci5fY2hhcnNXcml0dGVuID0gaSAqIDJcbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gX3V0ZjhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcih1dGY4VG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbmZ1bmN0aW9uIF9hc2NpaVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKGFzY2lpVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbmZ1bmN0aW9uIF9iaW5hcnlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBfYXNjaWlXcml0ZShidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIF9iYXNlNjRXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcihiYXNlNjRUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX3V0ZjE2bGVXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcih1dGYxNmxlVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpIHtcbiAgLy8gU3VwcG9ydCBib3RoIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZylcbiAgLy8gYW5kIHRoZSBsZWdhY3kgKHN0cmluZywgZW5jb2RpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICBpZiAoaXNGaW5pdGUob2Zmc2V0KSkge1xuICAgIGlmICghaXNGaW5pdGUobGVuZ3RoKSkge1xuICAgICAgZW5jb2RpbmcgPSBsZW5ndGhcbiAgICAgIGxlbmd0aCA9IHVuZGVmaW5lZFxuICAgIH1cbiAgfSBlbHNlIHsgIC8vIGxlZ2FjeVxuICAgIHZhciBzd2FwID0gZW5jb2RpbmdcbiAgICBlbmNvZGluZyA9IG9mZnNldFxuICAgIG9mZnNldCA9IGxlbmd0aFxuICAgIGxlbmd0aCA9IHN3YXBcbiAgfVxuXG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IHRoaXMubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aClcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgICB9XG4gIH1cbiAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpXG5cbiAgdmFyIHJldFxuICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldCA9IF9oZXhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSBfdXRmOFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIHJldCA9IF9hc2NpaVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICByZXQgPSBfYmluYXJ5V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IF9iYXNlNjRXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gX3V0ZjE2bGVXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJylcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoZW5jb2RpbmcsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG5cbiAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpXG4gIHN0YXJ0ID0gTnVtYmVyKHN0YXJ0KSB8fCAwXG4gIGVuZCA9IChlbmQgIT09IHVuZGVmaW5lZClcbiAgICA/IE51bWJlcihlbmQpXG4gICAgOiBlbmQgPSBzZWxmLmxlbmd0aFxuXG4gIC8vIEZhc3RwYXRoIGVtcHR5IHN0cmluZ3NcbiAgaWYgKGVuZCA9PT0gc3RhcnQpXG4gICAgcmV0dXJuICcnXG5cbiAgdmFyIHJldFxuICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldCA9IF9oZXhTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSBfdXRmOFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIHJldCA9IF9hc2NpaVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICByZXQgPSBfYmluYXJ5U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IF9iYXNlNjRTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gX3V0ZjE2bGVTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJylcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdCdWZmZXInLFxuICAgIGRhdGE6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuX2FyciB8fCB0aGlzLCAwKVxuICB9XG59XG5cbi8vIGNvcHkodGFyZ2V0QnVmZmVyLCB0YXJnZXRTdGFydD0wLCBzb3VyY2VTdGFydD0wLCBzb3VyY2VFbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uICh0YXJnZXQsIHRhcmdldF9zdGFydCwgc3RhcnQsIGVuZCkge1xuICB2YXIgc291cmNlID0gdGhpc1xuXG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCAmJiBlbmQgIT09IDApIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICghdGFyZ2V0X3N0YXJ0KSB0YXJnZXRfc3RhcnQgPSAwXG5cbiAgLy8gQ29weSAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm5cbiAgaWYgKHRhcmdldC5sZW5ndGggPT09IDAgfHwgc291cmNlLmxlbmd0aCA9PT0gMCkgcmV0dXJuXG5cbiAgLy8gRmF0YWwgZXJyb3IgY29uZGl0aW9uc1xuICBhc3NlcnQoZW5kID49IHN0YXJ0LCAnc291cmNlRW5kIDwgc291cmNlU3RhcnQnKVxuICBhc3NlcnQodGFyZ2V0X3N0YXJ0ID49IDAgJiYgdGFyZ2V0X3N0YXJ0IDwgdGFyZ2V0Lmxlbmd0aCxcbiAgICAgICd0YXJnZXRTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KHN0YXJ0ID49IDAgJiYgc3RhcnQgPCBzb3VyY2UubGVuZ3RoLCAnc291cmNlU3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGFzc2VydChlbmQgPj0gMCAmJiBlbmQgPD0gc291cmNlLmxlbmd0aCwgJ3NvdXJjZUVuZCBvdXQgb2YgYm91bmRzJylcblxuICAvLyBBcmUgd2Ugb29iP1xuICBpZiAoZW5kID4gdGhpcy5sZW5ndGgpXG4gICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldC5sZW5ndGggLSB0YXJnZXRfc3RhcnQgPCBlbmQgLSBzdGFydClcbiAgICBlbmQgPSB0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0X3N0YXJ0ICsgc3RhcnRcblxuICB2YXIgbGVuID0gZW5kIC0gc3RhcnRcblxuICBpZiAobGVuIDwgMTAwIHx8ICFCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0X3N0YXJ0XSA9IHRoaXNbaSArIHN0YXJ0XVxuICB9IGVsc2Uge1xuICAgIHRhcmdldC5fc2V0KHRoaXMuc3ViYXJyYXkoc3RhcnQsIHN0YXJ0ICsgbGVuKSwgdGFyZ2V0X3N0YXJ0KVxuICB9XG59XG5cbmZ1bmN0aW9uIF9iYXNlNjRTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGlmIChzdGFydCA9PT0gMCAmJiBlbmQgPT09IGJ1Zi5sZW5ndGgpIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYuc2xpY2Uoc3RhcnQsIGVuZCkpXG4gIH1cbn1cblxuZnVuY3Rpb24gX3V0ZjhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXMgPSAnJ1xuICB2YXIgdG1wID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgaWYgKGJ1ZltpXSA8PSAweDdGKSB7XG4gICAgICByZXMgKz0gZGVjb2RlVXRmOENoYXIodG1wKSArIFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICAgICAgdG1wID0gJydcbiAgICB9IGVsc2Uge1xuICAgICAgdG1wICs9ICclJyArIGJ1ZltpXS50b1N0cmluZygxNilcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzICsgZGVjb2RlVXRmOENoYXIodG1wKVxufVxuXG5mdW5jdGlvbiBfYXNjaWlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspXG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIF9iaW5hcnlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHJldHVybiBfYXNjaWlTbGljZShidWYsIHN0YXJ0LCBlbmQpXG59XG5cbmZ1bmN0aW9uIF9oZXhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG5cbiAgaWYgKCFzdGFydCB8fCBzdGFydCA8IDApIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCB8fCBlbmQgPCAwIHx8IGVuZCA+IGxlbikgZW5kID0gbGVuXG5cbiAgdmFyIG91dCA9ICcnXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgb3V0ICs9IHRvSGV4KGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gb3V0XG59XG5cbmZ1bmN0aW9uIF91dGYxNmxlU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgYnl0ZXMgPSBidWYuc2xpY2Uoc3RhcnQsIGVuZClcbiAgdmFyIHJlcyA9ICcnXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSArIGJ5dGVzW2krMV0gKiAyNTYpXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24gKHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIHN0YXJ0ID0gY2xhbXAoc3RhcnQsIGxlbiwgMClcbiAgZW5kID0gY2xhbXAoZW5kLCBsZW4sIGxlbilcblxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgIHJldHVybiBCdWZmZXIuX2F1Z21lbnQodGhpcy5zdWJhcnJheShzdGFydCwgZW5kKSlcbiAgfSBlbHNlIHtcbiAgICB2YXIgc2xpY2VMZW4gPSBlbmQgLSBzdGFydFxuICAgIHZhciBuZXdCdWYgPSBuZXcgQnVmZmVyKHNsaWNlTGVuLCB1bmRlZmluZWQsIHRydWUpXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGljZUxlbjsgaSsrKSB7XG4gICAgICBuZXdCdWZbaV0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gICAgcmV0dXJuIG5ld0J1ZlxuICB9XG59XG5cbi8vIGBnZXRgIHdpbGwgYmUgcmVtb3ZlZCBpbiBOb2RlIDAuMTMrXG5CdWZmZXIucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChvZmZzZXQpIHtcbiAgY29uc29sZS5sb2coJy5nZXQoKSBpcyBkZXByZWNhdGVkLiBBY2Nlc3MgdXNpbmcgYXJyYXkgaW5kZXhlcyBpbnN0ZWFkLicpXG4gIHJldHVybiB0aGlzLnJlYWRVSW50OChvZmZzZXQpXG59XG5cbi8vIGBzZXRgIHdpbGwgYmUgcmVtb3ZlZCBpbiBOb2RlIDAuMTMrXG5CdWZmZXIucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uICh2LCBvZmZzZXQpIHtcbiAgY29uc29sZS5sb2coJy5zZXQoKSBpcyBkZXByZWNhdGVkLiBBY2Nlc3MgdXNpbmcgYXJyYXkgaW5kZXhlcyBpbnN0ZWFkLicpXG4gIHJldHVybiB0aGlzLndyaXRlVUludDgodiwgb2Zmc2V0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50OCA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5mdW5jdGlvbiBfcmVhZFVJbnQxNiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWxcbiAgaWYgKGxpdHRsZUVuZGlhbikge1xuICAgIHZhbCA9IGJ1ZltvZmZzZXRdXG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdIDw8IDhcbiAgfSBlbHNlIHtcbiAgICB2YWwgPSBidWZbb2Zmc2V0XSA8PCA4XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdXG4gIH1cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQxNih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQxNih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWRVSW50MzIgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsXG4gIGlmIChsaXR0bGVFbmRpYW4pIHtcbiAgICBpZiAob2Zmc2V0ICsgMiA8IGxlbilcbiAgICAgIHZhbCA9IGJ1ZltvZmZzZXQgKyAyXSA8PCAxNlxuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAxXSA8PCA4XG4gICAgdmFsIHw9IGJ1ZltvZmZzZXRdXG4gICAgaWYgKG9mZnNldCArIDMgPCBsZW4pXG4gICAgICB2YWwgPSB2YWwgKyAoYnVmW29mZnNldCArIDNdIDw8IDI0ID4+PiAwKVxuICB9IGVsc2Uge1xuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsID0gYnVmW29mZnNldCArIDFdIDw8IDE2XG4gICAgaWYgKG9mZnNldCArIDIgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDJdIDw8IDhcbiAgICBpZiAob2Zmc2V0ICsgMyA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgM11cbiAgICB2YWwgPSB2YWwgKyAoYnVmW29mZnNldF0gPDwgMjQgPj4+IDApXG4gIH1cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQzMih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQzMih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50OCA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgdmFyIG5lZyA9IHRoaXNbb2Zmc2V0XSAmIDB4ODBcbiAgaWYgKG5lZylcbiAgICByZXR1cm4gKDB4ZmYgLSB0aGlzW29mZnNldF0gKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbmZ1bmN0aW9uIF9yZWFkSW50MTYgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsID0gX3JlYWRVSW50MTYoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgdHJ1ZSlcbiAgdmFyIG5lZyA9IHZhbCAmIDB4ODAwMFxuICBpZiAobmVnKVxuICAgIHJldHVybiAoMHhmZmZmIC0gdmFsICsgMSkgKiAtMVxuICBlbHNlXG4gICAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MTYodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDE2KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZEludDMyIChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbCA9IF9yZWFkVUludDMyKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIHRydWUpXG4gIHZhciBuZWcgPSB2YWwgJiAweDgwMDAwMDAwXG4gIGlmIChuZWcpXG4gICAgcmV0dXJuICgweGZmZmZmZmZmIC0gdmFsICsgMSkgKiAtMVxuICBlbHNlXG4gICAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MzIodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDMyKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZEZsb2F0IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHJldHVybiBpZWVlNzU0LnJlYWQoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRGbG9hdCh0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdEJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRmxvYXQodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkRG91YmxlIChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgKyA3IDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHJldHVybiBpZWVlNzU0LnJlYWQoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRG91YmxlKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRG91YmxlKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDggPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZilcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpIHJldHVyblxuXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlXG59XG5cbmZ1bmN0aW9uIF93cml0ZVVJbnQxNiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmZmYpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGxlbiAtIG9mZnNldCwgMik7IGkgPCBqOyBpKyspIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPVxuICAgICAgICAodmFsdWUgJiAoMHhmZiA8PCAoOCAqIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpKSkpID4+PlxuICAgICAgICAgICAgKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkgKiA4XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZVVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmZmZmZmZmKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihsZW4gLSBvZmZzZXQsIDQpOyBpIDwgajsgaSsrKSB7XG4gICAgYnVmW29mZnNldCArIGldID1cbiAgICAgICAgKHZhbHVlID4+PiAobGl0dGxlRW5kaWFuID8gaSA6IDMgLSBpKSAqIDgpICYgMHhmZlxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50OCA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmLCAtMHg4MClcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgaWYgKHZhbHVlID49IDApXG4gICAgdGhpcy53cml0ZVVJbnQ4KHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KVxuICBlbHNlXG4gICAgdGhpcy53cml0ZVVJbnQ4KDB4ZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUludDE2IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2ZmZiwgLTB4ODAwMClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGlmICh2YWx1ZSA+PSAwKVxuICAgIF93cml0ZVVJbnQxNihidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICBfd3JpdGVVSW50MTYoYnVmLCAweGZmZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlSW50MzIgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZiAodmFsdWUgPj0gMClcbiAgICBfd3JpdGVVSW50MzIoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxuICBlbHNlXG4gICAgX3dyaXRlVUludDMyKGJ1ZiwgMHhmZmZmZmZmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVGbG9hdCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZJRUVFNzU0KHZhbHVlLCAzLjQwMjgyMzQ2NjM4NTI4ODZlKzM4LCAtMy40MDI4MjM0NjYzODUyODg2ZSszOClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVEb3VibGUgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgNyA8IGJ1Zi5sZW5ndGgsXG4gICAgICAgICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmSUVFRTc1NCh2YWx1ZSwgMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgsIC0xLjc5NzY5MzEzNDg2MjMxNTdFKzMwOClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlTEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlQkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuLy8gZmlsbCh2YWx1ZSwgc3RhcnQ9MCwgZW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbiAodmFsdWUsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKCF2YWx1ZSkgdmFsdWUgPSAwXG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCkgZW5kID0gdGhpcy5sZW5ndGhcblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHZhbHVlID0gdmFsdWUuY2hhckNvZGVBdCgwKVxuICB9XG5cbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgIWlzTmFOKHZhbHVlKSwgJ3ZhbHVlIGlzIG5vdCBhIG51bWJlcicpXG4gIGFzc2VydChlbmQgPj0gc3RhcnQsICdlbmQgPCBzdGFydCcpXG5cbiAgLy8gRmlsbCAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm5cbiAgaWYgKHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICBhc3NlcnQoc3RhcnQgPj0gMCAmJiBzdGFydCA8IHRoaXMubGVuZ3RoLCAnc3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGFzc2VydChlbmQgPj0gMCAmJiBlbmQgPD0gdGhpcy5sZW5ndGgsICdlbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICB0aGlzW2ldID0gdmFsdWVcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluc3BlY3QgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBvdXQgPSBbXVxuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIG91dFtpXSA9IHRvSGV4KHRoaXNbaV0pXG4gICAgaWYgKGkgPT09IGV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMpIHtcbiAgICAgIG91dFtpICsgMV0gPSAnLi4uJ1xuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbiAgcmV0dXJuICc8QnVmZmVyICcgKyBvdXQuam9pbignICcpICsgJz4nXG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBgQXJyYXlCdWZmZXJgIHdpdGggdGhlICpjb3BpZWQqIG1lbW9yeSBvZiB0aGUgYnVmZmVyIGluc3RhbmNlLlxuICogQWRkZWQgaW4gTm9kZSAwLjEyLiBPbmx5IGF2YWlsYWJsZSBpbiBicm93c2VycyB0aGF0IHN1cHBvcnQgQXJyYXlCdWZmZXIuXG4gKi9cbkJ1ZmZlci5wcm90b3R5cGUudG9BcnJheUJ1ZmZlciA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgICByZXR1cm4gKG5ldyBCdWZmZXIodGhpcykpLmJ1ZmZlclxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYnVmID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5sZW5ndGgpXG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYnVmLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKVxuICAgICAgICBidWZbaV0gPSB0aGlzW2ldXG4gICAgICByZXR1cm4gYnVmLmJ1ZmZlclxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0J1ZmZlci50b0FycmF5QnVmZmVyIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyJylcbiAgfVxufVxuXG4vLyBIRUxQRVIgRlVOQ1RJT05TXG4vLyA9PT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIHN0cmluZ3RyaW0gKHN0cikge1xuICBpZiAoc3RyLnRyaW0pIHJldHVybiBzdHIudHJpbSgpXG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpXG59XG5cbnZhciBCUCA9IEJ1ZmZlci5wcm90b3R5cGVcblxuLyoqXG4gKiBBdWdtZW50IGEgVWludDhBcnJheSAqaW5zdGFuY2UqIChub3QgdGhlIFVpbnQ4QXJyYXkgY2xhc3MhKSB3aXRoIEJ1ZmZlciBtZXRob2RzXG4gKi9cbkJ1ZmZlci5fYXVnbWVudCA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgYXJyLl9pc0J1ZmZlciA9IHRydWVcblxuICAvLyBzYXZlIHJlZmVyZW5jZSB0byBvcmlnaW5hbCBVaW50OEFycmF5IGdldC9zZXQgbWV0aG9kcyBiZWZvcmUgb3ZlcndyaXRpbmdcbiAgYXJyLl9nZXQgPSBhcnIuZ2V0XG4gIGFyci5fc2V0ID0gYXJyLnNldFxuXG4gIC8vIGRlcHJlY2F0ZWQsIHdpbGwgYmUgcmVtb3ZlZCBpbiBub2RlIDAuMTMrXG4gIGFyci5nZXQgPSBCUC5nZXRcbiAgYXJyLnNldCA9IEJQLnNldFxuXG4gIGFyci53cml0ZSA9IEJQLndyaXRlXG4gIGFyci50b1N0cmluZyA9IEJQLnRvU3RyaW5nXG4gIGFyci50b0xvY2FsZVN0cmluZyA9IEJQLnRvU3RyaW5nXG4gIGFyci50b0pTT04gPSBCUC50b0pTT05cbiAgYXJyLmNvcHkgPSBCUC5jb3B5XG4gIGFyci5zbGljZSA9IEJQLnNsaWNlXG4gIGFyci5yZWFkVUludDggPSBCUC5yZWFkVUludDhcbiAgYXJyLnJlYWRVSW50MTZMRSA9IEJQLnJlYWRVSW50MTZMRVxuICBhcnIucmVhZFVJbnQxNkJFID0gQlAucmVhZFVJbnQxNkJFXG4gIGFyci5yZWFkVUludDMyTEUgPSBCUC5yZWFkVUludDMyTEVcbiAgYXJyLnJlYWRVSW50MzJCRSA9IEJQLnJlYWRVSW50MzJCRVxuICBhcnIucmVhZEludDggPSBCUC5yZWFkSW50OFxuICBhcnIucmVhZEludDE2TEUgPSBCUC5yZWFkSW50MTZMRVxuICBhcnIucmVhZEludDE2QkUgPSBCUC5yZWFkSW50MTZCRVxuICBhcnIucmVhZEludDMyTEUgPSBCUC5yZWFkSW50MzJMRVxuICBhcnIucmVhZEludDMyQkUgPSBCUC5yZWFkSW50MzJCRVxuICBhcnIucmVhZEZsb2F0TEUgPSBCUC5yZWFkRmxvYXRMRVxuICBhcnIucmVhZEZsb2F0QkUgPSBCUC5yZWFkRmxvYXRCRVxuICBhcnIucmVhZERvdWJsZUxFID0gQlAucmVhZERvdWJsZUxFXG4gIGFyci5yZWFkRG91YmxlQkUgPSBCUC5yZWFkRG91YmxlQkVcbiAgYXJyLndyaXRlVUludDggPSBCUC53cml0ZVVJbnQ4XG4gIGFyci53cml0ZVVJbnQxNkxFID0gQlAud3JpdGVVSW50MTZMRVxuICBhcnIud3JpdGVVSW50MTZCRSA9IEJQLndyaXRlVUludDE2QkVcbiAgYXJyLndyaXRlVUludDMyTEUgPSBCUC53cml0ZVVJbnQzMkxFXG4gIGFyci53cml0ZVVJbnQzMkJFID0gQlAud3JpdGVVSW50MzJCRVxuICBhcnIud3JpdGVJbnQ4ID0gQlAud3JpdGVJbnQ4XG4gIGFyci53cml0ZUludDE2TEUgPSBCUC53cml0ZUludDE2TEVcbiAgYXJyLndyaXRlSW50MTZCRSA9IEJQLndyaXRlSW50MTZCRVxuICBhcnIud3JpdGVJbnQzMkxFID0gQlAud3JpdGVJbnQzMkxFXG4gIGFyci53cml0ZUludDMyQkUgPSBCUC53cml0ZUludDMyQkVcbiAgYXJyLndyaXRlRmxvYXRMRSA9IEJQLndyaXRlRmxvYXRMRVxuICBhcnIud3JpdGVGbG9hdEJFID0gQlAud3JpdGVGbG9hdEJFXG4gIGFyci53cml0ZURvdWJsZUxFID0gQlAud3JpdGVEb3VibGVMRVxuICBhcnIud3JpdGVEb3VibGVCRSA9IEJQLndyaXRlRG91YmxlQkVcbiAgYXJyLmZpbGwgPSBCUC5maWxsXG4gIGFyci5pbnNwZWN0ID0gQlAuaW5zcGVjdFxuICBhcnIudG9BcnJheUJ1ZmZlciA9IEJQLnRvQXJyYXlCdWZmZXJcblxuICByZXR1cm4gYXJyXG59XG5cbi8vIHNsaWNlKHN0YXJ0LCBlbmQpXG5mdW5jdGlvbiBjbGFtcCAoaW5kZXgsIGxlbiwgZGVmYXVsdFZhbHVlKSB7XG4gIGlmICh0eXBlb2YgaW5kZXggIT09ICdudW1iZXInKSByZXR1cm4gZGVmYXVsdFZhbHVlXG4gIGluZGV4ID0gfn5pbmRleDsgIC8vIENvZXJjZSB0byBpbnRlZ2VyLlxuICBpZiAoaW5kZXggPj0gbGVuKSByZXR1cm4gbGVuXG4gIGlmIChpbmRleCA+PSAwKSByZXR1cm4gaW5kZXhcbiAgaW5kZXggKz0gbGVuXG4gIGlmIChpbmRleCA+PSAwKSByZXR1cm4gaW5kZXhcbiAgcmV0dXJuIDBcbn1cblxuZnVuY3Rpb24gY29lcmNlIChsZW5ndGgpIHtcbiAgLy8gQ29lcmNlIGxlbmd0aCB0byBhIG51bWJlciAocG9zc2libHkgTmFOKSwgcm91bmQgdXBcbiAgLy8gaW4gY2FzZSBpdCdzIGZyYWN0aW9uYWwgKGUuZy4gMTIzLjQ1NikgdGhlbiBkbyBhXG4gIC8vIGRvdWJsZSBuZWdhdGUgdG8gY29lcmNlIGEgTmFOIHRvIDAuIEVhc3ksIHJpZ2h0P1xuICBsZW5ndGggPSB+fk1hdGguY2VpbCgrbGVuZ3RoKVxuICByZXR1cm4gbGVuZ3RoIDwgMCA/IDAgOiBsZW5ndGhcbn1cblxuZnVuY3Rpb24gaXNBcnJheSAoc3ViamVjdCkge1xuICByZXR1cm4gKEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKHN1YmplY3QpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHN1YmplY3QpID09PSAnW29iamVjdCBBcnJheV0nXG4gIH0pKHN1YmplY3QpXG59XG5cbmZ1bmN0aW9uIGlzQXJyYXlpc2ggKHN1YmplY3QpIHtcbiAgcmV0dXJuIGlzQXJyYXkoc3ViamVjdCkgfHwgQnVmZmVyLmlzQnVmZmVyKHN1YmplY3QpIHx8XG4gICAgICBzdWJqZWN0ICYmIHR5cGVvZiBzdWJqZWN0ID09PSAnb2JqZWN0JyAmJlxuICAgICAgdHlwZW9mIHN1YmplY3QubGVuZ3RoID09PSAnbnVtYmVyJ1xufVxuXG5mdW5jdGlvbiB0b0hleCAobikge1xuICBpZiAobiA8IDE2KSByZXR1cm4gJzAnICsgbi50b1N0cmluZygxNilcbiAgcmV0dXJuIG4udG9TdHJpbmcoMTYpXG59XG5cbmZ1bmN0aW9uIHV0ZjhUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGIgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGlmIChiIDw9IDB4N0YpXG4gICAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSlcbiAgICBlbHNlIHtcbiAgICAgIHZhciBzdGFydCA9IGlcbiAgICAgIGlmIChiID49IDB4RDgwMCAmJiBiIDw9IDB4REZGRikgaSsrXG4gICAgICB2YXIgaCA9IGVuY29kZVVSSUNvbXBvbmVudChzdHIuc2xpY2Uoc3RhcnQsIGkrMSkpLnN1YnN0cigxKS5zcGxpdCgnJScpXG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGgubGVuZ3RoOyBqKyspXG4gICAgICAgIGJ5dGVBcnJheS5wdXNoKHBhcnNlSW50KGhbal0sIDE2KSlcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBhc2NpaVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAvLyBOb2RlJ3MgY29kZSBzZWVtcyB0byBiZSBkb2luZyB0aGlzIGFuZCBub3QgJiAweDdGLi5cbiAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSAmIDB4RkYpXG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiB1dGYxNmxlVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBjLCBoaSwgbG9cbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgYyA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaGkgPSBjID4+IDhcbiAgICBsbyA9IGMgJSAyNTZcbiAgICBieXRlQXJyYXkucHVzaChsbylcbiAgICBieXRlQXJyYXkucHVzaChoaSlcbiAgfVxuXG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gYmFzZTY0VG9CeXRlcyAoc3RyKSB7XG4gIHJldHVybiBiYXNlNjQudG9CeXRlQXJyYXkoc3RyKVxufVxuXG5mdW5jdGlvbiBibGl0QnVmZmVyIChzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIHBvc1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKChpICsgb2Zmc2V0ID49IGRzdC5sZW5ndGgpIHx8IChpID49IHNyYy5sZW5ndGgpKVxuICAgICAgYnJlYWtcbiAgICBkc3RbaSArIG9mZnNldF0gPSBzcmNbaV1cbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBkZWNvZGVVdGY4Q2hhciAoc3RyKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChzdHIpXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4RkZGRCkgLy8gVVRGIDggaW52YWxpZCBjaGFyXG4gIH1cbn1cblxuLypcbiAqIFdlIGhhdmUgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIHZhbHVlIGlzIGEgdmFsaWQgaW50ZWdlci4gVGhpcyBtZWFucyB0aGF0IGl0XG4gKiBpcyBub24tbmVnYXRpdmUuIEl0IGhhcyBubyBmcmFjdGlvbmFsIGNvbXBvbmVudCBhbmQgdGhhdCBpdCBkb2VzIG5vdFxuICogZXhjZWVkIHRoZSBtYXhpbXVtIGFsbG93ZWQgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIHZlcmlmdWludCAodmFsdWUsIG1heCkge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPj0gMCwgJ3NwZWNpZmllZCBhIG5lZ2F0aXZlIHZhbHVlIGZvciB3cml0aW5nIGFuIHVuc2lnbmVkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlIDw9IG1heCwgJ3ZhbHVlIGlzIGxhcmdlciB0aGFuIG1heGltdW0gdmFsdWUgZm9yIHR5cGUnKVxuICBhc3NlcnQoTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlLCAndmFsdWUgaGFzIGEgZnJhY3Rpb25hbCBjb21wb25lbnQnKVxufVxuXG5mdW5jdGlvbiB2ZXJpZnNpbnQgKHZhbHVlLCBtYXgsIG1pbikge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgbGFyZ2VyIHRoYW4gbWF4aW11bSBhbGxvd2VkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlID49IG1pbiwgJ3ZhbHVlIHNtYWxsZXIgdGhhbiBtaW5pbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQoTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlLCAndmFsdWUgaGFzIGEgZnJhY3Rpb25hbCBjb21wb25lbnQnKVxufVxuXG5mdW5jdGlvbiB2ZXJpZklFRUU3NTQgKHZhbHVlLCBtYXgsIG1pbikge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgbGFyZ2VyIHRoYW4gbWF4aW11bSBhbGxvd2VkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlID49IG1pbiwgJ3ZhbHVlIHNtYWxsZXIgdGhhbiBtaW5pbXVtIGFsbG93ZWQgdmFsdWUnKVxufVxuXG5mdW5jdGlvbiBhc3NlcnQgKHRlc3QsIG1lc3NhZ2UpIHtcbiAgaWYgKCF0ZXN0KSB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSB8fCAnRmFpbGVkIGFzc2VydGlvbicpXG59XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwickgxSlBHXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vbm9kZV9tb2R1bGVzL2J1ZmZlci9pbmRleC5qc1wiLFwiLy4uLy4uL25vZGVfbW9kdWxlcy9idWZmZXJcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG52YXIgQ2hhcnRpc3Q9cmVxdWlyZShcImNoYXJ0aXN0XCIpO0NoYXJ0aXN0LnBsdWdpbnM9Q2hhcnRpc3QucGx1Z2luc3x8e30sQ2hhcnRpc3QucGx1Z2lucy5saW5lU2VsZWN0b3I9ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24odCl7dCBpbnN0YW5jZW9mIENoYXJ0aXN0LkxpbmUmJnQub24oXCJkcmF3XCIsZnVuY3Rpb24odCl7XCJsaW5lXCIhPT10LnR5cGUmJlwicG9pbnRcIiE9PXQudHlwZXx8KHQuZWxlbWVudC5fbm9kZS5vbmNsaWNrPWZ1bmN0aW9uKHQpe3ZhciBuPXQudGFyZ2V0LnBhcmVudE5vZGUsZT1uLnBhcmVudE5vZGU7ZS5yZW1vdmVDaGlsZChuKSxlLmFwcGVuZENoaWxkKG4pfSl9KX19O1xufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJySDFKUEdcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi9ub2RlX21vZHVsZXMvY2hhcnRpc3QtcGx1Z2lucy1saW5lX3NlbGVjdG9yL2Rpc3QvY2hhcnRpc3QtcGx1Z2luLWxpbmVTZWxlY3Rvci5qc1wiLFwiLy4uLy4uL25vZGVfbW9kdWxlcy9jaGFydGlzdC1wbHVnaW5zLWxpbmVfc2VsZWN0b3IvZGlzdFwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlIHVubGVzcyBhbWRNb2R1bGVJZCBpcyBzZXRcbiAgICBkZWZpbmUoW10sIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAocm9vdFsnQ2hhcnRpc3QnXSA9IGZhY3RvcnkoKSk7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgLy8gTm9kZS4gRG9lcyBub3Qgd29yayB3aXRoIHN0cmljdCBDb21tb25KUywgYnV0XG4gICAgLy8gb25seSBDb21tb25KUy1saWtlIGVudmlyb25tZW50cyB0aGF0IHN1cHBvcnQgbW9kdWxlLmV4cG9ydHMsXG4gICAgLy8gbGlrZSBOb2RlLlxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICB9IGVsc2Uge1xuICAgIHJvb3RbJ0NoYXJ0aXN0J10gPSBmYWN0b3J5KCk7XG4gIH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuXG4vKiBDaGFydGlzdC5qcyAwLjkuOFxuICogQ29weXJpZ2h0IMKpIDIwMTYgR2lvbiBLdW56XG4gKiBGcmVlIHRvIHVzZSB1bmRlciBlaXRoZXIgdGhlIFdURlBMIGxpY2Vuc2Ugb3IgdGhlIE1JVCBsaWNlbnNlLlxuICogaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2dpb25rdW56L2NoYXJ0aXN0LWpzL21hc3Rlci9MSUNFTlNFLVdURlBMXG4gKiBodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vZ2lvbmt1bnovY2hhcnRpc3QtanMvbWFzdGVyL0xJQ0VOU0UtTUlUXG4gKi9cbi8qKlxuICogVGhlIGNvcmUgbW9kdWxlIG9mIENoYXJ0aXN0IHRoYXQgaXMgbWFpbmx5IHByb3ZpZGluZyBzdGF0aWMgZnVuY3Rpb25zIGFuZCBoaWdoZXIgbGV2ZWwgZnVuY3Rpb25zIGZvciBjaGFydCBtb2R1bGVzLlxuICpcbiAqIEBtb2R1bGUgQ2hhcnRpc3QuQ29yZVxuICovXG52YXIgQ2hhcnRpc3QgPSB7XG4gIHZlcnNpb246ICcwLjkuOCdcbn07XG5cbihmdW5jdGlvbiAod2luZG93LCBkb2N1bWVudCwgQ2hhcnRpc3QpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8qKlxuICAgKiBUaGlzIG9iamVjdCBjb250YWlucyBhbGwgbmFtZXNwYWNlcyB1c2VkIHdpdGhpbiBDaGFydGlzdC5cbiAgICpcbiAgICogQG1lbWJlcm9mIENoYXJ0aXN0LkNvcmVcbiAgICogQHR5cGUge3tzdmc6IHN0cmluZywgeG1sbnM6IHN0cmluZywgeGh0bWw6IHN0cmluZywgeGxpbms6IHN0cmluZywgY3Q6IHN0cmluZ319XG4gICAqL1xuICBDaGFydGlzdC5uYW1lc3BhY2VzID0ge1xuICAgIHN2ZzogJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyxcbiAgICB4bWxuczogJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAveG1sbnMvJyxcbiAgICB4aHRtbDogJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwnLFxuICAgIHhsaW5rOiAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycsXG4gICAgY3Q6ICdodHRwOi8vZ2lvbmt1bnouZ2l0aHViLmNvbS9jaGFydGlzdC1qcy9jdCdcbiAgfTtcblxuICAvKipcbiAgICogSGVscHMgdG8gc2ltcGxpZnkgZnVuY3Rpb25hbCBzdHlsZSBjb2RlXG4gICAqXG4gICAqIEBtZW1iZXJvZiBDaGFydGlzdC5Db3JlXG4gICAqIEBwYXJhbSB7Kn0gbiBUaGlzIGV4YWN0IHZhbHVlIHdpbGwgYmUgcmV0dXJuZWQgYnkgdGhlIG5vb3AgZnVuY3Rpb25cbiAgICogQHJldHVybiB7Kn0gVGhlIHNhbWUgdmFsdWUgdGhhdCB3YXMgcHJvdmlkZWQgdG8gdGhlIG4gcGFyYW1ldGVyXG4gICAqL1xuICBDaGFydGlzdC5ub29wID0gZnVuY3Rpb24gKG4pIHtcbiAgICByZXR1cm4gbjtcbiAgfTtcblxuICAvKipcbiAgICogR2VuZXJhdGVzIGEteiBmcm9tIGEgbnVtYmVyIDAgdG8gMjZcbiAgICpcbiAgICogQG1lbWJlcm9mIENoYXJ0aXN0LkNvcmVcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG4gQSBudW1iZXIgZnJvbSAwIHRvIDI2IHRoYXQgd2lsbCByZXN1bHQgaW4gYSBsZXR0ZXIgYS16XG4gICAqIEByZXR1cm4ge1N0cmluZ30gQSBjaGFyYWN0ZXIgZnJvbSBhLXogYmFzZWQgb24gdGhlIGlucHV0IG51bWJlciBuXG4gICAqL1xuICBDaGFydGlzdC5hbHBoYU51bWVyYXRlID0gZnVuY3Rpb24gKG4pIHtcbiAgICAvLyBMaW1pdCB0byBhLXpcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSg5NyArIG4gJSAyNik7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNpbXBsZSByZWN1cnNpdmUgb2JqZWN0IGV4dGVuZFxuICAgKlxuICAgKiBAbWVtYmVyb2YgQ2hhcnRpc3QuQ29yZVxuICAgKiBAcGFyYW0ge09iamVjdH0gdGFyZ2V0IFRhcmdldCBvYmplY3Qgd2hlcmUgdGhlIHNvdXJjZSB3aWxsIGJlIG1lcmdlZCBpbnRvXG4gICAqIEBwYXJhbSB7T2JqZWN0Li4ufSBzb3VyY2VzIFRoaXMgb2JqZWN0IChvYmplY3RzKSB3aWxsIGJlIG1lcmdlZCBpbnRvIHRhcmdldCBhbmQgdGhlbiB0YXJnZXQgaXMgcmV0dXJuZWRcbiAgICogQHJldHVybiB7T2JqZWN0fSBBbiBvYmplY3QgdGhhdCBoYXMgdGhlIHNhbWUgcmVmZXJlbmNlIGFzIHRhcmdldCBidXQgaXMgZXh0ZW5kZWQgYW5kIG1lcmdlZCB3aXRoIHRoZSBwcm9wZXJ0aWVzIG9mIHNvdXJjZVxuICAgKi9cbiAgQ2hhcnRpc3QuZXh0ZW5kID0gZnVuY3Rpb24gKHRhcmdldCkge1xuICAgIHRhcmdldCA9IHRhcmdldCB8fCB7fTtcblxuICAgIHZhciBzb3VyY2VzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICBzb3VyY2VzLmZvckVhY2goZnVuY3Rpb24oc291cmNlKSB7XG4gICAgICBmb3IgKHZhciBwcm9wIGluIHNvdXJjZSkge1xuICAgICAgICBpZiAodHlwZW9mIHNvdXJjZVtwcm9wXSA9PT0gJ29iamVjdCcgJiYgc291cmNlW3Byb3BdICE9PSBudWxsICYmICEoc291cmNlW3Byb3BdIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICAgICAgdGFyZ2V0W3Byb3BdID0gQ2hhcnRpc3QuZXh0ZW5kKHt9LCB0YXJnZXRbcHJvcF0sIHNvdXJjZVtwcm9wXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGFyZ2V0W3Byb3BdID0gc291cmNlW3Byb3BdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXBsYWNlcyBhbGwgb2NjdXJyZW5jZXMgb2Ygc3ViU3RyIGluIHN0ciB3aXRoIG5ld1N1YlN0ciBhbmQgcmV0dXJucyBhIG5ldyBzdHJpbmcuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBDaGFydGlzdC5Db3JlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IHN1YlN0clxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmV3U3ViU3RyXG4gICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICovXG4gIENoYXJ0aXN0LnJlcGxhY2VBbGwgPSBmdW5jdGlvbihzdHIsIHN1YlN0ciwgbmV3U3ViU3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKG5ldyBSZWdFeHAoc3ViU3RyLCAnZycpLCBuZXdTdWJTdHIpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBhIG51bWJlciB0byBhIHN0cmluZyB3aXRoIGEgdW5pdC4gSWYgYSBzdHJpbmcgaXMgcGFzc2VkIHRoZW4gdGhpcyB3aWxsIGJlIHJldHVybmVkIHVubW9kaWZpZWQuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBDaGFydGlzdC5Db3JlXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB2YWx1ZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gdW5pdFxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IFJldHVybnMgdGhlIHBhc3NlZCBudW1iZXIgdmFsdWUgd2l0aCB1bml0LlxuICAgKi9cbiAgQ2hhcnRpc3QuZW5zdXJlVW5pdCA9IGZ1bmN0aW9uKHZhbHVlLCB1bml0KSB7XG4gICAgaWYodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgICAgdmFsdWUgPSB2YWx1ZSArIHVuaXQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBhIG51bWJlciBvciBzdHJpbmcgdG8gYSBxdWFudGl0eSBvYmplY3QuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBDaGFydGlzdC5Db3JlXG4gICAqIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0gaW5wdXRcbiAgICogQHJldHVybiB7T2JqZWN0fSBSZXR1cm5zIGFuIG9iamVjdCBjb250YWluaW5nIHRoZSB2YWx1ZSBhcyBudW1iZXIgYW5kIHRoZSB1bml0IGFzIHN0cmluZy5cbiAgICovXG4gIENoYXJ0aXN0LnF1YW50aXR5ID0gZnVuY3Rpb24oaW5wdXQpIHtcbiAgICBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgdmFyIG1hdGNoID0gKC9eKFxcZCspXFxzKiguKikkL2cpLmV4ZWMoaW5wdXQpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdmFsdWUgOiArbWF0Y2hbMV0sXG4gICAgICAgIHVuaXQ6IG1hdGNoWzJdIHx8IHVuZGVmaW5lZFxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHsgdmFsdWU6IGlucHV0IH07XG4gIH07XG5cbiAgLyoqXG4gICAqIFRoaXMgaXMgYSB3cmFwcGVyIGFyb3VuZCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yIHRoYXQgd2lsbCByZXR1cm4gdGhlIHF1ZXJ5IGlmIGl0J3MgYWxyZWFkeSBvZiB0eXBlIE5vZGVcbiAgICpcbiAgICogQG1lbWJlcm9mIENoYXJ0aXN0LkNvcmVcbiAgICogQHBhcmFtIHtTdHJpbmd8Tm9kZX0gcXVlcnkgVGhlIHF1ZXJ5IHRvIHVzZSBmb3Igc2VsZWN0aW5nIGEgTm9kZSBvciBhIERPTSBub2RlIHRoYXQgd2lsbCBiZSByZXR1cm5lZCBkaXJlY3RseVxuICAgKiBAcmV0dXJuIHtOb2RlfVxuICAgKi9cbiAgQ2hhcnRpc3QucXVlcnlTZWxlY3RvciA9IGZ1bmN0aW9uKHF1ZXJ5KSB7XG4gICAgcmV0dXJuIHF1ZXJ5IGluc3RhbmNlb2YgTm9kZSA/IHF1ZXJ5IDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihxdWVyeSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEZ1bmN0aW9uYWwgc3R5bGUgaGVscGVyIHRvIHByb2R1Y2UgYXJyYXkgd2l0aCBnaXZlbiBsZW5ndGggaW5pdGlhbGl6ZWQgd2l0aCB1bmRlZmluZWQgdmFsdWVzXG4gICAqXG4gICAqIEBtZW1iZXJvZiBDaGFydGlzdC5Db3JlXG4gICAqIEBwYXJhbSBsZW5ndGhcbiAgICogQHJldHVybiB7QXJyYXl9XG4gICAqL1xuICBDaGFydGlzdC50aW1lcyA9IGZ1bmN0aW9uKGxlbmd0aCkge1xuICAgIHJldHVybiBBcnJheS5hcHBseShudWxsLCBuZXcgQXJyYXkobGVuZ3RoKSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFN1bSBoZWxwZXIgdG8gYmUgdXNlZCBpbiByZWR1Y2UgZnVuY3Rpb25zXG4gICAqXG4gICAqIEBtZW1iZXJvZiBDaGFydGlzdC5Db3JlXG4gICAqIEBwYXJhbSBwcmV2aW91c1xuICAgKiBAcGFyYW0gY3VycmVudFxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgQ2hhcnRpc3Quc3VtID0gZnVuY3Rpb24ocHJldmlvdXMsIGN1cnJlbnQpIHtcbiAgICByZXR1cm4gcHJldmlvdXMgKyAoY3VycmVudCA/IGN1cnJlbnQgOiAwKTtcbiAgfTtcblxuICAvKipcbiAgICogTXVsdGlwbHkgaGVscGVyIHRvIGJlIHVzZWQgaW4gYEFycmF5Lm1hcGAgZm9yIG11bHRpcGx5aW5nIGVhY2ggdmFsdWUgb2YgYW4gYXJyYXkgd2l0aCBhIGZhY3Rvci5cbiAgICpcbiAgICogQG1lbWJlcm9mIENoYXJ0aXN0LkNvcmVcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGZhY3RvclxuICAgKiBAcmV0dXJucyB7RnVuY3Rpb259IEZ1bmN0aW9uIHRoYXQgY2FuIGJlIHVzZWQgaW4gYEFycmF5Lm1hcGAgdG8gbXVsdGlwbHkgZWFjaCB2YWx1ZSBpbiBhbiBhcnJheVxuICAgKi9cbiAgQ2hhcnRpc3QubWFwTXVsdGlwbHkgPSBmdW5jdGlvbihmYWN0b3IpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24obnVtKSB7XG4gICAgICByZXR1cm4gbnVtICogZmFjdG9yO1xuICAgIH07XG4gIH07XG5cbiAgLyoqXG4gICAqIEFkZCBoZWxwZXIgdG8gYmUgdXNlZCBpbiBgQXJyYXkubWFwYCBmb3IgYWRkaW5nIGEgYWRkZW5kIHRvIGVhY2ggdmFsdWUgb2YgYW4gYXJyYXkuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBDaGFydGlzdC5Db3JlXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBhZGRlbmRcbiAgICogQHJldHVybnMge0Z1bmN0aW9ufSBGdW5jdGlvbiB0aGF0IGNhbiBiZSB1c2VkIGluIGBBcnJheS5tYXBgIHRvIGFkZCBhIGFkZGVuZCB0byBlYWNoIHZhbHVlIGluIGFuIGFycmF5XG4gICAqL1xuICBDaGFydGlzdC5tYXBBZGQgPSBmdW5jdGlvbihhZGRlbmQpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24obnVtKSB7XG4gICAgICByZXR1cm4gbnVtICsgYWRkZW5kO1xuICAgIH07XG4gIH07XG5cbiAgLyoqXG4gICAqIE1hcCBmb3IgbXVsdGkgZGltZW5zaW9uYWwgYXJyYXlzIHdoZXJlIHRoZWlyIG5lc3RlZCBhcnJheXMgd2lsbCBiZSBtYXBwZWQgaW4gc2VyaWFsLiBUaGUgb3V0cHV0IGFycmF5IHdpbGwgaGF2ZSB0aGUgbGVuZ3RoIG9mIHRoZSBsYXJnZXN0IG5lc3RlZCBhcnJheS4gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aXRoIHZhcmlhYmxlIGFyZ3VtZW50cyB3aGVyZSBlYWNoIGFyZ3VtZW50IGlzIHRoZSBuZXN0ZWQgYXJyYXkgdmFsdWUgKG9yIHVuZGVmaW5lZCBpZiB0aGVyZSBhcmUgbm8gbW9yZSB2YWx1ZXMpLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgQ2hhcnRpc3QuQ29yZVxuICAgKiBAcGFyYW0gYXJyXG4gICAqIEBwYXJhbSBjYlxuICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICovXG4gIENoYXJ0aXN0LnNlcmlhbE1hcCA9IGZ1bmN0aW9uKGFyciwgY2IpIHtcbiAgICB2YXIgcmVzdWx0ID0gW10sXG4gICAgICAgIGxlbmd0aCA9IE1hdGgubWF4LmFwcGx5KG51bGwsIGFyci5tYXAoZnVuY3Rpb24oZSkge1xuICAgICAgICAgIHJldHVybiBlLmxlbmd0aDtcbiAgICAgICAgfSkpO1xuXG4gICAgQ2hhcnRpc3QudGltZXMobGVuZ3RoKS5mb3JFYWNoKGZ1bmN0aW9uKGUsIGluZGV4KSB7XG4gICAgICB2YXIgYXJncyA9IGFyci5tYXAoZnVuY3Rpb24oZSkge1xuICAgICAgICByZXR1cm4gZVtpbmRleF07XG4gICAgICB9KTtcblxuICAgICAgcmVzdWx0W2luZGV4XSA9IGNiLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICAvKipcbiAgICogVGhpcyBoZWxwZXIgZnVuY3Rpb24gY2FuIGJlIHVzZWQgdG8gcm91bmQgdmFsdWVzIHdpdGggY2VydGFpbiBwcmVjaXNpb24gbGV2ZWwgYWZ0ZXIgZGVjaW1hbC4gVGhpcyBpcyB1c2VkIHRvIHByZXZlbnQgcm91bmRpbmcgZXJyb3JzIG5lYXIgZmxvYXQgcG9pbnQgcHJlY2lzaW9uIGxpbWl0LlxuICAgKlxuICAgKiBAbWVtYmVyb2YgQ2hhcnRpc3QuQ29yZVxuICAgKiBAcGFyYW0ge051bWJlcn0gdmFsdWUgVGhlIHZhbHVlIHRoYXQgc2hvdWxkIGJlIHJvdW5kZWQgd2l0aCBwcmVjaXNpb25cbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtkaWdpdHNdIFRoZSBudW1iZXIgb2YgZGlnaXRzIGFmdGVyIGRlY2ltYWwgdXNlZCB0byBkbyB0aGUgcm91bmRpbmdcbiAgICogQHJldHVybnMge251bWJlcn0gUm91bmRlZCB2YWx1ZVxuICAgKi9cbiAgQ2hhcnRpc3Qucm91bmRXaXRoUHJlY2lzaW9uID0gZnVuY3Rpb24odmFsdWUsIGRpZ2l0cykge1xuICAgIHZhciBwcmVjaXNpb24gPSBNYXRoLnBvdygxMCwgZGlnaXRzIHx8IENoYXJ0aXN0LnByZWNpc2lvbik7XG4gICAgcmV0dXJuIE1hdGgucm91bmQodmFsdWUgKiBwcmVjaXNpb24pIC8gcHJlY2lzaW9uO1xuICB9O1xuXG4gIC8qKlxuICAgKiBQcmVjaXNpb24gbGV2ZWwgdXNlZCBpbnRlcm5hbGx5IGluIENoYXJ0aXN0IGZvciByb3VuZGluZy4gSWYgeW91IHJlcXVpcmUgbW9yZSBkZWNpbWFsIHBsYWNlcyB5b3UgY2FuIGluY3JlYXNlIHRoaXMgbnVtYmVyLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgQ2hhcnRpc3QuQ29yZVxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKi9cbiAgQ2hhcnRpc3QucHJlY2lzaW9uID0gODtcblxuICAvKipcbiAgICogQSBtYXAgd2l0aCBjaGFyYWN0ZXJzIHRvIGVzY2FwZSBmb3Igc3RyaW5ncyB0byBiZSBzYWZlbHkgdXNlZCBhcyBhdHRyaWJ1dGUgdmFsdWVzLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgQ2hhcnRpc3QuQ29yZVxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cbiAgQ2hhcnRpc3QuZXNjYXBpbmdNYXAgPSB7XG4gICAgJyYnOiAnJmFtcDsnLFxuICAgICc8JzogJyZsdDsnLFxuICAgICc+JzogJyZndDsnLFxuICAgICdcIic6ICcmcXVvdDsnLFxuICAgICdcXCcnOiAnJiMwMzk7J1xuICB9O1xuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIHNlcmlhbGl6ZXMgYXJiaXRyYXJ5IGRhdGEgdG8gYSBzdHJpbmcuIEluIGNhc2Ugb2YgZGF0YSB0aGF0IGNhbid0IGJlIGVhc2lseSBjb252ZXJ0ZWQgdG8gYSBzdHJpbmcsIHRoaXMgZnVuY3Rpb24gd2lsbCBjcmVhdGUgYSB3cmFwcGVyIG9iamVjdCBhbmQgc2VyaWFsaXplIHRoZSBkYXRhIHVzaW5nIEpTT04uc3RyaW5naWZ5LiBUaGUgb3V0Y29taW5nIHN0cmluZyB3aWxsIGFsd2F5cyBiZSBlc2NhcGVkIHVzaW5nIENoYXJ0aXN0LmVzY2FwaW5nTWFwLlxuICAgKiBJZiBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCB0aGUgZnVuY3Rpb24gd2lsbCByZXR1cm4gaW1tZWRpYXRlbHkgd2l0aCBudWxsIG9yIHVuZGVmaW5lZC5cbiAgICpcbiAgICogQG1lbWJlcm9mIENoYXJ0aXN0LkNvcmVcbiAgICogQHBhcmFtIHtOdW1iZXJ8U3RyaW5nfE9iamVjdH0gZGF0YVxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqL1xuICBDaGFydGlzdC5zZXJpYWxpemUgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgaWYoZGF0YSA9PT0gbnVsbCB8fCBkYXRhID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH0gZWxzZSBpZih0eXBlb2YgZGF0YSA9PT0gJ251bWJlcicpIHtcbiAgICAgIGRhdGEgPSAnJytkYXRhO1xuICAgIH0gZWxzZSBpZih0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGRhdGEgPSBKU09OLnN0cmluZ2lmeSh7ZGF0YTogZGF0YX0pO1xuICAgIH1cblxuICAgIHJldHVybiBPYmplY3Qua2V5cyhDaGFydGlzdC5lc2NhcGluZ01hcCkucmVkdWNlKGZ1bmN0aW9uKHJlc3VsdCwga2V5KSB7XG4gICAgICByZXR1cm4gQ2hhcnRpc3QucmVwbGFjZUFsbChyZXN1bHQsIGtleSwgQ2hhcnRpc3QuZXNjYXBpbmdNYXBba2V5XSk7XG4gICAgfSwgZGF0YSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gZGUtc2VyaWFsaXplcyBhIHN0cmluZyBwcmV2aW91c2x5IHNlcmlhbGl6ZWQgd2l0aCBDaGFydGlzdC5zZXJpYWxpemUuIFRoZSBzdHJpbmcgd2lsbCBhbHdheXMgYmUgdW5lc2NhcGVkIHVzaW5nIENoYXJ0aXN0LmVzY2FwaW5nTWFwIGJlZm9yZSBpdCdzIHJldHVybmVkLiBCYXNlZCBvbiB0aGUgaW5wdXQgdmFsdWUgdGhlIHJldHVybiB0eXBlIGNhbiBiZSBOdW1iZXIsIFN0cmluZyBvciBPYmplY3QuIEpTT04ucGFyc2UgaXMgdXNlZCB3aXRoIHRyeSAvIGNhdGNoIHRvIHNlZSBpZiB0aGUgdW5lc2NhcGVkIHN0cmluZyBjYW4gYmUgcGFyc2VkIGludG8gYW4gT2JqZWN0IGFuZCB0aGlzIE9iamVjdCB3aWxsIGJlIHJldHVybmVkIG9uIHN1Y2Nlc3MuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBDaGFydGlzdC5Db3JlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBkYXRhXG4gICAqIEByZXR1cm4ge1N0cmluZ3xOdW1iZXJ8T2JqZWN0fVxuICAgKi9cbiAgQ2hhcnRpc3QuZGVzZXJpYWxpemUgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgaWYodHlwZW9mIGRhdGEgIT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICBkYXRhID0gT2JqZWN0LmtleXMoQ2hhcnRpc3QuZXNjYXBpbmdNYXApLnJlZHVjZShmdW5jdGlvbihyZXN1bHQsIGtleSkge1xuICAgICAgcmV0dXJuIENoYXJ0aXN0LnJlcGxhY2VBbGwocmVzdWx0LCBDaGFydGlzdC5lc2NhcGluZ01hcFtrZXldLCBrZXkpO1xuICAgIH0sIGRhdGEpO1xuXG4gICAgdHJ5IHtcbiAgICAgIGRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgZGF0YSA9IGRhdGEuZGF0YSAhPT0gdW5kZWZpbmVkID8gZGF0YS5kYXRhIDogZGF0YTtcbiAgICB9IGNhdGNoKGUpIHt9XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfTtcblxuICAvKipcbiAgICogQ3JlYXRlIG9yIHJlaW5pdGlhbGl6ZSB0aGUgU1ZHIGVsZW1lbnQgZm9yIHRoZSBjaGFydFxuICAgKlxuICAgKiBAbWVtYmVyb2YgQ2hhcnRpc3QuQ29yZVxuICAgKiBAcGFyYW0ge05vZGV9IGNvbnRhaW5lciBUaGUgY29udGFpbmluZyBET00gTm9kZSBvYmplY3QgdGhhdCB3aWxsIGJlIHVzZWQgdG8gcGxhbnQgdGhlIFNWRyBlbGVtZW50XG4gICAqIEBwYXJhbSB7U3RyaW5nfSB3aWR0aCBTZXQgdGhlIHdpZHRoIG9mIHRoZSBTVkcgZWxlbWVudC4gRGVmYXVsdCBpcyAxMDAlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBoZWlnaHQgU2V0IHRoZSBoZWlnaHQgb2YgdGhlIFNWRyBlbGVtZW50LiBEZWZhdWx0IGlzIDEwMCVcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNsYXNzTmFtZSBTcGVjaWZ5IGEgY2xhc3MgdG8gYmUgYWRkZWQgdG8gdGhlIFNWRyBlbGVtZW50XG4gICAqIEByZXR1cm4ge09iamVjdH0gVGhlIGNyZWF0ZWQvcmVpbml0aWFsaXplZCBTVkcgZWxlbWVudFxuICAgKi9cbiAgQ2hhcnRpc3QuY3JlYXRlU3ZnID0gZnVuY3Rpb24gKGNvbnRhaW5lciwgd2lkdGgsIGhlaWdodCwgY2xhc3NOYW1lKSB7XG4gICAgdmFyIHN2ZztcblxuICAgIHdpZHRoID0gd2lkdGggfHwgJzEwMCUnO1xuICAgIGhlaWdodCA9IGhlaWdodCB8fCAnMTAwJSc7XG5cbiAgICAvLyBDaGVjayBpZiB0aGVyZSBpcyBhIHByZXZpb3VzIFNWRyBlbGVtZW50IGluIHRoZSBjb250YWluZXIgdGhhdCBjb250YWlucyB0aGUgQ2hhcnRpc3QgWE1MIG5hbWVzcGFjZSBhbmQgcmVtb3ZlIGl0XG4gICAgLy8gU2luY2UgdGhlIERPTSBBUEkgZG9lcyBub3Qgc3VwcG9ydCBuYW1lc3BhY2VzIHdlIG5lZWQgdG8gbWFudWFsbHkgc2VhcmNoIHRoZSByZXR1cm5lZCBsaXN0IGh0dHA6Ly93d3cudzMub3JnL1RSL3NlbGVjdG9ycy1hcGkvXG4gICAgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ3N2ZycpKS5maWx0ZXIoZnVuY3Rpb24gZmlsdGVyQ2hhcnRpc3RTdmdPYmplY3RzKHN2Zykge1xuICAgICAgcmV0dXJuIHN2Zy5nZXRBdHRyaWJ1dGVOUyhDaGFydGlzdC5uYW1lc3BhY2VzLnhtbG5zLCAnY3QnKTtcbiAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uIHJlbW92ZVByZXZpb3VzRWxlbWVudChzdmcpIHtcbiAgICAgIGNvbnRhaW5lci5yZW1vdmVDaGlsZChzdmcpO1xuICAgIH0pO1xuXG4gICAgLy8gQ3JlYXRlIHN2ZyBvYmplY3Qgd2l0aCB3aWR0aCBhbmQgaGVpZ2h0IG9yIHVzZSAxMDAlIGFzIGRlZmF1bHRcbiAgICBzdmcgPSBuZXcgQ2hhcnRpc3QuU3ZnKCdzdmcnKS5hdHRyKHtcbiAgICAgIHdpZHRoOiB3aWR0aCxcbiAgICAgIGhlaWdodDogaGVpZ2h0XG4gICAgfSkuYWRkQ2xhc3MoY2xhc3NOYW1lKS5hdHRyKHtcbiAgICAgIHN0eWxlOiAnd2lkdGg6ICcgKyB3aWR0aCArICc7IGhlaWdodDogJyArIGhlaWdodCArICc7J1xuICAgIH0pO1xuXG4gICAgLy8gQWRkIHRoZSBET00gbm9kZSB0byBvdXIgY29udGFpbmVyXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHN2Zy5fbm9kZSk7XG5cbiAgICByZXR1cm4gc3ZnO1xuICB9O1xuXG4gIC8qKlxuICAgKiBFbnN1cmVzIHRoYXQgdGhlIGRhdGEgb2JqZWN0IHBhc3NlZCBhcyBzZWNvbmQgYXJndW1lbnQgdG8gdGhlIGNoYXJ0cyBpcyBwcmVzZW50IGFuZCBjb3JyZWN0bHkgaW5pdGlhbGl6ZWQuXG4gICAqXG4gICAqIEBwYXJhbSAge09iamVjdH0gZGF0YSBUaGUgZGF0YSBvYmplY3QgdGhhdCBpcyBwYXNzZWQgYXMgc2Vjb25kIGFyZ3VtZW50IHRvIHRoZSBjaGFydHNcbiAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgbm9ybWFsaXplZCBkYXRhIG9iamVjdFxuICAgKi9cbiAgQ2hhcnRpc3Qubm9ybWFsaXplRGF0YSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAvLyBFbnN1cmUgZGF0YSBpcyBwcmVzZW50IG90aGVyd2lzZSBlbmZvcmNlXG4gICAgZGF0YSA9IGRhdGEgfHwge3NlcmllczogW10sIGxhYmVsczogW119O1xuICAgIGRhdGEuc2VyaWVzID0gZGF0YS5zZXJpZXMgfHwgW107XG4gICAgZGF0YS5sYWJlbHMgPSBkYXRhLmxhYmVscyB8fCBbXTtcblxuICAgIC8vIENoZWNrIGlmIHdlIHNob3VsZCBnZW5lcmF0ZSBzb21lIGxhYmVscyBiYXNlZCBvbiBleGlzdGluZyBzZXJpZXMgZGF0YVxuICAgIGlmIChkYXRhLnNlcmllcy5sZW5ndGggPiAwICYmIGRhdGEubGFiZWxzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdmFyIG5vcm1hbGl6ZWQgPSBDaGFydGlzdC5nZXREYXRhQXJyYXkoZGF0YSksXG4gICAgICAgICAgbGFiZWxDb3VudDtcblxuICAgICAgLy8gSWYgYWxsIGVsZW1lbnRzIG9mIHRoZSBub3JtYWxpemVkIGRhdGEgYXJyYXkgYXJlIGFycmF5cyB3ZSdyZSBkZWFsaW5nIHdpdGhcbiAgICAgIC8vIGRhdGEgZnJvbSBCYXIgb3IgTGluZSBjaGFydHMgYW5kIHdlIG5lZWQgdG8gZmluZCB0aGUgbGFyZ2VzdCBzZXJpZXMgaWYgdGhleSBhcmUgdW4tZXZlblxuICAgICAgaWYgKG5vcm1hbGl6ZWQuZXZlcnkoZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgQXJyYXk7XG4gICAgICB9KSkge1xuICAgICAgICAvLyBHZXR0aW5nIHRoZSBzZXJpZXMgd2l0aCB0aGUgdGhlIG1vc3QgZWxlbWVudHNcbiAgICAgICAgbGFiZWxDb3VudCA9IE1hdGgubWF4LmFwcGx5KG51bGwsIG5vcm1hbGl6ZWQubWFwKGZ1bmN0aW9uKHNlcmllcykge1xuICAgICAgICAgIHJldHVybiBzZXJpZXMubGVuZ3RoO1xuICAgICAgICB9KSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBXZSdyZSBkZWFsaW5nIHdpdGggUGllIGRhdGEgc28gd2UganVzdCB0YWtlIHRoZSBub3JtYWxpemVkIGFycmF5IGxlbmd0aFxuICAgICAgICBsYWJlbENvdW50ID0gbm9ybWFsaXplZC5sZW5ndGg7XG4gICAgICB9XG5cbiAgICAgIC8vIFNldHRpbmcgbGFiZWxzIHRvIGFuIGFycmF5IHdpdGggZW1wdHJ5IHN0cmluZ3MgdXNpbmcgb3VyIGxhYmVsQ291bnQgZXN0aW1hdGVkIGFib3ZlXG4gICAgICBkYXRhLmxhYmVscyA9IENoYXJ0aXN0LnRpbWVzKGxhYmVsQ291bnQpLm1hcChmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXZlcnNlcyB0aGUgc2VyaWVzLCBsYWJlbHMgYW5kIHNlcmllcyBkYXRhIGFycmF5cy5cbiAgICpcbiAgICogQG1lbWJlcm9mIENoYXJ0aXN0LkNvcmVcbiAgICogQHBhcmFtIGRhdGFcbiAgICovXG4gIENoYXJ0aXN0LnJldmVyc2VEYXRhID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIGRhdGEubGFiZWxzLnJldmVyc2UoKTtcbiAgICBkYXRhLnNlcmllcy5yZXZlcnNlKCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLnNlcmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYodHlwZW9mKGRhdGEuc2VyaWVzW2ldKSA9PT0gJ29iamVjdCcgJiYgZGF0YS5zZXJpZXNbaV0uZGF0YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGRhdGEuc2VyaWVzW2ldLmRhdGEucmV2ZXJzZSgpO1xuICAgICAgfSBlbHNlIGlmKGRhdGEuc2VyaWVzW2ldIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgZGF0YS5zZXJpZXNbaV0ucmV2ZXJzZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQ29udmVydCBkYXRhIHNlcmllcyBpbnRvIHBsYWluIGFycmF5XG4gICAqXG4gICAqIEBtZW1iZXJvZiBDaGFydGlzdC5Db3JlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIFRoZSBzZXJpZXMgb2JqZWN0IHRoYXQgY29udGFpbnMgdGhlIGRhdGEgdG8gYmUgdmlzdWFsaXplZCBpbiB0aGUgY2hhcnRcbiAgICogQHBhcmFtIHtCb29sZWFufSByZXZlcnNlIElmIHRydWUgdGhlIHdob2xlIGRhdGEgaXMgcmV2ZXJzZWQgYnkgdGhlIGdldERhdGFBcnJheSBjYWxsLiBUaGlzIHdpbGwgbW9kaWZ5IHRoZSBkYXRhIG9iamVjdCBwYXNzZWQgYXMgZmlyc3QgcGFyYW1ldGVyLiBUaGUgbGFiZWxzIGFzIHdlbGwgYXMgdGhlIHNlcmllcyBvcmRlciBpcyByZXZlcnNlZC4gVGhlIHdob2xlIHNlcmllcyBkYXRhIGFycmF5cyBhcmUgcmV2ZXJzZWQgdG9vLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IG11bHRpIENyZWF0ZSBhIG11bHRpIGRpbWVuc2lvbmFsIGFycmF5IGZyb20gYSBzZXJpZXMgZGF0YSBhcnJheSB3aGVyZSBhIHZhbHVlIG9iamVjdCB3aXRoIGB4YCBhbmQgYHlgIHZhbHVlcyB3aWxsIGJlIGNyZWF0ZWQuXG4gICAqIEByZXR1cm4ge0FycmF5fSBBIHBsYWluIGFycmF5IHRoYXQgY29udGFpbnMgdGhlIGRhdGEgdG8gYmUgdmlzdWFsaXplZCBpbiB0aGUgY2hhcnRcbiAgICovXG4gIENoYXJ0aXN0LmdldERhdGFBcnJheSA9IGZ1bmN0aW9uIChkYXRhLCByZXZlcnNlLCBtdWx0aSkge1xuICAgIC8vIElmIHRoZSBkYXRhIHNob3VsZCBiZSByZXZlcnNlZCBidXQgaXNuJ3Qgd2UgbmVlZCB0byByZXZlcnNlIGl0XG4gICAgLy8gSWYgaXQncyByZXZlcnNlZCBidXQgaXQgc2hvdWxkbid0IHdlIG5lZWQgdG8gcmV2ZXJzZSBpdCBiYWNrXG4gICAgLy8gVGhhdCdzIHJlcXVpcmVkIHRvIGhhbmRsZSBkYXRhIHVwZGF0ZXMgY29ycmVjdGx5IGFuZCB0byByZWZsZWN0IHRoZSByZXNwb25zaXZlIGNvbmZpZ3VyYXRpb25zXG4gICAgaWYocmV2ZXJzZSAmJiAhZGF0YS5yZXZlcnNlZCB8fCAhcmV2ZXJzZSAmJiBkYXRhLnJldmVyc2VkKSB7XG4gICAgICBDaGFydGlzdC5yZXZlcnNlRGF0YShkYXRhKTtcbiAgICAgIGRhdGEucmV2ZXJzZWQgPSAhZGF0YS5yZXZlcnNlZDtcbiAgICB9XG5cbiAgICAvLyBSZWN1cnNpdmVseSB3YWxrcyB0aHJvdWdoIG5lc3RlZCBhcnJheXMgYW5kIGNvbnZlcnQgc3RyaW5nIHZhbHVlcyB0byBudW1iZXJzIGFuZCBvYmplY3RzIHdpdGggdmFsdWUgcHJvcGVydGllc1xuICAgIC8vIHRvIHZhbHVlcy4gQ2hlY2sgdGhlIHRlc3RzIGluIGRhdGEgY29yZSAtPiBkYXRhIG5vcm1hbGl6YXRpb24gZm9yIGEgZGV0YWlsZWQgc3BlY2lmaWNhdGlvbiBvZiBleHBlY3RlZCB2YWx1ZXNcbiAgICBmdW5jdGlvbiByZWN1cnNpdmVDb252ZXJ0KHZhbHVlKSB7XG4gICAgICBpZihDaGFydGlzdC5pc0ZhbHNleUJ1dFplcm8odmFsdWUpKSB7XG4gICAgICAgIC8vIFRoaXMgaXMgYSBob2xlIGluIGRhdGEgYW5kIHdlIHNob3VsZCByZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9IGVsc2UgaWYoKHZhbHVlLmRhdGEgfHwgdmFsdWUpIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgcmV0dXJuICh2YWx1ZS5kYXRhIHx8IHZhbHVlKS5tYXAocmVjdXJzaXZlQ29udmVydCk7XG4gICAgICB9IGVsc2UgaWYodmFsdWUuaGFzT3duUHJvcGVydHkoJ3ZhbHVlJykpIHtcbiAgICAgICAgcmV0dXJuIHJlY3Vyc2l2ZUNvbnZlcnQodmFsdWUudmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYobXVsdGkpIHtcbiAgICAgICAgICB2YXIgbXVsdGlWYWx1ZSA9IHt9O1xuXG4gICAgICAgICAgLy8gU2luZ2xlIHNlcmllcyB2YWx1ZSBhcnJheXMgYXJlIGFzc3VtZWQgdG8gc3BlY2lmeSB0aGUgWS1BeGlzIHZhbHVlXG4gICAgICAgICAgLy8gRm9yIGV4YW1wbGU6IFsxLCAyXSA9PiBbe3g6IHVuZGVmaW5lZCwgeTogMX0sIHt4OiB1bmRlZmluZWQsIHk6IDJ9XVxuICAgICAgICAgIC8vIElmIG11bHRpIGlzIGEgc3RyaW5nIHRoZW4gaXQncyBhc3N1bWVkIHRoYXQgaXQgc3BlY2lmaWVkIHdoaWNoIGRpbWVuc2lvbiBzaG91bGQgYmUgZmlsbGVkIGFzIGRlZmF1bHRcbiAgICAgICAgICBpZih0eXBlb2YgbXVsdGkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBtdWx0aVZhbHVlW211bHRpXSA9IENoYXJ0aXN0LmdldE51bWJlck9yVW5kZWZpbmVkKHZhbHVlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbXVsdGlWYWx1ZS55ID0gQ2hhcnRpc3QuZ2V0TnVtYmVyT3JVbmRlZmluZWQodmFsdWUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG11bHRpVmFsdWUueCA9IHZhbHVlLmhhc093blByb3BlcnR5KCd4JykgPyBDaGFydGlzdC5nZXROdW1iZXJPclVuZGVmaW5lZCh2YWx1ZS54KSA6IG11bHRpVmFsdWUueDtcbiAgICAgICAgICBtdWx0aVZhbHVlLnkgPSB2YWx1ZS5oYXNPd25Qcm9wZXJ0eSgneScpID8gQ2hhcnRpc3QuZ2V0TnVtYmVyT3JVbmRlZmluZWQodmFsdWUueSkgOiBtdWx0aVZhbHVlLnk7XG5cbiAgICAgICAgICByZXR1cm4gbXVsdGlWYWx1ZTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBDaGFydGlzdC5nZXROdW1iZXJPclVuZGVmaW5lZCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YS5zZXJpZXMubWFwKHJlY3Vyc2l2ZUNvbnZlcnQpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBhIG51bWJlciBpbnRvIGEgcGFkZGluZyBvYmplY3QuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBDaGFydGlzdC5Db3JlXG4gICAqIEBwYXJhbSB7T2JqZWN0fE51bWJlcn0gcGFkZGluZ1xuICAgKiBAcGFyYW0ge051bWJlcn0gW2ZhbGxiYWNrXSBUaGlzIHZhbHVlIGlzIHVzZWQgdG8gZmlsbCBtaXNzaW5nIHZhbHVlcyBpZiBhIGluY29tcGxldGUgcGFkZGluZyBvYmplY3Qgd2FzIHBhc3NlZFxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGEgcGFkZGluZyBvYmplY3QgY29udGFpbmluZyB0b3AsIHJpZ2h0LCBib3R0b20sIGxlZnQgcHJvcGVydGllcyBmaWxsZWQgd2l0aCB0aGUgcGFkZGluZyBudW1iZXIgcGFzc2VkIGluIGFzIGFyZ3VtZW50LiBJZiB0aGUgYXJndW1lbnQgaXMgc29tZXRoaW5nIGVsc2UgdGhhbiBhIG51bWJlciAocHJlc3VtYWJseSBhbHJlYWR5IGEgY29ycmVjdCBwYWRkaW5nIG9iamVjdCkgdGhlbiB0aGlzIGFyZ3VtZW50IGlzIGRpcmVjdGx5IHJldHVybmVkLlxuICAgKi9cbiAgQ2hhcnRpc3Qubm9ybWFsaXplUGFkZGluZyA9IGZ1bmN0aW9uKHBhZGRpbmcsIGZhbGxiYWNrKSB7XG4gICAgZmFsbGJhY2sgPSBmYWxsYmFjayB8fCAwO1xuXG4gICAgcmV0dXJuIHR5cGVvZiBwYWRkaW5nID09PSAnbnVtYmVyJyA/IHtcbiAgICAgIHRvcDogcGFkZGluZyxcbiAgICAgIHJpZ2h0OiBwYWRkaW5nLFxuICAgICAgYm90dG9tOiBwYWRkaW5nLFxuICAgICAgbGVmdDogcGFkZGluZ1xuICAgIH0gOiB7XG4gICAgICB0b3A6IHR5cGVvZiBwYWRkaW5nLnRvcCA9PT0gJ251bWJlcicgPyBwYWRkaW5nLnRvcCA6IGZhbGxiYWNrLFxuICAgICAgcmlnaHQ6IHR5cGVvZiBwYWRkaW5nLnJpZ2h0ID09PSAnbnVtYmVyJyA/IHBhZGRpbmcucmlnaHQgOiBmYWxsYmFjayxcbiAgICAgIGJvdHRvbTogdHlwZW9mIHBhZGRpbmcuYm90dG9tID09PSAnbnVtYmVyJyA/IHBhZGRpbmcuYm90dG9tIDogZmFsbGJhY2ssXG4gICAgICBsZWZ0OiB0eXBlb2YgcGFkZGluZy5sZWZ0ID09PSAnbnVtYmVyJyA/IHBhZGRpbmcubGVmdCA6IGZhbGxiYWNrXG4gICAgfTtcbiAgfTtcblxuICBDaGFydGlzdC5nZXRNZXRhRGF0YSA9IGZ1bmN0aW9uKHNlcmllcywgaW5kZXgpIHtcbiAgICB2YXIgdmFsdWUgPSBzZXJpZXMuZGF0YSA/IHNlcmllcy5kYXRhW2luZGV4XSA6IHNlcmllc1tpbmRleF07XG4gICAgcmV0dXJuIHZhbHVlID8gQ2hhcnRpc3Quc2VyaWFsaXplKHZhbHVlLm1ldGEpIDogdW5kZWZpbmVkO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGUgdGhlIG9yZGVyIG9mIG1hZ25pdHVkZSBmb3IgdGhlIGNoYXJ0IHNjYWxlXG4gICAqXG4gICAqIEBtZW1iZXJvZiBDaGFydGlzdC5Db3JlXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB2YWx1ZSBUaGUgdmFsdWUgUmFuZ2Ugb2YgdGhlIGNoYXJ0XG4gICAqIEByZXR1cm4ge051bWJlcn0gVGhlIG9yZGVyIG9mIG1hZ25pdHVkZVxuICAgKi9cbiAgQ2hhcnRpc3Qub3JkZXJPZk1hZ25pdHVkZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgubG9nKE1hdGguYWJzKHZhbHVlKSkgLyBNYXRoLkxOMTApO1xuICB9O1xuXG4gIC8qKlxuICAgKiBQcm9qZWN0IGEgZGF0YSBsZW5ndGggaW50byBzY3JlZW4gY29vcmRpbmF0ZXMgKHBpeGVscylcbiAgICpcbiAgICogQG1lbWJlcm9mIENoYXJ0aXN0LkNvcmVcbiAgICogQHBhcmFtIHtPYmplY3R9IGF4aXNMZW5ndGggVGhlIHN2ZyBlbGVtZW50IGZvciB0aGUgY2hhcnRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGxlbmd0aCBTaW5nbGUgZGF0YSB2YWx1ZSBmcm9tIGEgc2VyaWVzIGFycmF5XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBib3VuZHMgQWxsIHRoZSB2YWx1ZXMgdG8gc2V0IHRoZSBib3VuZHMgb2YgdGhlIGNoYXJ0XG4gICAqIEByZXR1cm4ge051bWJlcn0gVGhlIHByb2plY3RlZCBkYXRhIGxlbmd0aCBpbiBwaXhlbHNcbiAgICovXG4gIENoYXJ0aXN0LnByb2plY3RMZW5ndGggPSBmdW5jdGlvbiAoYXhpc0xlbmd0aCwgbGVuZ3RoLCBib3VuZHMpIHtcbiAgICByZXR1cm4gbGVuZ3RoIC8gYm91bmRzLnJhbmdlICogYXhpc0xlbmd0aDtcbiAgfTtcblxuICAvKipcbiAgICogR2V0IHRoZSBoZWlnaHQgb2YgdGhlIGFyZWEgaW4gdGhlIGNoYXJ0IGZvciB0aGUgZGF0YSBzZXJpZXNcbiAgICpcbiAgICogQG1lbWJlcm9mIENoYXJ0aXN0LkNvcmVcbiAgICogQHBhcmFtIHtPYmplY3R9IHN2ZyBUaGUgc3ZnIGVsZW1lbnQgZm9yIHRoZSBjaGFydFxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBUaGUgT2JqZWN0IHRoYXQgY29udGFpbnMgYWxsIHRoZSBvcHRpb25hbCB2YWx1ZXMgZm9yIHRoZSBjaGFydFxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBoZWlnaHQgb2YgdGhlIGFyZWEgaW4gdGhlIGNoYXJ0IGZvciB0aGUgZGF0YSBzZXJpZXNcbiAgICovXG4gIENoYXJ0aXN0LmdldEF2YWlsYWJsZUhlaWdodCA9IGZ1bmN0aW9uIChzdmcsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gTWF0aC5tYXgoKENoYXJ0aXN0LnF1YW50aXR5KG9wdGlvbnMuaGVpZ2h0KS52YWx1ZSB8fCBzdmcuaGVpZ2h0KCkpIC0gKG9wdGlvbnMuY2hhcnRQYWRkaW5nLnRvcCArICBvcHRpb25zLmNoYXJ0UGFkZGluZy5ib3R0b20pIC0gb3B0aW9ucy5heGlzWC5vZmZzZXQsIDApO1xuICB9O1xuXG4gIC8qKlxuICAgKiBHZXQgaGlnaGVzdCBhbmQgbG93ZXN0IHZhbHVlIG9mIGRhdGEgYXJyYXkuIFRoaXMgQXJyYXkgY29udGFpbnMgdGhlIGRhdGEgdGhhdCB3aWxsIGJlIHZpc3VhbGl6ZWQgaW4gdGhlIGNoYXJ0LlxuICAgKlxuICAgKiBAbWVtYmVyb2YgQ2hhcnRpc3QuQ29yZVxuICAgKiBAcGFyYW0ge0FycmF5fSBkYXRhIFRoZSBhcnJheSB0aGF0IGNvbnRhaW5zIHRoZSBkYXRhIHRvIGJlIHZpc3VhbGl6ZWQgaW4gdGhlIGNoYXJ0XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIFRoZSBPYmplY3QgdGhhdCBjb250YWlucyB0aGUgY2hhcnQgb3B0aW9uc1xuICAgKiBAcGFyYW0ge1N0cmluZ30gZGltZW5zaW9uIEF4aXMgZGltZW5zaW9uICd4JyBvciAneScgdXNlZCB0byBhY2Nlc3MgdGhlIGNvcnJlY3QgdmFsdWUgYW5kIGhpZ2ggLyBsb3cgY29uZmlndXJhdGlvblxuICAgKiBAcmV0dXJuIHtPYmplY3R9IEFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZSBoaWdoZXN0IGFuZCBsb3dlc3QgdmFsdWUgdGhhdCB3aWxsIGJlIHZpc3VhbGl6ZWQgb24gdGhlIGNoYXJ0LlxuICAgKi9cbiAgQ2hhcnRpc3QuZ2V0SGlnaExvdyA9IGZ1bmN0aW9uIChkYXRhLCBvcHRpb25zLCBkaW1lbnNpb24pIHtcbiAgICAvLyBUT0RPOiBSZW1vdmUgd29ya2Fyb3VuZCBmb3IgZGVwcmVjYXRlZCBnbG9iYWwgaGlnaCAvIGxvdyBjb25maWcuIEF4aXMgaGlnaCAvIGxvdyBjb25maWd1cmF0aW9uIGlzIHByZWZlcnJlZFxuICAgIG9wdGlvbnMgPSBDaGFydGlzdC5leHRlbmQoe30sIG9wdGlvbnMsIGRpbWVuc2lvbiA/IG9wdGlvbnNbJ2F4aXMnICsgZGltZW5zaW9uLnRvVXBwZXJDYXNlKCldIDoge30pO1xuXG4gICAgdmFyIGhpZ2hMb3cgPSB7XG4gICAgICAgIGhpZ2g6IG9wdGlvbnMuaGlnaCA9PT0gdW5kZWZpbmVkID8gLU51bWJlci5NQVhfVkFMVUUgOiArb3B0aW9ucy5oaWdoLFxuICAgICAgICBsb3c6IG9wdGlvbnMubG93ID09PSB1bmRlZmluZWQgPyBOdW1iZXIuTUFYX1ZBTFVFIDogK29wdGlvbnMubG93XG4gICAgICB9O1xuICAgIHZhciBmaW5kSGlnaCA9IG9wdGlvbnMuaGlnaCA9PT0gdW5kZWZpbmVkO1xuICAgIHZhciBmaW5kTG93ID0gb3B0aW9ucy5sb3cgPT09IHVuZGVmaW5lZDtcblxuICAgIC8vIEZ1bmN0aW9uIHRvIHJlY3Vyc2l2ZWx5IHdhbGsgdGhyb3VnaCBhcnJheXMgYW5kIGZpbmQgaGlnaGVzdCBhbmQgbG93ZXN0IG51bWJlclxuICAgIGZ1bmN0aW9uIHJlY3Vyc2l2ZUhpZ2hMb3coZGF0YSkge1xuICAgICAgaWYoZGF0YSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9IGVsc2UgaWYoZGF0YSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHJlY3Vyc2l2ZUhpZ2hMb3coZGF0YVtpXSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IGRpbWVuc2lvbiA/ICtkYXRhW2RpbWVuc2lvbl0gOiArZGF0YTtcblxuICAgICAgICBpZiAoZmluZEhpZ2ggJiYgdmFsdWUgPiBoaWdoTG93LmhpZ2gpIHtcbiAgICAgICAgICBoaWdoTG93LmhpZ2ggPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmaW5kTG93ICYmIHZhbHVlIDwgaGlnaExvdy5sb3cpIHtcbiAgICAgICAgICBoaWdoTG93LmxvdyA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gU3RhcnQgdG8gZmluZCBoaWdoZXN0IGFuZCBsb3dlc3QgbnVtYmVyIHJlY3Vyc2l2ZWx5XG4gICAgaWYoZmluZEhpZ2ggfHwgZmluZExvdykge1xuICAgICAgcmVjdXJzaXZlSGlnaExvdyhkYXRhKTtcbiAgICB9XG5cbiAgICAvLyBPdmVycmlkZXMgb2YgaGlnaCAvIGxvdyBiYXNlZCBvbiByZWZlcmVuY2UgdmFsdWUsIGl0IHdpbGwgbWFrZSBzdXJlIHRoYXQgdGhlIGludmlzaWJsZSByZWZlcmVuY2UgdmFsdWUgaXNcbiAgICAvLyB1c2VkIHRvIGdlbmVyYXRlIHRoZSBjaGFydC4gVGhpcyBpcyB1c2VmdWwgd2hlbiB0aGUgY2hhcnQgYWx3YXlzIG5lZWRzIHRvIGNvbnRhaW4gdGhlIHBvc2l0aW9uIG9mIHRoZVxuICAgIC8vIGludmlzaWJsZSByZWZlcmVuY2UgdmFsdWUgaW4gdGhlIHZpZXcgaS5lLiBmb3IgYmlwb2xhciBzY2FsZXMuXG4gICAgaWYgKG9wdGlvbnMucmVmZXJlbmNlVmFsdWUgfHwgb3B0aW9ucy5yZWZlcmVuY2VWYWx1ZSA9PT0gMCkge1xuICAgICAgaGlnaExvdy5oaWdoID0gTWF0aC5tYXgob3B0aW9ucy5yZWZlcmVuY2VWYWx1ZSwgaGlnaExvdy5oaWdoKTtcbiAgICAgIGhpZ2hMb3cubG93ID0gTWF0aC5taW4ob3B0aW9ucy5yZWZlcmVuY2VWYWx1ZSwgaGlnaExvdy5sb3cpO1xuICAgIH1cblxuICAgIC8vIElmIGhpZ2ggYW5kIGxvdyBhcmUgdGhlIHNhbWUgYmVjYXVzZSBvZiBtaXNjb25maWd1cmF0aW9uIG9yIGZsYXQgZGF0YSAob25seSB0aGUgc2FtZSB2YWx1ZSkgd2UgbmVlZFxuICAgIC8vIHRvIHNldCB0aGUgaGlnaCBvciBsb3cgdG8gMCBkZXBlbmRpbmcgb24gdGhlIHBvbGFyaXR5XG4gICAgaWYgKGhpZ2hMb3cuaGlnaCA8PSBoaWdoTG93Lmxvdykge1xuICAgICAgLy8gSWYgYm90aCB2YWx1ZXMgYXJlIDAgd2Ugc2V0IGhpZ2ggdG8gMVxuICAgICAgaWYgKGhpZ2hMb3cubG93ID09PSAwKSB7XG4gICAgICAgIGhpZ2hMb3cuaGlnaCA9IDE7XG4gICAgICB9IGVsc2UgaWYgKGhpZ2hMb3cubG93IDwgMCkge1xuICAgICAgICAvLyBJZiB3ZSBoYXZlIHRoZSBzYW1lIG5lZ2F0aXZlIHZhbHVlIGZvciB0aGUgYm91bmRzIHdlIHNldCBib3VuZHMuaGlnaCB0byAwXG4gICAgICAgIGhpZ2hMb3cuaGlnaCA9IDA7XG4gICAgICB9IGVsc2UgaWYgKGhpZ2hMb3cuaGlnaCA+IDApIHtcbiAgICAgICAgLy8gSWYgd2UgaGF2ZSB0aGUgc2FtZSBwb3NpdGl2ZSB2YWx1ZSBmb3IgdGhlIGJvdW5kcyB3ZSBzZXQgYm91bmRzLmxvdyB0byAwXG4gICAgICAgIGhpZ2hMb3cubG93ID0gMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIElmIGRhdGEgYXJyYXkgd2FzIGVtcHR5LCB2YWx1ZXMgYXJlIE51bWJlci5NQVhfVkFMVUUgYW5kIC1OdW1iZXIuTUFYX1ZBTFVFLiBTZXQgYm91bmRzIHRvIHByZXZlbnQgZXJyb3JzXG4gICAgICAgIGhpZ2hMb3cuaGlnaCA9IDE7XG4gICAgICAgIGhpZ2hMb3cubG93ID0gMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaGlnaExvdztcbiAgfTtcblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSB2YWx1ZSBpcyBhIHZhbGlkIG51bWJlciBvciBzdHJpbmcgd2l0aCBhIG51bWJlci5cbiAgICpcbiAgICogQG1lbWJlcm9mIENoYXJ0aXN0LkNvcmVcbiAgICogQHBhcmFtIHZhbHVlXG4gICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAgKi9cbiAgQ2hhcnRpc3QuaXNOdW0gPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiAhaXNOYU4odmFsdWUpICYmIGlzRmluaXRlKHZhbHVlKTtcbiAgfTtcblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIG9uIGFsbCBmYWxzZXkgdmFsdWVzIGV4Y2VwdCB0aGUgbnVtZXJpYyB2YWx1ZSAwLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgQ2hhcnRpc3QuQ29yZVxuICAgKiBAcGFyYW0gdmFsdWVcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBDaGFydGlzdC5pc0ZhbHNleUJ1dFplcm8gPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiAhdmFsdWUgJiYgdmFsdWUgIT09IDA7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBudW1iZXIgaWYgdGhlIHBhc3NlZCBwYXJhbWV0ZXIgaXMgYSB2YWxpZCBudW1iZXIgb3IgdGhlIGZ1bmN0aW9uIHdpbGwgcmV0dXJuIHVuZGVmaW5lZC4gT24gYWxsIG90aGVyIHZhbHVlcyB0aGFuIGEgdmFsaWQgbnVtYmVyLCB0aGlzIGZ1bmN0aW9uIHdpbGwgcmV0dXJuIHVuZGVmaW5lZC5cbiAgICpcbiAgICogQG1lbWJlcm9mIENoYXJ0aXN0LkNvcmVcbiAgICogQHBhcmFtIHZhbHVlXG4gICAqIEByZXR1cm5zIHsqfVxuICAgKi9cbiAgQ2hhcnRpc3QuZ2V0TnVtYmVyT3JVbmRlZmluZWQgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiBpc05hTigrdmFsdWUpID8gdW5kZWZpbmVkIDogK3ZhbHVlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgdmFsdWUgZnJvbSBhIGRpbWVuc2lvbiBgdmFsdWUueGAgb3IgYHZhbHVlLnlgIHdoaWxlIHJldHVybmluZyB2YWx1ZSBkaXJlY3RseSBpZiBpdCdzIGEgdmFsaWQgbnVtZXJpYyB2YWx1ZS4gSWYgdGhlIHZhbHVlIGlzIG5vdCBudW1lcmljIGFuZCBpdCdzIGZhbHNleSB0aGlzIGZ1bmN0aW9uIHdpbGwgcmV0dXJuIHVuZGVmaW5lZC5cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlXG4gICAqIEBwYXJhbSBkaW1lbnNpb25cbiAgICogQHJldHVybnMgeyp9XG4gICAqL1xuICBDaGFydGlzdC5nZXRNdWx0aVZhbHVlID0gZnVuY3Rpb24odmFsdWUsIGRpbWVuc2lvbikge1xuICAgIGlmKENoYXJ0aXN0LmlzTnVtKHZhbHVlKSkge1xuICAgICAgcmV0dXJuICt2YWx1ZTtcbiAgICB9IGVsc2UgaWYodmFsdWUpIHtcbiAgICAgIHJldHVybiB2YWx1ZVtkaW1lbnNpb24gfHwgJ3knXSB8fCAwO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFBvbGxhcmQgUmhvIEFsZ29yaXRobSB0byBmaW5kIHNtYWxsZXN0IGZhY3RvciBvZiBhbiBpbnRlZ2VyIHZhbHVlLiBUaGVyZSBhcmUgbW9yZSBlZmZpY2llbnQgYWxnb3JpdGhtcyBmb3IgZmFjdG9yaXphdGlvbiwgYnV0IHRoaXMgb25lIGlzIHF1aXRlIGVmZmljaWVudCBhbmQgbm90IHNvIGNvbXBsZXguXG4gICAqXG4gICAqIEBtZW1iZXJvZiBDaGFydGlzdC5Db3JlXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBudW0gQW4gaW50ZWdlciBudW1iZXIgd2hlcmUgdGhlIHNtYWxsZXN0IGZhY3RvciBzaG91bGQgYmUgc2VhcmNoZWQgZm9yXG4gICAqIEByZXR1cm5zIHtOdW1iZXJ9IFRoZSBzbWFsbGVzdCBpbnRlZ2VyIGZhY3RvciBvZiB0aGUgcGFyYW1ldGVyIG51bS5cbiAgICovXG4gIENoYXJ0aXN0LnJobyA9IGZ1bmN0aW9uKG51bSkge1xuICAgIGlmKG51bSA9PT0gMSkge1xuICAgICAgcmV0dXJuIG51bTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnY2QocCwgcSkge1xuICAgICAgaWYgKHAgJSBxID09PSAwKSB7XG4gICAgICAgIHJldHVybiBxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGdjZChxLCBwICUgcSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZih4KSB7XG4gICAgICByZXR1cm4geCAqIHggKyAxO1xuICAgIH1cblxuICAgIHZhciB4MSA9IDIsIHgyID0gMiwgZGl2aXNvcjtcbiAgICBpZiAobnVtICUgMiA9PT0gMCkge1xuICAgICAgcmV0dXJuIDI7XG4gICAgfVxuXG4gICAgZG8ge1xuICAgICAgeDEgPSBmKHgxKSAlIG51bTtcbiAgICAgIHgyID0gZihmKHgyKSkgJSBudW07XG4gICAgICBkaXZpc29yID0gZ2NkKE1hdGguYWJzKHgxIC0geDIpLCBudW0pO1xuICAgIH0gd2hpbGUgKGRpdmlzb3IgPT09IDEpO1xuXG4gICAgcmV0dXJuIGRpdmlzb3I7XG4gIH07XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZSBhbmQgcmV0cmlldmUgYWxsIHRoZSBib3VuZHMgZm9yIHRoZSBjaGFydCBhbmQgcmV0dXJuIHRoZW0gaW4gb25lIGFycmF5XG4gICAqXG4gICAqIEBtZW1iZXJvZiBDaGFydGlzdC5Db3JlXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBheGlzTGVuZ3RoIFRoZSBsZW5ndGggb2YgdGhlIEF4aXMgdXNlZCBmb3JcbiAgICogQHBhcmFtIHtPYmplY3R9IGhpZ2hMb3cgQW4gb2JqZWN0IGNvbnRhaW5pbmcgYSBoaWdoIGFuZCBsb3cgcHJvcGVydHkgaW5kaWNhdGluZyB0aGUgdmFsdWUgcmFuZ2Ugb2YgdGhlIGNoYXJ0LlxuICAgKiBAcGFyYW0ge051bWJlcn0gc2NhbGVNaW5TcGFjZSBUaGUgbWluaW11bSBwcm9qZWN0ZWQgbGVuZ3RoIGEgc3RlcCBzaG91bGQgcmVzdWx0IGluXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gb25seUludGVnZXJcbiAgICogQHJldHVybiB7T2JqZWN0fSBBbGwgdGhlIHZhbHVlcyB0byBzZXQgdGhlIGJvdW5kcyBvZiB0aGUgY2hhcnRcbiAgICovXG4gIENoYXJ0aXN0LmdldEJvdW5kcyA9IGZ1bmN0aW9uIChheGlzTGVuZ3RoLCBoaWdoTG93LCBzY2FsZU1pblNwYWNlLCBvbmx5SW50ZWdlcikge1xuICAgIHZhciBpLFxuICAgICAgb3B0aW1pemF0aW9uQ291bnRlciA9IDAsXG4gICAgICBuZXdNaW4sXG4gICAgICBuZXdNYXgsXG4gICAgICBib3VuZHMgPSB7XG4gICAgICAgIGhpZ2g6IGhpZ2hMb3cuaGlnaCxcbiAgICAgICAgbG93OiBoaWdoTG93Lmxvd1xuICAgICAgfTtcblxuICAgIGJvdW5kcy52YWx1ZVJhbmdlID0gYm91bmRzLmhpZ2ggLSBib3VuZHMubG93O1xuICAgIGJvdW5kcy5vb20gPSBDaGFydGlzdC5vcmRlck9mTWFnbml0dWRlKGJvdW5kcy52YWx1ZVJhbmdlKTtcbiAgICBib3VuZHMuc3RlcCA9IE1hdGgucG93KDEwLCBib3VuZHMub29tKTtcbiAgICBib3VuZHMubWluID0gTWF0aC5mbG9vcihib3VuZHMubG93IC8gYm91bmRzLnN0ZXApICogYm91bmRzLnN0ZXA7XG4gICAgYm91bmRzLm1heCA9IE1hdGguY2VpbChib3VuZHMuaGlnaCAvIGJvdW5kcy5zdGVwKSAqIGJvdW5kcy5zdGVwO1xuICAgIGJvdW5kcy5yYW5nZSA9IGJvdW5kcy5tYXggLSBib3VuZHMubWluO1xuICAgIGJvdW5kcy5udW1iZXJPZlN0ZXBzID0gTWF0aC5yb3VuZChib3VuZHMucmFuZ2UgLyBib3VuZHMuc3RlcCk7XG5cbiAgICAvLyBPcHRpbWl6ZSBzY2FsZSBzdGVwIGJ5IGNoZWNraW5nIGlmIHN1YmRpdmlzaW9uIGlzIHBvc3NpYmxlIGJhc2VkIG9uIGhvcml6b250YWxHcmlkTWluU3BhY2VcbiAgICAvLyBJZiB3ZSBhcmUgYWxyZWFkeSBiZWxvdyB0aGUgc2NhbGVNaW5TcGFjZSB2YWx1ZSB3ZSB3aWxsIHNjYWxlIHVwXG4gICAgdmFyIGxlbmd0aCA9IENoYXJ0aXN0LnByb2plY3RMZW5ndGgoYXhpc0xlbmd0aCwgYm91bmRzLnN0ZXAsIGJvdW5kcyk7XG4gICAgdmFyIHNjYWxlVXAgPSBsZW5ndGggPCBzY2FsZU1pblNwYWNlO1xuICAgIHZhciBzbWFsbGVzdEZhY3RvciA9IG9ubHlJbnRlZ2VyID8gQ2hhcnRpc3QucmhvKGJvdW5kcy5yYW5nZSkgOiAwO1xuXG4gICAgLy8gRmlyc3QgY2hlY2sgaWYgd2Ugc2hvdWxkIG9ubHkgdXNlIGludGVnZXIgc3RlcHMgYW5kIGlmIHN0ZXAgMSBpcyBzdGlsbCBsYXJnZXIgdGhhbiBzY2FsZU1pblNwYWNlIHNvIHdlIGNhbiB1c2UgMVxuICAgIGlmKG9ubHlJbnRlZ2VyICYmIENoYXJ0aXN0LnByb2plY3RMZW5ndGgoYXhpc0xlbmd0aCwgMSwgYm91bmRzKSA+PSBzY2FsZU1pblNwYWNlKSB7XG4gICAgICBib3VuZHMuc3RlcCA9IDE7XG4gICAgfSBlbHNlIGlmKG9ubHlJbnRlZ2VyICYmIHNtYWxsZXN0RmFjdG9yIDwgYm91bmRzLnN0ZXAgJiYgQ2hhcnRpc3QucHJvamVjdExlbmd0aChheGlzTGVuZ3RoLCBzbWFsbGVzdEZhY3RvciwgYm91bmRzKSA+PSBzY2FsZU1pblNwYWNlKSB7XG4gICAgICAvLyBJZiBzdGVwIDEgd2FzIHRvbyBzbWFsbCwgd2UgY2FuIHRyeSB0aGUgc21hbGxlc3QgZmFjdG9yIG9mIHJhbmdlXG4gICAgICAvLyBJZiB0aGUgc21hbGxlc3QgZmFjdG9yIGlzIHNtYWxsZXIgdGhhbiB0aGUgY3VycmVudCBib3VuZHMuc3RlcCBhbmQgdGhlIHByb2plY3RlZCBsZW5ndGggb2Ygc21hbGxlc3QgZmFjdG9yXG4gICAgICAvLyBpcyBsYXJnZXIgdGhhbiB0aGUgc2NhbGVNaW5TcGFjZSB3ZSBzaG91bGQgZ28gZm9yIGl0LlxuICAgICAgYm91bmRzLnN0ZXAgPSBzbWFsbGVzdEZhY3RvcjtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVHJ5aW5nIHRvIGRpdmlkZSBvciBtdWx0aXBseSBieSAyIGFuZCBmaW5kIHRoZSBiZXN0IHN0ZXAgdmFsdWVcbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIGlmIChzY2FsZVVwICYmIENoYXJ0aXN0LnByb2plY3RMZW5ndGgoYXhpc0xlbmd0aCwgYm91bmRzLnN0ZXAsIGJvdW5kcykgPD0gc2NhbGVNaW5TcGFjZSkge1xuICAgICAgICAgIGJvdW5kcy5zdGVwICo9IDI7XG4gICAgICAgIH0gZWxzZSBpZiAoIXNjYWxlVXAgJiYgQ2hhcnRpc3QucHJvamVjdExlbmd0aChheGlzTGVuZ3RoLCBib3VuZHMuc3RlcCAvIDIsIGJvdW5kcykgPj0gc2NhbGVNaW5TcGFjZSkge1xuICAgICAgICAgIGJvdW5kcy5zdGVwIC89IDI7XG4gICAgICAgICAgaWYob25seUludGVnZXIgJiYgYm91bmRzLnN0ZXAgJSAxICE9PSAwKSB7XG4gICAgICAgICAgICBib3VuZHMuc3RlcCAqPSAyO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYob3B0aW1pemF0aW9uQ291bnRlcisrID4gMTAwMCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRXhjZWVkZWQgbWF4aW11bSBudW1iZXIgb2YgaXRlcmF0aW9ucyB3aGlsZSBvcHRpbWl6aW5nIHNjYWxlIHN0ZXAhJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBzdGVwIG11c3Qgbm90IGJlIGxlc3MgdGhhbiBFUFNJTE9OIHRvIGNyZWF0ZSB2YWx1ZXMgdGhhdCBjYW4gYmUgcmVwcmVzZW50ZWQgYXMgZmxvYXRpbmcgbnVtYmVyLlxuICAgIHZhciBFUFNJTE9OID0gMi4yMjFFLTE2O1xuICAgIGJvdW5kcy5zdGVwID0gTWF0aC5tYXgoYm91bmRzLnN0ZXAsIEVQU0lMT04pO1xuXG4gICAgLy8gTmFycm93IG1pbiBhbmQgbWF4IGJhc2VkIG9uIG5ldyBzdGVwXG4gICAgbmV3TWluID0gYm91bmRzLm1pbjtcbiAgICBuZXdNYXggPSBib3VuZHMubWF4O1xuICAgIHdoaWxlKG5ld01pbiArIGJvdW5kcy5zdGVwIDw9IGJvdW5kcy5sb3cpIHtcbiAgICAgIG5ld01pbiArPSBib3VuZHMuc3RlcDtcbiAgICB9XG4gICAgd2hpbGUobmV3TWF4IC0gYm91bmRzLnN0ZXAgPj0gYm91bmRzLmhpZ2gpIHtcbiAgICAgIG5ld01heCAtPSBib3VuZHMuc3RlcDtcbiAgICB9XG4gICAgYm91bmRzLm1pbiA9IG5ld01pbjtcbiAgICBib3VuZHMubWF4ID0gbmV3TWF4O1xuICAgIGJvdW5kcy5yYW5nZSA9IGJvdW5kcy5tYXggLSBib3VuZHMubWluO1xuXG4gICAgdmFyIHZhbHVlcyA9IFtdO1xuICAgIGZvciAoaSA9IGJvdW5kcy5taW47IGkgPD0gYm91bmRzLm1heDsgaSArPSBib3VuZHMuc3RlcCkge1xuICAgICAgdmFyIHZhbHVlID0gQ2hhcnRpc3Qucm91bmRXaXRoUHJlY2lzaW9uKGkpO1xuICAgICAgaWYgKHZhbHVlICE9PSB2YWx1ZXNbdmFsdWVzLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgIHZhbHVlcy5wdXNoKGkpO1xuICAgICAgfVxuICAgIH1cbiAgICBib3VuZHMudmFsdWVzID0gdmFsdWVzO1xuICAgIHJldHVybiBib3VuZHM7XG4gIH07XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZSBjYXJ0ZXNpYW4gY29vcmRpbmF0ZXMgb2YgcG9sYXIgY29vcmRpbmF0ZXNcbiAgICpcbiAgICogQG1lbWJlcm9mIENoYXJ0aXN0LkNvcmVcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGNlbnRlclggWC1heGlzIGNvb3JkaW5hdGVzIG9mIGNlbnRlciBwb2ludCBvZiBjaXJjbGUgc2VnbWVudFxuICAgKiBAcGFyYW0ge051bWJlcn0gY2VudGVyWSBYLWF4aXMgY29vcmRpbmF0ZXMgb2YgY2VudGVyIHBvaW50IG9mIGNpcmNsZSBzZWdtZW50XG4gICAqIEBwYXJhbSB7TnVtYmVyfSByYWRpdXMgUmFkaXVzIG9mIGNpcmNsZSBzZWdtZW50XG4gICAqIEBwYXJhbSB7TnVtYmVyfSBhbmdsZUluRGVncmVlcyBBbmdsZSBvZiBjaXJjbGUgc2VnbWVudCBpbiBkZWdyZWVzXG4gICAqIEByZXR1cm4ge3t4Ok51bWJlciwgeTpOdW1iZXJ9fSBDb29yZGluYXRlcyBvZiBwb2ludCBvbiBjaXJjdW1mZXJlbmNlXG4gICAqL1xuICBDaGFydGlzdC5wb2xhclRvQ2FydGVzaWFuID0gZnVuY3Rpb24gKGNlbnRlclgsIGNlbnRlclksIHJhZGl1cywgYW5nbGVJbkRlZ3JlZXMpIHtcbiAgICB2YXIgYW5nbGVJblJhZGlhbnMgPSAoYW5nbGVJbkRlZ3JlZXMgLSA5MCkgKiBNYXRoLlBJIC8gMTgwLjA7XG5cbiAgICByZXR1cm4ge1xuICAgICAgeDogY2VudGVyWCArIChyYWRpdXMgKiBNYXRoLmNvcyhhbmdsZUluUmFkaWFucykpLFxuICAgICAgeTogY2VudGVyWSArIChyYWRpdXMgKiBNYXRoLnNpbihhbmdsZUluUmFkaWFucykpXG4gICAgfTtcbiAgfTtcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBjaGFydCBkcmF3aW5nIHJlY3RhbmdsZSAoYXJlYSB3aGVyZSBjaGFydCBpcyBkcmF3bikgeDEseTEgPSBib3R0b20gbGVmdCAvIHgyLHkyID0gdG9wIHJpZ2h0XG4gICAqXG4gICAqIEBtZW1iZXJvZiBDaGFydGlzdC5Db3JlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzdmcgVGhlIHN2ZyBlbGVtZW50IGZvciB0aGUgY2hhcnRcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgVGhlIE9iamVjdCB0aGF0IGNvbnRhaW5zIGFsbCB0aGUgb3B0aW9uYWwgdmFsdWVzIGZvciB0aGUgY2hhcnRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtmYWxsYmFja1BhZGRpbmddIFRoZSBmYWxsYmFjayBwYWRkaW5nIGlmIHBhcnRpYWwgcGFkZGluZyBvYmplY3RzIGFyZSB1c2VkXG4gICAqIEByZXR1cm4ge09iamVjdH0gVGhlIGNoYXJ0IHJlY3RhbmdsZXMgY29vcmRpbmF0ZXMgaW5zaWRlIHRoZSBzdmcgZWxlbWVudCBwbHVzIHRoZSByZWN0YW5nbGVzIG1lYXN1cmVtZW50c1xuICAgKi9cbiAgQ2hhcnRpc3QuY3JlYXRlQ2hhcnRSZWN0ID0gZnVuY3Rpb24gKHN2Zywgb3B0aW9ucywgZmFsbGJhY2tQYWRkaW5nKSB7XG4gICAgdmFyIGhhc0F4aXMgPSAhIShvcHRpb25zLmF4aXNYIHx8IG9wdGlvbnMuYXhpc1kpO1xuICAgIHZhciB5QXhpc09mZnNldCA9IGhhc0F4aXMgPyBvcHRpb25zLmF4aXNZLm9mZnNldCA6IDA7XG4gICAgdmFyIHhBeGlzT2Zmc2V0ID0gaGFzQXhpcyA/IG9wdGlvbnMuYXhpc1gub2Zmc2V0IDogMDtcbiAgICAvLyBJZiB3aWR0aCBvciBoZWlnaHQgcmVzdWx0cyBpbiBpbnZhbGlkIHZhbHVlIChpbmNsdWRpbmcgMCkgd2UgZmFsbGJhY2sgdG8gdGhlIHVuaXRsZXNzIHNldHRpbmdzIG9yIGV2ZW4gMFxuICAgIHZhciB3aWR0aCA9IHN2Zy53aWR0aCgpIHx8IENoYXJ0aXN0LnF1YW50aXR5KG9wdGlvbnMud2lkdGgpLnZhbHVlIHx8IDA7XG4gICAgdmFyIGhlaWdodCA9IHN2Zy5oZWlnaHQoKSB8fCBDaGFydGlzdC5xdWFudGl0eShvcHRpb25zLmhlaWdodCkudmFsdWUgfHwgMDtcbiAgICB2YXIgbm9ybWFsaXplZFBhZGRpbmcgPSBDaGFydGlzdC5ub3JtYWxpemVQYWRkaW5nKG9wdGlvbnMuY2hhcnRQYWRkaW5nLCBmYWxsYmFja1BhZGRpbmcpO1xuXG4gICAgLy8gSWYgc2V0dGluZ3Mgd2VyZSB0byBzbWFsbCB0byBjb3BlIHdpdGggb2Zmc2V0IChsZWdhY3kpIGFuZCBwYWRkaW5nLCB3ZSdsbCBhZGp1c3RcbiAgICB3aWR0aCA9IE1hdGgubWF4KHdpZHRoLCB5QXhpc09mZnNldCArIG5vcm1hbGl6ZWRQYWRkaW5nLmxlZnQgKyBub3JtYWxpemVkUGFkZGluZy5yaWdodCk7XG4gICAgaGVpZ2h0ID0gTWF0aC5tYXgoaGVpZ2h0LCB4QXhpc09mZnNldCArIG5vcm1hbGl6ZWRQYWRkaW5nLnRvcCArIG5vcm1hbGl6ZWRQYWRkaW5nLmJvdHRvbSk7XG5cbiAgICB2YXIgY2hhcnRSZWN0ID0ge1xuICAgICAgcGFkZGluZzogbm9ybWFsaXplZFBhZGRpbmcsXG4gICAgICB3aWR0aDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy54MiAtIHRoaXMueDE7XG4gICAgICB9LFxuICAgICAgaGVpZ2h0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnkxIC0gdGhpcy55MjtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYoaGFzQXhpcykge1xuICAgICAgaWYgKG9wdGlvbnMuYXhpc1gucG9zaXRpb24gPT09ICdzdGFydCcpIHtcbiAgICAgICAgY2hhcnRSZWN0LnkyID0gbm9ybWFsaXplZFBhZGRpbmcudG9wICsgeEF4aXNPZmZzZXQ7XG4gICAgICAgIGNoYXJ0UmVjdC55MSA9IE1hdGgubWF4KGhlaWdodCAtIG5vcm1hbGl6ZWRQYWRkaW5nLmJvdHRvbSwgY2hhcnRSZWN0LnkyICsgMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjaGFydFJlY3QueTIgPSBub3JtYWxpemVkUGFkZGluZy50b3A7XG4gICAgICAgIGNoYXJ0UmVjdC55MSA9IE1hdGgubWF4KGhlaWdodCAtIG5vcm1hbGl6ZWRQYWRkaW5nLmJvdHRvbSAtIHhBeGlzT2Zmc2V0LCBjaGFydFJlY3QueTIgKyAxKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMuYXhpc1kucG9zaXRpb24gPT09ICdzdGFydCcpIHtcbiAgICAgICAgY2hhcnRSZWN0LngxID0gbm9ybWFsaXplZFBhZGRpbmcubGVmdCArIHlBeGlzT2Zmc2V0O1xuICAgICAgICBjaGFydFJlY3QueDIgPSBNYXRoLm1heCh3aWR0aCAtIG5vcm1hbGl6ZWRQYWRkaW5nLnJpZ2h0LCBjaGFydFJlY3QueDEgKyAxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNoYXJ0UmVjdC54MSA9IG5vcm1hbGl6ZWRQYWRkaW5nLmxlZnQ7XG4gICAgICAgIGNoYXJ0UmVjdC54MiA9IE1hdGgubWF4KHdpZHRoIC0gbm9ybWFsaXplZFBhZGRpbmcucmlnaHQgLSB5QXhpc09mZnNldCwgY2hhcnRSZWN0LngxICsgMSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNoYXJ0UmVjdC54MSA9IG5vcm1hbGl6ZWRQYWRkaW5nLmxlZnQ7XG4gICAgICBjaGFydFJlY3QueDIgPSBNYXRoLm1heCh3aWR0aCAtIG5vcm1hbGl6ZWRQYWRkaW5nLnJpZ2h0LCBjaGFydFJlY3QueDEgKyAxKTtcbiAgICAgIGNoYXJ0UmVjdC55MiA9IG5vcm1hbGl6ZWRQYWRkaW5nLnRvcDtcbiAgICAgIGNoYXJ0UmVjdC55MSA9IE1hdGgubWF4KGhlaWdodCAtIG5vcm1hbGl6ZWRQYWRkaW5nLmJvdHRvbSwgY2hhcnRSZWN0LnkyICsgMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNoYXJ0UmVjdDtcbiAgfTtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGdyaWQgbGluZSBiYXNlZCBvbiBhIHByb2plY3RlZCB2YWx1ZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIENoYXJ0aXN0LkNvcmVcbiAgICogQHBhcmFtIHBvc2l0aW9uXG4gICAqIEBwYXJhbSBpbmRleFxuICAgKiBAcGFyYW0gYXhpc1xuICAgKiBAcGFyYW0gb2Zmc2V0XG4gICAqIEBwYXJhbSBsZW5ndGhcbiAgICogQHBhcmFtIGdyb3VwXG4gICAqIEBwYXJhbSBjbGFzc2VzXG4gICAqIEBwYXJhbSBldmVudEVtaXR0ZXJcbiAgICovXG4gIENoYXJ0aXN0LmNyZWF0ZUdyaWQgPSBmdW5jdGlvbihwb3NpdGlvbiwgaW5kZXgsIGF4aXMsIG9mZnNldCwgbGVuZ3RoLCBncm91cCwgY2xhc3NlcywgZXZlbnRFbWl0dGVyKSB7XG4gICAgdmFyIHBvc2l0aW9uYWxEYXRhID0ge307XG4gICAgcG9zaXRpb25hbERhdGFbYXhpcy51bml0cy5wb3MgKyAnMSddID0gcG9zaXRpb247XG4gICAgcG9zaXRpb25hbERhdGFbYXhpcy51bml0cy5wb3MgKyAnMiddID0gcG9zaXRpb247XG4gICAgcG9zaXRpb25hbERhdGFbYXhpcy5jb3VudGVyVW5pdHMucG9zICsgJzEnXSA9IG9mZnNldDtcbiAgICBwb3NpdGlvbmFsRGF0YVtheGlzLmNvdW50ZXJVbml0cy5wb3MgKyAnMiddID0gb2Zmc2V0ICsgbGVuZ3RoO1xuXG4gICAgdmFyIGdyaWRFbGVtZW50ID0gZ3JvdXAuZWxlbSgnbGluZScsIHBvc2l0aW9uYWxEYXRhLCBjbGFzc2VzLmpvaW4oJyAnKSk7XG5cbiAgICAvLyBFdmVudCBmb3IgZ3JpZCBkcmF3XG4gICAgZXZlbnRFbWl0dGVyLmVtaXQoJ2RyYXcnLFxuICAgICAgQ2hhcnRpc3QuZXh0ZW5kKHtcbiAgICAgICAgdHlwZTogJ2dyaWQnLFxuICAgICAgICBheGlzOiBheGlzLFxuICAgICAgICBpbmRleDogaW5kZXgsXG4gICAgICAgIGdyb3VwOiBncm91cCxcbiAgICAgICAgZWxlbWVudDogZ3JpZEVsZW1lbnRcbiAgICAgIH0sIHBvc2l0aW9uYWxEYXRhKVxuICAgICk7XG4gIH07XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBsYWJlbCBiYXNlZCBvbiBhIHByb2plY3RlZCB2YWx1ZSBhbmQgYW4gYXhpcy5cbiAgICpcbiAgICogQG1lbWJlcm9mIENoYXJ0aXN0LkNvcmVcbiAgICogQHBhcmFtIHBvc2l0aW9uXG4gICAqIEBwYXJhbSBsZW5ndGhcbiAgICogQHBhcmFtIGluZGV4XG4gICAqIEBwYXJhbSBsYWJlbHNcbiAgICogQHBhcmFtIGF4aXNcbiAgICogQHBhcmFtIGF4aXNPZmZzZXRcbiAgICogQHBhcmFtIGxhYmVsT2Zmc2V0XG4gICAqIEBwYXJhbSBncm91cFxuICAgKiBAcGFyYW0gY2xhc3Nlc1xuICAgKiBAcGFyYW0gdXNlRm9yZWlnbk9iamVjdFxuICAgKiBAcGFyYW0gZXZlbnRFbWl0dGVyXG4gICAqL1xuICBDaGFydGlzdC5jcmVhdGVMYWJlbCA9IGZ1bmN0aW9uKHBvc2l0aW9uLCBsZW5ndGgsIGluZGV4LCBsYWJlbHMsIGF4aXMsIGF4aXNPZmZzZXQsIGxhYmVsT2Zmc2V0LCBncm91cCwgY2xhc3NlcywgdXNlRm9yZWlnbk9iamVjdCwgZXZlbnRFbWl0dGVyKSB7XG4gICAgdmFyIGxhYmVsRWxlbWVudDtcbiAgICB2YXIgcG9zaXRpb25hbERhdGEgPSB7fTtcblxuICAgIHBvc2l0aW9uYWxEYXRhW2F4aXMudW5pdHMucG9zXSA9IHBvc2l0aW9uICsgbGFiZWxPZmZzZXRbYXhpcy51bml0cy5wb3NdO1xuICAgIHBvc2l0aW9uYWxEYXRhW2F4aXMuY291bnRlclVuaXRzLnBvc10gPSBsYWJlbE9mZnNldFtheGlzLmNvdW50ZXJVbml0cy5wb3NdO1xuICAgIHBvc2l0aW9uYWxEYXRhW2F4aXMudW5pdHMubGVuXSA9IGxlbmd0aDtcbiAgICBwb3NpdGlvbmFsRGF0YVtheGlzLmNvdW50ZXJVbml0cy5sZW5dID0gTWF0aC5tYXgoMCwgYXhpc09mZnNldCAtIDEwKTtcblxuICAgIGlmKHVzZUZvcmVpZ25PYmplY3QpIHtcbiAgICAgIC8vIFdlIG5lZWQgdG8gc2V0IHdpZHRoIGFuZCBoZWlnaHQgZXhwbGljaXRseSB0byBweCBhcyBzcGFuIHdpbGwgbm90IGV4cGFuZCB3aXRoIHdpZHRoIGFuZCBoZWlnaHQgYmVpbmdcbiAgICAgIC8vIDEwMCUgaW4gYWxsIGJyb3dzZXJzXG4gICAgICB2YXIgY29udGVudCA9ICc8c3BhbiBjbGFzcz1cIicgKyBjbGFzc2VzLmpvaW4oJyAnKSArICdcIiBzdHlsZT1cIicgK1xuICAgICAgICBheGlzLnVuaXRzLmxlbiArICc6ICcgKyBNYXRoLnJvdW5kKHBvc2l0aW9uYWxEYXRhW2F4aXMudW5pdHMubGVuXSkgKyAncHg7ICcgK1xuICAgICAgICBheGlzLmNvdW50ZXJVbml0cy5sZW4gKyAnOiAnICsgTWF0aC5yb3VuZChwb3NpdGlvbmFsRGF0YVtheGlzLmNvdW50ZXJVbml0cy5sZW5dKSArICdweFwiPicgK1xuICAgICAgICBsYWJlbHNbaW5kZXhdICsgJzwvc3Bhbj4nO1xuXG4gICAgICBsYWJlbEVsZW1lbnQgPSBncm91cC5mb3JlaWduT2JqZWN0KGNvbnRlbnQsIENoYXJ0aXN0LmV4dGVuZCh7XG4gICAgICAgIHN0eWxlOiAnb3ZlcmZsb3c6IHZpc2libGU7J1xuICAgICAgfSwgcG9zaXRpb25hbERhdGEpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGFiZWxFbGVtZW50ID0gZ3JvdXAuZWxlbSgndGV4dCcsIHBvc2l0aW9uYWxEYXRhLCBjbGFzc2VzLmpvaW4oJyAnKSkudGV4dChsYWJlbHNbaW5kZXhdKTtcbiAgICB9XG5cbiAgICBldmVudEVtaXR0ZXIuZW1pdCgnZHJhdycsIENoYXJ0aXN0LmV4dGVuZCh7XG4gICAgICB0eXBlOiAnbGFiZWwnLFxuICAgICAgYXhpczogYXhpcyxcbiAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgIGdyb3VwOiBncm91cCxcbiAgICAgIGVsZW1lbnQ6IGxhYmVsRWxlbWVudCxcbiAgICAgIHRleHQ6IGxhYmVsc1tpbmRleF1cbiAgICB9LCBwb3NpdGlvbmFsRGF0YSkpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBIZWxwZXIgdG8gcmVhZCBzZXJpZXMgc3BlY2lmaWMgb3B0aW9ucyBmcm9tIG9wdGlvbnMgb2JqZWN0LiBJdCBhdXRvbWF0aWNhbGx5IGZhbGxzIGJhY2sgdG8gdGhlIGdsb2JhbCBvcHRpb24gaWZcbiAgICogdGhlcmUgaXMgbm8gb3B0aW9uIGluIHRoZSBzZXJpZXMgb3B0aW9ucy5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHNlcmllcyBTZXJpZXMgb2JqZWN0XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIENoYXJ0aXN0IG9wdGlvbnMgb2JqZWN0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIG9wdGlvbnMga2V5IHRoYXQgc2hvdWxkIGJlIHVzZWQgdG8gb2J0YWluIHRoZSBvcHRpb25zXG4gICAqIEByZXR1cm5zIHsqfVxuICAgKi9cbiAgQ2hhcnRpc3QuZ2V0U2VyaWVzT3B0aW9uID0gZnVuY3Rpb24oc2VyaWVzLCBvcHRpb25zLCBrZXkpIHtcbiAgICBpZihzZXJpZXMubmFtZSAmJiBvcHRpb25zLnNlcmllcyAmJiBvcHRpb25zLnNlcmllc1tzZXJpZXMubmFtZV0pIHtcbiAgICAgIHZhciBzZXJpZXNPcHRpb25zID0gb3B0aW9ucy5zZXJpZXNbc2VyaWVzLm5hbWVdO1xuICAgICAgcmV0dXJuIHNlcmllc09wdGlvbnMuaGFzT3duUHJvcGVydHkoa2V5KSA/IHNlcmllc09wdGlvbnNba2V5XSA6IG9wdGlvbnNba2V5XTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9wdGlvbnNba2V5XTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFByb3ZpZGVzIG9wdGlvbnMgaGFuZGxpbmcgZnVuY3Rpb25hbGl0eSB3aXRoIGNhbGxiYWNrIGZvciBvcHRpb25zIGNoYW5nZXMgdHJpZ2dlcmVkIGJ5IHJlc3BvbnNpdmUgb3B0aW9ucyBhbmQgbWVkaWEgcXVlcnkgbWF0Y2hlc1xuICAgKlxuICAgKiBAbWVtYmVyb2YgQ2hhcnRpc3QuQ29yZVxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBPcHRpb25zIHNldCBieSB1c2VyXG4gICAqIEBwYXJhbSB7QXJyYXl9IHJlc3BvbnNpdmVPcHRpb25zIE9wdGlvbmFsIGZ1bmN0aW9ucyB0byBhZGQgcmVzcG9uc2l2ZSBiZWhhdmlvciB0byBjaGFydFxuICAgKiBAcGFyYW0ge09iamVjdH0gZXZlbnRFbWl0dGVyIFRoZSBldmVudCBlbWl0dGVyIHRoYXQgd2lsbCBiZSB1c2VkIHRvIGVtaXQgdGhlIG9wdGlvbnMgY2hhbmdlZCBldmVudHNcbiAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgY29uc29saWRhdGVkIG9wdGlvbnMgb2JqZWN0IGZyb20gdGhlIGRlZmF1bHRzLCBiYXNlIGFuZCBtYXRjaGluZyByZXNwb25zaXZlIG9wdGlvbnNcbiAgICovXG4gIENoYXJ0aXN0Lm9wdGlvbnNQcm92aWRlciA9IGZ1bmN0aW9uIChvcHRpb25zLCByZXNwb25zaXZlT3B0aW9ucywgZXZlbnRFbWl0dGVyKSB7XG4gICAgdmFyIGJhc2VPcHRpb25zID0gQ2hhcnRpc3QuZXh0ZW5kKHt9LCBvcHRpb25zKSxcbiAgICAgIGN1cnJlbnRPcHRpb25zLFxuICAgICAgbWVkaWFRdWVyeUxpc3RlbmVycyA9IFtdLFxuICAgICAgaTtcblxuICAgIGZ1bmN0aW9uIHVwZGF0ZUN1cnJlbnRPcHRpb25zKG1lZGlhRXZlbnQpIHtcbiAgICAgIHZhciBwcmV2aW91c09wdGlvbnMgPSBjdXJyZW50T3B0aW9ucztcbiAgICAgIGN1cnJlbnRPcHRpb25zID0gQ2hhcnRpc3QuZXh0ZW5kKHt9LCBiYXNlT3B0aW9ucyk7XG5cbiAgICAgIGlmIChyZXNwb25zaXZlT3B0aW9ucykge1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcmVzcG9uc2l2ZU9wdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgbXFsID0gd2luZG93Lm1hdGNoTWVkaWEocmVzcG9uc2l2ZU9wdGlvbnNbaV1bMF0pO1xuICAgICAgICAgIGlmIChtcWwubWF0Y2hlcykge1xuICAgICAgICAgICAgY3VycmVudE9wdGlvbnMgPSBDaGFydGlzdC5leHRlbmQoY3VycmVudE9wdGlvbnMsIHJlc3BvbnNpdmVPcHRpb25zW2ldWzFdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYoZXZlbnRFbWl0dGVyICYmIG1lZGlhRXZlbnQpIHtcbiAgICAgICAgZXZlbnRFbWl0dGVyLmVtaXQoJ29wdGlvbnNDaGFuZ2VkJywge1xuICAgICAgICAgIHByZXZpb3VzT3B0aW9uczogcHJldmlvdXNPcHRpb25zLFxuICAgICAgICAgIGN1cnJlbnRPcHRpb25zOiBjdXJyZW50T3B0aW9uc1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW1vdmVNZWRpYVF1ZXJ5TGlzdGVuZXJzKCkge1xuICAgICAgbWVkaWFRdWVyeUxpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uKG1xbCkge1xuICAgICAgICBtcWwucmVtb3ZlTGlzdGVuZXIodXBkYXRlQ3VycmVudE9wdGlvbnMpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKCF3aW5kb3cubWF0Y2hNZWRpYSkge1xuICAgICAgdGhyb3cgJ3dpbmRvdy5tYXRjaE1lZGlhIG5vdCBmb3VuZCEgTWFrZSBzdXJlIHlvdVxcJ3JlIHVzaW5nIGEgcG9seWZpbGwuJztcbiAgICB9IGVsc2UgaWYgKHJlc3BvbnNpdmVPcHRpb25zKSB7XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCByZXNwb25zaXZlT3B0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgbXFsID0gd2luZG93Lm1hdGNoTWVkaWEocmVzcG9uc2l2ZU9wdGlvbnNbaV1bMF0pO1xuICAgICAgICBtcWwuYWRkTGlzdGVuZXIodXBkYXRlQ3VycmVudE9wdGlvbnMpO1xuICAgICAgICBtZWRpYVF1ZXJ5TGlzdGVuZXJzLnB1c2gobXFsKTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gRXhlY3V0ZSBpbml0aWFsbHkgd2l0aG91dCBhbiBldmVudCBhcmd1bWVudCBzbyB3ZSBnZXQgdGhlIGNvcnJlY3Qgb3B0aW9uc1xuICAgIHVwZGF0ZUN1cnJlbnRPcHRpb25zKCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgcmVtb3ZlTWVkaWFRdWVyeUxpc3RlbmVyczogcmVtb3ZlTWVkaWFRdWVyeUxpc3RlbmVycyxcbiAgICAgIGdldEN1cnJlbnRPcHRpb25zOiBmdW5jdGlvbiBnZXRDdXJyZW50T3B0aW9ucygpIHtcbiAgICAgICAgcmV0dXJuIENoYXJ0aXN0LmV4dGVuZCh7fSwgY3VycmVudE9wdGlvbnMpO1xuICAgICAgfVxuICAgIH07XG4gIH07XG5cblxuICAvKipcbiAgICogU3BsaXRzIGEgbGlzdCBvZiBjb29yZGluYXRlcyBhbmQgYXNzb2NpYXRlZCB2YWx1ZXMgaW50byBzZWdtZW50cy4gRWFjaCByZXR1cm5lZCBzZWdtZW50IGNvbnRhaW5zIGEgcGF0aENvb3JkaW5hdGVzXG4gICAqIHZhbHVlRGF0YSBwcm9wZXJ0eSBkZXNjcmliaW5nIHRoZSBzZWdtZW50LlxuICAgKlxuICAgKiBXaXRoIHRoZSBkZWZhdWx0IG9wdGlvbnMsIHNlZ21lbnRzIGNvbnNpc3Qgb2YgY29udGlndW91cyBzZXRzIG9mIHBvaW50cyB0aGF0IGRvIG5vdCBoYXZlIGFuIHVuZGVmaW5lZCB2YWx1ZS4gQW55XG4gICAqIHBvaW50cyB3aXRoIHVuZGVmaW5lZCB2YWx1ZXMgYXJlIGRpc2NhcmRlZC5cbiAgICpcbiAgICogKipPcHRpb25zKipcbiAgICogVGhlIGZvbGxvd2luZyBvcHRpb25zIGFyZSB1c2VkIHRvIGRldGVybWluZSBob3cgc2VnbWVudHMgYXJlIGZvcm1lZFxuICAgKiBgYGBqYXZhc2NyaXB0XG4gICAqIHZhciBvcHRpb25zID0ge1xuICAgKiAgIC8vIElmIGZpbGxIb2xlcyBpcyB0cnVlLCB1bmRlZmluZWQgdmFsdWVzIGFyZSBzaW1wbHkgZGlzY2FyZGVkIHdpdGhvdXQgY3JlYXRpbmcgYSBuZXcgc2VnbWVudC4gQXNzdW1pbmcgb3RoZXIgb3B0aW9ucyBhcmUgZGVmYXVsdCwgdGhpcyByZXR1cm5zIHNpbmdsZSBzZWdtZW50LlxuICAgKiAgIGZpbGxIb2xlczogZmFsc2UsXG4gICAqICAgLy8gSWYgaW5jcmVhc2luZ1ggaXMgdHJ1ZSwgdGhlIGNvb3JkaW5hdGVzIGluIGFsbCBzZWdtZW50cyBoYXZlIHN0cmljdGx5IGluY3JlYXNpbmcgeC12YWx1ZXMuXG4gICAqICAgaW5jcmVhc2luZ1g6IGZhbHNlXG4gICAqIH07XG4gICAqIGBgYFxuICAgKlxuICAgKiBAbWVtYmVyb2YgQ2hhcnRpc3QuQ29yZVxuICAgKiBAcGFyYW0ge0FycmF5fSBwYXRoQ29vcmRpbmF0ZXMgTGlzdCBvZiBwb2ludCBjb29yZGluYXRlcyB0byBiZSBzcGxpdCBpbiB0aGUgZm9ybSBbeDEsIHkxLCB4MiwgeTIgLi4uIHhuLCB5bl1cbiAgICogQHBhcmFtIHtBcnJheX0gdmFsdWVzIExpc3Qgb2YgYXNzb2NpYXRlZCBwb2ludCB2YWx1ZXMgaW4gdGhlIGZvcm0gW3YxLCB2MiAuLiB2bl1cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgT3B0aW9ucyBzZXQgYnkgdXNlclxuICAgKiBAcmV0dXJuIHtBcnJheX0gTGlzdCBvZiBzZWdtZW50cywgZWFjaCBjb250YWluaW5nIGEgcGF0aENvb3JkaW5hdGVzIGFuZCB2YWx1ZURhdGEgcHJvcGVydHkuXG4gICAqL1xuICBDaGFydGlzdC5zcGxpdEludG9TZWdtZW50cyA9IGZ1bmN0aW9uKHBhdGhDb29yZGluYXRlcywgdmFsdWVEYXRhLCBvcHRpb25zKSB7XG4gICAgdmFyIGRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgaW5jcmVhc2luZ1g6IGZhbHNlLFxuICAgICAgZmlsbEhvbGVzOiBmYWxzZVxuICAgIH07XG5cbiAgICBvcHRpb25zID0gQ2hhcnRpc3QuZXh0ZW5kKHt9LCBkZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB2YXIgc2VnbWVudHMgPSBbXTtcbiAgICB2YXIgaG9sZSA9IHRydWU7XG5cbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgcGF0aENvb3JkaW5hdGVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgICAvLyBJZiB0aGlzIHZhbHVlIGlzIGEgXCJob2xlXCIgd2Ugc2V0IHRoZSBob2xlIGZsYWdcbiAgICAgIGlmKHZhbHVlRGF0YVtpIC8gMl0udmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZighb3B0aW9ucy5maWxsSG9sZXMpIHtcbiAgICAgICAgICBob2xlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYob3B0aW9ucy5pbmNyZWFzaW5nWCAmJiBpID49IDIgJiYgcGF0aENvb3JkaW5hdGVzW2ldIDw9IHBhdGhDb29yZGluYXRlc1tpLTJdKSB7XG4gICAgICAgICAgLy8gWCBpcyBub3QgaW5jcmVhc2luZywgc28gd2UgbmVlZCB0byBtYWtlIHN1cmUgd2Ugc3RhcnQgYSBuZXcgc2VnbWVudFxuICAgICAgICAgIGhvbGUgPSB0cnVlO1xuICAgICAgICB9XG5cblxuICAgICAgICAvLyBJZiBpdCdzIGEgdmFsaWQgdmFsdWUgd2UgbmVlZCB0byBjaGVjayBpZiB3ZSdyZSBjb21pbmcgb3V0IG9mIGEgaG9sZSBhbmQgY3JlYXRlIGEgbmV3IGVtcHR5IHNlZ21lbnRcbiAgICAgICAgaWYoaG9sZSkge1xuICAgICAgICAgIHNlZ21lbnRzLnB1c2goe1xuICAgICAgICAgICAgcGF0aENvb3JkaW5hdGVzOiBbXSxcbiAgICAgICAgICAgIHZhbHVlRGF0YTogW11cbiAgICAgICAgICB9KTtcbiAgICAgICAgICAvLyBBcyB3ZSBoYXZlIGEgdmFsaWQgdmFsdWUgbm93LCB3ZSBhcmUgbm90IGluIGEgXCJob2xlXCIgYW55bW9yZVxuICAgICAgICAgIGhvbGUgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkZCB0byB0aGUgc2VnbWVudCBwYXRoQ29vcmRpbmF0ZXMgYW5kIHZhbHVlRGF0YVxuICAgICAgICBzZWdtZW50c1tzZWdtZW50cy5sZW5ndGggLSAxXS5wYXRoQ29vcmRpbmF0ZXMucHVzaChwYXRoQ29vcmRpbmF0ZXNbaV0sIHBhdGhDb29yZGluYXRlc1tpICsgMV0pO1xuICAgICAgICBzZWdtZW50c1tzZWdtZW50cy5sZW5ndGggLSAxXS52YWx1ZURhdGEucHVzaCh2YWx1ZURhdGFbaSAvIDJdKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc2VnbWVudHM7XG4gIH07XG59KHdpbmRvdywgZG9jdW1lbnQsIENoYXJ0aXN0KSk7XG47LyoqXG4gKiBDaGFydGlzdCBwYXRoIGludGVycG9sYXRpb24gZnVuY3Rpb25zLlxuICpcbiAqIEBtb2R1bGUgQ2hhcnRpc3QuSW50ZXJwb2xhdGlvblxuICovXG4vKiBnbG9iYWwgQ2hhcnRpc3QgKi9cbihmdW5jdGlvbih3aW5kb3csIGRvY3VtZW50LCBDaGFydGlzdCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgQ2hhcnRpc3QuSW50ZXJwb2xhdGlvbiA9IHt9O1xuXG4gIC8qKlxuICAgKiBUaGlzIGludGVycG9sYXRpb24gZnVuY3Rpb24gZG9lcyBub3Qgc21vb3RoIHRoZSBwYXRoIGFuZCB0aGUgcmVzdWx0IGlzIG9ubHkgY29udGFpbmluZyBsaW5lcyBhbmQgbm8gY3VydmVzLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiB2YXIgY2hhcnQgPSBuZXcgQ2hhcnRpc3QuTGluZSgnLmN0LWNoYXJ0Jywge1xuICAgKiAgIGxhYmVsczogWzEsIDIsIDMsIDQsIDVdLFxuICAgKiAgIHNlcmllczogW1sxLCAyLCA4LCAxLCA3XV1cbiAgICogfSwge1xuICAgKiAgIGxpbmVTbW9vdGg6IENoYXJ0aXN0LkludGVycG9sYXRpb24ubm9uZSh7XG4gICAqICAgICBmaWxsSG9sZXM6IGZhbHNlXG4gICAqICAgfSlcbiAgICogfSk7XG4gICAqXG4gICAqXG4gICAqIEBtZW1iZXJvZiBDaGFydGlzdC5JbnRlcnBvbGF0aW9uXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICAgKi9cbiAgQ2hhcnRpc3QuSW50ZXJwb2xhdGlvbi5ub25lID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHZhciBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgIGZpbGxIb2xlczogZmFsc2VcbiAgICB9O1xuICAgIG9wdGlvbnMgPSBDaGFydGlzdC5leHRlbmQoe30sIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gbm9uZShwYXRoQ29vcmRpbmF0ZXMsIHZhbHVlRGF0YSkge1xuICAgICAgdmFyIHBhdGggPSBuZXcgQ2hhcnRpc3QuU3ZnLlBhdGgoKTtcbiAgICAgIHZhciBob2xlID0gdHJ1ZTtcblxuICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHBhdGhDb29yZGluYXRlcy5sZW5ndGg7IGkgKz0gMikge1xuICAgICAgICB2YXIgY3VyclggPSBwYXRoQ29vcmRpbmF0ZXNbaV07XG4gICAgICAgIHZhciBjdXJyWSA9IHBhdGhDb29yZGluYXRlc1tpICsgMV07XG4gICAgICAgIHZhciBjdXJyRGF0YSA9IHZhbHVlRGF0YVtpIC8gMl07XG5cbiAgICAgICAgaWYoY3VyckRhdGEudmFsdWUgIT09IHVuZGVmaW5lZCkge1xuXG4gICAgICAgICAgaWYoaG9sZSkge1xuICAgICAgICAgICAgcGF0aC5tb3ZlKGN1cnJYLCBjdXJyWSwgZmFsc2UsIGN1cnJEYXRhKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGF0aC5saW5lKGN1cnJYLCBjdXJyWSwgZmFsc2UsIGN1cnJEYXRhKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBob2xlID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSBpZighb3B0aW9ucy5maWxsSG9sZXMpIHtcbiAgICAgICAgICBob2xlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcGF0aDtcbiAgICB9O1xuICB9O1xuXG4gIC8qKlxuICAgKiBTaW1wbGUgc21vb3RoaW5nIGNyZWF0ZXMgaG9yaXpvbnRhbCBoYW5kbGVzIHRoYXQgYXJlIHBvc2l0aW9uZWQgd2l0aCBhIGZyYWN0aW9uIG9mIHRoZSBsZW5ndGggYmV0d2VlbiB0d28gZGF0YSBwb2ludHMuIFlvdSBjYW4gdXNlIHRoZSBkaXZpc29yIG9wdGlvbiB0byBzcGVjaWZ5IHRoZSBhbW91bnQgb2Ygc21vb3RoaW5nLlxuICAgKlxuICAgKiBTaW1wbGUgc21vb3RoaW5nIGNhbiBiZSB1c2VkIGluc3RlYWQgb2YgYENoYXJ0aXN0LlNtb290aGluZy5jYXJkaW5hbGAgaWYgeW91J2QgbGlrZSB0byBnZXQgcmlkIG9mIHRoZSBhcnRpZmFjdHMgaXQgcHJvZHVjZXMgc29tZXRpbWVzLiBTaW1wbGUgc21vb3RoaW5nIHByb2R1Y2VzIGxlc3MgZmxvd2luZyBsaW5lcyBidXQgaXMgYWNjdXJhdGUgYnkgaGl0dGluZyB0aGUgcG9pbnRzIGFuZCBpdCBhbHNvIGRvZXNuJ3Qgc3dpbmcgYmVsb3cgb3IgYWJvdmUgdGhlIGdpdmVuIGRhdGEgcG9pbnQuXG4gICAqXG4gICAqIEFsbCBzbW9vdGhpbmcgZnVuY3Rpb25zIHdpdGhpbiBDaGFydGlzdCBhcmUgZmFjdG9yeSBmdW5jdGlvbnMgdGhhdCBhY2NlcHQgYW4gb3B0aW9ucyBwYXJhbWV0ZXIuIFRoZSBzaW1wbGUgaW50ZXJwb2xhdGlvbiBmdW5jdGlvbiBhY2NlcHRzIG9uZSBjb25maWd1cmF0aW9uIHBhcmFtZXRlciBgZGl2aXNvcmAsIGJldHdlZW4gMSBhbmQg4oieLCB3aGljaCBjb250cm9scyB0aGUgc21vb3RoaW5nIGNoYXJhY3RlcmlzdGljcy5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogdmFyIGNoYXJ0ID0gbmV3IENoYXJ0aXN0LkxpbmUoJy5jdC1jaGFydCcsIHtcbiAgICogICBsYWJlbHM6IFsxLCAyLCAzLCA0LCA1XSxcbiAgICogICBzZXJpZXM6IFtbMSwgMiwgOCwgMSwgN11dXG4gICAqIH0sIHtcbiAgICogICBsaW5lU21vb3RoOiBDaGFydGlzdC5JbnRlcnBvbGF0aW9uLnNpbXBsZSh7XG4gICAqICAgICBkaXZpc29yOiAyLFxuICAgKiAgICAgZmlsbEhvbGVzOiBmYWxzZVxuICAgKiAgIH0pXG4gICAqIH0pO1xuICAgKlxuICAgKlxuICAgKiBAbWVtYmVyb2YgQ2hhcnRpc3QuSW50ZXJwb2xhdGlvblxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBUaGUgb3B0aW9ucyBvZiB0aGUgc2ltcGxlIGludGVycG9sYXRpb24gZmFjdG9yeSBmdW5jdGlvbi5cbiAgICogQHJldHVybiB7RnVuY3Rpb259XG4gICAqL1xuICBDaGFydGlzdC5JbnRlcnBvbGF0aW9uLnNpbXBsZSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB2YXIgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICBkaXZpc29yOiAyLFxuICAgICAgZmlsbEhvbGVzOiBmYWxzZVxuICAgIH07XG4gICAgb3B0aW9ucyA9IENoYXJ0aXN0LmV4dGVuZCh7fSwgZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgdmFyIGQgPSAxIC8gTWF0aC5tYXgoMSwgb3B0aW9ucy5kaXZpc29yKTtcblxuICAgIHJldHVybiBmdW5jdGlvbiBzaW1wbGUocGF0aENvb3JkaW5hdGVzLCB2YWx1ZURhdGEpIHtcbiAgICAgIHZhciBwYXRoID0gbmV3IENoYXJ0aXN0LlN2Zy5QYXRoKCk7XG4gICAgICB2YXIgcHJldlgsIHByZXZZLCBwcmV2RGF0YTtcblxuICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHBhdGhDb29yZGluYXRlcy5sZW5ndGg7IGkgKz0gMikge1xuICAgICAgICB2YXIgY3VyclggPSBwYXRoQ29vcmRpbmF0ZXNbaV07XG4gICAgICAgIHZhciBjdXJyWSA9IHBhdGhDb29yZGluYXRlc1tpICsgMV07XG4gICAgICAgIHZhciBsZW5ndGggPSAoY3VyclggLSBwcmV2WCkgKiBkO1xuICAgICAgICB2YXIgY3VyckRhdGEgPSB2YWx1ZURhdGFbaSAvIDJdO1xuXG4gICAgICAgIGlmKGN1cnJEYXRhLnZhbHVlICE9PSB1bmRlZmluZWQpIHtcblxuICAgICAgICAgIGlmKHByZXZEYXRhID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHBhdGgubW92ZShjdXJyWCwgY3VyclksIGZhbHNlLCBjdXJyRGF0YSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhdGguY3VydmUoXG4gICAgICAgICAgICAgIHByZXZYICsgbGVuZ3RoLFxuICAgICAgICAgICAgICBwcmV2WSxcbiAgICAgICAgICAgICAgY3VyclggLSBsZW5ndGgsXG4gICAgICAgICAgICAgIGN1cnJZLFxuICAgICAgICAgICAgICBjdXJyWCxcbiAgICAgICAgICAgICAgY3VyclksXG4gICAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgICBjdXJyRGF0YVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBwcmV2WCA9IGN1cnJYO1xuICAgICAgICAgIHByZXZZID0gY3Vyclk7XG4gICAgICAgICAgcHJldkRhdGEgPSBjdXJyRGF0YTtcbiAgICAgICAgfSBlbHNlIGlmKCFvcHRpb25zLmZpbGxIb2xlcykge1xuICAgICAgICAgIHByZXZYID0gY3VyclggPSBwcmV2RGF0YSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcGF0aDtcbiAgICB9O1xuICB9O1xuXG4gIC8qKlxuICAgKiBDYXJkaW5hbCAvIENhdG11bGwtUm9tZSBzcGxpbmUgaW50ZXJwb2xhdGlvbiBpcyB0aGUgZGVmYXVsdCBzbW9vdGhpbmcgZnVuY3Rpb24gaW4gQ2hhcnRpc3QuIEl0IHByb2R1Y2VzIG5pY2UgcmVzdWx0cyB3aGVyZSB0aGUgc3BsaW5lcyB3aWxsIGFsd2F5cyBtZWV0IHRoZSBwb2ludHMuIEl0IHByb2R1Y2VzIHNvbWUgYXJ0aWZhY3RzIHRob3VnaCB3aGVuIGRhdGEgdmFsdWVzIGFyZSBpbmNyZWFzZWQgb3IgZGVjcmVhc2VkIHJhcGlkbHkuIFRoZSBsaW5lIG1heSBub3QgZm9sbG93IGEgdmVyeSBhY2N1cmF0ZSBwYXRoIGFuZCBpZiB0aGUgbGluZSBzaG91bGQgYmUgYWNjdXJhdGUgdGhpcyBzbW9vdGhpbmcgZnVuY3Rpb24gZG9lcyBub3QgcHJvZHVjZSB0aGUgYmVzdCByZXN1bHRzLlxuICAgKlxuICAgKiBDYXJkaW5hbCBzcGxpbmVzIGNhbiBvbmx5IGJlIGNyZWF0ZWQgaWYgdGhlcmUgYXJlIG1vcmUgdGhhbiB0d28gZGF0YSBwb2ludHMuIElmIHRoaXMgaXMgbm90IHRoZSBjYXNlIHRoaXMgc21vb3RoaW5nIHdpbGwgZmFsbGJhY2sgdG8gYENoYXJ0aXN0LlNtb290aGluZy5ub25lYC5cbiAgICpcbiAgICogQWxsIHNtb290aGluZyBmdW5jdGlvbnMgd2l0aGluIENoYXJ0aXN0IGFyZSBmYWN0b3J5IGZ1bmN0aW9ucyB0aGF0IGFjY2VwdCBhbiBvcHRpb25zIHBhcmFtZXRlci4gVGhlIGNhcmRpbmFsIGludGVycG9sYXRpb24gZnVuY3Rpb24gYWNjZXB0cyBvbmUgY29uZmlndXJhdGlvbiBwYXJhbWV0ZXIgYHRlbnNpb25gLCBiZXR3ZWVuIDAgYW5kIDEsIHdoaWNoIGNvbnRyb2xzIHRoZSBzbW9vdGhpbmcgaW50ZW5zaXR5LlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiB2YXIgY2hhcnQgPSBuZXcgQ2hhcnRpc3QuTGluZSgnLmN0LWNoYXJ0Jywge1xuICAgKiAgIGxhYmVsczogWzEsIDIsIDMsIDQsIDVdLFxuICAgKiAgIHNlcmllczogW1sxLCAyLCA4LCAxLCA3XV1cbiAgICogfSwge1xuICAgKiAgIGxpbmVTbW9vdGg6IENoYXJ0aXN0LkludGVycG9sYXRpb24uY2FyZGluYWwoe1xuICAgKiAgICAgdGVuc2lvbjogMSxcbiAgICogICAgIGZpbGxIb2xlczogZmFsc2VcbiAgICogICB9KVxuICAgKiB9KTtcbiAgICpcbiAgICogQG1lbWJlcm9mIENoYXJ0aXN0LkludGVycG9sYXRpb25cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgVGhlIG9wdGlvbnMgb2YgdGhlIGNhcmRpbmFsIGZhY3RvcnkgZnVuY3Rpb24uXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICAgKi9cbiAgQ2hhcnRpc3QuSW50ZXJwb2xhdGlvbi5jYXJkaW5hbCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB2YXIgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICB0ZW5zaW9uOiAxLFxuICAgICAgZmlsbEhvbGVzOiBmYWxzZVxuICAgIH07XG5cbiAgICBvcHRpb25zID0gQ2hhcnRpc3QuZXh0ZW5kKHt9LCBkZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB2YXIgdCA9IE1hdGgubWluKDEsIE1hdGgubWF4KDAsIG9wdGlvbnMudGVuc2lvbikpLFxuICAgICAgYyA9IDEgLSB0O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGNhcmRpbmFsKHBhdGhDb29yZGluYXRlcywgdmFsdWVEYXRhKSB7XG4gICAgICAvLyBGaXJzdCB3ZSB0cnkgdG8gc3BsaXQgdGhlIGNvb3JkaW5hdGVzIGludG8gc2VnbWVudHNcbiAgICAgIC8vIFRoaXMgaXMgbmVjZXNzYXJ5IHRvIHRyZWF0IFwiaG9sZXNcIiBpbiBsaW5lIGNoYXJ0c1xuICAgICAgdmFyIHNlZ21lbnRzID0gQ2hhcnRpc3Quc3BsaXRJbnRvU2VnbWVudHMocGF0aENvb3JkaW5hdGVzLCB2YWx1ZURhdGEsIHtcbiAgICAgICAgZmlsbEhvbGVzOiBvcHRpb25zLmZpbGxIb2xlc1xuICAgICAgfSk7XG5cbiAgICAgIGlmKCFzZWdtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgLy8gSWYgdGhlcmUgd2VyZSBubyBzZWdtZW50cyByZXR1cm4gJ0NoYXJ0aXN0LkludGVycG9sYXRpb24ubm9uZSdcbiAgICAgICAgcmV0dXJuIENoYXJ0aXN0LkludGVycG9sYXRpb24ubm9uZSgpKFtdKTtcbiAgICAgIH0gZWxzZSBpZihzZWdtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIC8vIElmIHRoZSBzcGxpdCByZXN1bHRlZCBpbiBtb3JlIHRoYXQgb25lIHNlZ21lbnQgd2UgbmVlZCB0byBpbnRlcnBvbGF0ZSBlYWNoIHNlZ21lbnQgaW5kaXZpZHVhbGx5IGFuZCBqb2luIHRoZW1cbiAgICAgICAgLy8gYWZ0ZXJ3YXJkcyB0b2dldGhlciBpbnRvIGEgc2luZ2xlIHBhdGguXG4gICAgICAgICAgdmFyIHBhdGhzID0gW107XG4gICAgICAgIC8vIEZvciBlYWNoIHNlZ21lbnQgd2Ugd2lsbCByZWN1cnNlIHRoZSBjYXJkaW5hbCBmdW5jdGlvblxuICAgICAgICBzZWdtZW50cy5mb3JFYWNoKGZ1bmN0aW9uKHNlZ21lbnQpIHtcbiAgICAgICAgICBwYXRocy5wdXNoKGNhcmRpbmFsKHNlZ21lbnQucGF0aENvb3JkaW5hdGVzLCBzZWdtZW50LnZhbHVlRGF0YSkpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gSm9pbiB0aGUgc2VnbWVudCBwYXRoIGRhdGEgaW50byBhIHNpbmdsZSBwYXRoIGFuZCByZXR1cm5cbiAgICAgICAgcmV0dXJuIENoYXJ0aXN0LlN2Zy5QYXRoLmpvaW4ocGF0aHMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gSWYgdGhlcmUgd2FzIG9ubHkgb25lIHNlZ21lbnQgd2UgY2FuIHByb2NlZWQgcmVndWxhcmx5IGJ5IHVzaW5nIHBhdGhDb29yZGluYXRlcyBhbmQgdmFsdWVEYXRhIGZyb20gdGhlIGZpcnN0XG4gICAgICAgIC8vIHNlZ21lbnRcbiAgICAgICAgcGF0aENvb3JkaW5hdGVzID0gc2VnbWVudHNbMF0ucGF0aENvb3JkaW5hdGVzO1xuICAgICAgICB2YWx1ZURhdGEgPSBzZWdtZW50c1swXS52YWx1ZURhdGE7XG5cbiAgICAgICAgLy8gSWYgbGVzcyB0aGFuIHR3byBwb2ludHMgd2UgbmVlZCB0byBmYWxsYmFjayB0byBubyBzbW9vdGhpbmdcbiAgICAgICAgaWYocGF0aENvb3JkaW5hdGVzLmxlbmd0aCA8PSA0KSB7XG4gICAgICAgICAgcmV0dXJuIENoYXJ0aXN0LkludGVycG9sYXRpb24ubm9uZSgpKHBhdGhDb29yZGluYXRlcywgdmFsdWVEYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBwYXRoID0gbmV3IENoYXJ0aXN0LlN2Zy5QYXRoKCkubW92ZShwYXRoQ29vcmRpbmF0ZXNbMF0sIHBhdGhDb29yZGluYXRlc1sxXSwgZmFsc2UsIHZhbHVlRGF0YVswXSksXG4gICAgICAgICAgejtcblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgaUxlbiA9IHBhdGhDb29yZGluYXRlcy5sZW5ndGg7IGlMZW4gLSAyICogIXogPiBpOyBpICs9IDIpIHtcbiAgICAgICAgICB2YXIgcCA9IFtcbiAgICAgICAgICAgIHt4OiArcGF0aENvb3JkaW5hdGVzW2kgLSAyXSwgeTogK3BhdGhDb29yZGluYXRlc1tpIC0gMV19LFxuICAgICAgICAgICAge3g6ICtwYXRoQ29vcmRpbmF0ZXNbaV0sIHk6ICtwYXRoQ29vcmRpbmF0ZXNbaSArIDFdfSxcbiAgICAgICAgICAgIHt4OiArcGF0aENvb3JkaW5hdGVzW2kgKyAyXSwgeTogK3BhdGhDb29yZGluYXRlc1tpICsgM119LFxuICAgICAgICAgICAge3g6ICtwYXRoQ29vcmRpbmF0ZXNbaSArIDRdLCB5OiArcGF0aENvb3JkaW5hdGVzW2kgKyA1XX1cbiAgICAgICAgICBdO1xuICAgICAgICAgIGlmICh6KSB7XG4gICAgICAgICAgICBpZiAoIWkpIHtcbiAgICAgICAgICAgICAgcFswXSA9IHt4OiArcGF0aENvb3JkaW5hdGVzW2lMZW4gLSAyXSwgeTogK3BhdGhDb29yZGluYXRlc1tpTGVuIC0gMV19O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpTGVuIC0gNCA9PT0gaSkge1xuICAgICAgICAgICAgICBwWzNdID0ge3g6ICtwYXRoQ29vcmRpbmF0ZXNbMF0sIHk6ICtwYXRoQ29vcmRpbmF0ZXNbMV19O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpTGVuIC0gMiA9PT0gaSkge1xuICAgICAgICAgICAgICBwWzJdID0ge3g6ICtwYXRoQ29vcmRpbmF0ZXNbMF0sIHk6ICtwYXRoQ29vcmRpbmF0ZXNbMV19O1xuICAgICAgICAgICAgICBwWzNdID0ge3g6ICtwYXRoQ29vcmRpbmF0ZXNbMl0sIHk6ICtwYXRoQ29vcmRpbmF0ZXNbM119O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoaUxlbiAtIDQgPT09IGkpIHtcbiAgICAgICAgICAgICAgcFszXSA9IHBbMl07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFpKSB7XG4gICAgICAgICAgICAgIHBbMF0gPSB7eDogK3BhdGhDb29yZGluYXRlc1tpXSwgeTogK3BhdGhDb29yZGluYXRlc1tpICsgMV19O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHBhdGguY3VydmUoXG4gICAgICAgICAgICAodCAqICgtcFswXS54ICsgNiAqIHBbMV0ueCArIHBbMl0ueCkgLyA2KSArIChjICogcFsyXS54KSxcbiAgICAgICAgICAgICh0ICogKC1wWzBdLnkgKyA2ICogcFsxXS55ICsgcFsyXS55KSAvIDYpICsgKGMgKiBwWzJdLnkpLFxuICAgICAgICAgICAgKHQgKiAocFsxXS54ICsgNiAqIHBbMl0ueCAtIHBbM10ueCkgLyA2KSArIChjICogcFsyXS54KSxcbiAgICAgICAgICAgICh0ICogKHBbMV0ueSArIDYgKiBwWzJdLnkgLSBwWzNdLnkpIC8gNikgKyAoYyAqIHBbMl0ueSksXG4gICAgICAgICAgICBwWzJdLngsXG4gICAgICAgICAgICBwWzJdLnksXG4gICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgIHZhbHVlRGF0YVsoaSArIDIpIC8gMl1cbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBhdGg7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICAvKipcbiAgICogTW9ub3RvbmUgQ3ViaWMgc3BsaW5lIGludGVycG9sYXRpb24gcHJvZHVjZXMgYSBzbW9vdGggY3VydmUgd2hpY2ggcHJlc2VydmVzIG1vbm90b25pY2l0eS4gVW5saWtlIGNhcmRpbmFsIHNwbGluZXMsIHRoZSBjdXJ2ZSB3aWxsIG5vdCBleHRlbmQgYmV5b25kIHRoZSByYW5nZSBvZiB5LXZhbHVlcyBvZiB0aGUgb3JpZ2luYWwgZGF0YSBwb2ludHMuXG4gICAqXG4gICAqIE1vbm90b25lIEN1YmljIHNwbGluZXMgY2FuIG9ubHkgYmUgY3JlYXRlZCBpZiB0aGVyZSBhcmUgbW9yZSB0aGFuIHR3byBkYXRhIHBvaW50cy4gSWYgdGhpcyBpcyBub3QgdGhlIGNhc2UgdGhpcyBzbW9vdGhpbmcgd2lsbCBmYWxsYmFjayB0byBgQ2hhcnRpc3QuU21vb3RoaW5nLm5vbmVgLlxuICAgKlxuICAgKiBUaGUgeC12YWx1ZXMgb2Ygc3Vic2VxdWVudCBwb2ludHMgbXVzdCBiZSBpbmNyZWFzaW5nIHRvIGZpdCBhIE1vbm90b25lIEN1YmljIHNwbGluZS4gSWYgdGhpcyBjb25kaXRpb24gaXMgbm90IG1ldCBmb3IgYSBwYWlyIG9mIGFkamFjZW50IHBvaW50cywgdGhlbiB0aGVyZSB3aWxsIGJlIGEgYnJlYWsgaW4gdGhlIGN1cnZlIGJldHdlZW4gdGhvc2UgZGF0YSBwb2ludHMuXG4gICAqXG4gICAqIEFsbCBzbW9vdGhpbmcgZnVuY3Rpb25zIHdpdGhpbiBDaGFydGlzdCBhcmUgZmFjdG9yeSBmdW5jdGlvbnMgdGhhdCBhY2NlcHQgYW4gb3B0aW9ucyBwYXJhbWV0ZXIuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIHZhciBjaGFydCA9IG5ldyBDaGFydGlzdC5MaW5lKCcuY3QtY2hhcnQnLCB7XG4gICAqICAgbGFiZWxzOiBbMSwgMiwgMywgNCwgNV0sXG4gICAqICAgc2VyaWVzOiBbWzEsIDIsIDgsIDEsIDddXVxuICAgKiB9LCB7XG4gICAqICAgbGluZVNtb290aDogQ2hhcnRpc3QuSW50ZXJwb2xhdGlvbi5tb25vdG9uZUN1YmljKHtcbiAgICogICAgIGZpbGxIb2xlczogZmFsc2VcbiAgICogICB9KVxuICAgKiB9KTtcbiAgICpcbiAgICogQG1lbWJlcm9mIENoYXJ0aXN0LkludGVycG9sYXRpb25cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgVGhlIG9wdGlvbnMgb2YgdGhlIG1vbm90b25lQ3ViaWMgZmFjdG9yeSBmdW5jdGlvbi5cbiAgICogQHJldHVybiB7RnVuY3Rpb259XG4gICAqL1xuICBDaGFydGlzdC5JbnRlcnBvbGF0aW9uLm1vbm90b25lQ3ViaWMgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdmFyIGRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgZmlsbEhvbGVzOiBmYWxzZVxuICAgIH07XG5cbiAgICBvcHRpb25zID0gQ2hhcnRpc3QuZXh0ZW5kKHt9LCBkZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gbW9ub3RvbmVDdWJpYyhwYXRoQ29vcmRpbmF0ZXMsIHZhbHVlRGF0YSkge1xuICAgICAgLy8gRmlyc3Qgd2UgdHJ5IHRvIHNwbGl0IHRoZSBjb29yZGluYXRlcyBpbnRvIHNlZ21lbnRzXG4gICAgICAvLyBUaGlzIGlzIG5lY2Vzc2FyeSB0byB0cmVhdCBcImhvbGVzXCIgaW4gbGluZSBjaGFydHNcbiAgICAgIHZhciBzZWdtZW50cyA9IENoYXJ0aXN0LnNwbGl0SW50b1NlZ21lbnRzKHBhdGhDb29yZGluYXRlcywgdmFsdWVEYXRhLCB7XG4gICAgICAgIGZpbGxIb2xlczogb3B0aW9ucy5maWxsSG9sZXMsXG4gICAgICAgIGluY3JlYXNpbmdYOiB0cnVlXG4gICAgICB9KTtcblxuICAgICAgaWYoIXNlZ21lbnRzLmxlbmd0aCkge1xuICAgICAgICAvLyBJZiB0aGVyZSB3ZXJlIG5vIHNlZ21lbnRzIHJldHVybiAnQ2hhcnRpc3QuSW50ZXJwb2xhdGlvbi5ub25lJ1xuICAgICAgICByZXR1cm4gQ2hhcnRpc3QuSW50ZXJwb2xhdGlvbi5ub25lKCkoW10pO1xuICAgICAgfSBlbHNlIGlmKHNlZ21lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgLy8gSWYgdGhlIHNwbGl0IHJlc3VsdGVkIGluIG1vcmUgdGhhdCBvbmUgc2VnbWVudCB3ZSBuZWVkIHRvIGludGVycG9sYXRlIGVhY2ggc2VnbWVudCBpbmRpdmlkdWFsbHkgYW5kIGpvaW4gdGhlbVxuICAgICAgICAvLyBhZnRlcndhcmRzIHRvZ2V0aGVyIGludG8gYSBzaW5nbGUgcGF0aC5cbiAgICAgICAgICB2YXIgcGF0aHMgPSBbXTtcbiAgICAgICAgLy8gRm9yIGVhY2ggc2VnbWVudCB3ZSB3aWxsIHJlY3Vyc2UgdGhlIG1vbm90b25lQ3ViaWMgZm4gZnVuY3Rpb25cbiAgICAgICAgc2VnbWVudHMuZm9yRWFjaChmdW5jdGlvbihzZWdtZW50KSB7XG4gICAgICAgICAgcGF0aHMucHVzaChtb25vdG9uZUN1YmljKHNlZ21lbnQucGF0aENvb3JkaW5hdGVzLCBzZWdtZW50LnZhbHVlRGF0YSkpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gSm9pbiB0aGUgc2VnbWVudCBwYXRoIGRhdGEgaW50byBhIHNpbmdsZSBwYXRoIGFuZCByZXR1cm5cbiAgICAgICAgcmV0dXJuIENoYXJ0aXN0LlN2Zy5QYXRoLmpvaW4ocGF0aHMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gSWYgdGhlcmUgd2FzIG9ubHkgb25lIHNlZ21lbnQgd2UgY2FuIHByb2NlZWQgcmVndWxhcmx5IGJ5IHVzaW5nIHBhdGhDb29yZGluYXRlcyBhbmQgdmFsdWVEYXRhIGZyb20gdGhlIGZpcnN0XG4gICAgICAgIC8vIHNlZ21lbnRcbiAgICAgICAgcGF0aENvb3JkaW5hdGVzID0gc2VnbWVudHNbMF0ucGF0aENvb3JkaW5hdGVzO1xuICAgICAgICB2YWx1ZURhdGEgPSBzZWdtZW50c1swXS52YWx1ZURhdGE7XG5cbiAgICAgICAgLy8gSWYgbGVzcyB0aGFuIHRocmVlIHBvaW50cyB3ZSBuZWVkIHRvIGZhbGxiYWNrIHRvIG5vIHNtb290aGluZ1xuICAgICAgICBpZihwYXRoQ29vcmRpbmF0ZXMubGVuZ3RoIDw9IDQpIHtcbiAgICAgICAgICByZXR1cm4gQ2hhcnRpc3QuSW50ZXJwb2xhdGlvbi5ub25lKCkocGF0aENvb3JkaW5hdGVzLCB2YWx1ZURhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHhzID0gW10sXG4gICAgICAgICAgeXMgPSBbXSxcbiAgICAgICAgICBpLFxuICAgICAgICAgIG4gPSBwYXRoQ29vcmRpbmF0ZXMubGVuZ3RoIC8gMixcbiAgICAgICAgICBtcyA9IFtdLFxuICAgICAgICAgIGRzID0gW10sIGR5cyA9IFtdLCBkeHMgPSBbXSxcbiAgICAgICAgICBwYXRoO1xuXG4gICAgICAgIC8vIFBvcHVsYXRlIHggYW5kIHkgY29vcmRpbmF0ZXMgaW50byBzZXBhcmF0ZSBhcnJheXMsIGZvciByZWFkYWJpbGl0eVxuXG4gICAgICAgIGZvcihpID0gMDsgaSA8IG47IGkrKykge1xuICAgICAgICAgIHhzW2ldID0gcGF0aENvb3JkaW5hdGVzW2kgKiAyXTtcbiAgICAgICAgICB5c1tpXSA9IHBhdGhDb29yZGluYXRlc1tpICogMiArIDFdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIGRlbHRhcyBhbmQgZGVyaXZhdGl2ZVxuXG4gICAgICAgIGZvcihpID0gMDsgaSA8IG4gLSAxOyBpKyspIHtcbiAgICAgICAgICBkeXNbaV0gPSB5c1tpICsgMV0gLSB5c1tpXTtcbiAgICAgICAgICBkeHNbaV0gPSB4c1tpICsgMV0gLSB4c1tpXTtcbiAgICAgICAgICBkc1tpXSA9IGR5c1tpXSAvIGR4c1tpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERldGVybWluZSBkZXNpcmVkIHNsb3BlIChtKSBhdCBlYWNoIHBvaW50IHVzaW5nIEZyaXRzY2gtQ2FybHNvbiBtZXRob2RcbiAgICAgICAgLy8gU2VlOiBodHRwOi8vbWF0aC5zdGFja2V4Y2hhbmdlLmNvbS9xdWVzdGlvbnMvNDUyMTgvaW1wbGVtZW50YXRpb24tb2YtbW9ub3RvbmUtY3ViaWMtaW50ZXJwb2xhdGlvblxuXG4gICAgICAgIG1zWzBdID0gZHNbMF07XG4gICAgICAgIG1zW24gLSAxXSA9IGRzW24gLSAyXTtcblxuICAgICAgICBmb3IoaSA9IDE7IGkgPCBuIC0gMTsgaSsrKSB7XG4gICAgICAgICAgaWYoZHNbaV0gPT09IDAgfHwgZHNbaSAtIDFdID09PSAwIHx8IChkc1tpIC0gMV0gPiAwKSAhPT0gKGRzW2ldID4gMCkpIHtcbiAgICAgICAgICAgIG1zW2ldID0gMDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbXNbaV0gPSAzICogKGR4c1tpIC0gMV0gKyBkeHNbaV0pIC8gKFxuICAgICAgICAgICAgICAoMiAqIGR4c1tpXSArIGR4c1tpIC0gMV0pIC8gZHNbaSAtIDFdICtcbiAgICAgICAgICAgICAgKGR4c1tpXSArIDIgKiBkeHNbaSAtIDFdKSAvIGRzW2ldKTtcblxuICAgICAgICAgICAgaWYoIWlzRmluaXRlKG1zW2ldKSkge1xuICAgICAgICAgICAgICBtc1tpXSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gTm93IGJ1aWxkIGEgcGF0aCBmcm9tIHRoZSBzbG9wZXNcblxuICAgICAgICBwYXRoID0gbmV3IENoYXJ0aXN0LlN2Zy5QYXRoKCkubW92ZSh4c1swXSwgeXNbMF0sIGZhbHNlLCB2YWx1ZURhdGFbMF0pO1xuXG4gICAgICAgIGZvcihpID0gMDsgaSA8IG4gLSAxOyBpKyspIHtcbiAgICAgICAgICBwYXRoLmN1cnZlKFxuICAgICAgICAgICAgLy8gRmlyc3QgY29udHJvbCBwb2ludFxuICAgICAgICAgICAgeHNbaV0gKyBkeHNbaV0gLyAzLFxuICAgICAgICAgICAgeXNbaV0gKyBtc1tpXSAqIGR4c1tpXSAvIDMsXG4gICAgICAgICAgICAvLyBTZWNvbmQgY29udHJvbCBwb2ludFxuICAgICAgICAgICAgeHNbaSArIDFdIC0gZHhzW2ldIC8gMyxcbiAgICAgICAgICAgIHlzW2kgKyAxXSAtIG1zW2kgKyAxXSAqIGR4c1tpXSAvIDMsXG4gICAgICAgICAgICAvLyBFbmQgcG9pbnRcbiAgICAgICAgICAgIHhzW2kgKyAxXSxcbiAgICAgICAgICAgIHlzW2kgKyAxXSxcblxuICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICB2YWx1ZURhdGFbaSArIDFdXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwYXRoO1xuICAgICAgfVxuICAgIH07XG4gIH07XG5cbiAgLyoqXG4gICAqIFN0ZXAgaW50ZXJwb2xhdGlvbiB3aWxsIGNhdXNlIHRoZSBsaW5lIGNoYXJ0IHRvIG1vdmUgaW4gc3RlcHMgcmF0aGVyIHRoYW4gZGlhZ29uYWwgb3Igc21vb3RoZWQgbGluZXMuIFRoaXMgaW50ZXJwb2xhdGlvbiB3aWxsIGNyZWF0ZSBhZGRpdGlvbmFsIHBvaW50cyB0aGF0IHdpbGwgYWxzbyBiZSBkcmF3biB3aGVuIHRoZSBgc2hvd1BvaW50YCBvcHRpb24gaXMgZW5hYmxlZC5cbiAgICpcbiAgICogQWxsIHNtb290aGluZyBmdW5jdGlvbnMgd2l0aGluIENoYXJ0aXN0IGFyZSBmYWN0b3J5IGZ1bmN0aW9ucyB0aGF0IGFjY2VwdCBhbiBvcHRpb25zIHBhcmFtZXRlci4gVGhlIHN0ZXAgaW50ZXJwb2xhdGlvbiBmdW5jdGlvbiBhY2NlcHRzIG9uZSBjb25maWd1cmF0aW9uIHBhcmFtZXRlciBgcG9zdHBvbmVgLCB0aGF0IGNhbiBiZSBgdHJ1ZWAgb3IgYGZhbHNlYC4gVGhlIGRlZmF1bHQgdmFsdWUgaXMgYHRydWVgIGFuZCB3aWxsIGNhdXNlIHRoZSBzdGVwIHRvIG9jY3VyIHdoZXJlIHRoZSB2YWx1ZSBhY3R1YWxseSBjaGFuZ2VzLiBJZiBhIGRpZmZlcmVudCBiZWhhdmlvdXIgaXMgbmVlZGVkIHdoZXJlIHRoZSBzdGVwIGlzIHNoaWZ0ZWQgdG8gdGhlIGxlZnQgYW5kIGhhcHBlbnMgYmVmb3JlIHRoZSBhY3R1YWwgdmFsdWUsIHRoaXMgb3B0aW9uIGNhbiBiZSBzZXQgdG8gYGZhbHNlYC5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogdmFyIGNoYXJ0ID0gbmV3IENoYXJ0aXN0LkxpbmUoJy5jdC1jaGFydCcsIHtcbiAgICogICBsYWJlbHM6IFsxLCAyLCAzLCA0LCA1XSxcbiAgICogICBzZXJpZXM6IFtbMSwgMiwgOCwgMSwgN11dXG4gICAqIH0sIHtcbiAgICogICBsaW5lU21vb3RoOiBDaGFydGlzdC5JbnRlcnBvbGF0aW9uLnN0ZXAoe1xuICAgKiAgICAgcG9zdHBvbmU6IHRydWUsXG4gICAqICAgICBmaWxsSG9sZXM6IGZhbHNlXG4gICAqICAgfSlcbiAgICogfSk7XG4gICAqXG4gICAqIEBtZW1iZXJvZiBDaGFydGlzdC5JbnRlcnBvbGF0aW9uXG4gICAqIEBwYXJhbSBvcHRpb25zXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn1cbiAgICovXG4gIENoYXJ0aXN0LkludGVycG9sYXRpb24uc3RlcCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB2YXIgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICBwb3N0cG9uZTogdHJ1ZSxcbiAgICAgIGZpbGxIb2xlczogZmFsc2VcbiAgICB9O1xuXG4gICAgb3B0aW9ucyA9IENoYXJ0aXN0LmV4dGVuZCh7fSwgZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIHN0ZXAocGF0aENvb3JkaW5hdGVzLCB2YWx1ZURhdGEpIHtcbiAgICAgIHZhciBwYXRoID0gbmV3IENoYXJ0aXN0LlN2Zy5QYXRoKCk7XG5cbiAgICAgIHZhciBwcmV2WCwgcHJldlksIHByZXZEYXRhO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhdGhDb29yZGluYXRlcy5sZW5ndGg7IGkgKz0gMikge1xuICAgICAgICB2YXIgY3VyclggPSBwYXRoQ29vcmRpbmF0ZXNbaV07XG4gICAgICAgIHZhciBjdXJyWSA9IHBhdGhDb29yZGluYXRlc1tpICsgMV07XG4gICAgICAgIHZhciBjdXJyRGF0YSA9IHZhbHVlRGF0YVtpIC8gMl07XG5cbiAgICAgICAgLy8gSWYgdGhlIGN1cnJlbnQgcG9pbnQgaXMgYWxzbyBub3QgYSBob2xlIHdlIGNhbiBkcmF3IHRoZSBzdGVwIGxpbmVzXG4gICAgICAgIGlmKGN1cnJEYXRhLnZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBpZihwcmV2RGF0YSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBwYXRoLm1vdmUoY3VyclgsIGN1cnJZLCBmYWxzZSwgY3VyckRhdGEpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZihvcHRpb25zLnBvc3Rwb25lKSB7XG4gICAgICAgICAgICAgIC8vIElmIHBvc3Rwb25lZCB3ZSBzaG91bGQgZHJhdyB0aGUgc3RlcCBsaW5lIHdpdGggdGhlIHZhbHVlIG9mIHRoZSBwcmV2aW91cyB2YWx1ZVxuICAgICAgICAgICAgICBwYXRoLmxpbmUoY3VyclgsIHByZXZZLCBmYWxzZSwgcHJldkRhdGEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gSWYgbm90IHBvc3Rwb25lZCB3ZSBzaG91bGQgZHJhdyB0aGUgc3RlcCBsaW5lIHdpdGggdGhlIHZhbHVlIG9mIHRoZSBjdXJyZW50IHZhbHVlXG4gICAgICAgICAgICAgIHBhdGgubGluZShwcmV2WCwgY3VyclksIGZhbHNlLCBjdXJyRGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBMaW5lIHRvIHRoZSBhY3R1YWwgcG9pbnQgKHRoaXMgc2hvdWxkIG9ubHkgYmUgYSBZLUF4aXMgbW92ZW1lbnRcbiAgICAgICAgICAgIHBhdGgubGluZShjdXJyWCwgY3VyclksIGZhbHNlLCBjdXJyRGF0YSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcHJldlggPSBjdXJyWDtcbiAgICAgICAgICBwcmV2WSA9IGN1cnJZO1xuICAgICAgICAgIHByZXZEYXRhID0gY3VyckRhdGE7XG4gICAgICAgIH0gZWxzZSBpZighb3B0aW9ucy5maWxsSG9sZXMpIHtcbiAgICAgICAgICBwcmV2WCA9IHByZXZZID0gcHJldkRhdGEgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHBhdGg7XG4gICAgfTtcbiAgfTtcblxufSh3aW5kb3csIGRvY3VtZW50LCBDaGFydGlzdCkpO1xuOy8qKlxuICogQSB2ZXJ5IGJhc2ljIGV2ZW50IG1vZHVsZSB0aGF0IGhlbHBzIHRvIGdlbmVyYXRlIGFuZCBjYXRjaCBldmVudHMuXG4gKlxuICogQG1vZHVsZSBDaGFydGlzdC5FdmVudFxuICovXG4vKiBnbG9iYWwgQ2hhcnRpc3QgKi9cbihmdW5jdGlvbiAod2luZG93LCBkb2N1bWVudCwgQ2hhcnRpc3QpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIENoYXJ0aXN0LkV2ZW50RW1pdHRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaGFuZGxlcnMgPSBbXTtcblxuICAgIC8qKlxuICAgICAqIEFkZCBhbiBldmVudCBoYW5kbGVyIGZvciBhIHNwZWNpZmljIGV2ZW50XG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgQ2hhcnRpc3QuRXZlbnRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnQgVGhlIGV2ZW50IG5hbWVcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBoYW5kbGVyIEEgZXZlbnQgaGFuZGxlciBmdW5jdGlvblxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGFkZEV2ZW50SGFuZGxlcihldmVudCwgaGFuZGxlcikge1xuICAgICAgaGFuZGxlcnNbZXZlbnRdID0gaGFuZGxlcnNbZXZlbnRdIHx8IFtdO1xuICAgICAgaGFuZGxlcnNbZXZlbnRdLnB1c2goaGFuZGxlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGFuIGV2ZW50IGhhbmRsZXIgb2YgYSBzcGVjaWZpYyBldmVudCBuYW1lIG9yIHJlbW92ZSBhbGwgZXZlbnQgaGFuZGxlcnMgZm9yIGEgc3BlY2lmaWMgZXZlbnQuXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgQ2hhcnRpc3QuRXZlbnRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnQgVGhlIGV2ZW50IG5hbWUgd2hlcmUgYSBzcGVjaWZpYyBvciBhbGwgaGFuZGxlcnMgc2hvdWxkIGJlIHJlbW92ZWRcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbaGFuZGxlcl0gQW4gb3B0aW9uYWwgZXZlbnQgaGFuZGxlciBmdW5jdGlvbi4gSWYgc3BlY2lmaWVkIG9ubHkgdGhpcyBzcGVjaWZpYyBoYW5kbGVyIHdpbGwgYmUgcmVtb3ZlZCBhbmQgb3RoZXJ3aXNlIGFsbCBoYW5kbGVycyBhcmUgcmVtb3ZlZC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiByZW1vdmVFdmVudEhhbmRsZXIoZXZlbnQsIGhhbmRsZXIpIHtcbiAgICAgIC8vIE9ubHkgZG8gc29tZXRoaW5nIGlmIHRoZXJlIGFyZSBldmVudCBoYW5kbGVycyB3aXRoIHRoaXMgbmFtZSBleGlzdGluZ1xuICAgICAgaWYoaGFuZGxlcnNbZXZlbnRdKSB7XG4gICAgICAgIC8vIElmIGhhbmRsZXIgaXMgc2V0IHdlIHdpbGwgbG9vayBmb3IgYSBzcGVjaWZpYyBoYW5kbGVyIGFuZCBvbmx5IHJlbW92ZSB0aGlzXG4gICAgICAgIGlmKGhhbmRsZXIpIHtcbiAgICAgICAgICBoYW5kbGVyc1tldmVudF0uc3BsaWNlKGhhbmRsZXJzW2V2ZW50XS5pbmRleE9mKGhhbmRsZXIpLCAxKTtcbiAgICAgICAgICBpZihoYW5kbGVyc1tldmVudF0ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBkZWxldGUgaGFuZGxlcnNbZXZlbnRdO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBJZiBubyBoYW5kbGVyIGlzIHNwZWNpZmllZCB3ZSByZW1vdmUgYWxsIGhhbmRsZXJzIGZvciB0aGlzIGV2ZW50XG4gICAgICAgICAgZGVsZXRlIGhhbmRsZXJzW2V2ZW50XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVzZSB0aGlzIGZ1bmN0aW9uIHRvIGVtaXQgYW4gZXZlbnQuIEFsbCBoYW5kbGVycyB0aGF0IGFyZSBsaXN0ZW5pbmcgZm9yIHRoaXMgZXZlbnQgd2lsbCBiZSB0cmlnZ2VyZWQgd2l0aCB0aGUgZGF0YSBwYXJhbWV0ZXIuXG4gICAgICpcbiAgICAgKiBAbWVtYmVyb2YgQ2hhcnRpc3QuRXZlbnRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnQgVGhlIGV2ZW50IG5hbWUgdGhhdCBzaG91bGQgYmUgdHJpZ2dlcmVkXG4gICAgICogQHBhcmFtIHsqfSBkYXRhIEFyYml0cmFyeSBkYXRhIHRoYXQgd2lsbCBiZSBwYXNzZWQgdG8gdGhlIGV2ZW50IGhhbmRsZXIgY2FsbGJhY2sgZnVuY3Rpb25zXG4gICAgICovXG4gICAgZnVuY3Rpb24gZW1pdChldmVudCwgZGF0YSkge1xuICAgICAgLy8gT25seSBkbyBzb21ldGhpbmcgaWYgdGhlcmUgYXJlIGV2ZW50IGhhbmRsZXJzIHdpdGggdGhpcyBuYW1lIGV4aXN0aW5nXG4gICAgICBpZihoYW5kbGVyc1tldmVudF0pIHtcbiAgICAgICAgaGFuZGxlcnNbZXZlbnRdLmZvckVhY2goZnVuY3Rpb24oaGFuZGxlcikge1xuICAgICAgICAgIGhhbmRsZXIoZGF0YSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAvLyBFbWl0IGV2ZW50IHRvIHN0YXIgZXZlbnQgaGFuZGxlcnNcbiAgICAgIGlmKGhhbmRsZXJzWycqJ10pIHtcbiAgICAgICAgaGFuZGxlcnNbJyonXS5mb3JFYWNoKGZ1bmN0aW9uKHN0YXJIYW5kbGVyKSB7XG4gICAgICAgICAgc3RhckhhbmRsZXIoZXZlbnQsIGRhdGEpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgYWRkRXZlbnRIYW5kbGVyOiBhZGRFdmVudEhhbmRsZXIsXG4gICAgICByZW1vdmVFdmVudEhhbmRsZXI6IHJlbW92ZUV2ZW50SGFuZGxlcixcbiAgICAgIGVtaXQ6IGVtaXRcbiAgICB9O1xuICB9O1xuXG59KHdpbmRvdywgZG9jdW1lbnQsIENoYXJ0aXN0KSk7XG47LyoqXG4gKiBUaGlzIG1vZHVsZSBwcm92aWRlcyBzb21lIGJhc2ljIHByb3RvdHlwZSBpbmhlcml0YW5jZSB1dGlsaXRpZXMuXG4gKlxuICogQG1vZHVsZSBDaGFydGlzdC5DbGFzc1xuICovXG4vKiBnbG9iYWwgQ2hhcnRpc3QgKi9cbihmdW5jdGlvbih3aW5kb3csIGRvY3VtZW50LCBDaGFydGlzdCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZnVuY3Rpb24gbGlzdFRvQXJyYXkobGlzdCkge1xuICAgIHZhciBhcnIgPSBbXTtcbiAgICBpZiAobGlzdC5sZW5ndGgpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICBhcnIucHVzaChsaXN0W2ldKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFycjtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXRob2QgdG8gZXh0ZW5kIGZyb20gY3VycmVudCBwcm90b3R5cGUuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBDaGFydGlzdC5DbGFzc1xuICAgKiBAcGFyYW0ge09iamVjdH0gcHJvcGVydGllcyBUaGUgb2JqZWN0IHRoYXQgc2VydmVzIGFzIGRlZmluaXRpb24gZm9yIHRoZSBwcm90b3R5cGUgdGhhdCBnZXRzIGNyZWF0ZWQgZm9yIHRoZSBuZXcgY2xhc3MuIFRoaXMgb2JqZWN0IHNob3VsZCBhbHdheXMgY29udGFpbiBhIGNvbnN0cnVjdG9yIHByb3BlcnR5IHRoYXQgaXMgdGhlIGRlc2lyZWQgY29uc3RydWN0b3IgZm9yIHRoZSBuZXdseSBjcmVhdGVkIGNsYXNzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW3N1cGVyUHJvdG9PdmVycmlkZV0gQnkgZGVmYXVsdCBleHRlbnMgd2lsbCB1c2UgdGhlIGN1cnJlbnQgY2xhc3MgcHJvdG90eXBlIG9yIENoYXJ0aXN0LmNsYXNzLiBXaXRoIHRoaXMgcGFyYW1ldGVyIHlvdSBjYW4gc3BlY2lmeSBhbnkgc3VwZXIgcHJvdG90eXBlIHRoYXQgd2lsbCBiZSB1c2VkLlxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gQ29uc3RydWN0b3IgZnVuY3Rpb24gb2YgdGhlIG5ldyBjbGFzc1xuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiB2YXIgRnJ1aXQgPSBDbGFzcy5leHRlbmQoe1xuICAgICAqIGNvbG9yOiB1bmRlZmluZWQsXG4gICAgICogICBzdWdhcjogdW5kZWZpbmVkLFxuICAgICAqXG4gICAgICogICBjb25zdHJ1Y3RvcjogZnVuY3Rpb24oY29sb3IsIHN1Z2FyKSB7XG4gICAgICogICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcbiAgICAgKiAgICAgdGhpcy5zdWdhciA9IHN1Z2FyO1xuICAgICAqICAgfSxcbiAgICAgKlxuICAgICAqICAgZWF0OiBmdW5jdGlvbigpIHtcbiAgICAgKiAgICAgdGhpcy5zdWdhciA9IDA7XG4gICAgICogICAgIHJldHVybiB0aGlzO1xuICAgICAqICAgfVxuICAgICAqIH0pO1xuICAgKlxuICAgKiB2YXIgQmFuYW5hID0gRnJ1aXQuZXh0ZW5kKHtcbiAgICAgKiAgIGxlbmd0aDogdW5kZWZpbmVkLFxuICAgICAqXG4gICAgICogICBjb25zdHJ1Y3RvcjogZnVuY3Rpb24obGVuZ3RoLCBzdWdhcikge1xuICAgICAqICAgICBCYW5hbmEuc3VwZXIuY29uc3RydWN0b3IuY2FsbCh0aGlzLCAnWWVsbG93Jywgc3VnYXIpO1xuICAgICAqICAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcbiAgICAgKiAgIH1cbiAgICAgKiB9KTtcbiAgICpcbiAgICogdmFyIGJhbmFuYSA9IG5ldyBCYW5hbmEoMjAsIDQwKTtcbiAgICogY29uc29sZS5sb2coJ2JhbmFuYSBpbnN0YW5jZW9mIEZydWl0JywgYmFuYW5hIGluc3RhbmNlb2YgRnJ1aXQpO1xuICAgKiBjb25zb2xlLmxvZygnRnJ1aXQgaXMgcHJvdG90eXBlIG9mIGJhbmFuYScsIEZydWl0LnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJhbmFuYSkpO1xuICAgKiBjb25zb2xlLmxvZygnYmFuYW5hcyBwcm90b3R5cGUgaXMgRnJ1aXQnLCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoYmFuYW5hKSA9PT0gRnJ1aXQucHJvdG90eXBlKTtcbiAgICogY29uc29sZS5sb2coYmFuYW5hLnN1Z2FyKTtcbiAgICogY29uc29sZS5sb2coYmFuYW5hLmVhdCgpLnN1Z2FyKTtcbiAgICogY29uc29sZS5sb2coYmFuYW5hLmNvbG9yKTtcbiAgICovXG4gIGZ1bmN0aW9uIGV4dGVuZChwcm9wZXJ0aWVzLCBzdXBlclByb3RvT3ZlcnJpZGUpIHtcbiAgICB2YXIgc3VwZXJQcm90byA9IHN1cGVyUHJvdG9PdmVycmlkZSB8fCB0aGlzLnByb3RvdHlwZSB8fCBDaGFydGlzdC5DbGFzcztcbiAgICB2YXIgcHJvdG8gPSBPYmplY3QuY3JlYXRlKHN1cGVyUHJvdG8pO1xuXG4gICAgQ2hhcnRpc3QuQ2xhc3MuY2xvbmVEZWZpbml0aW9ucyhwcm90bywgcHJvcGVydGllcyk7XG5cbiAgICB2YXIgY29uc3RyID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZm4gPSBwcm90by5jb25zdHJ1Y3RvciB8fCBmdW5jdGlvbiAoKSB7fSxcbiAgICAgICAgaW5zdGFuY2U7XG5cbiAgICAgIC8vIElmIHRoaXMgaXMgbGlua2VkIHRvIHRoZSBDaGFydGlzdCBuYW1lc3BhY2UgdGhlIGNvbnN0cnVjdG9yIHdhcyBub3QgY2FsbGVkIHdpdGggbmV3XG4gICAgICAvLyBUbyBwcm92aWRlIGEgZmFsbGJhY2sgd2Ugd2lsbCBpbnN0YW50aWF0ZSBoZXJlIGFuZCByZXR1cm4gdGhlIGluc3RhbmNlXG4gICAgICBpbnN0YW5jZSA9IHRoaXMgPT09IENoYXJ0aXN0ID8gT2JqZWN0LmNyZWF0ZShwcm90bykgOiB0aGlzO1xuICAgICAgZm4uYXBwbHkoaW5zdGFuY2UsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCkpO1xuXG4gICAgICAvLyBJZiB0aGlzIGNvbnN0cnVjdG9yIHdhcyBub3QgY2FsbGVkIHdpdGggbmV3IHdlIG5lZWQgdG8gcmV0dXJuIHRoZSBpbnN0YW5jZVxuICAgICAgLy8gVGhpcyB3aWxsIG5vdCBoYXJtIHdoZW4gdGhlIGNvbnN0cnVjdG9yIGhhcyBiZWVuIGNhbGxlZCB3aXRoIG5ldyBhcyB0aGUgcmV0dXJuZWQgdmFsdWUgaXMgaWdub3JlZFxuICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgIH07XG5cbiAgICBjb25zdHIucHJvdG90eXBlID0gcHJvdG87XG4gICAgY29uc3RyLnN1cGVyID0gc3VwZXJQcm90bztcbiAgICBjb25zdHIuZXh0ZW5kID0gdGhpcy5leHRlbmQ7XG5cbiAgICByZXR1cm4gY29uc3RyO1xuICB9XG5cbiAgLy8gVmFyaWFibGUgYXJndW1lbnQgbGlzdCBjbG9uZXMgYXJncyA+IDAgaW50byBhcmdzWzBdIGFuZCByZXRydW5zIG1vZGlmaWVkIGFyZ3NbMF1cbiAgZnVuY3Rpb24gY2xvbmVEZWZpbml0aW9ucygpIHtcbiAgICB2YXIgYXJncyA9IGxpc3RUb0FycmF5KGFyZ3VtZW50cyk7XG4gICAgdmFyIHRhcmdldCA9IGFyZ3NbMF07XG5cbiAgICBhcmdzLnNwbGljZSgxLCBhcmdzLmxlbmd0aCAtIDEpLmZvckVhY2goZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoc291cmNlKS5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wTmFtZSkge1xuICAgICAgICAvLyBJZiB0aGlzIHByb3BlcnR5IGFscmVhZHkgZXhpc3QgaW4gdGFyZ2V0IHdlIGRlbGV0ZSBpdCBmaXJzdFxuICAgICAgICBkZWxldGUgdGFyZ2V0W3Byb3BOYW1lXTtcbiAgICAgICAgLy8gRGVmaW5lIHRoZSBwcm9wZXJ0eSB3aXRoIHRoZSBkZXNjcmlwdG9yIGZyb20gc291cmNlXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHByb3BOYW1lLFxuICAgICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlLCBwcm9wTmFtZSkpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9XG5cbiAgQ2hhcnRpc3QuQ2xhc3MgPSB7XG4gICAgZXh0ZW5kOiBleHRlbmQsXG4gICAgY2xvbmVEZWZpbml0aW9uczogY2xvbmVEZWZpbml0aW9uc1xuICB9O1xuXG59KHdpbmRvdywgZG9jdW1lbnQsIENoYXJ0aXN0KSk7XG47LyoqXG4gKiBCYXNlIGZvciBhbGwgY2hhcnQgdHlwZXMuIFRoZSBtZXRob2RzIGluIENoYXJ0aXN0LkJhc2UgYXJlIGluaGVyaXRlZCB0byBhbGwgY2hhcnQgdHlwZXMuXG4gKlxuICogQG1vZHVsZSBDaGFydGlzdC5CYXNlXG4gKi9cbi8qIGdsb2JhbCBDaGFydGlzdCAqL1xuKGZ1bmN0aW9uKHdpbmRvdywgZG9jdW1lbnQsIENoYXJ0aXN0KSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvLyBUT0RPOiBDdXJyZW50bHkgd2UgbmVlZCB0byByZS1kcmF3IHRoZSBjaGFydCBvbiB3aW5kb3cgcmVzaXplLiBUaGlzIGlzIHVzdWFsbHkgdmVyeSBiYWQgYW5kIHdpbGwgYWZmZWN0IHBlcmZvcm1hbmNlLlxuICAvLyBUaGlzIGlzIGRvbmUgYmVjYXVzZSB3ZSBjYW4ndCB3b3JrIHdpdGggcmVsYXRpdmUgY29vcmRpbmF0ZXMgd2hlbiBkcmF3aW5nIHRoZSBjaGFydCBiZWNhdXNlIFNWRyBQYXRoIGRvZXMgbm90XG4gIC8vIHdvcmsgd2l0aCByZWxhdGl2ZSBwb3NpdGlvbnMgeWV0LiBXZSBuZWVkIHRvIGNoZWNrIGlmIHdlIGNhbiBkbyBhIHZpZXdCb3ggaGFjayB0byBzd2l0Y2ggdG8gcGVyY2VudGFnZS5cbiAgLy8gU2VlIGh0dHA6Ly9tb3ppbGxhLjY1MDYubjcubmFiYmxlLmNvbS9TcGVjeWZpbmctcGF0aHMtd2l0aC1wZXJjZW50YWdlcy11bml0LXRkMjQ3NDc0Lmh0bWxcbiAgLy8gVXBkYXRlOiBjYW4gYmUgZG9uZSB1c2luZyB0aGUgYWJvdmUgbWV0aG9kIHRlc3RlZCBoZXJlOiBodHRwOi8vY29kZXBlbi5pby9naW9ua3Vuei9wZW4vS0R2TGpcbiAgLy8gVGhlIHByb2JsZW0gaXMgd2l0aCB0aGUgbGFiZWwgb2Zmc2V0cyB0aGF0IGNhbid0IGJlIGNvbnZlcnRlZCBpbnRvIHBlcmNlbnRhZ2UgYW5kIGFmZmVjdGluZyB0aGUgY2hhcnQgY29udGFpbmVyXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBjaGFydCB3aGljaCBjdXJyZW50bHkgZG9lcyBhIGZ1bGwgcmVjb25zdHJ1Y3Rpb24gb2YgdGhlIFNWRyBET01cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IFtkYXRhXSBPcHRpb25hbCBkYXRhIHlvdSdkIGxpa2UgdG8gc2V0IGZvciB0aGUgY2hhcnQgYmVmb3JlIGl0IHdpbGwgdXBkYXRlLiBJZiBub3Qgc3BlY2lmaWVkIHRoZSB1cGRhdGUgbWV0aG9kIHdpbGwgdXNlIHRoZSBkYXRhIHRoYXQgaXMgYWxyZWFkeSBjb25maWd1cmVkIHdpdGggdGhlIGNoYXJ0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIE9wdGlvbmFsIG9wdGlvbnMgeW91J2QgbGlrZSB0byBhZGQgdG8gdGhlIHByZXZpb3VzIG9wdGlvbnMgZm9yIHRoZSBjaGFydCBiZWZvcmUgaXQgd2lsbCB1cGRhdGUuIElmIG5vdCBzcGVjaWZpZWQgdGhlIHVwZGF0ZSBtZXRob2Qgd2lsbCB1c2UgdGhlIG9wdGlvbnMgdGhhdCBoYXZlIGJlZW4gYWxyZWFkeSBjb25maWd1cmVkIHdpdGggdGhlIGNoYXJ0LlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvdmVycmlkZV0gSWYgc2V0IHRvIHRydWUsIHRoZSBwYXNzZWQgb3B0aW9ucyB3aWxsIGJlIHVzZWQgdG8gZXh0ZW5kIHRoZSBvcHRpb25zIHRoYXQgaGF2ZSBiZWVuIGNvbmZpZ3VyZWQgYWxyZWFkeS4gT3RoZXJ3aXNlIHRoZSBjaGFydCBkZWZhdWx0IG9wdGlvbnMgd2lsbCBiZSB1c2VkIGFzIHRoZSBiYXNlXG4gICAqIEBtZW1iZXJvZiBDaGFydGlzdC5CYXNlXG4gICAqL1xuICBmdW5jdGlvbiB1cGRhdGUoZGF0YSwgb3B0aW9ucywgb3ZlcnJpZGUpIHtcbiAgICBpZihkYXRhKSB7XG4gICAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgICAgLy8gRXZlbnQgZm9yIGRhdGEgdHJhbnNmb3JtYXRpb24gdGhhdCBhbGxvd3MgdG8gbWFuaXB1bGF0ZSB0aGUgZGF0YSBiZWZvcmUgaXQgZ2V0cyByZW5kZXJlZCBpbiB0aGUgY2hhcnRzXG4gICAgICB0aGlzLmV2ZW50RW1pdHRlci5lbWl0KCdkYXRhJywge1xuICAgICAgICB0eXBlOiAndXBkYXRlJyxcbiAgICAgICAgZGF0YTogdGhpcy5kYXRhXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZihvcHRpb25zKSB7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBDaGFydGlzdC5leHRlbmQoe30sIG92ZXJyaWRlID8gdGhpcy5vcHRpb25zIDogdGhpcy5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICAgIC8vIElmIGNoYXJ0aXN0IHdhcyBub3QgaW5pdGlhbGl6ZWQgeWV0LCB3ZSBqdXN0IHNldCB0aGUgb3B0aW9ucyBhbmQgbGVhdmUgdGhlIHJlc3QgdG8gdGhlIGluaXRpYWxpemF0aW9uXG4gICAgICAvLyBPdGhlcndpc2Ugd2UgcmUtY3JlYXRlIHRoZSBvcHRpb25zUHJvdmlkZXIgYXQgdGhpcyBwb2ludFxuICAgICAgaWYoIXRoaXMuaW5pdGlhbGl6ZVRpbWVvdXRJZCkge1xuICAgICAgICB0aGlzLm9wdGlvbnNQcm92aWRlci5yZW1vdmVNZWRpYVF1ZXJ5TGlzdGVuZXJzKCk7XG4gICAgICAgIHRoaXMub3B0aW9uc1Byb3ZpZGVyID0gQ2hhcnRpc3Qub3B0aW9uc1Byb3ZpZGVyKHRoaXMub3B0aW9ucywgdGhpcy5yZXNwb25zaXZlT3B0aW9ucywgdGhpcy5ldmVudEVtaXR0ZXIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIE9ubHkgcmUtY3JlYXRlZCB0aGUgY2hhcnQgaWYgaXQgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgeWV0XG4gICAgaWYoIXRoaXMuaW5pdGlhbGl6ZVRpbWVvdXRJZCkge1xuICAgICAgdGhpcy5jcmVhdGVDaGFydCh0aGlzLm9wdGlvbnNQcm92aWRlci5nZXRDdXJyZW50T3B0aW9ucygpKTtcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYSByZWZlcmVuY2UgdG8gdGhlIGNoYXJ0IG9iamVjdCB0byBjaGFpbiB1cCBjYWxsc1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGNhbiBiZSBjYWxsZWQgb24gdGhlIEFQSSBvYmplY3Qgb2YgZWFjaCBjaGFydCBhbmQgd2lsbCB1bi1yZWdpc3RlciBhbGwgZXZlbnQgbGlzdGVuZXJzIHRoYXQgd2VyZSBhZGRlZCB0byBvdGhlciBjb21wb25lbnRzLiBUaGlzIGN1cnJlbnRseSBpbmNsdWRlcyBhIHdpbmRvdy5yZXNpemUgbGlzdGVuZXIgYXMgd2VsbCBhcyBtZWRpYSBxdWVyeSBsaXN0ZW5lcnMgaWYgYW55IHJlc3BvbnNpdmUgb3B0aW9ucyBoYXZlIGJlZW4gcHJvdmlkZWQuIFVzZSB0aGlzIGZ1bmN0aW9uIGlmIHlvdSBuZWVkIHRvIGRlc3Ryb3kgYW5kIHJlY3JlYXRlIENoYXJ0aXN0IGNoYXJ0cyBkeW5hbWljYWxseS5cbiAgICpcbiAgICogQG1lbWJlcm9mIENoYXJ0aXN0LkJhc2VcbiAgICovXG4gIGZ1bmN0aW9uIGRldGFjaCgpIHtcbiAgICAvLyBPbmx5IGRldGFjaCBpZiBpbml0aWFsaXphdGlvbiBhbHJlYWR5IG9jY3VycmVkIG9uIHRoaXMgY2hhcnQuIElmIHRoaXMgY2hhcnQgc3RpbGwgaGFzbid0IGluaXRpYWxpemVkICh0aGVyZWZvcmVcbiAgICAvLyB0aGUgaW5pdGlhbGl6YXRpb25UaW1lb3V0SWQgaXMgc3RpbGwgYSB2YWxpZCB0aW1lb3V0IHJlZmVyZW5jZSwgd2Ugd2lsbCBjbGVhciB0aGUgdGltZW91dFxuICAgIGlmKCF0aGlzLmluaXRpYWxpemVUaW1lb3V0SWQpIHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLnJlc2l6ZUxpc3RlbmVyKTtcbiAgICAgIHRoaXMub3B0aW9uc1Byb3ZpZGVyLnJlbW92ZU1lZGlhUXVlcnlMaXN0ZW5lcnMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aGlzLmluaXRpYWxpemVUaW1lb3V0SWQpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZSB0aGlzIGZ1bmN0aW9uIHRvIHJlZ2lzdGVyIGV2ZW50IGhhbmRsZXJzLiBUaGUgaGFuZGxlciBjYWxsYmFja3MgYXJlIHN5bmNocm9ub3VzIGFuZCB3aWxsIHJ1biBpbiB0aGUgbWFpbiB0aHJlYWQgcmF0aGVyIHRoYW4gdGhlIGV2ZW50IGxvb3AuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBDaGFydGlzdC5CYXNlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudCBOYW1lIG9mIHRoZSBldmVudC4gQ2hlY2sgdGhlIGV4YW1wbGVzIGZvciBzdXBwb3J0ZWQgZXZlbnRzLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBoYW5kbGVyIFRoZSBoYW5kbGVyIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBjYWxsZWQgd2hlbiBhbiBldmVudCB3aXRoIHRoZSBnaXZlbiBuYW1lIHdhcyBlbWl0dGVkLiBUaGlzIGZ1bmN0aW9uIHdpbGwgcmVjZWl2ZSBhIGRhdGEgYXJndW1lbnQgd2hpY2ggY29udGFpbnMgZXZlbnQgZGF0YS4gU2VlIHRoZSBleGFtcGxlIGZvciBtb3JlIGRldGFpbHMuXG4gICAqL1xuICBmdW5jdGlvbiBvbihldmVudCwgaGFuZGxlcikge1xuICAgIHRoaXMuZXZlbnRFbWl0dGVyLmFkZEV2ZW50SGFuZGxlcihldmVudCwgaGFuZGxlcik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogVXNlIHRoaXMgZnVuY3Rpb24gdG8gdW4tcmVnaXN0ZXIgZXZlbnQgaGFuZGxlcnMuIElmIHRoZSBoYW5kbGVyIGZ1bmN0aW9uIHBhcmFtZXRlciBpcyBvbWl0dGVkIGFsbCBoYW5kbGVycyBmb3IgdGhlIGdpdmVuIGV2ZW50IHdpbGwgYmUgdW4tcmVnaXN0ZXJlZC5cbiAgICpcbiAgICogQG1lbWJlcm9mIENoYXJ0aXN0LkJhc2VcbiAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50IE5hbWUgb2YgdGhlIGV2ZW50IGZvciB3aGljaCBhIGhhbmRsZXIgc2hvdWxkIGJlIHJlbW92ZWRcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2hhbmRsZXJdIFRoZSBoYW5kbGVyIGZ1bmN0aW9uIHRoYXQgdGhhdCB3YXMgcHJldmlvdXNseSB1c2VkIHRvIHJlZ2lzdGVyIGEgbmV3IGV2ZW50IGhhbmRsZXIuIFRoaXMgaGFuZGxlciB3aWxsIGJlIHJlbW92ZWQgZnJvbSB0aGUgZXZlbnQgaGFuZGxlciBsaXN0LiBJZiB0aGlzIHBhcmFtZXRlciBpcyBvbWl0dGVkIHRoZW4gYWxsIGV2ZW50IGhhbmRsZXJzIGZvciB0aGUgZ2l2ZW4gZXZlbnQgYXJlIHJlbW92ZWQgZnJvbSB0aGUgbGlzdC5cbiAgICovXG4gIGZ1bmN0aW9uIG9mZihldmVudCwgaGFuZGxlcikge1xuICAgIHRoaXMuZXZlbnRFbWl0dGVyLnJlbW92ZUV2ZW50SGFuZGxlcihldmVudCwgaGFuZGxlcik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBmdW5jdGlvbiBpbml0aWFsaXplKCkge1xuICAgIC8vIEFkZCB3aW5kb3cgcmVzaXplIGxpc3RlbmVyIHRoYXQgcmUtY3JlYXRlcyB0aGUgY2hhcnRcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5yZXNpemVMaXN0ZW5lcik7XG5cbiAgICAvLyBPYnRhaW4gY3VycmVudCBvcHRpb25zIGJhc2VkIG9uIG1hdGNoaW5nIG1lZGlhIHF1ZXJpZXMgKGlmIHJlc3BvbnNpdmUgb3B0aW9ucyBhcmUgZ2l2ZW4pXG4gICAgLy8gVGhpcyB3aWxsIGFsc28gcmVnaXN0ZXIgYSBsaXN0ZW5lciB0aGF0IGlzIHJlLWNyZWF0aW5nIHRoZSBjaGFydCBiYXNlZCBvbiBtZWRpYSBjaGFuZ2VzXG4gICAgdGhpcy5vcHRpb25zUHJvdmlkZXIgPSBDaGFydGlzdC5vcHRpb25zUHJvdmlkZXIodGhpcy5vcHRpb25zLCB0aGlzLnJlc3BvbnNpdmVPcHRpb25zLCB0aGlzLmV2ZW50RW1pdHRlcik7XG4gICAgLy8gUmVnaXN0ZXIgb3B0aW9ucyBjaGFuZ2UgbGlzdGVuZXIgdGhhdCB3aWxsIHRyaWdnZXIgYSBjaGFydCB1cGRhdGVcbiAgICB0aGlzLmV2ZW50RW1pdHRlci5hZGRFdmVudEhhbmRsZXIoJ29wdGlvbnNDaGFuZ2VkJywgZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAvLyBCZWZvcmUgdGhlIGZpcnN0IGNoYXJ0IGNyZWF0aW9uIHdlIG5lZWQgdG8gcmVnaXN0ZXIgdXMgd2l0aCBhbGwgcGx1Z2lucyB0aGF0IGFyZSBjb25maWd1cmVkXG4gICAgLy8gSW5pdGlhbGl6ZSBhbGwgcmVsZXZhbnQgcGx1Z2lucyB3aXRoIG91ciBjaGFydCBvYmplY3QgYW5kIHRoZSBwbHVnaW4gb3B0aW9ucyBzcGVjaWZpZWQgaW4gdGhlIGNvbmZpZ1xuICAgIGlmKHRoaXMub3B0aW9ucy5wbHVnaW5zKSB7XG4gICAgICB0aGlzLm9wdGlvbnMucGx1Z2lucy5mb3JFYWNoKGZ1bmN0aW9uKHBsdWdpbikge1xuICAgICAgICBpZihwbHVnaW4gaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgIHBsdWdpblswXSh0aGlzLCBwbHVnaW5bMV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBsdWdpbih0aGlzKTtcbiAgICAgICAgfVxuICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICAvLyBFdmVudCBmb3IgZGF0YSB0cmFuc2Zvcm1hdGlvbiB0aGF0IGFsbG93cyB0byBtYW5pcHVsYXRlIHRoZSBkYXRhIGJlZm9yZSBpdCBnZXRzIHJlbmRlcmVkIGluIHRoZSBjaGFydHNcbiAgICB0aGlzLmV2ZW50RW1pdHRlci5lbWl0KCdkYXRhJywge1xuICAgICAgdHlwZTogJ2luaXRpYWwnLFxuICAgICAgZGF0YTogdGhpcy5kYXRhXG4gICAgfSk7XG5cbiAgICAvLyBDcmVhdGUgdGhlIGZpcnN0IGNoYXJ0XG4gICAgdGhpcy5jcmVhdGVDaGFydCh0aGlzLm9wdGlvbnNQcm92aWRlci5nZXRDdXJyZW50T3B0aW9ucygpKTtcblxuICAgIC8vIEFzIGNoYXJ0IGlzIGluaXRpYWxpemVkIGZyb20gdGhlIGV2ZW50IGxvb3Agbm93IHdlIGNhbiByZXNldCBvdXIgdGltZW91dCByZWZlcmVuY2VcbiAgICAvLyBUaGlzIGlzIGltcG9ydGFudCBpZiB0aGUgY2hhcnQgZ2V0cyBpbml0aWFsaXplZCBvbiB0aGUgc2FtZSBlbGVtZW50IHR3aWNlXG4gICAgdGhpcy5pbml0aWFsaXplVGltZW91dElkID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIG9mIGNoYXJ0IGJhc2UgY2xhc3MuXG4gICAqXG4gICAqIEBwYXJhbSBxdWVyeVxuICAgKiBAcGFyYW0gZGF0YVxuICAgKiBAcGFyYW0gZGVmYXVsdE9wdGlvbnNcbiAgICogQHBhcmFtIG9wdGlvbnNcbiAgICogQHBhcmFtIHJlc3BvbnNpdmVPcHRpb25zXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKi9cbiAgZnVuY3Rpb24gQmFzZShxdWVyeSwgZGF0YSwgZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMsIHJlc3BvbnNpdmVPcHRpb25zKSB7XG4gICAgdGhpcy5jb250YWluZXIgPSBDaGFydGlzdC5xdWVyeVNlbGVjdG9yKHF1ZXJ5KTtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMuZGVmYXVsdE9wdGlvbnMgPSBkZWZhdWx0T3B0aW9ucztcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMucmVzcG9uc2l2ZU9wdGlvbnMgPSByZXNwb25zaXZlT3B0aW9ucztcbiAgICB0aGlzLmV2ZW50RW1pdHRlciA9IENoYXJ0aXN0LkV2ZW50RW1pdHRlcigpO1xuICAgIHRoaXMuc3VwcG9ydHNGb3JlaWduT2JqZWN0ID0gQ2hhcnRpc3QuU3ZnLmlzU3VwcG9ydGVkKCdFeHRlbnNpYmlsaXR5Jyk7XG4gICAgdGhpcy5zdXBwb3J0c0FuaW1hdGlvbnMgPSBDaGFydGlzdC5TdmcuaXNTdXBwb3J0ZWQoJ0FuaW1hdGlvbkV2ZW50c0F0dHJpYnV0ZScpO1xuICAgIHRoaXMucmVzaXplTGlzdGVuZXIgPSBmdW5jdGlvbiByZXNpemVMaXN0ZW5lcigpe1xuICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICB9LmJpbmQodGhpcyk7XG5cbiAgICBpZih0aGlzLmNvbnRhaW5lcikge1xuICAgICAgLy8gSWYgY2hhcnRpc3Qgd2FzIGFscmVhZHkgaW5pdGlhbGl6ZWQgaW4gdGhpcyBjb250YWluZXIgd2UgYXJlIGRldGFjaGluZyBhbGwgZXZlbnQgbGlzdGVuZXJzIGZpcnN0XG4gICAgICBpZih0aGlzLmNvbnRhaW5lci5fX2NoYXJ0aXN0X18pIHtcbiAgICAgICAgdGhpcy5jb250YWluZXIuX19jaGFydGlzdF9fLmRldGFjaCgpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNvbnRhaW5lci5fX2NoYXJ0aXN0X18gPSB0aGlzO1xuICAgIH1cblxuICAgIC8vIFVzaW5nIGV2ZW50IGxvb3AgZm9yIGZpcnN0IGRyYXcgdG8gbWFrZSBpdCBwb3NzaWJsZSB0byByZWdpc3RlciBldmVudCBsaXN0ZW5lcnMgaW4gdGhlIHNhbWUgY2FsbCBzdGFjayB3aGVyZVxuICAgIC8vIHRoZSBjaGFydCB3YXMgY3JlYXRlZC5cbiAgICB0aGlzLmluaXRpYWxpemVUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KGluaXRpYWxpemUuYmluZCh0aGlzKSwgMCk7XG4gIH1cblxuICAvLyBDcmVhdGluZyB0aGUgY2hhcnQgYmFzZSBjbGFzc1xuICBDaGFydGlzdC5CYXNlID0gQ2hhcnRpc3QuQ2xhc3MuZXh0ZW5kKHtcbiAgICBjb25zdHJ1Y3RvcjogQmFzZSxcbiAgICBvcHRpb25zUHJvdmlkZXI6IHVuZGVmaW5lZCxcbiAgICBjb250YWluZXI6IHVuZGVmaW5lZCxcbiAgICBzdmc6IHVuZGVmaW5lZCxcbiAgICBldmVudEVtaXR0ZXI6IHVuZGVmaW5lZCxcbiAgICBjcmVhdGVDaGFydDogZnVuY3Rpb24oKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Jhc2UgY2hhcnQgdHlwZSBjYW5cXCd0IGJlIGluc3RhbnRpYXRlZCEnKTtcbiAgICB9LFxuICAgIHVwZGF0ZTogdXBkYXRlLFxuICAgIGRldGFjaDogZGV0YWNoLFxuICAgIG9uOiBvbixcbiAgICBvZmY6IG9mZixcbiAgICB2ZXJzaW9uOiBDaGFydGlzdC52ZXJzaW9uLFxuICAgIHN1cHBvcnRzRm9yZWlnbk9iamVjdDogZmFsc2VcbiAgfSk7XG5cbn0od2luZG93LCBkb2N1bWVudCwgQ2hhcnRpc3QpKTtcbjsvKipcbiAqIENoYXJ0aXN0IFNWRyBtb2R1bGUgZm9yIHNpbXBsZSBTVkcgRE9NIGFic3RyYWN0aW9uXG4gKlxuICogQG1vZHVsZSBDaGFydGlzdC5TdmdcbiAqL1xuLyogZ2xvYmFsIENoYXJ0aXN0ICovXG4oZnVuY3Rpb24od2luZG93LCBkb2N1bWVudCwgQ2hhcnRpc3QpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8qKlxuICAgKiBDaGFydGlzdC5TdmcgY3JlYXRlcyBhIG5ldyBTVkcgb2JqZWN0IHdyYXBwZXIgd2l0aCBhIHN0YXJ0aW5nIGVsZW1lbnQuIFlvdSBjYW4gdXNlIHRoZSB3cmFwcGVyIHRvIGZsdWVudGx5IGNyZWF0ZSBzdWItZWxlbWVudHMgYW5kIG1vZGlmeSB0aGVtLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgQ2hhcnRpc3QuU3ZnXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge1N0cmluZ3xFbGVtZW50fSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBTVkcgZWxlbWVudCB0byBjcmVhdGUgb3IgYW4gU1ZHIGRvbSBlbGVtZW50IHdoaWNoIHNob3VsZCBiZSB3cmFwcGVkIGludG8gQ2hhcnRpc3QuU3ZnXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhdHRyaWJ1dGVzIEFuIG9iamVjdCB3aXRoIHByb3BlcnRpZXMgdGhhdCB3aWxsIGJlIGFkZGVkIGFzIGF0dHJpYnV0ZXMgdG8gdGhlIFNWRyBlbGVtZW50IHRoYXQgaXMgY3JlYXRlZC4gQXR0cmlidXRlcyB3aXRoIHVuZGVmaW5lZCB2YWx1ZXMgd2lsbCBub3QgYmUgYWRkZWQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjbGFzc05hbWUgVGhpcyBjbGFzcyBvciBjbGFzcyBsaXN0IHdpbGwgYmUgYWRkZWQgdG8gdGhlIFNWRyBlbGVtZW50XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJlbnQgVGhlIHBhcmVudCBTVkcgd3JhcHBlciBvYmplY3Qgd2hlcmUgdGhpcyBuZXdseSBjcmVhdGVkIHdyYXBwZXIgYW5kIGl0J3MgZWxlbWVudCB3aWxsIGJlIGF0dGFjaGVkIHRvIGFzIGNoaWxkXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gaW5zZXJ0Rmlyc3QgSWYgdGhpcyBwYXJhbSBpcyBzZXQgdG8gdHJ1ZSBpbiBjb25qdW5jdGlvbiB3aXRoIGEgcGFyZW50IGVsZW1lbnQgdGhlIG5ld2x5IGNyZWF0ZWQgZWxlbWVudCB3aWxsIGJlIGFkZGVkIGFzIGZpcnN0IGNoaWxkIGVsZW1lbnQgaW4gdGhlIHBhcmVudCBlbGVtZW50XG4gICAqL1xuICBmdW5jdGlvbiBTdmcobmFtZSwgYXR0cmlidXRlcywgY2xhc3NOYW1lLCBwYXJlbnQsIGluc2VydEZpcnN0KSB7XG4gICAgLy8gSWYgU3ZnIGlzIGdldHRpbmcgY2FsbGVkIHdpdGggYW4gU1ZHIGVsZW1lbnQgd2UganVzdCByZXR1cm4gdGhlIHdyYXBwZXJcbiAgICBpZihuYW1lIGluc3RhbmNlb2YgRWxlbWVudCkge1xuICAgICAgdGhpcy5fbm9kZSA9IG5hbWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX25vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoQ2hhcnRpc3QubmFtZXNwYWNlcy5zdmcsIG5hbWUpO1xuXG4gICAgICAvLyBJZiB0aGlzIGlzIGFuIFNWRyBlbGVtZW50IGNyZWF0ZWQgdGhlbiBjdXN0b20gbmFtZXNwYWNlXG4gICAgICBpZihuYW1lID09PSAnc3ZnJykge1xuICAgICAgICB0aGlzLmF0dHIoe1xuICAgICAgICAgICd4bWxuczpjdCc6IENoYXJ0aXN0Lm5hbWVzcGFjZXMuY3RcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYoYXR0cmlidXRlcykge1xuICAgICAgdGhpcy5hdHRyKGF0dHJpYnV0ZXMpO1xuICAgIH1cblxuICAgIGlmKGNsYXNzTmFtZSkge1xuICAgICAgdGhpcy5hZGRDbGFzcyhjbGFzc05hbWUpO1xuICAgIH1cblxuICAgIGlmKHBhcmVudCkge1xuICAgICAgaWYgKGluc2VydEZpcnN0ICYmIHBhcmVudC5fbm9kZS5maXJzdENoaWxkKSB7XG4gICAgICAgIHBhcmVudC5fbm9kZS5pbnNlcnRCZWZvcmUodGhpcy5fbm9kZSwgcGFyZW50Ll9ub2RlLmZpcnN0Q2hpbGQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFyZW50Ll9ub2RlLmFwcGVuZENoaWxkKHRoaXMuX25vZGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgYXR0cmlidXRlcyBvbiB0aGUgY3VycmVudCBTVkcgZWxlbWVudCBvZiB0aGUgd3JhcHBlciB5b3UncmUgY3VycmVudGx5IHdvcmtpbmcgb24uXG4gICAqXG4gICAqIEBtZW1iZXJvZiBDaGFydGlzdC5TdmdcbiAgICogQHBhcmFtIHtPYmplY3R8U3RyaW5nfSBhdHRyaWJ1dGVzIEFuIG9iamVjdCB3aXRoIHByb3BlcnRpZXMgdGhhdCB3aWxsIGJlIGFkZGVkIGFzIGF0dHJpYnV0ZXMgdG8gdGhlIFNWRyBlbGVtZW50IHRoYXQgaXMgY3JlYXRlZC4gQXR0cmlidXRlcyB3aXRoIHVuZGVmaW5lZCB2YWx1ZXMgd2lsbCBub3QgYmUgYWRkZWQuIElmIHRoaXMgcGFyYW1ldGVyIGlzIGEgU3RyaW5nIHRoZW4gdGhlIGZ1bmN0aW9uIGlzIHVzZWQgYXMgYSBnZXR0ZXIgYW5kIHdpbGwgcmV0dXJuIHRoZSBhdHRyaWJ1dGUgdmFsdWUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBucyBJZiBzcGVjaWZpZWQsIHRoZSBhdHRyaWJ1dGUgd2lsbCBiZSBvYnRhaW5lZCB1c2luZyBnZXRBdHRyaWJ1dGVOcy4gSW4gb3JkZXIgdG8gd3JpdGUgbmFtZXBzYWNlZCBhdHRyaWJ1dGVzIHlvdSBjYW4gdXNlIHRoZSBuYW1lc3BhY2U6YXR0cmlidXRlIG5vdGF0aW9uIHdpdGhpbiB0aGUgYXR0cmlidXRlcyBvYmplY3QuXG4gICAqIEByZXR1cm4ge09iamVjdHxTdHJpbmd9IFRoZSBjdXJyZW50IHdyYXBwZXIgb2JqZWN0IHdpbGwgYmUgcmV0dXJuZWQgc28gaXQgY2FuIGJlIHVzZWQgZm9yIGNoYWluaW5nIG9yIHRoZSBhdHRyaWJ1dGUgdmFsdWUgaWYgdXNlZCBhcyBnZXR0ZXIgZnVuY3Rpb24uXG4gICAqL1xuICBmdW5jdGlvbiBhdHRyKGF0dHJpYnV0ZXMsIG5zKSB7XG4gICAgaWYodHlwZW9mIGF0dHJpYnV0ZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZihucykge1xuICAgICAgICByZXR1cm4gdGhpcy5fbm9kZS5nZXRBdHRyaWJ1dGVOUyhucywgYXR0cmlidXRlcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5fbm9kZS5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlcyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgT2JqZWN0LmtleXMoYXR0cmlidXRlcykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgIC8vIElmIHRoZSBhdHRyaWJ1dGUgdmFsdWUgaXMgdW5kZWZpbmVkIHdlIGNhbiBza2lwIHRoaXMgb25lXG4gICAgICBpZihhdHRyaWJ1dGVzW2tleV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChrZXkuaW5kZXhPZignOicpICE9PSAtMSkge1xuICAgICAgICB2YXIgbmFtZXNwYWNlZEF0dHJpYnV0ZSA9IGtleS5zcGxpdCgnOicpO1xuICAgICAgICB0aGlzLl9ub2RlLnNldEF0dHJpYnV0ZU5TKENoYXJ0aXN0Lm5hbWVzcGFjZXNbbmFtZXNwYWNlZEF0dHJpYnV0ZVswXV0sIGtleSwgYXR0cmlidXRlc1trZXldKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX25vZGUuc2V0QXR0cmlidXRlKGtleSwgYXR0cmlidXRlc1trZXldKTtcbiAgICAgIH1cbiAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IFNWRyBlbGVtZW50IHdob3NlIHdyYXBwZXIgb2JqZWN0IHdpbGwgYmUgc2VsZWN0ZWQgZm9yIGZ1cnRoZXIgb3BlcmF0aW9ucy4gVGhpcyB3YXkgeW91IGNhbiBhbHNvIGNyZWF0ZSBuZXN0ZWQgZ3JvdXBzIGVhc2lseS5cbiAgICpcbiAgICogQG1lbWJlcm9mIENoYXJ0aXN0LlN2Z1xuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgU1ZHIGVsZW1lbnQgdGhhdCBzaG91bGQgYmUgY3JlYXRlZCBhcyBjaGlsZCBlbGVtZW50IG9mIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgZWxlbWVudCB3cmFwcGVyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbYXR0cmlidXRlc10gQW4gb2JqZWN0IHdpdGggcHJvcGVydGllcyB0aGF0IHdpbGwgYmUgYWRkZWQgYXMgYXR0cmlidXRlcyB0byB0aGUgU1ZHIGVsZW1lbnQgdGhhdCBpcyBjcmVhdGVkLiBBdHRyaWJ1dGVzIHdpdGggdW5kZWZpbmVkIHZhbHVlcyB3aWxsIG5vdCBiZSBhZGRlZC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtjbGFzc05hbWVdIFRoaXMgY2xhc3Mgb3IgY2xhc3MgbGlzdCB3aWxsIGJlIGFkZGVkIHRvIHRoZSBTVkcgZWxlbWVudFxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtpbnNlcnRGaXJzdF0gSWYgdGhpcyBwYXJhbSBpcyBzZXQgdG8gdHJ1ZSBpbiBjb25qdW5jdGlvbiB3aXRoIGEgcGFyZW50IGVsZW1lbnQgdGhlIG5ld2x5IGNyZWF0ZWQgZWxlbWVudCB3aWxsIGJlIGFkZGVkIGFzIGZpcnN0IGNoaWxkIGVsZW1lbnQgaW4gdGhlIHBhcmVudCBlbGVtZW50XG4gICAqIEByZXR1cm4ge0NoYXJ0aXN0LlN2Z30gUmV0dXJucyBhIENoYXJ0aXN0LlN2ZyB3cmFwcGVyIG9iamVjdCB0aGF0IGNhbiBiZSB1c2VkIHRvIG1vZGlmeSB0aGUgY29udGFpbmluZyBTVkcgZGF0YVxuICAgKi9cbiAgZnVuY3Rpb24gZWxlbShuYW1lLCBhdHRyaWJ1dGVzLCBjbGFzc05hbWUsIGluc2VydEZpcnN0KSB7XG4gICAgcmV0dXJuIG5ldyBDaGFydGlzdC5TdmcobmFtZSwgYXR0cmlidXRlcywgY2xhc3NOYW1lLCB0aGlzLCBpbnNlcnRGaXJzdCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgcGFyZW50IENoYXJ0aXN0LlNWRyB3cmFwcGVyIG9iamVjdFxuICAgKlxuICAgKiBAbWVtYmVyb2YgQ2hhcnRpc3QuU3ZnXG4gICAqIEByZXR1cm4ge0NoYXJ0aXN0LlN2Z30gUmV0dXJucyBhIENoYXJ0aXN0LlN2ZyB3cmFwcGVyIGFyb3VuZCB0aGUgcGFyZW50IG5vZGUgb2YgdGhlIGN1cnJlbnQgbm9kZS4gSWYgdGhlIHBhcmVudCBub2RlIGlzIG5vdCBleGlzdGluZyBvciBpdCdzIG5vdCBhbiBTVkcgbm9kZSB0aGVuIHRoaXMgZnVuY3Rpb24gd2lsbCByZXR1cm4gbnVsbC5cbiAgICovXG4gIGZ1bmN0aW9uIHBhcmVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbm9kZS5wYXJlbnROb2RlIGluc3RhbmNlb2YgU1ZHRWxlbWVudCA/IG5ldyBDaGFydGlzdC5TdmcodGhpcy5fbm9kZS5wYXJlbnROb2RlKSA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgcmV0dXJucyBhIENoYXJ0aXN0LlN2ZyB3cmFwcGVyIGFyb3VuZCB0aGUgcm9vdCBTVkcgZWxlbWVudCBvZiB0aGUgY3VycmVudCB0cmVlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgQ2hhcnRpc3QuU3ZnXG4gICAqIEByZXR1cm4ge0NoYXJ0aXN0LlN2Z30gVGhlIHJvb3QgU1ZHIGVsZW1lbnQgd3JhcHBlZCBpbiBhIENoYXJ0aXN0LlN2ZyBlbGVtZW50XG4gICAqL1xuICBmdW5jdGlvbiByb290KCkge1xuICAgIHZhciBub2RlID0gdGhpcy5fbm9kZTtcbiAgICB3aGlsZShub2RlLm5vZGVOYW1lICE9PSAnc3ZnJykge1xuICAgICAgbm9kZSA9IG5vZGUucGFyZW50Tm9kZTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBDaGFydGlzdC5Tdmcobm9kZSk7XG4gIH1cblxuICAvKipcbiAgICogRmluZCB0aGUgZmlyc3QgY2hpbGQgU1ZHIGVsZW1lbnQgb2YgdGhlIGN1cnJlbnQgZWxlbWVudCB0aGF0IG1hdGNoZXMgYSBDU1Mgc2VsZWN0b3IuIFRoZSByZXR1cm5lZCBvYmplY3QgaXMgYSBDaGFydGlzdC5Tdmcgd3JhcHBlci5cbiAgICpcbiAgICogQG1lbWJlcm9mIENoYXJ0aXN0LlN2Z1xuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3IgQSBDU1Mgc2VsZWN0b3IgdGhhdCBpcyB1c2VkIHRvIHF1ZXJ5IGZvciBjaGlsZCBTVkcgZWxlbWVudHNcbiAgICogQHJldHVybiB7Q2hhcnRpc3QuU3ZnfSBUaGUgU1ZHIHdyYXBwZXIgZm9yIHRoZSBlbGVtZW50IGZvdW5kIG9yIG51bGwgaWYgbm8gZWxlbWVudCB3YXMgZm91bmRcbiAgICovXG4gIGZ1bmN0aW9uIHF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpIHtcbiAgICB2YXIgZm91bmROb2RlID0gdGhpcy5fbm9kZS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICByZXR1cm4gZm91bmROb2RlID8gbmV3IENoYXJ0aXN0LlN2Zyhmb3VuZE5vZGUpIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kIHRoZSBhbGwgY2hpbGQgU1ZHIGVsZW1lbnRzIG9mIHRoZSBjdXJyZW50IGVsZW1lbnQgdGhhdCBtYXRjaCBhIENTUyBzZWxlY3Rvci4gVGhlIHJldHVybmVkIG9iamVjdCBpcyBhIENoYXJ0aXN0LlN2Zy5MaXN0IHdyYXBwZXIuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBDaGFydGlzdC5TdmdcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yIEEgQ1NTIHNlbGVjdG9yIHRoYXQgaXMgdXNlZCB0byBxdWVyeSBmb3IgY2hpbGQgU1ZHIGVsZW1lbnRzXG4gICAqIEByZXR1cm4ge0NoYXJ0aXN0LlN2Zy5MaXN0fSBUaGUgU1ZHIHdyYXBwZXIgbGlzdCBmb3IgdGhlIGVsZW1lbnQgZm91bmQgb3IgbnVsbCBpZiBubyBlbGVtZW50IHdhcyBmb3VuZFxuICAgKi9cbiAgZnVuY3Rpb24gcXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcikge1xuICAgIHZhciBmb3VuZE5vZGVzID0gdGhpcy5fbm9kZS5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcbiAgICByZXR1cm4gZm91bmROb2Rlcy5sZW5ndGggPyBuZXcgQ2hhcnRpc3QuU3ZnLkxpc3QoZm91bmROb2RlcykgOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGNyZWF0ZXMgYSBmb3JlaWduT2JqZWN0IChzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvU1ZHL0VsZW1lbnQvZm9yZWlnbk9iamVjdCkgdGhhdCBhbGxvd3MgdG8gZW1iZWQgSFRNTCBjb250ZW50IGludG8gYSBTVkcgZ3JhcGhpYy4gV2l0aCB0aGUgaGVscCBvZiBmb3JlaWduT2JqZWN0cyB5b3UgY2FuIGVuYWJsZSB0aGUgdXNhZ2Ugb2YgcmVndWxhciBIVE1MIGVsZW1lbnRzIGluc2lkZSBvZiBTVkcgd2hlcmUgdGhleSBhcmUgc3ViamVjdCBmb3IgU1ZHIHBvc2l0aW9uaW5nIGFuZCB0cmFuc2Zvcm1hdGlvbiBidXQgdGhlIEJyb3dzZXIgd2lsbCB1c2UgdGhlIEhUTUwgcmVuZGVyaW5nIGNhcGFiaWxpdGllcyBmb3IgdGhlIGNvbnRhaW5pbmcgRE9NLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgQ2hhcnRpc3QuU3ZnXG4gICAqIEBwYXJhbSB7Tm9kZXxTdHJpbmd9IGNvbnRlbnQgVGhlIERPTSBOb2RlLCBvciBIVE1MIHN0cmluZyB0aGF0IHdpbGwgYmUgY29udmVydGVkIHRvIGEgRE9NIE5vZGUsIHRoYXQgaXMgdGhlbiBwbGFjZWQgaW50byBhbmQgd3JhcHBlZCBieSB0aGUgZm9yZWlnbk9iamVjdFxuICAgKiBAcGFyYW0ge1N0cmluZ30gW2F0dHJpYnV0ZXNdIEFuIG9iamVjdCB3aXRoIHByb3BlcnRpZXMgdGhhdCB3aWxsIGJlIGFkZGVkIGFzIGF0dHJpYnV0ZXMgdG8gdGhlIGZvcmVpZ25PYmplY3QgZWxlbWVudCB0aGF0IGlzIGNyZWF0ZWQuIEF0dHJpYnV0ZXMgd2l0aCB1bmRlZmluZWQgdmFsdWVzIHdpbGwgbm90IGJlIGFkZGVkLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW2NsYXNzTmFtZV0gVGhpcyBjbGFzcyBvciBjbGFzcyBsaXN0IHdpbGwgYmUgYWRkZWQgdG8gdGhlIFNWRyBlbGVtZW50XG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2luc2VydEZpcnN0XSBTcGVjaWZpZXMgaWYgdGhlIGZvcmVpZ25PYmplY3Qgc2hvdWxkIGJlIGluc2VydGVkIGFzIGZpcnN0IGNoaWxkXG4gICAqIEByZXR1cm4ge0NoYXJ0aXN0LlN2Z30gTmV3IHdyYXBwZXIgb2JqZWN0IHRoYXQgd3JhcHMgdGhlIGZvcmVpZ25PYmplY3QgZWxlbWVudFxuICAgKi9cbiAgZnVuY3Rpb24gZm9yZWlnbk9iamVjdChjb250ZW50LCBhdHRyaWJ1dGVzLCBjbGFzc05hbWUsIGluc2VydEZpcnN0KSB7XG4gICAgLy8gSWYgY29udGVudCBpcyBzdHJpbmcgdGhlbiB3ZSBjb252ZXJ0IGl0IHRvIERPTVxuICAgIC8vIFRPRE86IEhhbmRsZSBjYXNlIHdoZXJlIGNvbnRlbnQgaXMgbm90IGEgc3RyaW5nIG5vciBhIERPTSBOb2RlXG4gICAgaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBjb250YWluZXIuaW5uZXJIVE1MID0gY29udGVudDtcbiAgICAgIGNvbnRlbnQgPSBjb250YWluZXIuZmlyc3RDaGlsZDtcbiAgICB9XG5cbiAgICAvLyBBZGRpbmcgbmFtZXNwYWNlIHRvIGNvbnRlbnQgZWxlbWVudFxuICAgIGNvbnRlbnQuc2V0QXR0cmlidXRlKCd4bWxucycsIENoYXJ0aXN0Lm5hbWVzcGFjZXMueG1sbnMpO1xuXG4gICAgLy8gQ3JlYXRpbmcgdGhlIGZvcmVpZ25PYmplY3Qgd2l0aG91dCByZXF1aXJlZCBleHRlbnNpb24gYXR0cmlidXRlIChhcyBkZXNjcmliZWQgaGVyZVxuICAgIC8vIGh0dHA6Ly93d3cudzMub3JnL1RSL1NWRy9leHRlbmQuaHRtbCNGb3JlaWduT2JqZWN0RWxlbWVudClcbiAgICB2YXIgZm5PYmogPSB0aGlzLmVsZW0oJ2ZvcmVpZ25PYmplY3QnLCBhdHRyaWJ1dGVzLCBjbGFzc05hbWUsIGluc2VydEZpcnN0KTtcblxuICAgIC8vIEFkZCBjb250ZW50IHRvIGZvcmVpZ25PYmplY3RFbGVtZW50XG4gICAgZm5PYmouX25vZGUuYXBwZW5kQ2hpbGQoY29udGVudCk7XG5cbiAgICByZXR1cm4gZm5PYmo7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgYWRkcyBhIG5ldyB0ZXh0IGVsZW1lbnQgdG8gdGhlIGN1cnJlbnQgQ2hhcnRpc3QuU3ZnIHdyYXBwZXIuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBDaGFydGlzdC5TdmdcbiAgICogQHBhcmFtIHtTdHJpbmd9IHQgVGhlIHRleHQgdGhhdCBzaG91bGQgYmUgYWRkZWQgdG8gdGhlIHRleHQgZWxlbWVudCB0aGF0IGlzIGNyZWF0ZWRcbiAgICogQHJldHVybiB7Q2hhcnRpc3QuU3ZnfSBUaGUgc2FtZSB3cmFwcGVyIG9iamVjdCB0aGF0IHdhcyB1c2VkIHRvIGFkZCB0aGUgbmV3bHkgY3JlYXRlZCBlbGVtZW50XG4gICAqL1xuICBmdW5jdGlvbiB0ZXh0KHQpIHtcbiAgICB0aGlzLl9ub2RlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHQpKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCB3aWxsIGNsZWFyIGFsbCBjaGlsZCBub2RlcyBvZiB0aGUgY3VycmVudCB3cmFwcGVyIG9iamVjdC5cbiAgICpcbiAgICogQG1lbWJlcm9mIENoYXJ0aXN0LlN2Z1xuICAgKiBAcmV0dXJuIHtDaGFydGlzdC5Tdmd9IFRoZSBzYW1lIHdyYXBwZXIgb2JqZWN0IHRoYXQgZ290IGVtcHRpZWRcbiAgICovXG4gIGZ1bmN0aW9uIGVtcHR5KCkge1xuICAgIHdoaWxlICh0aGlzLl9ub2RlLmZpcnN0Q2hpbGQpIHtcbiAgICAgIHRoaXMuX25vZGUucmVtb3ZlQ2hpbGQodGhpcy5fbm9kZS5maXJzdENoaWxkKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCB3aWxsIGNhdXNlIHRoZSBjdXJyZW50IHdyYXBwZXIgdG8gcmVtb3ZlIGl0c2VsZiBmcm9tIGl0cyBwYXJlbnQgd3JhcHBlci4gVXNlIHRoaXMgbWV0aG9kIGlmIHlvdSdkIGxpa2UgdG8gZ2V0IHJpZCBvZiBhbiBlbGVtZW50IGluIGEgZ2l2ZW4gRE9NIHN0cnVjdHVyZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIENoYXJ0aXN0LlN2Z1xuICAgKiBAcmV0dXJuIHtDaGFydGlzdC5Tdmd9IFRoZSBwYXJlbnQgd3JhcHBlciBvYmplY3Qgb2YgdGhlIGVsZW1lbnQgdGhhdCBnb3QgcmVtb3ZlZFxuICAgKi9cbiAgZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgIHRoaXMuX25vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLl9ub2RlKTtcbiAgICByZXR1cm4gdGhpcy5wYXJlbnQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCB3aWxsIHJlcGxhY2UgdGhlIGVsZW1lbnQgd2l0aCBhIG5ldyBlbGVtZW50IHRoYXQgY2FuIGJlIGNyZWF0ZWQgb3V0c2lkZSBvZiB0aGUgY3VycmVudCBET00uXG4gICAqXG4gICAqIEBtZW1iZXJvZiBDaGFydGlzdC5TdmdcbiAgICogQHBhcmFtIHtDaGFydGlzdC5Tdmd9IG5ld0VsZW1lbnQgVGhlIG5ldyBDaGFydGlzdC5Tdmcgb2JqZWN0IHRoYXQgd2lsbCBiZSB1c2VkIHRvIHJlcGxhY2UgdGhlIGN1cnJlbnQgd3JhcHBlciBvYmplY3RcbiAgICogQHJldHVybiB7Q2hhcnRpc3QuU3ZnfSBUaGUgd3JhcHBlciBvZiB0aGUgbmV3IGVsZW1lbnRcbiAgICovXG4gIGZ1bmN0aW9uIHJlcGxhY2UobmV3RWxlbWVudCkge1xuICAgIHRoaXMuX25vZGUucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobmV3RWxlbWVudC5fbm9kZSwgdGhpcy5fbm9kZSk7XG4gICAgcmV0dXJuIG5ld0VsZW1lbnQ7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2Qgd2lsbCBhcHBlbmQgYW4gZWxlbWVudCB0byB0aGUgY3VycmVudCBlbGVtZW50IGFzIGEgY2hpbGQuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBDaGFydGlzdC5TdmdcbiAgICogQHBhcmFtIHtDaGFydGlzdC5Tdmd9IGVsZW1lbnQgVGhlIENoYXJ0aXN0LlN2ZyBlbGVtZW50IHRoYXQgc2hvdWxkIGJlIGFkZGVkIGFzIGEgY2hpbGRcbiAgICogQHBhcmFtIHtCb29sZWFufSBbaW5zZXJ0Rmlyc3RdIFNwZWNpZmllcyBpZiB0aGUgZWxlbWVudCBzaG91bGQgYmUgaW5zZXJ0ZWQgYXMgZmlyc3QgY2hpbGRcbiAgICogQHJldHVybiB7Q2hhcnRpc3QuU3ZnfSBUaGUgd3JhcHBlciBvZiB0aGUgYXBwZW5kZWQgb2JqZWN0XG4gICAqL1xuICBmdW5jdGlvbiBhcHBlbmQoZWxlbWVudCwgaW5zZXJ0Rmlyc3QpIHtcbiAgICBpZihpbnNlcnRGaXJzdCAmJiB0aGlzLl9ub2RlLmZpcnN0Q2hpbGQpIHtcbiAgICAgIHRoaXMuX25vZGUuaW5zZXJ0QmVmb3JlKGVsZW1lbnQuX25vZGUsIHRoaXMuX25vZGUuZmlyc3RDaGlsZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX25vZGUuYXBwZW5kQ2hpbGQoZWxlbWVudC5fbm9kZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBhcnJheSBvZiBjbGFzcyBuYW1lcyB0aGF0IGFyZSBhdHRhY2hlZCB0byB0aGUgY3VycmVudCB3cmFwcGVyIGVsZW1lbnQuIFRoaXMgbWV0aG9kIGNhbiBub3QgYmUgY2hhaW5lZCBmdXJ0aGVyLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgQ2hhcnRpc3QuU3ZnXG4gICAqIEByZXR1cm4ge0FycmF5fSBBIGxpc3Qgb2YgY2xhc3NlcyBvciBhbiBlbXB0eSBhcnJheSBpZiB0aGVyZSBhcmUgbm8gY2xhc3NlcyBvbiB0aGUgY3VycmVudCBlbGVtZW50XG4gICAqL1xuICBmdW5jdGlvbiBjbGFzc2VzKCkge1xuICAgIHJldHVybiB0aGlzLl9ub2RlLmdldEF0dHJpYnV0ZSgnY2xhc3MnKSA/IHRoaXMuX25vZGUuZ2V0QXR0cmlidXRlKCdjbGFzcycpLnRyaW0oKS5zcGxpdCgvXFxzKy8pIDogW107XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBvbmUgb3IgYSBzcGFjZSBzZXBhcmF0ZWQgbGlzdCBvZiBjbGFzc2VzIHRvIHRoZSBjdXJyZW50IGVsZW1lbnQgYW5kIGVuc3VyZXMgdGhlIGNsYXNzZXMgYXJlIG9ubHkgZXhpc3Rpbmcgb25jZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIENoYXJ0aXN0LlN2Z1xuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZXMgQSB3aGl0ZSBzcGFjZSBzZXBhcmF0ZWQgbGlzdCBvZiBjbGFzcyBuYW1lc1xuICAgKiBAcmV0dXJuIHtDaGFydGlzdC5Tdmd9IFRoZSB3cmFwcGVyIG9mIHRoZSBjdXJyZW50IGVsZW1lbnRcbiAgICovXG4gIGZ1bmN0aW9uIGFkZENsYXNzKG5hbWVzKSB7XG4gICAgdGhpcy5fbm9kZS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJyxcbiAgICAgIHRoaXMuY2xhc3Nlcyh0aGlzLl9ub2RlKVxuICAgICAgICAuY29uY2F0KG5hbWVzLnRyaW0oKS5zcGxpdCgvXFxzKy8pKVxuICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKGVsZW0sIHBvcywgc2VsZikge1xuICAgICAgICAgIHJldHVybiBzZWxmLmluZGV4T2YoZWxlbSkgPT09IHBvcztcbiAgICAgICAgfSkuam9pbignICcpXG4gICAgKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgb25lIG9yIGEgc3BhY2Ugc2VwYXJhdGVkIGxpc3Qgb2YgY2xhc3NlcyBmcm9tIHRoZSBjdXJyZW50IGVsZW1lbnQuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBDaGFydGlzdC5TdmdcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzIEEgd2hpdGUgc3BhY2Ugc2VwYXJhdGVkIGxpc3Qgb2YgY2xhc3MgbmFtZXNcbiAgICogQHJldHVybiB7Q2hhcnRpc3QuU3ZnfSBUaGUgd3JhcHBlciBvZiB0aGUgY3VycmVudCBlbGVtZW50XG4gICAqL1xuICBmdW5jdGlvbiByZW1vdmVDbGFzcyhuYW1lcykge1xuICAgIHZhciByZW1vdmVkQ2xhc3NlcyA9IG5hbWVzLnRyaW0oKS5zcGxpdCgvXFxzKy8pO1xuXG4gICAgdGhpcy5fbm9kZS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgdGhpcy5jbGFzc2VzKHRoaXMuX25vZGUpLmZpbHRlcihmdW5jdGlvbihuYW1lKSB7XG4gICAgICByZXR1cm4gcmVtb3ZlZENsYXNzZXMuaW5kZXhPZihuYW1lKSA9PT0gLTE7XG4gICAgfSkuam9pbignICcpKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYWxsIGNsYXNzZXMgZnJvbSB0aGUgY3VycmVudCBlbGVtZW50LlxuICAgKlxuICAgKiBAbWVtYmVyb2YgQ2hhcnRpc3QuU3ZnXG4gICAqIEByZXR1cm4ge0NoYXJ0aXN0LlN2Z30gVGhlIHdyYXBwZXIgb2YgdGhlIGN1cnJlbnQgZWxlbWVudFxuICAgKi9cbiAgZnVuY3Rpb24gcmVtb3ZlQWxsQ2xhc3NlcygpIHtcbiAgICB0aGlzLl9ub2RlLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnJyk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgZWxlbWVudCBoZWlnaHQgdXNpbmcgYGdldEJvdW5kaW5nQ2xpZW50UmVjdGBcbiAgICpcbiAgICogQG1lbWJlcm9mIENoYXJ0aXN0LlN2Z1xuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBlbGVtZW50cyBoZWlnaHQgaW4gcGl4ZWxzXG4gICAqL1xuICBmdW5jdGlvbiBoZWlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX25vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBlbGVtZW50IHdpZHRoIHVzaW5nIGBnZXRCb3VuZGluZ0NsaWVudFJlY3RgXG4gICAqXG4gICAqIEBtZW1iZXJvZiBDaGFydGlzdC5Db3JlXG4gICAqIEByZXR1cm4ge051bWJlcn0gVGhlIGVsZW1lbnRzIHdpZHRoIGluIHBpeGVsc1xuICAgKi9cbiAgZnVuY3Rpb24gd2lkdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuX25vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGFuaW1hdGUgZnVuY3Rpb24gbGV0cyB5b3UgYW5pbWF0ZSB0aGUgY3VycmVudCBlbGVtZW50IHdpdGggU01JTCBhbmltYXRpb25zLiBZb3UgY2FuIGFkZCBhbmltYXRpb25zIGZvciBtdWx0aXBsZSBhdHRyaWJ1dGVzIGF0IHRoZSBzYW1lIHRpbWUgYnkgdXNpbmcgYW4gYW5pbWF0aW9uIGRlZmluaXRpb24gb2JqZWN0LiBUaGlzIG9iamVjdCBzaG91bGQgY29udGFpbiBTTUlMIGFuaW1hdGlvbiBhdHRyaWJ1dGVzLiBQbGVhc2UgcmVmZXIgdG8gaHR0cDovL3d3dy53My5vcmcvVFIvU1ZHL2FuaW1hdGUuaHRtbCBmb3IgYSBkZXRhaWxlZCBzcGVjaWZpY2F0aW9uIGFib3V0IHRoZSBhdmFpbGFibGUgYW5pbWF0aW9uIGF0dHJpYnV0ZXMuIEFkZGl0aW9uYWxseSBhbiBlYXNpbmcgcHJvcGVydHkgY2FuIGJlIHBhc3NlZCBpbiB0aGUgYW5pbWF0aW9uIGRlZmluaXRpb24gb2JqZWN0LiBUaGlzIGNhbiBiZSBhIHN0cmluZyB3aXRoIGEgbmFtZSBvZiBhbiBlYXNpbmcgZnVuY3Rpb24gaW4gYENoYXJ0aXN0LlN2Zy5FYXNpbmdgIG9yIGFuIGFycmF5IHdpdGggZm91ciBudW1iZXJzIHNwZWNpZnlpbmcgYSBjdWJpYyBCw6l6aWVyIGN1cnZlLlxuICAgKiAqKkFuIGFuaW1hdGlvbnMgb2JqZWN0IGNvdWxkIGxvb2sgbGlrZSB0aGlzOioqXG4gICAqIGBgYGphdmFzY3JpcHRcbiAgICogZWxlbWVudC5hbmltYXRlKHtcbiAgICogICBvcGFjaXR5OiB7XG4gICAqICAgICBkdXI6IDEwMDAsXG4gICAqICAgICBmcm9tOiAwLFxuICAgKiAgICAgdG86IDFcbiAgICogICB9LFxuICAgKiAgIHgxOiB7XG4gICAqICAgICBkdXI6ICcxMDAwbXMnLFxuICAgKiAgICAgZnJvbTogMTAwLFxuICAgKiAgICAgdG86IDIwMCxcbiAgICogICAgIGVhc2luZzogJ2Vhc2VPdXRRdWFydCdcbiAgICogICB9LFxuICAgKiAgIHkxOiB7XG4gICAqICAgICBkdXI6ICcycycsXG4gICAqICAgICBmcm9tOiAwLFxuICAgKiAgICAgdG86IDEwMFxuICAgKiAgIH1cbiAgICogfSk7XG4gICAqIGBgYFxuICAgKiAqKkF1dG9tYXRpYyB1bml0IGNvbnZlcnNpb24qKlxuICAgKiBGb3IgdGhlIGBkdXJgIGFuZCB0aGUgYGJlZ2luYCBhbmltYXRlIGF0dHJpYnV0ZSB5b3UgY2FuIGFsc28gb21pdCBhIHVuaXQgYnkgcGFzc2luZyBhIG51bWJlci4gVGhlIG51bWJlciB3aWxsIGF1dG9tYXRpY2FsbHkgYmUgY29udmVydGVkIHRvIG1pbGxpIHNlY29uZHMuXG4gICAqICoqR3VpZGVkIG1vZGUqKlxuICAgKiBUaGUgZGVmYXVsdCBiZWhhdmlvciBvZiBTTUlMIGFuaW1hdGlvbnMgd2l0aCBvZmZzZXQgdXNpbmcgdGhlIGBiZWdpbmAgYXR0cmlidXRlIGlzIHRoYXQgdGhlIGF0dHJpYnV0ZSB3aWxsIGtlZXAgaXQncyBvcmlnaW5hbCB2YWx1ZSB1bnRpbCB0aGUgYW5pbWF0aW9uIHN0YXJ0cy4gTW9zdGx5IHRoaXMgYmVoYXZpb3IgaXMgbm90IGRlc2lyZWQgYXMgeW91J2QgbGlrZSB0byBoYXZlIHlvdXIgZWxlbWVudCBhdHRyaWJ1dGVzIGFscmVhZHkgaW5pdGlhbGl6ZWQgd2l0aCB0aGUgYW5pbWF0aW9uIGBmcm9tYCB2YWx1ZSBldmVuIGJlZm9yZSB0aGUgYW5pbWF0aW9uIHN0YXJ0cy4gQWxzbyBpZiB5b3UgZG9uJ3Qgc3BlY2lmeSBgZmlsbD1cImZyZWV6ZVwiYCBvbiBhbiBhbmltYXRlIGVsZW1lbnQgb3IgaWYgeW91IGRlbGV0ZSB0aGUgYW5pbWF0aW9uIGFmdGVyIGl0J3MgZG9uZSAod2hpY2ggaXMgZG9uZSBpbiBndWlkZWQgbW9kZSkgdGhlIGF0dHJpYnV0ZSB3aWxsIHN3aXRjaCBiYWNrIHRvIHRoZSBpbml0aWFsIHZhbHVlLiBUaGlzIGJlaGF2aW9yIGlzIGFsc28gbm90IGRlc2lyZWQgd2hlbiBwZXJmb3JtaW5nIHNpbXBsZSBvbmUtdGltZSBhbmltYXRpb25zLiBGb3Igb25lLXRpbWUgYW5pbWF0aW9ucyB5b3UnZCB3YW50IHRvIHRyaWdnZXIgYW5pbWF0aW9ucyBpbW1lZGlhdGVseSBpbnN0ZWFkIG9mIHJlbGF0aXZlIHRvIHRoZSBkb2N1bWVudCBiZWdpbiB0aW1lLiBUaGF0J3Mgd2h5IGluIGd1aWRlZCBtb2RlIENoYXJ0aXN0LlN2ZyB3aWxsIGFsc28gdXNlIHRoZSBgYmVnaW5gIHByb3BlcnR5IHRvIHNjaGVkdWxlIGEgdGltZW91dCBhbmQgbWFudWFsbHkgc3RhcnQgdGhlIGFuaW1hdGlvbiBhZnRlciB0aGUgdGltZW91dC4gSWYgeW91J3JlIHVzaW5nIG11bHRpcGxlIFNNSUwgZGVmaW5pdGlvbiBvYmplY3RzIGZvciBhbiBhdHRyaWJ1dGUgKGluIGFuIGFycmF5KSwgZ3VpZGVkIG1vZGUgd2lsbCBiZSBkaXNhYmxlZCBmb3IgdGhpcyBhdHRyaWJ1dGUsIGV2ZW4gaWYgeW91IGV4cGxpY2l0bHkgZW5hYmxlZCBpdC5cbiAgICogSWYgZ3VpZGVkIG1vZGUgaXMgZW5hYmxlZCB0aGUgZm9sbG93aW5nIGJlaGF2aW9yIGlzIGFkZGVkOlxuICAgKiAtIEJlZm9yZSB0aGUgYW5pbWF0aW9uIHN0YXJ0cyAoZXZlbiB3aGVuIGRlbGF5ZWQgd2l0aCBgYmVnaW5gKSB0aGUgYW5pbWF0ZWQgYXR0cmlidXRlIHdpbGwgYmUgc2V0IGFscmVhZHkgdG8gdGhlIGBmcm9tYCB2YWx1ZSBvZiB0aGUgYW5pbWF0aW9uXG4gICAqIC0gYGJlZ2luYCBpcyBleHBsaWNpdGx5IHNldCB0byBgaW5kZWZpbml0ZWAgc28gaXQgY2FuIGJlIHN0YXJ0ZWQgbWFudWFsbHkgd2l0aG91dCByZWx5aW5nIG9uIGRvY3VtZW50IGJlZ2luIHRpbWUgKGNyZWF0aW9uKVxuICAgKiAtIFRoZSBhbmltYXRlIGVsZW1lbnQgd2lsbCBiZSBmb3JjZWQgdG8gdXNlIGBmaWxsPVwiZnJlZXplXCJgXG4gICAqIC0gVGhlIGFuaW1hdGlvbiB3aWxsIGJlIHRyaWdnZXJlZCB3aXRoIGBiZWdpbkVsZW1lbnQoKWAgaW4gYSB0aW1lb3V0IHdoZXJlIGBiZWdpbmAgb2YgdGhlIGRlZmluaXRpb24gb2JqZWN0IGlzIGludGVycHJldGVkIGluIG1pbGxpIHNlY29uZHMuIElmIG5vIGBiZWdpbmAgd2FzIHNwZWNpZmllZCB0aGUgdGltZW91dCBpcyB0cmlnZ2VyZWQgaW1tZWRpYXRlbHkuXG4gICAqIC0gQWZ0ZXIgdGhlIGFuaW1hdGlvbiB0aGUgZWxlbWVudCBhdHRyaWJ1dGUgdmFsdWUgd2lsbCBiZSBzZXQgdG8gdGhlIGB0b2AgdmFsdWUgb2YgdGhlIGFuaW1hdGlvblxuICAgKiAtIFRoZSBhbmltYXRlIGVsZW1lbnQgaXMgZGVsZXRlZCBmcm9tIHRoZSBET01cbiAgICpcbiAgICogQG1lbWJlcm9mIENoYXJ0aXN0LlN2Z1xuICAgKiBAcGFyYW0ge09iamVjdH0gYW5pbWF0aW9ucyBBbiBhbmltYXRpb25zIG9iamVjdCB3aGVyZSB0aGUgcHJvcGVydHkga2V5cyBhcmUgdGhlIGF0dHJpYnV0ZXMgeW91J2QgbGlrZSB0byBhbmltYXRlLiBUaGUgcHJvcGVydGllcyBzaG91bGQgYmUgb2JqZWN0cyBhZ2FpbiB0aGF0IGNvbnRhaW4gdGhlIFNNSUwgYW5pbWF0aW9uIGF0dHJpYnV0ZXMgKHVzdWFsbHkgYmVnaW4sIGR1ciwgZnJvbSwgYW5kIHRvKS4gVGhlIHByb3BlcnR5IGJlZ2luIGFuZCBkdXIgaXMgYXV0byBjb252ZXJ0ZWQgKHNlZSBBdXRvbWF0aWMgdW5pdCBjb252ZXJzaW9uKS4gWW91IGNhbiBhbHNvIHNjaGVkdWxlIG11bHRpcGxlIGFuaW1hdGlvbnMgZm9yIHRoZSBzYW1lIGF0dHJpYnV0ZSBieSBwYXNzaW5nIGFuIEFycmF5IG9mIFNNSUwgZGVmaW5pdGlvbiBvYmplY3RzLiBBdHRyaWJ1dGVzIHRoYXQgY29udGFpbiBhbiBhcnJheSBvZiBTTUlMIGRlZmluaXRpb24gb2JqZWN0cyB3aWxsIG5vdCBiZSBleGVjdXRlZCBpbiBndWlkZWQgbW9kZS5cbiAgICogQHBhcmFtIHtCb29sZWFufSBndWlkZWQgU3BlY2lmeSBpZiBndWlkZWQgbW9kZSBzaG91bGQgYmUgYWN0aXZhdGVkIGZvciB0aGlzIGFuaW1hdGlvbiAoc2VlIEd1aWRlZCBtb2RlKS4gSWYgbm90IG90aGVyd2lzZSBzcGVjaWZpZWQsIGd1aWRlZCBtb2RlIHdpbGwgYmUgYWN0aXZhdGVkLlxuICAgKiBAcGFyYW0ge09iamVjdH0gZXZlbnRFbWl0dGVyIElmIHNwZWNpZmllZCwgdGhpcyBldmVudCBlbWl0dGVyIHdpbGwgYmUgbm90aWZpZWQgd2hlbiBhbiBhbmltYXRpb24gc3RhcnRzIG9yIGVuZHMuXG4gICAqIEByZXR1cm4ge0NoYXJ0aXN0LlN2Z30gVGhlIGN1cnJlbnQgZWxlbWVudCB3aGVyZSB0aGUgYW5pbWF0aW9uIHdhcyBhZGRlZFxuICAgKi9cbiAgZnVuY3Rpb24gYW5pbWF0ZShhbmltYXRpb25zLCBndWlkZWQsIGV2ZW50RW1pdHRlcikge1xuICAgIGlmKGd1aWRlZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBndWlkZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIE9iamVjdC5rZXlzKGFuaW1hdGlvbnMpLmZvckVhY2goZnVuY3Rpb24gY3JlYXRlQW5pbWF0ZUZvckF0dHJpYnV0ZXMoYXR0cmlidXRlKSB7XG5cbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZUFuaW1hdGUoYW5pbWF0aW9uRGVmaW5pdGlvbiwgZ3VpZGVkKSB7XG4gICAgICAgIHZhciBhdHRyaWJ1dGVQcm9wZXJ0aWVzID0ge30sXG4gICAgICAgICAgYW5pbWF0ZSxcbiAgICAgICAgICB0aW1lb3V0LFxuICAgICAgICAgIGVhc2luZztcblxuICAgICAgICAvLyBDaGVjayBpZiBhbiBlYXNpbmcgaXMgc3BlY2lmaWVkIGluIHRoZSBkZWZpbml0aW9uIG9iamVjdCBhbmQgZGVsZXRlIGl0IGZyb20gdGhlIG9iamVjdCBhcyBpdCB3aWxsIG5vdFxuICAgICAgICAvLyBiZSBwYXJ0IG9mIHRoZSBhbmltYXRlIGVsZW1lbnQgYXR0cmlidXRlcy5cbiAgICAgICAgaWYoYW5pbWF0aW9uRGVmaW5pdGlvbi5lYXNpbmcpIHtcbiAgICAgICAgICAvLyBJZiBhbHJlYWR5IGFuIGVhc2luZyBCw6l6aWVyIGN1cnZlIGFycmF5IHdlIHRha2UgaXQgb3Igd2UgbG9va3VwIGEgZWFzaW5nIGFycmF5IGluIHRoZSBFYXNpbmcgb2JqZWN0XG4gICAgICAgICAgZWFzaW5nID0gYW5pbWF0aW9uRGVmaW5pdGlvbi5lYXNpbmcgaW5zdGFuY2VvZiBBcnJheSA/XG4gICAgICAgICAgICBhbmltYXRpb25EZWZpbml0aW9uLmVhc2luZyA6XG4gICAgICAgICAgICBDaGFydGlzdC5TdmcuRWFzaW5nW2FuaW1hdGlvbkRlZmluaXRpb24uZWFzaW5nXTtcbiAgICAgICAgICBkZWxldGUgYW5pbWF0aW9uRGVmaW5pdGlvbi5lYXNpbmc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiBudW1lcmljIGR1ciBvciBiZWdpbiB3YXMgcHJvdmlkZWQgd2UgYXNzdW1lIG1pbGxpIHNlY29uZHNcbiAgICAgICAgYW5pbWF0aW9uRGVmaW5pdGlvbi5iZWdpbiA9IENoYXJ0aXN0LmVuc3VyZVVuaXQoYW5pbWF0aW9uRGVmaW5pdGlvbi5iZWdpbiwgJ21zJyk7XG4gICAgICAgIGFuaW1hdGlvbkRlZmluaXRpb24uZHVyID0gQ2hhcnRpc3QuZW5zdXJlVW5pdChhbmltYXRpb25EZWZpbml0aW9uLmR1ciwgJ21zJyk7XG5cbiAgICAgICAgaWYoZWFzaW5nKSB7XG4gICAgICAgICAgYW5pbWF0aW9uRGVmaW5pdGlvbi5jYWxjTW9kZSA9ICdzcGxpbmUnO1xuICAgICAgICAgIGFuaW1hdGlvbkRlZmluaXRpb24ua2V5U3BsaW5lcyA9IGVhc2luZy5qb2luKCcgJyk7XG4gICAgICAgICAgYW5pbWF0aW9uRGVmaW5pdGlvbi5rZXlUaW1lcyA9ICcwOzEnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkaW5nIFwiZmlsbDogZnJlZXplXCIgaWYgd2UgYXJlIGluIGd1aWRlZCBtb2RlIGFuZCBzZXQgaW5pdGlhbCBhdHRyaWJ1dGUgdmFsdWVzXG4gICAgICAgIGlmKGd1aWRlZCkge1xuICAgICAgICAgIGFuaW1hdGlvbkRlZmluaXRpb24uZmlsbCA9ICdmcmVlemUnO1xuICAgICAgICAgIC8vIEFuaW1hdGVkIHByb3BlcnR5IG9uIG91ciBlbGVtZW50IHNob3VsZCBhbHJlYWR5IGJlIHNldCB0byB0aGUgYW5pbWF0aW9uIGZyb20gdmFsdWUgaW4gZ3VpZGVkIG1vZGVcbiAgICAgICAgICBhdHRyaWJ1dGVQcm9wZXJ0aWVzW2F0dHJpYnV0ZV0gPSBhbmltYXRpb25EZWZpbml0aW9uLmZyb207XG4gICAgICAgICAgdGhpcy5hdHRyKGF0dHJpYnV0ZVByb3BlcnRpZXMpO1xuXG4gICAgICAgICAgLy8gSW4gZ3VpZGVkIG1vZGUgd2UgYWxzbyBzZXQgYmVnaW4gdG8gaW5kZWZpbml0ZSBzbyB3ZSBjYW4gdHJpZ2dlciB0aGUgc3RhcnQgbWFudWFsbHkgYW5kIHB1dCB0aGUgYmVnaW5cbiAgICAgICAgICAvLyB3aGljaCBuZWVkcyB0byBiZSBpbiBtcyBhc2lkZVxuICAgICAgICAgIHRpbWVvdXQgPSBDaGFydGlzdC5xdWFudGl0eShhbmltYXRpb25EZWZpbml0aW9uLmJlZ2luIHx8IDApLnZhbHVlO1xuICAgICAgICAgIGFuaW1hdGlvbkRlZmluaXRpb24uYmVnaW4gPSAnaW5kZWZpbml0ZSc7XG4gICAgICAgIH1cblxuICAgICAgICBhbmltYXRlID0gdGhpcy5lbGVtKCdhbmltYXRlJywgQ2hhcnRpc3QuZXh0ZW5kKHtcbiAgICAgICAgICBhdHRyaWJ1dGVOYW1lOiBhdHRyaWJ1dGVcbiAgICAgICAgfSwgYW5pbWF0aW9uRGVmaW5pdGlvbikpO1xuXG4gICAgICAgIGlmKGd1aWRlZCkge1xuICAgICAgICAgIC8vIElmIGd1aWRlZCB3ZSB0YWtlIHRoZSB2YWx1ZSB0aGF0IHdhcyBwdXQgYXNpZGUgaW4gdGltZW91dCBhbmQgdHJpZ2dlciB0aGUgYW5pbWF0aW9uIG1hbnVhbGx5IHdpdGggYSB0aW1lb3V0XG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIElmIGJlZ2luRWxlbWVudCBmYWlscyB3ZSBzZXQgdGhlIGFuaW1hdGVkIGF0dHJpYnV0ZSB0byB0aGUgZW5kIHBvc2l0aW9uIGFuZCByZW1vdmUgdGhlIGFuaW1hdGUgZWxlbWVudFxuICAgICAgICAgICAgLy8gVGhpcyBoYXBwZW5zIGlmIHRoZSBTTUlMIEVsZW1lbnRUaW1lQ29udHJvbCBpbnRlcmZhY2UgaXMgbm90IHN1cHBvcnRlZCBvciBhbnkgb3RoZXIgcHJvYmxlbXMgb2NjdXJlZCBpblxuICAgICAgICAgICAgLy8gdGhlIGJyb3dzZXIuIChDdXJyZW50bHkgRkYgMzQgZG9lcyBub3Qgc3VwcG9ydCBhbmltYXRlIGVsZW1lbnRzIGluIGZvcmVpZ25PYmplY3RzKVxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgYW5pbWF0ZS5fbm9kZS5iZWdpbkVsZW1lbnQoKTtcbiAgICAgICAgICAgIH0gY2F0Y2goZXJyKSB7XG4gICAgICAgICAgICAgIC8vIFNldCBhbmltYXRlZCBhdHRyaWJ1dGUgdG8gY3VycmVudCBhbmltYXRlZCB2YWx1ZVxuICAgICAgICAgICAgICBhdHRyaWJ1dGVQcm9wZXJ0aWVzW2F0dHJpYnV0ZV0gPSBhbmltYXRpb25EZWZpbml0aW9uLnRvO1xuICAgICAgICAgICAgICB0aGlzLmF0dHIoYXR0cmlidXRlUHJvcGVydGllcyk7XG4gICAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgYW5pbWF0ZSBlbGVtZW50IGFzIGl0J3Mgbm8gbG9uZ2VyIHJlcXVpcmVkXG4gICAgICAgICAgICAgIGFuaW1hdGUucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfS5iaW5kKHRoaXMpLCB0aW1lb3V0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKGV2ZW50RW1pdHRlcikge1xuICAgICAgICAgIGFuaW1hdGUuX25vZGUuYWRkRXZlbnRMaXN0ZW5lcignYmVnaW5FdmVudCcsIGZ1bmN0aW9uIGhhbmRsZUJlZ2luRXZlbnQoKSB7XG4gICAgICAgICAgICBldmVudEVtaXR0ZXIuZW1pdCgnYW5pbWF0aW9uQmVnaW4nLCB7XG4gICAgICAgICAgICAgIGVsZW1lbnQ6IHRoaXMsXG4gICAgICAgICAgICAgIGFuaW1hdGU6IGFuaW1hdGUuX25vZGUsXG4gICAgICAgICAgICAgIHBhcmFtczogYW5pbWF0aW9uRGVmaW5pdGlvblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFuaW1hdGUuX25vZGUuYWRkRXZlbnRMaXN0ZW5lcignZW5kRXZlbnQnLCBmdW5jdGlvbiBoYW5kbGVFbmRFdmVudCgpIHtcbiAgICAgICAgICBpZihldmVudEVtaXR0ZXIpIHtcbiAgICAgICAgICAgIGV2ZW50RW1pdHRlci5lbWl0KCdhbmltYXRpb25FbmQnLCB7XG4gICAgICAgICAgICAgIGVsZW1lbnQ6IHRoaXMsXG4gICAgICAgICAgICAgIGFuaW1hdGU6IGFuaW1hdGUuX25vZGUsXG4gICAgICAgICAgICAgIHBhcmFtczogYW5pbWF0aW9uRGVmaW5pdGlvblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYoZ3VpZGVkKSB7XG4gICAgICAgICAgICAvLyBTZXQgYW5pbWF0ZWQgYXR0cmlidXRlIHRvIGN1cnJlbnQgYW5pbWF0ZWQgdmFsdWVcbiAgICAgICAgICAgIGF0dHJpYnV0ZVByb3BlcnRpZXNbYXR0cmlidXRlXSA9IGFuaW1hdGlvbkRlZmluaXRpb24udG87XG4gICAgICAgICAgICB0aGlzLmF0dHIoYXR0cmlidXRlUHJvcGVydGllcyk7XG4gICAgICAgICAgICAvLyBSZW1vdmUgdGhlIGFuaW1hdGUgZWxlbWVudCBhcyBpdCdzIG5vIGxvbmdlciByZXF1aXJlZFxuICAgICAgICAgICAgYW5pbWF0ZS5yZW1vdmUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIGN1cnJlbnQgYXR0cmlidXRlIGlzIGFuIGFycmF5IG9mIGRlZmluaXRpb24gb2JqZWN0cyB3ZSBjcmVhdGUgYW4gYW5pbWF0ZSBmb3IgZWFjaCBhbmQgZGlzYWJsZSBndWlkZWQgbW9kZVxuICAgICAgaWYoYW5pbWF0aW9uc1thdHRyaWJ1dGVdIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgYW5pbWF0aW9uc1thdHRyaWJ1dGVdLmZvckVhY2goZnVuY3Rpb24oYW5pbWF0aW9uRGVmaW5pdGlvbikge1xuICAgICAgICAgIGNyZWF0ZUFuaW1hdGUuYmluZCh0aGlzKShhbmltYXRpb25EZWZpbml0aW9uLCBmYWxzZSk7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjcmVhdGVBbmltYXRlLmJpbmQodGhpcykoYW5pbWF0aW9uc1thdHRyaWJ1dGVdLCBndWlkZWQpO1xuICAgICAgfVxuXG4gICAgfS5iaW5kKHRoaXMpKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgQ2hhcnRpc3QuU3ZnID0gQ2hhcnRpc3QuQ2xhc3MuZXh0ZW5kKHtcbiAgICBjb25zdHJ1Y3RvcjogU3ZnLFxuICAgIGF0dHI6IGF0dHIsXG4gICAgZWxlbTogZWxlbSxcbiAgICBwYXJlbnQ6IHBhcmVudCxcbiAgICByb290OiByb290LFxuICAgIHF1ZXJ5U2VsZWN0b3I6IHF1ZXJ5U2VsZWN0b3IsXG4gICAgcXVlcnlTZWxlY3RvckFsbDogcXVlcnlTZWxlY3RvckFsbCxcbiAgICBmb3JlaWduT2JqZWN0OiBmb3JlaWduT2JqZWN0LFxuICAgIHRleHQ6IHRleHQsXG4gICAgZW1wdHk6IGVtcHR5LFxuICAgIHJlbW92ZTogcmVtb3ZlLFxuICAgIHJlcGxhY2U6IHJlcGxhY2UsXG4gICAgYXBwZW5kOiBhcHBlbmQsXG4gICAgY2xhc3NlczogY2xhc3NlcyxcbiAgICBhZGRDbGFzczogYWRkQ2xhc3MsXG4gICAgcmVtb3ZlQ2xhc3M6IHJlbW92ZUNsYXNzLFxuICAgIHJlbW92ZUFsbENsYXNzZXM6IHJlbW92ZUFsbENsYXNzZXMsXG4gICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgd2lkdGg6IHdpZHRoLFxuICAgIGFuaW1hdGU6IGFuaW1hdGVcbiAgfSk7XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGNoZWNrcyBmb3Igc3VwcG9ydCBvZiBhIGdpdmVuIFNWRyBmZWF0dXJlIGxpa2UgRXh0ZW5zaWJpbGl0eSwgU1ZHLWFuaW1hdGlvbiBvciB0aGUgbGlrZS4gQ2hlY2sgaHR0cDovL3d3dy53My5vcmcvVFIvU1ZHMTEvZmVhdHVyZSBmb3IgYSBkZXRhaWxlZCBsaXN0LlxuICAgKlxuICAgKiBAbWVtYmVyb2YgQ2hhcnRpc3QuU3ZnXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBmZWF0dXJlIFRoZSBTVkcgMS4xIGZlYXR1cmUgdGhhdCBzaG91bGQgYmUgY2hlY2tlZCBmb3Igc3VwcG9ydC5cbiAgICogQHJldHVybiB7Qm9vbGVhbn0gVHJ1ZSBvZiBmYWxzZSBpZiB0aGUgZmVhdHVyZSBpcyBzdXBwb3J0ZWQgb3Igbm90XG4gICAqL1xuICBDaGFydGlzdC5TdmcuaXNTdXBwb3J0ZWQgPSBmdW5jdGlvbihmZWF0dXJlKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmltcGxlbWVudGF0aW9uLmhhc0ZlYXR1cmUoJ2h0dHA6Ly93d3cudzMub3JnL1RSL1NWRzExL2ZlYXR1cmUjJyArIGZlYXR1cmUsICcxLjEnKTtcbiAgfTtcblxuICAvKipcbiAgICogVGhpcyBPYmplY3QgY29udGFpbnMgc29tZSBzdGFuZGFyZCBlYXNpbmcgY3ViaWMgYmV6aWVyIGN1cnZlcy4gVGhlbiBjYW4gYmUgdXNlZCB3aXRoIHRoZWlyIG5hbWUgaW4gdGhlIGBDaGFydGlzdC5TdmcuYW5pbWF0ZWAuIFlvdSBjYW4gYWxzbyBleHRlbmQgdGhlIGxpc3QgYW5kIHVzZSB5b3VyIG93biBuYW1lIGluIHRoZSBgYW5pbWF0ZWAgZnVuY3Rpb24uIENsaWNrIHRoZSBzaG93IGNvZGUgYnV0dG9uIHRvIHNlZSB0aGUgYXZhaWxhYmxlIGJlemllciBmdW5jdGlvbnMuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBDaGFydGlzdC5TdmdcbiAgICovXG4gIHZhciBlYXNpbmdDdWJpY0JlemllcnMgPSB7XG4gICAgZWFzZUluU2luZTogWzAuNDcsIDAsIDAuNzQ1LCAwLjcxNV0sXG4gICAgZWFzZU91dFNpbmU6IFswLjM5LCAwLjU3NSwgMC41NjUsIDFdLFxuICAgIGVhc2VJbk91dFNpbmU6IFswLjQ0NSwgMC4wNSwgMC41NSwgMC45NV0sXG4gICAgZWFzZUluUXVhZDogWzAuNTUsIDAuMDg1LCAwLjY4LCAwLjUzXSxcbiAgICBlYXNlT3V0UXVhZDogWzAuMjUsIDAuNDYsIDAuNDUsIDAuOTRdLFxuICAgIGVhc2VJbk91dFF1YWQ6IFswLjQ1NSwgMC4wMywgMC41MTUsIDAuOTU1XSxcbiAgICBlYXNlSW5DdWJpYzogWzAuNTUsIDAuMDU1LCAwLjY3NSwgMC4xOV0sXG4gICAgZWFzZU91dEN1YmljOiBbMC4yMTUsIDAuNjEsIDAuMzU1LCAxXSxcbiAgICBlYXNlSW5PdXRDdWJpYzogWzAuNjQ1LCAwLjA0NSwgMC4zNTUsIDFdLFxuICAgIGVhc2VJblF1YXJ0OiBbMC44OTUsIDAuMDMsIDAuNjg1LCAwLjIyXSxcbiAgICBlYXNlT3V0UXVhcnQ6IFswLjE2NSwgMC44NCwgMC40NCwgMV0sXG4gICAgZWFzZUluT3V0UXVhcnQ6IFswLjc3LCAwLCAwLjE3NSwgMV0sXG4gICAgZWFzZUluUXVpbnQ6IFswLjc1NSwgMC4wNSwgMC44NTUsIDAuMDZdLFxuICAgIGVhc2VPdXRRdWludDogWzAuMjMsIDEsIDAuMzIsIDFdLFxuICAgIGVhc2VJbk91dFF1aW50OiBbMC44NiwgMCwgMC4wNywgMV0sXG4gICAgZWFzZUluRXhwbzogWzAuOTUsIDAuMDUsIDAuNzk1LCAwLjAzNV0sXG4gICAgZWFzZU91dEV4cG86IFswLjE5LCAxLCAwLjIyLCAxXSxcbiAgICBlYXNlSW5PdXRFeHBvOiBbMSwgMCwgMCwgMV0sXG4gICAgZWFzZUluQ2lyYzogWzAuNiwgMC4wNCwgMC45OCwgMC4zMzVdLFxuICAgIGVhc2VPdXRDaXJjOiBbMC4wNzUsIDAuODIsIDAuMTY1LCAxXSxcbiAgICBlYXNlSW5PdXRDaXJjOiBbMC43ODUsIDAuMTM1LCAwLjE1LCAwLjg2XSxcbiAgICBlYXNlSW5CYWNrOiBbMC42LCAtMC4yOCwgMC43MzUsIDAuMDQ1XSxcbiAgICBlYXNlT3V0QmFjazogWzAuMTc1LCAwLjg4NSwgMC4zMiwgMS4yNzVdLFxuICAgIGVhc2VJbk91dEJhY2s6IFswLjY4LCAtMC41NSwgMC4yNjUsIDEuNTVdXG4gIH07XG5cbiAgQ2hhcnRpc3QuU3ZnLkVhc2luZyA9IGVhc2luZ0N1YmljQmV6aWVycztcblxuICAvKipcbiAgICogVGhpcyBoZWxwZXIgY2xhc3MgaXMgdG8gd3JhcCBtdWx0aXBsZSBgQ2hhcnRpc3QuU3ZnYCBlbGVtZW50cyBpbnRvIGEgbGlzdCB3aGVyZSB5b3UgY2FuIGNhbGwgdGhlIGBDaGFydGlzdC5TdmdgIGZ1bmN0aW9ucyBvbiBhbGwgZWxlbWVudHMgaW4gdGhlIGxpc3Qgd2l0aCBvbmUgY2FsbC4gVGhpcyBpcyBoZWxwZnVsIHdoZW4geW91J2QgbGlrZSB0byBwZXJmb3JtIGNhbGxzIHdpdGggYENoYXJ0aXN0LlN2Z2Agb24gbXVsdGlwbGUgZWxlbWVudHMuXG4gICAqIEFuIGluc3RhbmNlIG9mIHRoaXMgY2xhc3MgaXMgYWxzbyByZXR1cm5lZCBieSBgQ2hhcnRpc3QuU3ZnLnF1ZXJ5U2VsZWN0b3JBbGxgLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgQ2hhcnRpc3QuU3ZnXG4gICAqIEBwYXJhbSB7QXJyYXk8Tm9kZT58Tm9kZUxpc3R9IG5vZGVMaXN0IEFuIEFycmF5IG9mIFNWRyBET00gbm9kZXMgb3IgYSBTVkcgRE9NIE5vZGVMaXN0IChhcyByZXR1cm5lZCBieSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKVxuICAgKiBAY29uc3RydWN0b3JcbiAgICovXG4gIGZ1bmN0aW9uIFN2Z0xpc3Qobm9kZUxpc3QpIHtcbiAgICB2YXIgbGlzdCA9IHRoaXM7XG5cbiAgICB0aGlzLnN2Z0VsZW1lbnRzID0gW107XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IG5vZGVMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLnN2Z0VsZW1lbnRzLnB1c2gobmV3IENoYXJ0aXN0LlN2Zyhub2RlTGlzdFtpXSkpO1xuICAgIH1cblxuICAgIC8vIEFkZCBkZWxlZ2F0aW9uIG1ldGhvZHMgZm9yIENoYXJ0aXN0LlN2Z1xuICAgIE9iamVjdC5rZXlzKENoYXJ0aXN0LlN2Zy5wcm90b3R5cGUpLmZpbHRlcihmdW5jdGlvbihwcm90b3R5cGVQcm9wZXJ0eSkge1xuICAgICAgcmV0dXJuIFsnY29uc3RydWN0b3InLFxuICAgICAgICAgICdwYXJlbnQnLFxuICAgICAgICAgICdxdWVyeVNlbGVjdG9yJyxcbiAgICAgICAgICAncXVlcnlTZWxlY3RvckFsbCcsXG4gICAgICAgICAgJ3JlcGxhY2UnLFxuICAgICAgICAgICdhcHBlbmQnLFxuICAgICAgICAgICdjbGFzc2VzJyxcbiAgICAgICAgICAnaGVpZ2h0JyxcbiAgICAgICAgICAnd2lkdGgnXS5pbmRleE9mKHByb3RvdHlwZVByb3BlcnR5KSA9PT0gLTE7XG4gICAgfSkuZm9yRWFjaChmdW5jdGlvbihwcm90b3R5cGVQcm9wZXJ0eSkge1xuICAgICAgbGlzdFtwcm90b3R5cGVQcm9wZXJ0eV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICAgICAgICBsaXN0LnN2Z0VsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAgIENoYXJ0aXN0LlN2Zy5wcm90b3R5cGVbcHJvdG90eXBlUHJvcGVydHldLmFwcGx5KGVsZW1lbnQsIGFyZ3MpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGxpc3Q7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgQ2hhcnRpc3QuU3ZnLkxpc3QgPSBDaGFydGlzdC5DbGFzcy5leHRlbmQoe1xuICAgIGNvbnN0cnVjdG9yOiBTdmdMaXN0XG4gIH0pO1xufSh3aW5kb3csIGRvY3VtZW50LCBDaGFydGlzdCkpO1xuOy8qKlxuICogQ2hhcnRpc3QgU1ZHIHBhdGggbW9kdWxlIGZvciBTVkcgcGF0aCBkZXNjcmlwdGlvbiBjcmVhdGlvbiBhbmQgbW9kaWZpY2F0aW9uLlxuICpcbiAqIEBtb2R1bGUgQ2hhcnRpc3QuU3ZnLlBhdGhcbiAqL1xuLyogZ2xvYmFsIENoYXJ0aXN0ICovXG4oZnVuY3Rpb24od2luZG93LCBkb2N1bWVudCwgQ2hhcnRpc3QpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIC8qKlxuICAgKiBDb250YWlucyB0aGUgZGVzY3JpcHRvcnMgb2Ygc3VwcG9ydGVkIGVsZW1lbnQgdHlwZXMgaW4gYSBTVkcgcGF0aC4gQ3VycmVudGx5IG9ubHkgbW92ZSwgbGluZSBhbmQgY3VydmUgYXJlIHN1cHBvcnRlZC5cbiAgICpcbiAgICogQG1lbWJlcm9mIENoYXJ0aXN0LlN2Zy5QYXRoXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqL1xuICB2YXIgZWxlbWVudERlc2NyaXB0aW9ucyA9IHtcbiAgICBtOiBbJ3gnLCAneSddLFxuICAgIGw6IFsneCcsICd5J10sXG4gICAgYzogWyd4MScsICd5MScsICd4MicsICd5MicsICd4JywgJ3knXSxcbiAgICBhOiBbJ3J4JywgJ3J5JywgJ3hBcicsICdsQWYnLCAnc2YnLCAneCcsICd5J11cbiAgfTtcblxuICAvKipcbiAgICogRGVmYXVsdCBvcHRpb25zIGZvciBuZXdseSBjcmVhdGVkIFNWRyBwYXRoIG9iamVjdHMuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBDaGFydGlzdC5TdmcuUGF0aFxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cbiAgdmFyIGRlZmF1bHRPcHRpb25zID0ge1xuICAgIC8vIFRoZSBhY2N1cmFjeSBpbiBkaWdpdCBjb3VudCBhZnRlciB0aGUgZGVjaW1hbCBwb2ludC4gVGhpcyB3aWxsIGJlIHVzZWQgdG8gcm91bmQgbnVtYmVycyBpbiB0aGUgU1ZHIHBhdGguIElmIHRoaXMgb3B0aW9uIGlzIHNldCB0byBmYWxzZSB0aGVuIG5vIHJvdW5kaW5nIHdpbGwgYmUgcGVyZm9ybWVkLlxuICAgIGFjY3VyYWN5OiAzXG4gIH07XG5cbiAgZnVuY3Rpb24gZWxlbWVudChjb21tYW5kLCBwYXJhbXMsIHBhdGhFbGVtZW50cywgcG9zLCByZWxhdGl2ZSwgZGF0YSkge1xuICAgIHZhciBwYXRoRWxlbWVudCA9IENoYXJ0aXN0LmV4dGVuZCh7XG4gICAgICBjb21tYW5kOiByZWxhdGl2ZSA/IGNvbW1hbmQudG9Mb3dlckNhc2UoKSA6IGNvbW1hbmQudG9VcHBlckNhc2UoKVxuICAgIH0sIHBhcmFtcywgZGF0YSA/IHsgZGF0YTogZGF0YSB9IDoge30gKTtcblxuICAgIHBhdGhFbGVtZW50cy5zcGxpY2UocG9zLCAwLCBwYXRoRWxlbWVudCk7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JFYWNoUGFyYW0ocGF0aEVsZW1lbnRzLCBjYikge1xuICAgIHBhdGhFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uKHBhdGhFbGVtZW50LCBwYXRoRWxlbWVudEluZGV4KSB7XG4gICAgICBlbGVtZW50RGVzY3JpcHRpb25zW3BhdGhFbGVtZW50LmNvbW1hbmQudG9Mb3dlckNhc2UoKV0uZm9yRWFjaChmdW5jdGlvbihwYXJhbU5hbWUsIHBhcmFtSW5kZXgpIHtcbiAgICAgICAgY2IocGF0aEVsZW1lbnQsIHBhcmFtTmFtZSwgcGF0aEVsZW1lbnRJbmRleCwgcGFyYW1JbmRleCwgcGF0aEVsZW1lbnRzKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gY29uc3RydWN0IGEgbmV3IHBhdGggb2JqZWN0LlxuICAgKlxuICAgKiBAbWVtYmVyb2YgQ2hhcnRpc3QuU3ZnLlBhdGhcbiAgICogQHBhcmFtIHtCb29sZWFufSBjbG9zZSBJZiBzZXQgdG8gdHJ1ZSB0aGVuIHRoaXMgcGF0aCB3aWxsIGJlIGNsb3NlZCB3aGVuIHN0cmluZ2lmaWVkICh3aXRoIGEgWiBhdCB0aGUgZW5kKVxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBPcHRpb25zIG9iamVjdCB0aGF0IG92ZXJyaWRlcyB0aGUgZGVmYXVsdCBvYmplY3RzLiBTZWUgZGVmYXVsdCBvcHRpb25zIGZvciBtb3JlIGRldGFpbHMuXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKi9cbiAgZnVuY3Rpb24gU3ZnUGF0aChjbG9zZSwgb3B0aW9ucykge1xuICAgIHRoaXMucGF0aEVsZW1lbnRzID0gW107XG4gICAgdGhpcy5wb3MgPSAwO1xuICAgIHRoaXMuY2xvc2UgPSBjbG9zZTtcbiAgICB0aGlzLm9wdGlvbnMgPSBDaGFydGlzdC5leHRlbmQoe30sIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIG9yIHNldHMgdGhlIGN1cnJlbnQgcG9zaXRpb24gKGN1cnNvcikgaW5zaWRlIG9mIHRoZSBwYXRoLiBZb3UgY2FuIG1vdmUgYXJvdW5kIHRoZSBjdXJzb3IgZnJlZWx5IGJ1dCBsaW1pdGVkIHRvIDAgb3IgdGhlIGNvdW50IG9mIGV4aXN0aW5nIGVsZW1lbnRzLiBBbGwgbW9kaWZpY2F0aW9ucyB3aXRoIGVsZW1lbnQgZnVuY3Rpb25zIHdpbGwgaW5zZXJ0IG5ldyBlbGVtZW50cyBhdCB0aGUgcG9zaXRpb24gb2YgdGhpcyBjdXJzb3IuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBDaGFydGlzdC5TdmcuUGF0aFxuICAgKiBAcGFyYW0ge051bWJlcn0gW3Bvc10gSWYgYSBudW1iZXIgaXMgcGFzc2VkIHRoZW4gdGhlIGN1cnNvciBpcyBzZXQgdG8gdGhpcyBwb3NpdGlvbiBpbiB0aGUgcGF0aCBlbGVtZW50IGFycmF5LlxuICAgKiBAcmV0dXJuIHtDaGFydGlzdC5TdmcuUGF0aHxOdW1iZXJ9IElmIHRoZSBwb3NpdGlvbiBwYXJhbWV0ZXIgd2FzIHBhc3NlZCB0aGVuIHRoZSByZXR1cm4gdmFsdWUgd2lsbCBiZSB0aGUgcGF0aCBvYmplY3QgZm9yIGVhc3kgY2FsbCBjaGFpbmluZy4gSWYgbm8gcG9zaXRpb24gcGFyYW1ldGVyIHdhcyBwYXNzZWQgdGhlbiB0aGUgY3VycmVudCBwb3NpdGlvbiBpcyByZXR1cm5lZC5cbiAgICovXG4gIGZ1bmN0aW9uIHBvc2l0aW9uKHBvcykge1xuICAgIGlmKHBvcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnBvcyA9IE1hdGgubWF4KDAsIE1hdGgubWluKHRoaXMucGF0aEVsZW1lbnRzLmxlbmd0aCwgcG9zKSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMucG9zO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGVsZW1lbnRzIGZyb20gdGhlIHBhdGggc3RhcnRpbmcgYXQgdGhlIGN1cnJlbnQgcG9zaXRpb24uXG4gICAqXG4gICAqIEBtZW1iZXJvZiBDaGFydGlzdC5TdmcuUGF0aFxuICAgKiBAcGFyYW0ge051bWJlcn0gY291bnQgTnVtYmVyIG9mIHBhdGggZWxlbWVudHMgdGhhdCBzaG91bGQgYmUgcmVtb3ZlZCBmcm9tIHRoZSBjdXJyZW50IHBvc2l0aW9uLlxuICAgKiBAcmV0dXJuIHtDaGFydGlzdC5TdmcuUGF0aH0gVGhlIGN1cnJlbnQgcGF0aCBvYmplY3QgZm9yIGVhc3kgY2FsbCBjaGFpbmluZy5cbiAgICovXG4gIGZ1bmN0aW9uIHJlbW92ZShjb3VudCkge1xuICAgIHRoaXMucGF0aEVsZW1lbnRzLnNwbGljZSh0aGlzLnBvcywgY291bnQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZSB0aGlzIGZ1bmN0aW9uIHRvIGFkZCBhIG5ldyBtb3ZlIFNWRyBwYXRoIGVsZW1lbnQuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBDaGFydGlzdC5TdmcuUGF0aFxuICAgKiBAcGFyYW0ge051bWJlcn0geCBUaGUgeCBjb29yZGluYXRlIGZvciB0aGUgbW92ZSBlbGVtZW50LlxuICAgKiBAcGFyYW0ge051bWJlcn0geSBUaGUgeSBjb29yZGluYXRlIGZvciB0aGUgbW92ZSBlbGVtZW50LlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtyZWxhdGl2ZV0gSWYgc2V0IHRvIHRydWUgdGhlIG1vdmUgZWxlbWVudCB3aWxsIGJlIGNyZWF0ZWQgd2l0aCByZWxhdGl2ZSBjb29yZGluYXRlcyAobG93ZXJjYXNlIGxldHRlcilcbiAgICogQHBhcmFtIHsqfSBbZGF0YV0gQW55IGRhdGEgdGhhdCBzaG91bGQgYmUgc3RvcmVkIHdpdGggdGhlIGVsZW1lbnQgb2JqZWN0IHRoYXQgd2lsbCBiZSBhY2Nlc3NpYmxlIGluIHBhdGhFbGVtZW50XG4gICAqIEByZXR1cm4ge0NoYXJ0aXN0LlN2Zy5QYXRofSBUaGUgY3VycmVudCBwYXRoIG9iamVjdCBmb3IgZWFzeSBjYWxsIGNoYWluaW5nLlxuICAgKi9cbiAgZnVuY3Rpb24gbW92ZSh4LCB5LCByZWxhdGl2ZSwgZGF0YSkge1xuICAgIGVsZW1lbnQoJ00nLCB7XG4gICAgICB4OiAreCxcbiAgICAgIHk6ICt5XG4gICAgfSwgdGhpcy5wYXRoRWxlbWVudHMsIHRoaXMucG9zKyssIHJlbGF0aXZlLCBkYXRhKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2UgdGhpcyBmdW5jdGlvbiB0byBhZGQgYSBuZXcgbGluZSBTVkcgcGF0aCBlbGVtZW50LlxuICAgKlxuICAgKiBAbWVtYmVyb2YgQ2hhcnRpc3QuU3ZnLlBhdGhcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHggVGhlIHggY29vcmRpbmF0ZSBmb3IgdGhlIGxpbmUgZWxlbWVudC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHkgVGhlIHkgY29vcmRpbmF0ZSBmb3IgdGhlIGxpbmUgZWxlbWVudC5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbcmVsYXRpdmVdIElmIHNldCB0byB0cnVlIHRoZSBsaW5lIGVsZW1lbnQgd2lsbCBiZSBjcmVhdGVkIHdpdGggcmVsYXRpdmUgY29vcmRpbmF0ZXMgKGxvd2VyY2FzZSBsZXR0ZXIpXG4gICAqIEBwYXJhbSB7Kn0gW2RhdGFdIEFueSBkYXRhIHRoYXQgc2hvdWxkIGJlIHN0b3JlZCB3aXRoIHRoZSBlbGVtZW50IG9iamVjdCB0aGF0IHdpbGwgYmUgYWNjZXNzaWJsZSBpbiBwYXRoRWxlbWVudFxuICAgKiBAcmV0dXJuIHtDaGFydGlzdC5TdmcuUGF0aH0gVGhlIGN1cnJlbnQgcGF0aCBvYmplY3QgZm9yIGVhc3kgY2FsbCBjaGFpbmluZy5cbiAgICovXG4gIGZ1bmN0aW9uIGxpbmUoeCwgeSwgcmVsYXRpdmUsIGRhdGEpIHtcbiAgICBlbGVtZW50KCdMJywge1xuICAgICAgeDogK3gsXG4gICAgICB5OiAreVxuICAgIH0sIHRoaXMucGF0aEVsZW1lbnRzLCB0aGlzLnBvcysrLCByZWxhdGl2ZSwgZGF0YSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogVXNlIHRoaXMgZnVuY3Rpb24gdG8gYWRkIGEgbmV3IGN1cnZlIFNWRyBwYXRoIGVsZW1lbnQuXG4gICAqXG4gICAqIEBtZW1iZXJvZiBDaGFydGlzdC5TdmcuUGF0aFxuICAgKiBAcGFyYW0ge051bWJlcn0geDEgVGhlIHggY29vcmRpbmF0ZSBmb3IgdGhlIGZpcnN0IGNvbnRyb2wgcG9pbnQgb2YgdGhlIGJlemllciBjdXJ2ZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHkxIFRoZSB5IGNvb3JkaW5hdGUgZm9yIHRoZSBmaXJzdCBjb250cm9sIHBvaW50IG9mIHRoZSBiZXppZXIgY3VydmUuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB4MiBUaGUgeCBjb29yZGluYXRlIGZvciB0aGUgc2Vjb25kIGNvbnRyb2wgcG9pbnQgb2YgdGhlIGJlemllciBjdXJ2ZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHkyIFRoZSB5IGNvb3JkaW5hdGUgZm9yIHRoZSBzZWNvbmQgY29udHJvbCBwb2ludCBvZiB0aGUgYmV6aWVyIGN1cnZlLlxuICAgKiBAcGFyYW0ge051bWJlcn0geCBUaGUgeCBjb29yZGluYXRlIGZvciB0aGUgdGFyZ2V0IHBvaW50IG9mIHRoZSBjdXJ2ZSBlbGVtZW50LlxuICAgKiBAcGFyYW0ge051bWJlcn0geSBUaGUgeSBjb29yZGluYXRlIGZvciB0aGUgdGFyZ2V0IHBvaW50IG9mIHRoZSBjdXJ2ZSBlbGVtZW50LlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtyZWxhdGl2ZV0gSWYgc2V0IHRvIHRydWUgdGhlIGN1cnZlIGVsZW1lbnQgd2lsbCBiZSBjcmVhdGVkIHdpdGggcmVsYXRpdmUgY29vcmRpbmF0ZXMgKGxvd2VyY2FzZSBsZXR0ZXIpXG4gICAqIEBwYXJhbSB7Kn0gW2RhdGFdIEFueSBkYXRhIHRoYXQgc2hvdWxkIGJlIHN0b3JlZCB3aXRoIHRoZSBlbGVtZW50IG9iamVjdCB0aGF0IHdpbGwgYmUgYWNjZXNzaWJsZSBpbiBwYXRoRWxlbWVudFxuICAgKiBAcmV0dXJuIHtDaGFydGlzdC5TdmcuUGF0aH0gVGhlIGN1cnJlbnQgcGF0aCBvYmplY3QgZm9yIGVhc3kgY2FsbCBjaGFpbmluZy5cbiAgICovXG4gIGZ1bmN0aW9uIGN1cnZlKHgxLCB5MSwgeDIsIHkyLCB4LCB5LCByZWxhdGl2ZSwgZGF0YSkge1xuICAgIGVsZW1lbnQoJ0MnLCB7XG4gICAgICB4MTogK3gxLFxuICAgICAgeTE6ICt5MSxcbiAgICAgIHgyOiAreDIsXG4gICAgICB5MjogK3kyLFxuICAgICAgeDogK3gsXG4gICAgICB5OiAreVxuICAgIH0sIHRoaXMucGF0aEVsZW1lbnRzLCB0aGlzLnBvcysrLCByZWxhdGl2ZSwgZGF0YSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogVXNlIHRoaXMgZnVuY3Rpb24gdG8gYWRkIGEgbmV3IG5vbi1iZXppZXIgY3VydmUgU1ZHIHBhdGggZWxlbWVudC5cbiAgICpcbiAgICogQG1lbWJlcm9mIENoYXJ0aXN0LlN2Zy5QYXRoXG4gICAqIEBwYXJhbSB7TnVtYmVyfSByeCBUaGUgcmFkaXVzIHRvIGJlIHVzZWQgZm9yIHRoZSB4LWF4aXMgb2YgdGhlIGFyYy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHJ5IFRoZSByYWRpdXMgdG8gYmUgdXNlZCBmb3IgdGhlIHktYXhpcyBvZiB0aGUgYXJjLlxuICAgKiBAcGFyYW0ge051bWJlcn0geEFyIERlZmluZXMgdGhlIG9yaWVudGF0aW9uIG9mIHRoZSBhcmNcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGxBZiBMYXJnZSBhcmMgZmxhZ1xuICAgKiBAcGFyYW0ge051bWJlcn0gc2YgU3dlZXAgZmxhZ1xuICAgKiBAcGFyYW0ge051bWJlcn0geCBUaGUgeCBjb29yZGluYXRlIGZvciB0aGUgdGFyZ2V0IHBvaW50IG9mIHRoZSBjdXJ2ZSBlbGVtZW50LlxuICAgKiBAcGFyYW0ge051bWJlcn0geSBUaGUgeSBjb29yZGluYXRlIGZvciB0aGUgdGFyZ2V0IHBvaW50IG9mIHRoZSBjdXJ2ZSBlbGVtZW50LlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtyZWxhdGl2ZV0gSWYgc2V0IHRvIHRydWUgdGhlIGN1cnZlIGVsZW1lbnQgd2lsbCBiZSBjcmVhdGVkIHdpdGggcmVsYXRpdmUgY29vcmRpbmF0ZXMgKGxvd2VyY2FzZSBsZXR0ZXIpXG4gICAqIEBwYXJhbSB7Kn0gW2RhdGFdIEFueSBkYXRhIHRoYXQgc2hvdWxkIGJlIHN0b3JlZCB3aXRoIHRoZSBlbGVtZW50IG9iamVjdCB0aGF0IHdpbGwgYmUgYWNjZXNzaWJsZSBpbiBwYXRoRWxlbWVudFxuICAgKiBAcmV0dXJuIHtDaGFydGlzdC5TdmcuUGF0aH0gVGhlIGN1cnJlbnQgcGF0aCBvYmplY3QgZm9yIGVhc3kgY2FsbCBjaGFpbmluZy5cbiAgICovXG4gIGZ1bmN0aW9uIGFyYyhyeCwgcnksIHhBciwgbEFmLCBzZiwgeCwgeSwgcmVsYXRpdmUsIGRhdGEpIHtcbiAgICBlbGVtZW50KCdBJywge1xuICAgICAgcng6ICtyeCxcbiAgICAgIHJ5OiArcnksXG4gICAgICB4QXI6ICt4QXIsXG4gICAgICBsQWY6ICtsQWYsXG4gICAgICBzZjogK3NmLFxuICAgICAgeDogK3gsXG4gICAgICB5OiAreVxuICAgIH0sIHRoaXMucGF0aEVsZW1lbnRzLCB0aGlzLnBvcysrLCByZWxhdGl2ZSwgZGF0YSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogUGFyc2VzIGFuIFNWRyBwYXRoIHNlZW4gaW4gdGhlIGQgYXR0cmlidXRlIG9mIHBhdGggZWxlbWVudHMsIGFuZCBpbnNlcnRzIHRoZSBwYXJzZWQgZWxlbWVudHMgaW50byB0aGUgZXhpc3RpbmcgcGF0aCBvYmplY3QgYXQgdGhlIGN1cnJlbnQgY3Vyc29yIHBvc2l0aW9uLiBBbnkgY2xvc2luZyBwYXRoIGluZGljYXRvcnMgKFogYXQgdGhlIGVuZCBvZiB0aGUgcGF0aCkgd2lsbCBiZSBpZ25vcmVkIGJ5IHRoZSBwYXJzZXIgYXMgdGhpcyBpcyBwcm92aWRlZCBieSB0aGUgY2xvc2Ugb3B0aW9uIGluIHRoZSBvcHRpb25zIG9mIHRoZSBwYXRoIG9iamVjdC5cbiAgICpcbiAgICogQG1lbWJlcm9mIENoYXJ0aXN0LlN2Zy5QYXRoXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoIEFueSBTVkcgcGF0aCB0aGF0IGNvbnRhaW5zIG1vdmUgKG0pLCBsaW5lIChsKSBvciBjdXJ2ZSAoYykgY29tcG9uZW50cy5cbiAgICogQHJldHVybiB7Q2hhcnRpc3QuU3ZnLlBhdGh9IFRoZSBjdXJyZW50IHBhdGggb2JqZWN0IGZvciBlYXN5IGNhbGwgY2hhaW5pbmcuXG4gICAqL1xuICBmdW5jdGlvbiBwYXJzZShwYXRoKSB7XG4gICAgLy8gUGFyc2luZyB0aGUgU1ZHIHBhdGggc3RyaW5nIGludG8gYW4gYXJyYXkgb2YgYXJyYXlzIFtbJ00nLCAnMTAnLCAnMTAnXSwgWydMJywgJzEwMCcsICcxMDAnXV1cbiAgICB2YXIgY2h1bmtzID0gcGF0aC5yZXBsYWNlKC8oW0EtWmEtel0pKFswLTldKS9nLCAnJDEgJDInKVxuICAgICAgLnJlcGxhY2UoLyhbMC05XSkoW0EtWmEtel0pL2csICckMSAkMicpXG4gICAgICAuc3BsaXQoL1tcXHMsXSsvKVxuICAgICAgLnJlZHVjZShmdW5jdGlvbihyZXN1bHQsIGVsZW1lbnQpIHtcbiAgICAgICAgaWYoZWxlbWVudC5tYXRjaCgvW0EtWmEtel0vKSkge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKFtdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV0ucHVzaChlbGVtZW50KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH0sIFtdKTtcblxuICAgIC8vIElmIHRoaXMgaXMgYSBjbG9zZWQgcGF0aCB3ZSByZW1vdmUgdGhlIFogYXQgdGhlIGVuZCBiZWNhdXNlIHRoaXMgaXMgZGV0ZXJtaW5lZCBieSB0aGUgY2xvc2Ugb3B0aW9uXG4gICAgaWYoY2h1bmtzW2NodW5rcy5sZW5ndGggLSAxXVswXS50b1VwcGVyQ2FzZSgpID09PSAnWicpIHtcbiAgICAgIGNodW5rcy5wb3AoKTtcbiAgICB9XG5cbiAgICAvLyBVc2luZyBzdmdQYXRoRWxlbWVudERlc2NyaXB0aW9ucyB0byBtYXAgcmF3IHBhdGggYXJyYXlzIGludG8gb2JqZWN0cyB0aGF0IGNvbnRhaW4gdGhlIGNvbW1hbmQgYW5kIHRoZSBwYXJhbWV0ZXJzXG4gICAgLy8gRm9yIGV4YW1wbGUge2NvbW1hbmQ6ICdNJywgeDogJzEwJywgeTogJzEwJ31cbiAgICB2YXIgZWxlbWVudHMgPSBjaHVua3MubWFwKGZ1bmN0aW9uKGNodW5rKSB7XG4gICAgICAgIHZhciBjb21tYW5kID0gY2h1bmsuc2hpZnQoKSxcbiAgICAgICAgICBkZXNjcmlwdGlvbiA9IGVsZW1lbnREZXNjcmlwdGlvbnNbY29tbWFuZC50b0xvd2VyQ2FzZSgpXTtcblxuICAgICAgICByZXR1cm4gQ2hhcnRpc3QuZXh0ZW5kKHtcbiAgICAgICAgICBjb21tYW5kOiBjb21tYW5kXG4gICAgICAgIH0sIGRlc2NyaXB0aW9uLnJlZHVjZShmdW5jdGlvbihyZXN1bHQsIHBhcmFtTmFtZSwgaW5kZXgpIHtcbiAgICAgICAgICByZXN1bHRbcGFyYW1OYW1lXSA9ICtjaHVua1tpbmRleF07XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSwge30pKTtcbiAgICAgIH0pO1xuXG4gICAgLy8gUHJlcGFyaW5nIGEgc3BsaWNlIGNhbGwgd2l0aCB0aGUgZWxlbWVudHMgYXJyYXkgYXMgdmFyIGFyZyBwYXJhbXMgYW5kIGluc2VydCB0aGUgcGFyc2VkIGVsZW1lbnRzIGF0IHRoZSBjdXJyZW50IHBvc2l0aW9uXG4gICAgdmFyIHNwbGljZUFyZ3MgPSBbdGhpcy5wb3MsIDBdO1xuICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KHNwbGljZUFyZ3MsIGVsZW1lbnRzKTtcbiAgICBBcnJheS5wcm90b3R5cGUuc3BsaWNlLmFwcGx5KHRoaXMucGF0aEVsZW1lbnRzLCBzcGxpY2VBcmdzKTtcbiAgICAvLyBJbmNyZWFzZSB0aGUgaW50ZXJuYWwgcG9zaXRpb24gYnkgdGhlIGVsZW1lbnQgY291bnRcbiAgICB0aGlzLnBvcyArPSBlbGVtZW50cy5sZW5ndGg7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIHJlbmRlcnMgdG8gY3VycmVudCBTVkcgcGF0aCBvYmplY3QgaW50byBhIGZpbmFsIFNWRyBzdHJpbmcgdGhhdCBjYW4gYmUgdXNlZCBpbiB0aGUgZCBhdHRyaWJ1dGUgb2YgU1ZHIHBhdGggZWxlbWVudHMuIEl0IHVzZXMgdGhlIGFjY3VyYWN5IG9wdGlvbiB0byByb3VuZCBiaWcgZGVjaW1hbHMuIElmIHRoZSBjbG9zZSBwYXJhbWV0ZXIgd2FzIHNldCBpbiB0aGUgY29uc3RydWN0b3Igb2YgdGhpcyBwYXRoIG9iamVjdCB0aGVuIGEgcGF0aCBjbG9zaW5nIFogd2lsbCBiZSBhcHBlbmRlZCB0byB0aGUgb3V0cHV0IHN0cmluZy5cbiAgICpcbiAgICogQG1lbWJlcm9mIENoYXJ0aXN0LlN2Zy5QYXRoXG4gICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIHN0cmluZ2lmeSgpIHtcbiAgICB2YXIgYWNjdXJhY3lNdWx0aXBsaWVyID0gTWF0aC5wb3coMTAsIHRoaXMub3B0aW9ucy5hY2N1cmFjeSk7XG5cbiAgICByZXR1cm4gdGhpcy5wYXRoRWxlbWVudHMucmVkdWNlKGZ1bmN0aW9uKHBhdGgsIHBhdGhFbGVtZW50KSB7XG4gICAgICAgIHZhciBwYXJhbXMgPSBlbGVtZW50RGVzY3JpcHRpb25zW3BhdGhFbGVtZW50LmNvbW1hbmQudG9Mb3dlckNhc2UoKV0ubWFwKGZ1bmN0aW9uKHBhcmFtTmFtZSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuYWNjdXJhY3kgP1xuICAgICAgICAgICAgKE1hdGgucm91bmQocGF0aEVsZW1lbnRbcGFyYW1OYW1lXSAqIGFjY3VyYWN5TXVsdGlwbGllcikgLyBhY2N1cmFjeU11bHRpcGxpZXIpIDpcbiAgICAgICAgICAgIHBhdGhFbGVtZW50W3BhcmFtTmFtZV07XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICAgICAgcmV0dXJuIHBhdGggKyBwYXRoRWxlbWVudC5jb21tYW5kICsgcGFyYW1zLmpvaW4oJywnKTtcbiAgICAgIH0uYmluZCh0aGlzKSwgJycpICsgKHRoaXMuY2xvc2UgPyAnWicgOiAnJyk7XG4gIH1cblxuICAvKipcbiAgICogU2NhbGVzIGFsbCBlbGVtZW50cyBpbiB0aGUgY3VycmVudCBTVkcgcGF0aCBvYmplY3QuIFRoZXJlIGlzIGFuIGluZGl2aWR1YWwgcGFyYW1ldGVyIGZvciBlYWNoIGNvb3JkaW5hdGUuIFNjYWxpbmcgd2lsbCBhbHNvIGJlIGRvbmUgZm9yIGNvbnRyb2wgcG9pbnRzIG9mIGN1cnZlcywgYWZmZWN0aW5nIHRoZSBnaXZlbiBjb29yZGluYXRlLlxuICAgKlxuICAgKiBAbWVtYmVyb2YgQ2hhcnRpc3QuU3ZnLlBhdGhcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHggVGhlIG51bWJlciB3aGljaCB3aWxsIGJlIHVzZWQgdG8gc2NhbGUgdGhlIHgsIHgxIGFuZCB4MiBvZiBhbGwgcGF0aCBlbGVtZW50cy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHkgVGhlIG51bWJlciB3aGljaCB3aWxsIGJlIHVzZWQgdG8gc2NhbGUgdGhlIHksIHkxIGFuZCB5MiBvZiBhbGwgcGF0aCBlbGVtZW50cy5cbiAgICogQHJldHVybiB7Q2hhcnRpc3QuU3ZnLlBhdGh9IFRoZSBjdXJyZW50IHBhdGggb2JqZWN0IGZvciBlYXN5IGNhbGwgY2hhaW5pbmcuXG4gICAqL1xuICBmdW5jdGlvbiBzY2FsZSh4LCB5KSB7XG4gICAgZm9yRWFjaFBhcmFtKHRoaXMucGF0aEVsZW1lbnRzLCBmdW5jdGlvbihwYXRoRWxlbWVudCwgcGFyYW1OYW1lKSB7XG4gICAgICBwYXRoRWxlbWVudFtwYXJhbU5hbWVdICo9IHBhcmFtTmFtZVswXSA9PT0gJ3gnID8geCA6IHk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogVHJhbnNsYXRlcyBhbGwgZWxlbWVudHMgaW4gdGhlIGN1cnJlbnQgU1ZHIHBhdGggb2JqZWN0LiBUaGUgdHJhbnNsYXRpb24gaXMgcmVsYXRpdmUgYW5kIHRoZXJlIGlzIGFuIGluZGl2aWR1YWwgcGFyYW1ldGVyIGZvciBlYWNoIGNvb3JkaW5hdGUuIFRyYW5zbGF0aW9uIHdpbGwgYWxzbyBiZSBkb25lIGZvciBjb250cm9sIHBvaW50cyBvZiBjdXJ2ZXMsIGFmZmVjdGluZyB0aGUgZ2l2ZW4gY29vcmRpbmF0ZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIENoYXJ0aXN0LlN2Zy5QYXRoXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB4IFRoZSBudW1iZXIgd2hpY2ggd2lsbCBiZSB1c2VkIHRvIHRyYW5zbGF0ZSB0aGUgeCwgeDEgYW5kIHgyIG9mIGFsbCBwYXRoIGVsZW1lbnRzLlxuICAgKiBAcGFyYW0ge051bWJlcn0geSBUaGUgbnVtYmVyIHdoaWNoIHdpbGwgYmUgdXNlZCB0byB0cmFuc2xhdGUgdGhlIHksIHkxIGFuZCB5MiBvZiBhbGwgcGF0aCBlbGVtZW50cy5cbiAgICogQHJldHVybiB7Q2hhcnRpc3QuU3ZnLlBhdGh9IFRoZSBjdXJyZW50IHBhdGggb2JqZWN0IGZvciBlYXN5IGNhbGwgY2hhaW5pbmcuXG4gICAqL1xuICBmdW5jdGlvbiB0cmFuc2xhdGUoeCwgeSkge1xuICAgIGZvckVhY2hQYXJhbSh0aGlzLnBhdGhFbGVtZW50cywgZnVuY3Rpb24ocGF0aEVsZW1lbnQsIHBhcmFtTmFtZSkge1xuICAgICAgcGF0aEVsZW1lbnRbcGFyYW1OYW1lXSArPSBwYXJhbU5hbWVbMF0gPT09ICd4JyA/IHggOiB5O1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gd2lsbCBydW4gb3ZlciBhbGwgZXhpc3RpbmcgcGF0aCBlbGVtZW50cyBhbmQgdGhlbiBsb29wIG92ZXIgdGhlaXIgYXR0cmlidXRlcy4gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIGZvciBldmVyeSBwYXRoIGVsZW1lbnQgYXR0cmlidXRlIHRoYXQgZXhpc3RzIGluIHRoZSBjdXJyZW50IHBhdGguXG4gICAqIFRoZSBtZXRob2Qgc2lnbmF0dXJlIG9mIHRoZSBjYWxsYmFjayBmdW5jdGlvbiBsb29rcyBsaWtlIHRoaXM6XG4gICAqIGBgYGphdmFzY3JpcHRcbiAgICogZnVuY3Rpb24ocGF0aEVsZW1lbnQsIHBhcmFtTmFtZSwgcGF0aEVsZW1lbnRJbmRleCwgcGFyYW1JbmRleCwgcGF0aEVsZW1lbnRzKVxuICAgKiBgYGBcbiAgICogSWYgc29tZXRoaW5nIGVsc2UgdGhhbiB1bmRlZmluZWQgaXMgcmV0dXJuZWQgYnkgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uLCB0aGlzIHZhbHVlIHdpbGwgYmUgdXNlZCB0byByZXBsYWNlIHRoZSBvbGQgdmFsdWUuIFRoaXMgYWxsb3dzIHlvdSB0byBidWlsZCBjdXN0b20gdHJhbnNmb3JtYXRpb25zIG9mIHBhdGggb2JqZWN0cyB0aGF0IGNhbid0IGJlIGFjaGlldmVkIHVzaW5nIHRoZSBiYXNpYyB0cmFuc2Zvcm1hdGlvbiBmdW5jdGlvbnMgc2NhbGUgYW5kIHRyYW5zbGF0ZS5cbiAgICpcbiAgICogQG1lbWJlcm9mIENoYXJ0aXN0LlN2Zy5QYXRoXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IHRyYW5zZm9ybUZuYyBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gZm9yIHRoZSB0cmFuc2Zvcm1hdGlvbi4gQ2hlY2sgdGhlIHNpZ25hdHVyZSBpbiB0aGUgZnVuY3Rpb24gZGVzY3JpcHRpb24uXG4gICAqIEByZXR1cm4ge0NoYXJ0aXN0LlN2Zy5QYXRofSBUaGUgY3VycmVudCBwYXRoIG9iamVjdCBmb3IgZWFzeSBjYWxsIGNoYWluaW5nLlxuICAgKi9cbiAgZnVuY3Rpb24gdHJhbnNmb3JtKHRyYW5zZm9ybUZuYykge1xuICAgIGZvckVhY2hQYXJhbSh0aGlzLnBhdGhFbGVtZW50cywgZnVuY3Rpb24ocGF0aEVsZW1lbnQsIHBhcmFtTmFtZSwgcGF0aEVsZW1lbnRJbmRleCwgcGFyYW1JbmRleCwgcGF0aEVsZW1lbnRzKSB7XG4gICAgICB2YXIgdHJhbnNmb3JtZWQgPSB0cmFuc2Zvcm1GbmMocGF0aEVsZW1lbnQsIHBhcmFtTmFtZSwgcGF0aEVsZW1lbnRJbmRleCwgcGFyYW1JbmRleCwgcGF0aEVsZW1lbnRzKTtcbiAgICAgIGlmKHRyYW5zZm9ybWVkIHx8IHRyYW5zZm9ybWVkID09PSAwKSB7XG4gICAgICAgIHBhdGhFbGVtZW50W3BhcmFtTmFtZV0gPSB0cmFuc2Zvcm1lZDtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGNsb25lcyBhIHdob2xlIHBhdGggb2JqZWN0IHdpdGggYWxsIGl0cyBwcm9wZXJ0aWVzLiBUaGlzIGlzIGEgZGVlcCBjbG9uZSBhbmQgcGF0aCBlbGVtZW50IG9iamVjdHMgd2lsbCBhbHNvIGJlIGNsb25lZC5cbiAgICpcbiAgICogQG1lbWJlcm9mIENoYXJ0aXN0LlN2Zy5QYXRoXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2Nsb3NlXSBPcHRpb25hbCBvcHRpb24gdG8gc2V0IHRoZSBuZXcgY2xvbmVkIHBhdGggdG8gY2xvc2VkLiBJZiBub3Qgc3BlY2lmaWVkIG9yIGZhbHNlLCB0aGUgb3JpZ2luYWwgcGF0aCBjbG9zZSBvcHRpb24gd2lsbCBiZSB1c2VkLlxuICAgKiBAcmV0dXJuIHtDaGFydGlzdC5TdmcuUGF0aH1cbiAgICovXG4gIGZ1bmN0aW9uIGNsb25lKGNsb3NlKSB7XG4gICAgdmFyIGMgPSBuZXcgQ2hhcnRpc3QuU3ZnLlBhdGgoY2xvc2UgfHwgdGhpcy5jbG9zZSk7XG4gICAgYy5wb3MgPSB0aGlzLnBvcztcbiAgICBjLnBhdGhFbGVtZW50cyA9IHRoaXMucGF0aEVsZW1lbnRzLnNsaWNlKCkubWFwKGZ1bmN0aW9uIGNsb25lRWxlbWVudHMocGF0aEVsZW1lbnQpIHtcbiAgICAgIHJldHVybiBDaGFydGlzdC5leHRlbmQoe30sIHBhdGhFbGVtZW50KTtcbiAgICB9KTtcbiAgICBjLm9wdGlvbnMgPSBDaGFydGlzdC5leHRlbmQoe30sIHRoaXMub3B0aW9ucyk7XG4gICAgcmV0dXJuIGM7XG4gIH1cblxuICAvKipcbiAgICogU3BsaXQgYSBTdmcuUGF0aCBvYmplY3QgYnkgYSBzcGVjaWZpYyBjb21tYW5kIGluIHRoZSBwYXRoIGNoYWluLiBUaGUgcGF0aCBjaGFpbiB3aWxsIGJlIHNwbGl0IGFuZCBhbiBhcnJheSBvZiBuZXdseSBjcmVhdGVkIHBhdGhzIG9iamVjdHMgd2lsbCBiZSByZXR1cm5lZC4gVGhpcyBpcyB1c2VmdWwgaWYgeW91J2QgbGlrZSB0byBzcGxpdCBhbiBTVkcgcGF0aCBieSBpdCdzIG1vdmUgY29tbWFuZHMsIGZvciBleGFtcGxlLCBpbiBvcmRlciB0byBpc29sYXRlIGNodW5rcyBvZiBkcmF3aW5ncy5cbiAgICpcbiAgICogQG1lbWJlcm9mIENoYXJ0aXN0LlN2Zy5QYXRoXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjb21tYW5kIFRoZSBjb21tYW5kIHlvdSdkIGxpa2UgdG8gdXNlIHRvIHNwbGl0IHRoZSBwYXRoXG4gICAqIEByZXR1cm4ge0FycmF5PENoYXJ0aXN0LlN2Zy5QYXRoPn1cbiAgICovXG4gIGZ1bmN0aW9uIHNwbGl0QnlDb21tYW5kKGNvbW1hbmQpIHtcbiAgICB2YXIgc3BsaXQgPSBbXG4gICAgICBuZXcgQ2hhcnRpc3QuU3ZnLlBhdGgoKVxuICAgIF07XG5cbiAgICB0aGlzLnBhdGhFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uKHBhdGhFbGVtZW50KSB7XG4gICAgICBpZihwYXRoRWxlbWVudC5jb21tYW5kID09PSBjb21tYW5kLnRvVXBwZXJDYXNlKCkgJiYgc3BsaXRbc3BsaXQubGVuZ3RoIC0gMV0ucGF0aEVsZW1lbnRzLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICBzcGxpdC5wdXNoKG5ldyBDaGFydGlzdC5TdmcuUGF0aCgpKTtcbiAgICAgIH1cblxuICAgICAgc3BsaXRbc3BsaXQubGVuZ3RoIC0gMV0ucGF0aEVsZW1lbnRzLnB1c2gocGF0aEVsZW1lbnQpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHNwbGl0O1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgc3RhdGljIGZ1bmN0aW9uIG9uIGBDaGFydGlzdC5TdmcuUGF0aGAgaXMgam9pbmluZyBtdWx0aXBsZSBwYXRocyB0b2dldGhlciBpbnRvIG9uZSBwYXRocy5cbiAgICpcbiAgICogQG1lbWJlcm9mIENoYXJ0aXN0LlN2Zy5QYXRoXG4gICAqIEBwYXJhbSB7QXJyYXk8Q2hhcnRpc3QuU3ZnLlBhdGg+fSBwYXRocyBBIGxpc3Qgb2YgcGF0aHMgdG8gYmUgam9pbmVkIHRvZ2V0aGVyLiBUaGUgb3JkZXIgaXMgaW1wb3J0YW50LlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNsb3NlIElmIHRoZSBuZXdseSBjcmVhdGVkIHBhdGggc2hvdWxkIGJlIGEgY2xvc2VkIHBhdGhcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgUGF0aCBvcHRpb25zIGZvciB0aGUgbmV3bHkgY3JlYXRlZCBwYXRoLlxuICAgKiBAcmV0dXJuIHtDaGFydGlzdC5TdmcuUGF0aH1cbiAgICovXG5cbiAgZnVuY3Rpb24gam9pbihwYXRocywgY2xvc2UsIG9wdGlvbnMpIHtcbiAgICB2YXIgam9pbmVkUGF0aCA9IG5ldyBDaGFydGlzdC5TdmcuUGF0aChjbG9zZSwgb3B0aW9ucyk7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHBhdGhzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgcGF0aCA9IHBhdGhzW2ldO1xuICAgICAgZm9yKHZhciBqID0gMDsgaiA8IHBhdGgucGF0aEVsZW1lbnRzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGpvaW5lZFBhdGgucGF0aEVsZW1lbnRzLnB1c2gocGF0aC5wYXRoRWxlbWVudHNbal0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gam9pbmVkUGF0aDtcbiAgfVxuXG4gIENoYXJ0aXN0LlN2Zy5QYXRoID0gQ2hhcnRpc3QuQ2xhc3MuZXh0ZW5kKHtcbiAgICBjb25zdHJ1Y3RvcjogU3ZnUGF0aCxcbiAgICBwb3NpdGlvbjogcG9zaXRpb24sXG4gICAgcmVtb3ZlOiByZW1vdmUsXG4gICAgbW92ZTogbW92ZSxcbiAgICBsaW5lOiBsaW5lLFxuICAgIGN1cnZlOiBjdXJ2ZSxcbiAgICBhcmM6IGFyYyxcbiAgICBzY2FsZTogc2NhbGUsXG4gICAgdHJhbnNsYXRlOiB0cmFuc2xhdGUsXG4gICAgdHJhbnNmb3JtOiB0cmFuc2Zvcm0sXG4gICAgcGFyc2U6IHBhcnNlLFxuICAgIHN0cmluZ2lmeTogc3RyaW5naWZ5LFxuICAgIGNsb25lOiBjbG9uZSxcbiAgICBzcGxpdEJ5Q29tbWFuZDogc3BsaXRCeUNvbW1hbmRcbiAgfSk7XG5cbiAgQ2hhcnRpc3QuU3ZnLlBhdGguZWxlbWVudERlc2NyaXB0aW9ucyA9IGVsZW1lbnREZXNjcmlwdGlvbnM7XG4gIENoYXJ0aXN0LlN2Zy5QYXRoLmpvaW4gPSBqb2luO1xufSh3aW5kb3csIGRvY3VtZW50LCBDaGFydGlzdCkpO1xuOy8qIGdsb2JhbCBDaGFydGlzdCAqL1xuKGZ1bmN0aW9uICh3aW5kb3csIGRvY3VtZW50LCBDaGFydGlzdCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIGF4aXNVbml0cyA9IHtcbiAgICB4OiB7XG4gICAgICBwb3M6ICd4JyxcbiAgICAgIGxlbjogJ3dpZHRoJyxcbiAgICAgIGRpcjogJ2hvcml6b250YWwnLFxuICAgICAgcmVjdFN0YXJ0OiAneDEnLFxuICAgICAgcmVjdEVuZDogJ3gyJyxcbiAgICAgIHJlY3RPZmZzZXQ6ICd5MidcbiAgICB9LFxuICAgIHk6IHtcbiAgICAgIHBvczogJ3knLFxuICAgICAgbGVuOiAnaGVpZ2h0JyxcbiAgICAgIGRpcjogJ3ZlcnRpY2FsJyxcbiAgICAgIHJlY3RTdGFydDogJ3kyJyxcbiAgICAgIHJlY3RFbmQ6ICd5MScsXG4gICAgICByZWN0T2Zmc2V0OiAneDEnXG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIEF4aXModW5pdHMsIGNoYXJ0UmVjdCwgdGlja3MsIG9wdGlvbnMpIHtcbiAgICB0aGlzLnVuaXRzID0gdW5pdHM7XG4gICAgdGhpcy5jb3VudGVyVW5pdHMgPSB1bml0cyA9PT0gYXhpc1VuaXRzLnggPyBheGlzVW5pdHMueSA6IGF4aXNVbml0cy54O1xuICAgIHRoaXMuY2hhcnRSZWN0ID0gY2hhcnRSZWN0O1xuICAgIHRoaXMuYXhpc0xlbmd0aCA9IGNoYXJ0UmVjdFt1bml0cy5yZWN0RW5kXSAtIGNoYXJ0UmVjdFt1bml0cy5yZWN0U3RhcnRdO1xuICAgIHRoaXMuZ3JpZE9mZnNldCA9IGNoYXJ0UmVjdFt1bml0cy5yZWN0T2Zmc2V0XTtcbiAgICB0aGlzLnRpY2tzID0gdGlja3M7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUdyaWRBbmRMYWJlbHMoZ3JpZEdyb3VwLCBsYWJlbEdyb3VwLCB1c2VGb3JlaWduT2JqZWN0LCBjaGFydE9wdGlvbnMsIGV2ZW50RW1pdHRlcikge1xuICAgIHZhciBheGlzT3B0aW9ucyA9IGNoYXJ0T3B0aW9uc1snYXhpcycgKyB0aGlzLnVuaXRzLnBvcy50b1VwcGVyQ2FzZSgpXTtcbiAgICB2YXIgcHJvamVjdGVkVmFsdWVzID0gdGhpcy50aWNrcy5tYXAodGhpcy5wcm9qZWN0VmFsdWUuYmluZCh0aGlzKSk7XG4gICAgdmFyIGxhYmVsVmFsdWVzID0gdGhpcy50aWNrcy5tYXAoYXhpc09wdGlvbnMubGFiZWxJbnRlcnBvbGF0aW9uRm5jKTtcblxuICAgIHByb2plY3RlZFZhbHVlcy5mb3JFYWNoKGZ1bmN0aW9uKHByb2plY3RlZFZhbHVlLCBpbmRleCkge1xuICAgICAgdmFyIGxhYmVsT2Zmc2V0ID0ge1xuICAgICAgICB4OiAwLFxuICAgICAgICB5OiAwXG4gICAgICB9O1xuXG4gICAgICAvLyBUT0RPOiBGaW5kIGJldHRlciBzb2x1dGlvbiBmb3Igc29sdmluZyB0aGlzIHByb2JsZW1cbiAgICAgIC8vIENhbGN1bGF0ZSBob3cgbXVjaCBzcGFjZSB3ZSBoYXZlIGF2YWlsYWJsZSBmb3IgdGhlIGxhYmVsXG4gICAgICB2YXIgbGFiZWxMZW5ndGg7XG4gICAgICBpZihwcm9qZWN0ZWRWYWx1ZXNbaW5kZXggKyAxXSkge1xuICAgICAgICAvLyBJZiB3ZSBzdGlsbCBoYXZlIG9uZSBsYWJlbCBhaGVhZCwgd2UgY2FuIGNhbGN1bGF0ZSB0aGUgZGlzdGFuY2UgdG8gdGhlIG5leHQgdGljayAvIGxhYmVsXG4gICAgICAgIGxhYmVsTGVuZ3RoID0gcHJvamVjdGVkVmFsdWVzW2luZGV4ICsgMV0gLSBwcm9qZWN0ZWRWYWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIElmIHdlIGRvbid0IGhhdmUgYSBsYWJlbCBhaGVhZCBhbmQgd2UgaGF2ZSBvbmx5IHR3byBsYWJlbHMgaW4gdG90YWwsIHdlIGp1c3QgdGFrZSB0aGUgcmVtYWluaW5nIGRpc3RhbmNlIHRvXG4gICAgICAgIC8vIG9uIHRoZSB3aG9sZSBheGlzIGxlbmd0aC4gV2UgbGltaXQgdGhhdCB0byBhIG1pbmltdW0gb2YgMzAgcGl4ZWwsIHNvIHRoYXQgbGFiZWxzIGNsb3NlIHRvIHRoZSBib3JkZXIgd2lsbFxuICAgICAgICAvLyBzdGlsbCBiZSB2aXNpYmxlIGluc2lkZSBvZiB0aGUgY2hhcnQgcGFkZGluZy5cbiAgICAgICAgbGFiZWxMZW5ndGggPSBNYXRoLm1heCh0aGlzLmF4aXNMZW5ndGggLSBwcm9qZWN0ZWRWYWx1ZSwgMzApO1xuICAgICAgfVxuXG4gICAgICAvLyBTa2lwIGdyaWQgbGluZXMgYW5kIGxhYmVscyB3aGVyZSBpbnRlcnBvbGF0ZWQgbGFiZWwgdmFsdWVzIGFyZSBmYWxzZXkgKGV4ZWNwdCBmb3IgMClcbiAgICAgIGlmKENoYXJ0aXN0LmlzRmFsc2V5QnV0WmVybyhsYWJlbFZhbHVlc1tpbmRleF0pICYmIGxhYmVsVmFsdWVzW2luZGV4XSAhPT0gJycpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBUcmFuc2Zvcm0gdG8gZ2xvYmFsIGNvb3JkaW5hdGVzIHVzaW5nIHRoZSBjaGFydFJlY3RcbiAgICAgIC8vIFdlIGFsc28gbmVlZCB0byBzZXQgdGhlIGxhYmVsIG9mZnNldCBmb3IgdGhlIGNyZWF0ZUxhYmVsIGZ1bmN0aW9uXG4gICAgICBpZih0aGlzLnVuaXRzLnBvcyA9PT0gJ3gnKSB7XG4gICAgICAgIHByb2plY3RlZFZhbHVlID0gdGhpcy5jaGFydFJlY3QueDEgKyBwcm9qZWN0ZWRWYWx1ZTtcbiAgICAgICAgbGFiZWxPZmZzZXQueCA9IGNoYXJ0T3B0aW9ucy5heGlzWC5sYWJlbE9mZnNldC54O1xuXG4gICAgICAgIC8vIElmIHRoZSBsYWJlbHMgc2hvdWxkIGJlIHBvc2l0aW9uZWQgaW4gc3RhcnQgcG9zaXRpb24gKHRvcCBzaWRlIGZvciB2ZXJ0aWNhbCBheGlzKSB3ZSBuZWVkIHRvIHNldCBhXG4gICAgICAgIC8vIGRpZmZlcmVudCBvZmZzZXQgYXMgZm9yIHBvc2l0aW9uZWQgd2l0aCBlbmQgKGJvdHRvbSlcbiAgICAgICAgaWYoY2hhcnRPcHRpb25zLmF4aXNYLnBvc2l0aW9uID09PSAnc3RhcnQnKSB7XG4gICAgICAgICAgbGFiZWxPZmZzZXQueSA9IHRoaXMuY2hhcnRSZWN0LnBhZGRpbmcudG9wICsgY2hhcnRPcHRpb25zLmF4aXNYLmxhYmVsT2Zmc2V0LnkgKyAodXNlRm9yZWlnbk9iamVjdCA/IDUgOiAyMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGFiZWxPZmZzZXQueSA9IHRoaXMuY2hhcnRSZWN0LnkxICsgY2hhcnRPcHRpb25zLmF4aXNYLmxhYmVsT2Zmc2V0LnkgKyAodXNlRm9yZWlnbk9iamVjdCA/IDUgOiAyMCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByb2plY3RlZFZhbHVlID0gdGhpcy5jaGFydFJlY3QueTEgLSBwcm9qZWN0ZWRWYWx1ZTtcbiAgICAgICAgbGFiZWxPZmZzZXQueSA9IGNoYXJ0T3B0aW9ucy5heGlzWS5sYWJlbE9mZnNldC55IC0gKHVzZUZvcmVpZ25PYmplY3QgPyBsYWJlbExlbmd0aCA6IDApO1xuXG4gICAgICAgIC8vIElmIHRoZSBsYWJlbHMgc2hvdWxkIGJlIHBvc2l0aW9uZWQgaW4gc3RhcnQgcG9zaXRpb24gKGxlZnQgc2lkZSBmb3IgaG9yaXpvbnRhbCBheGlzKSB3ZSBuZWVkIHRvIHNldCBhXG4gICAgICAgIC8vIGRpZmZlcmVudCBvZmZzZXQgYXMgZm9yIHBvc2l0aW9uZWQgd2l0aCBlbmQgKHJpZ2h0IHNpZGUpXG4gICAgICAgIGlmKGNoYXJ0T3B0aW9ucy5heGlzWS5wb3NpdGlvbiA9PT0gJ3N0YXJ0Jykge1xuICAgICAgICAgIGxhYmVsT2Zmc2V0LnggPSB1c2VGb3JlaWduT2JqZWN0ID8gdGhpcy5jaGFydFJlY3QucGFkZGluZy5sZWZ0ICsgY2hhcnRPcHRpb25zLmF4aXNZLmxhYmVsT2Zmc2V0LnggOiB0aGlzLmNoYXJ0UmVjdC54MSAtIDEwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxhYmVsT2Zmc2V0LnggPSB0aGlzLmNoYXJ0UmVjdC54MiArIGNoYXJ0T3B0aW9ucy5heGlzWS5sYWJlbE9mZnNldC54ICsgMTA7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYoYXhpc09wdGlvbnMuc2hvd0dyaWQpIHtcbiAgICAgICAgQ2hhcnRpc3QuY3JlYXRlR3JpZChwcm9qZWN0ZWRWYWx1ZSwgaW5kZXgsIHRoaXMsIHRoaXMuZ3JpZE9mZnNldCwgdGhpcy5jaGFydFJlY3RbdGhpcy5jb3VudGVyVW5pdHMubGVuXSgpLCBncmlkR3JvdXAsIFtcbiAgICAgICAgICBjaGFydE9wdGlvbnMuY2xhc3NOYW1lcy5ncmlkLFxuICAgICAgICAgIGNoYXJ0T3B0aW9ucy5jbGFzc05hbWVzW3RoaXMudW5pdHMuZGlyXVxuICAgICAgICBdLCBldmVudEVtaXR0ZXIpO1xuICAgICAgfVxuXG4gICAgICBpZihheGlzT3B0aW9ucy5zaG93TGFiZWwpIHtcbiAgICAgICAgQ2hhcnRpc3QuY3JlYXRlTGFiZWwocHJvamVjdGVkVmFsdWUsIGxhYmVsTGVuZ3RoLCBpbmRleCwgbGFiZWxWYWx1ZXMsIHRoaXMsIGF4aXNPcHRpb25zLm9mZnNldCwgbGFiZWxPZmZzZXQsIGxhYmVsR3JvdXAsIFtcbiAgICAgICAgICBjaGFydE9wdGlvbnMuY2xhc3NOYW1lcy5sYWJlbCxcbiAgICAgICAgICBjaGFydE9wdGlvbnMuY2xhc3NOYW1lc1t0aGlzLnVuaXRzLmRpcl0sXG4gICAgICAgICAgY2hhcnRPcHRpb25zLmNsYXNzTmFtZXNbYXhpc09wdGlvbnMucG9zaXRpb25dXG4gICAgICAgIF0sIHVzZUZvcmVpZ25PYmplY3QsIGV2ZW50RW1pdHRlcik7XG4gICAgICB9XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIENoYXJ0aXN0LkF4aXMgPSBDaGFydGlzdC5DbGFzcy5leHRlbmQoe1xuICAgIGNvbnN0cnVjdG9yOiBBeGlzLFxuICAgIGNyZWF0ZUdyaWRBbmRMYWJlbHM6IGNyZWF0ZUdyaWRBbmRMYWJlbHMsXG4gICAgcHJvamVjdFZhbHVlOiBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGRhdGEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQmFzZSBheGlzIGNhblxcJ3QgYmUgaW5zdGFudGlhdGVkIScpO1xuICAgIH1cbiAgfSk7XG5cbiAgQ2hhcnRpc3QuQXhpcy51bml0cyA9IGF4aXNVbml0cztcblxufSh3aW5kb3csIGRvY3VtZW50LCBDaGFydGlzdCkpO1xuOy8qKlxuICogVGhlIGF1dG8gc2NhbGUgYXhpcyB1c2VzIHN0YW5kYXJkIGxpbmVhciBzY2FsZSBwcm9qZWN0aW9uIG9mIHZhbHVlcyBhbG9uZyBhbiBheGlzLiBJdCB1c2VzIG9yZGVyIG9mIG1hZ25pdHVkZSB0byBmaW5kIGEgc2NhbGUgYXV0b21hdGljYWxseSBhbmQgZXZhbHVhdGVzIHRoZSBhdmFpbGFibGUgc3BhY2UgaW4gb3JkZXIgdG8gZmluZCB0aGUgcGVyZmVjdCBhbW91bnQgb2YgdGlja3MgZm9yIHlvdXIgY2hhcnQuXG4gKiAqKk9wdGlvbnMqKlxuICogVGhlIGZvbGxvd2luZyBvcHRpb25zIGFyZSB1c2VkIGJ5IHRoaXMgYXhpcyBpbiBhZGRpdGlvbiB0byB0aGUgZGVmYXVsdCBheGlzIG9wdGlvbnMgb3V0bGluZWQgaW4gdGhlIGF4aXMgY29uZmlndXJhdGlvbiBvZiB0aGUgY2hhcnQgZGVmYXVsdCBzZXR0aW5ncy5cbiAqIGBgYGphdmFzY3JpcHRcbiAqIHZhciBvcHRpb25zID0ge1xuICogICAvLyBJZiBoaWdoIGlzIHNwZWNpZmllZCB0aGVuIHRoZSBheGlzIHdpbGwgZGlzcGxheSB2YWx1ZXMgZXhwbGljaXRseSB1cCB0byB0aGlzIHZhbHVlIGFuZCB0aGUgY29tcHV0ZWQgbWF4aW11bSBmcm9tIHRoZSBkYXRhIGlzIGlnbm9yZWRcbiAqICAgaGlnaDogMTAwLFxuICogICAvLyBJZiBsb3cgaXMgc3BlY2lmaWVkIHRoZW4gdGhlIGF4aXMgd2lsbCBkaXNwbGF5IHZhbHVlcyBleHBsaWNpdGx5IGRvd24gdG8gdGhpcyB2YWx1ZSBhbmQgdGhlIGNvbXB1dGVkIG1pbmltdW0gZnJvbSB0aGUgZGF0YSBpcyBpZ25vcmVkXG4gKiAgIGxvdzogMCxcbiAqICAgLy8gVGhpcyBvcHRpb24gd2lsbCBiZSB1c2VkIHdoZW4gZmluZGluZyB0aGUgcmlnaHQgc2NhbGUgZGl2aXNpb24gc2V0dGluZ3MuIFRoZSBhbW91bnQgb2YgdGlja3Mgb24gdGhlIHNjYWxlIHdpbGwgYmUgZGV0ZXJtaW5lZCBzbyB0aGF0IGFzIG1hbnkgdGlja3MgYXMgcG9zc2libGUgd2lsbCBiZSBkaXNwbGF5ZWQsIHdoaWxlIG5vdCB2aW9sYXRpbmcgdGhpcyBtaW5pbXVtIHJlcXVpcmVkIHNwYWNlIChpbiBwaXhlbCkuXG4gKiAgIHNjYWxlTWluU3BhY2U6IDIwLFxuICogICAvLyBDYW4gYmUgc2V0IHRvIHRydWUgb3IgZmFsc2UuIElmIHNldCB0byB0cnVlLCB0aGUgc2NhbGUgd2lsbCBiZSBnZW5lcmF0ZWQgd2l0aCB3aG9sZSBudW1iZXJzIG9ubHkuXG4gKiAgIG9ubHlJbnRlZ2VyOiB0cnVlLFxuICogICAvLyBUaGUgcmVmZXJlbmNlIHZhbHVlIGNhbiBiZSB1c2VkIHRvIG1ha2Ugc3VyZSB0aGF0IHRoaXMgdmFsdWUgd2lsbCBhbHdheXMgYmUgb24gdGhlIGNoYXJ0LiBUaGlzIGlzIGVzcGVjaWFsbHkgdXNlZnVsIG9uIGJpcG9sYXIgY2hhcnRzIHdoZXJlIHRoZSBiaXBvbGFyIGNlbnRlciBhbHdheXMgbmVlZHMgdG8gYmUgcGFydCBvZiB0aGUgY2hhcnQuXG4gKiAgIHJlZmVyZW5jZVZhbHVlOiA1XG4gKiB9O1xuICogYGBgXG4gKlxuICogQG1vZHVsZSBDaGFydGlzdC5BdXRvU2NhbGVBeGlzXG4gKi9cbi8qIGdsb2JhbCBDaGFydGlzdCAqL1xuKGZ1bmN0aW9uICh3aW5kb3csIGRvY3VtZW50LCBDaGFydGlzdCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZnVuY3Rpb24gQXV0b1NjYWxlQXhpcyhheGlzVW5pdCwgZGF0YSwgY2hhcnRSZWN0LCBvcHRpb25zKSB7XG4gICAgLy8gVXN1YWxseSB3ZSBjYWxjdWxhdGUgaGlnaExvdyBiYXNlZCBvbiB0aGUgZGF0YSBidXQgdGhpcyBjYW4gYmUgb3ZlcnJpZGVuIGJ5IGEgaGlnaExvdyBvYmplY3QgaW4gdGhlIG9wdGlvbnNcbiAgICB2YXIgaGlnaExvdyA9IG9wdGlvbnMuaGlnaExvdyB8fCBDaGFydGlzdC5nZXRIaWdoTG93KGRhdGEubm9ybWFsaXplZCwgb3B0aW9ucywgYXhpc1VuaXQucG9zKTtcbiAgICB0aGlzLmJvdW5kcyA9IENoYXJ0aXN0LmdldEJvdW5kcyhjaGFydFJlY3RbYXhpc1VuaXQucmVjdEVuZF0gLSBjaGFydFJlY3RbYXhpc1VuaXQucmVjdFN0YXJ0XSwgaGlnaExvdywgb3B0aW9ucy5zY2FsZU1pblNwYWNlIHx8IDIwLCBvcHRpb25zLm9ubHlJbnRlZ2VyKTtcbiAgICB0aGlzLnJhbmdlID0ge1xuICAgICAgbWluOiB0aGlzLmJvdW5kcy5taW4sXG4gICAgICBtYXg6IHRoaXMuYm91bmRzLm1heFxuICAgIH07XG5cbiAgICBDaGFydGlzdC5BdXRvU2NhbGVBeGlzLnN1cGVyLmNvbnN0cnVjdG9yLmNhbGwodGhpcyxcbiAgICAgIGF4aXNVbml0LFxuICAgICAgY2hhcnRSZWN0LFxuICAgICAgdGhpcy5ib3VuZHMudmFsdWVzLFxuICAgICAgb3B0aW9ucyk7XG4gIH1cblxuICBmdW5jdGlvbiBwcm9qZWN0VmFsdWUodmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5heGlzTGVuZ3RoICogKCtDaGFydGlzdC5nZXRNdWx0aVZhbHVlKHZhbHVlLCB0aGlzLnVuaXRzLnBvcykgLSB0aGlzLmJvdW5kcy5taW4pIC8gdGhpcy5ib3VuZHMucmFuZ2U7XG4gIH1cblxuICBDaGFydGlzdC5BdXRvU2NhbGVBeGlzID0gQ2hhcnRpc3QuQXhpcy5leHRlbmQoe1xuICAgIGNvbnN0cnVjdG9yOiBBdXRvU2NhbGVBeGlzLFxuICAgIHByb2plY3RWYWx1ZTogcHJvamVjdFZhbHVlXG4gIH0pO1xuXG59KHdpbmRvdywgZG9jdW1lbnQsIENoYXJ0aXN0KSk7XG47LyoqXG4gKiBUaGUgZml4ZWQgc2NhbGUgYXhpcyB1c2VzIHN0YW5kYXJkIGxpbmVhciBwcm9qZWN0aW9uIG9mIHZhbHVlcyBhbG9uZyBhbiBheGlzLiBJdCBtYWtlcyB1c2Ugb2YgYSBkaXZpc29yIG9wdGlvbiB0byBkaXZpZGUgdGhlIHJhbmdlIHByb3ZpZGVkIGZyb20gdGhlIG1pbmltdW0gYW5kIG1heGltdW0gdmFsdWUgb3IgdGhlIG9wdGlvbnMgaGlnaCBhbmQgbG93IHRoYXQgd2lsbCBvdmVycmlkZSB0aGUgY29tcHV0ZWQgbWluaW11bSBhbmQgbWF4aW11bS5cbiAqICoqT3B0aW9ucyoqXG4gKiBUaGUgZm9sbG93aW5nIG9wdGlvbnMgYXJlIHVzZWQgYnkgdGhpcyBheGlzIGluIGFkZGl0aW9uIHRvIHRoZSBkZWZhdWx0IGF4aXMgb3B0aW9ucyBvdXRsaW5lZCBpbiB0aGUgYXhpcyBjb25maWd1cmF0aW9uIG9mIHRoZSBjaGFydCBkZWZhdWx0IHNldHRpbmdzLlxuICogYGBgamF2YXNjcmlwdFxuICogdmFyIG9wdGlvbnMgPSB7XG4gKiAgIC8vIElmIGhpZ2ggaXMgc3BlY2lmaWVkIHRoZW4gdGhlIGF4aXMgd2lsbCBkaXNwbGF5IHZhbHVlcyBleHBsaWNpdGx5IHVwIHRvIHRoaXMgdmFsdWUgYW5kIHRoZSBjb21wdXRlZCBtYXhpbXVtIGZyb20gdGhlIGRhdGEgaXMgaWdub3JlZFxuICogICBoaWdoOiAxMDAsXG4gKiAgIC8vIElmIGxvdyBpcyBzcGVjaWZpZWQgdGhlbiB0aGUgYXhpcyB3aWxsIGRpc3BsYXkgdmFsdWVzIGV4cGxpY2l0bHkgZG93biB0byB0aGlzIHZhbHVlIGFuZCB0aGUgY29tcHV0ZWQgbWluaW11bSBmcm9tIHRoZSBkYXRhIGlzIGlnbm9yZWRcbiAqICAgbG93OiAwLFxuICogICAvLyBJZiBzcGVjaWZpZWQgdGhlbiB0aGUgdmFsdWUgcmFuZ2UgZGV0ZXJtaW5lZCBmcm9tIG1pbmltdW0gdG8gbWF4aW11bSAob3IgbG93IGFuZCBoaWdoKSB3aWxsIGJlIGRpdmlkZWQgYnkgdGhpcyBudW1iZXIgYW5kIHRpY2tzIHdpbGwgYmUgZ2VuZXJhdGVkIGF0IHRob3NlIGRpdmlzaW9uIHBvaW50cy4gVGhlIGRlZmF1bHQgZGl2aXNvciBpcyAxLlxuICogICBkaXZpc29yOiA0LFxuICogICAvLyBJZiB0aWNrcyBpcyBleHBsaWNpdGx5IHNldCwgdGhlbiB0aGUgYXhpcyB3aWxsIG5vdCBjb21wdXRlIHRoZSB0aWNrcyB3aXRoIHRoZSBkaXZpc29yLCBidXQgZGlyZWN0bHkgdXNlIHRoZSBkYXRhIGluIHRpY2tzIHRvIGRldGVybWluZSBhdCB3aGF0IHBvaW50cyBvbiB0aGUgYXhpcyBhIHRpY2sgbmVlZCB0byBiZSBnZW5lcmF0ZWQuXG4gKiAgIHRpY2tzOiBbMSwgMTAsIDIwLCAzMF1cbiAqIH07XG4gKiBgYGBcbiAqXG4gKiBAbW9kdWxlIENoYXJ0aXN0LkZpeGVkU2NhbGVBeGlzXG4gKi9cbi8qIGdsb2JhbCBDaGFydGlzdCAqL1xuKGZ1bmN0aW9uICh3aW5kb3csIGRvY3VtZW50LCBDaGFydGlzdCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZnVuY3Rpb24gRml4ZWRTY2FsZUF4aXMoYXhpc1VuaXQsIGRhdGEsIGNoYXJ0UmVjdCwgb3B0aW9ucykge1xuICAgIHZhciBoaWdoTG93ID0gb3B0aW9ucy5oaWdoTG93IHx8IENoYXJ0aXN0LmdldEhpZ2hMb3coZGF0YS5ub3JtYWxpemVkLCBvcHRpb25zLCBheGlzVW5pdC5wb3MpO1xuICAgIHRoaXMuZGl2aXNvciA9IG9wdGlvbnMuZGl2aXNvciB8fCAxO1xuICAgIHRoaXMudGlja3MgPSBvcHRpb25zLnRpY2tzIHx8IENoYXJ0aXN0LnRpbWVzKHRoaXMuZGl2aXNvcikubWFwKGZ1bmN0aW9uKHZhbHVlLCBpbmRleCkge1xuICAgICAgcmV0dXJuIGhpZ2hMb3cubG93ICsgKGhpZ2hMb3cuaGlnaCAtIGhpZ2hMb3cubG93KSAvIHRoaXMuZGl2aXNvciAqIGluZGV4O1xuICAgIH0uYmluZCh0aGlzKSk7XG4gICAgdGhpcy50aWNrcy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgIHJldHVybiBhIC0gYjtcbiAgICB9KTtcbiAgICB0aGlzLnJhbmdlID0ge1xuICAgICAgbWluOiBoaWdoTG93LmxvdyxcbiAgICAgIG1heDogaGlnaExvdy5oaWdoXG4gICAgfTtcblxuICAgIENoYXJ0aXN0LkZpeGVkU2NhbGVBeGlzLnN1cGVyLmNvbnN0cnVjdG9yLmNhbGwodGhpcyxcbiAgICAgIGF4aXNVbml0LFxuICAgICAgY2hhcnRSZWN0LFxuICAgICAgdGhpcy50aWNrcyxcbiAgICAgIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5zdGVwTGVuZ3RoID0gdGhpcy5heGlzTGVuZ3RoIC8gdGhpcy5kaXZpc29yO1xuICB9XG5cbiAgZnVuY3Rpb24gcHJvamVjdFZhbHVlKHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuYXhpc0xlbmd0aCAqICgrQ2hhcnRpc3QuZ2V0TXVsdGlWYWx1ZSh2YWx1ZSwgdGhpcy51bml0cy5wb3MpIC0gdGhpcy5yYW5nZS5taW4pIC8gKHRoaXMucmFuZ2UubWF4IC0gdGhpcy5yYW5nZS5taW4pO1xuICB9XG5cbiAgQ2hhcnRpc3QuRml4ZWRTY2FsZUF4aXMgPSBDaGFydGlzdC5BeGlzLmV4dGVuZCh7XG4gICAgY29uc3RydWN0b3I6IEZpeGVkU2NhbGVBeGlzLFxuICAgIHByb2plY3RWYWx1ZTogcHJvamVjdFZhbHVlXG4gIH0pO1xuXG59KHdpbmRvdywgZG9jdW1lbnQsIENoYXJ0aXN0KSk7XG47LyoqXG4gKiBUaGUgc3RlcCBheGlzIGZvciBzdGVwIGJhc2VkIGNoYXJ0cyBsaWtlIGJhciBjaGFydCBvciBzdGVwIGJhc2VkIGxpbmUgY2hhcnRzLiBJdCB1c2VzIGEgZml4ZWQgYW1vdW50IG9mIHRpY2tzIHRoYXQgd2lsbCBiZSBlcXVhbGx5IGRpc3RyaWJ1dGVkIGFjcm9zcyB0aGUgd2hvbGUgYXhpcyBsZW5ndGguIFRoZSBwcm9qZWN0aW9uIGlzIGRvbmUgdXNpbmcgdGhlIGluZGV4IG9mIHRoZSBkYXRhIHZhbHVlIHJhdGhlciB0aGFuIHRoZSB2YWx1ZSBpdHNlbGYgYW5kIHRoZXJlZm9yZSBpdCdzIG9ubHkgdXNlZnVsIGZvciBkaXN0cmlidXRpb24gcHVycG9zZS5cbiAqICoqT3B0aW9ucyoqXG4gKiBUaGUgZm9sbG93aW5nIG9wdGlvbnMgYXJlIHVzZWQgYnkgdGhpcyBheGlzIGluIGFkZGl0aW9uIHRvIHRoZSBkZWZhdWx0IGF4aXMgb3B0aW9ucyBvdXRsaW5lZCBpbiB0aGUgYXhpcyBjb25maWd1cmF0aW9uIG9mIHRoZSBjaGFydCBkZWZhdWx0IHNldHRpbmdzLlxuICogYGBgamF2YXNjcmlwdFxuICogdmFyIG9wdGlvbnMgPSB7XG4gKiAgIC8vIFRpY2tzIHRvIGJlIHVzZWQgdG8gZGlzdHJpYnV0ZSBhY3Jvc3MgdGhlIGF4aXMgbGVuZ3RoLiBBcyB0aGlzIGF4aXMgdHlwZSByZWxpZXMgb24gdGhlIGluZGV4IG9mIHRoZSB2YWx1ZSByYXRoZXIgdGhhbiB0aGUgdmFsdWUsIGFyYml0cmFyeSBkYXRhIHRoYXQgY2FuIGJlIGNvbnZlcnRlZCB0byBhIHN0cmluZyBjYW4gYmUgdXNlZCBhcyB0aWNrcy5cbiAqICAgdGlja3M6IFsnT25lJywgJ1R3bycsICdUaHJlZSddLFxuICogICAvLyBJZiBzZXQgdG8gdHJ1ZSB0aGUgZnVsbCB3aWR0aCB3aWxsIGJlIHVzZWQgdG8gZGlzdHJpYnV0ZSB0aGUgdmFsdWVzIHdoZXJlIHRoZSBsYXN0IHZhbHVlIHdpbGwgYmUgYXQgdGhlIG1heGltdW0gb2YgdGhlIGF4aXMgbGVuZ3RoLiBJZiBmYWxzZSB0aGUgc3BhY2VzIGJldHdlZW4gdGhlIHRpY2tzIHdpbGwgYmUgZXZlbmx5IGRpc3RyaWJ1dGVkIGluc3RlYWQuXG4gKiAgIHN0cmV0Y2g6IHRydWVcbiAqIH07XG4gKiBgYGBcbiAqXG4gKiBAbW9kdWxlIENoYXJ0aXN0LlN0ZXBBeGlzXG4gKi9cbi8qIGdsb2JhbCBDaGFydGlzdCAqL1xuKGZ1bmN0aW9uICh3aW5kb3csIGRvY3VtZW50LCBDaGFydGlzdCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZnVuY3Rpb24gU3RlcEF4aXMoYXhpc1VuaXQsIGRhdGEsIGNoYXJ0UmVjdCwgb3B0aW9ucykge1xuICAgIENoYXJ0aXN0LlN0ZXBBeGlzLnN1cGVyLmNvbnN0cnVjdG9yLmNhbGwodGhpcyxcbiAgICAgIGF4aXNVbml0LFxuICAgICAgY2hhcnRSZWN0LFxuICAgICAgb3B0aW9ucy50aWNrcyxcbiAgICAgIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5zdGVwTGVuZ3RoID0gdGhpcy5heGlzTGVuZ3RoIC8gKG9wdGlvbnMudGlja3MubGVuZ3RoIC0gKG9wdGlvbnMuc3RyZXRjaCA/IDEgOiAwKSk7XG4gIH1cblxuICBmdW5jdGlvbiBwcm9qZWN0VmFsdWUodmFsdWUsIGluZGV4KSB7XG4gICAgcmV0dXJuIHRoaXMuc3RlcExlbmd0aCAqIGluZGV4O1xuICB9XG5cbiAgQ2hhcnRpc3QuU3RlcEF4aXMgPSBDaGFydGlzdC5BeGlzLmV4dGVuZCh7XG4gICAgY29uc3RydWN0b3I6IFN0ZXBBeGlzLFxuICAgIHByb2plY3RWYWx1ZTogcHJvamVjdFZhbHVlXG4gIH0pO1xuXG59KHdpbmRvdywgZG9jdW1lbnQsIENoYXJ0aXN0KSk7XG47LyoqXG4gKiBUaGUgQ2hhcnRpc3QgbGluZSBjaGFydCBjYW4gYmUgdXNlZCB0byBkcmF3IExpbmUgb3IgU2NhdHRlciBjaGFydHMuIElmIHVzZWQgaW4gdGhlIGJyb3dzZXIgeW91IGNhbiBhY2Nlc3MgdGhlIGdsb2JhbCBgQ2hhcnRpc3RgIG5hbWVzcGFjZSB3aGVyZSB5b3UgZmluZCB0aGUgYExpbmVgIGZ1bmN0aW9uIGFzIGEgbWFpbiBlbnRyeSBwb2ludC5cbiAqXG4gKiBGb3IgZXhhbXBsZXMgb24gaG93IHRvIHVzZSB0aGUgbGluZSBjaGFydCBwbGVhc2UgY2hlY2sgdGhlIGV4YW1wbGVzIG9mIHRoZSBgQ2hhcnRpc3QuTGluZWAgbWV0aG9kLlxuICpcbiAqIEBtb2R1bGUgQ2hhcnRpc3QuTGluZVxuICovXG4vKiBnbG9iYWwgQ2hhcnRpc3QgKi9cbihmdW5jdGlvbih3aW5kb3csIGRvY3VtZW50LCBDaGFydGlzdCl7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvKipcbiAgICogRGVmYXVsdCBvcHRpb25zIGluIGxpbmUgY2hhcnRzLiBFeHBhbmQgdGhlIGNvZGUgdmlldyB0byBzZWUgYSBkZXRhaWxlZCBsaXN0IG9mIG9wdGlvbnMgd2l0aCBjb21tZW50cy5cbiAgICpcbiAgICogQG1lbWJlcm9mIENoYXJ0aXN0LkxpbmVcbiAgICovXG4gIHZhciBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAvLyBPcHRpb25zIGZvciBYLUF4aXNcbiAgICBheGlzWDoge1xuICAgICAgLy8gVGhlIG9mZnNldCBvZiB0aGUgbGFiZWxzIHRvIHRoZSBjaGFydCBhcmVhXG4gICAgICBvZmZzZXQ6IDMwLFxuICAgICAgLy8gUG9zaXRpb24gd2hlcmUgbGFiZWxzIGFyZSBwbGFjZWQuIENhbiBiZSBzZXQgdG8gYHN0YXJ0YCBvciBgZW5kYCB3aGVyZSBgc3RhcnRgIGlzIGVxdWl2YWxlbnQgdG8gbGVmdCBvciB0b3Agb24gdmVydGljYWwgYXhpcyBhbmQgYGVuZGAgaXMgZXF1aXZhbGVudCB0byByaWdodCBvciBib3R0b20gb24gaG9yaXpvbnRhbCBheGlzLlxuICAgICAgcG9zaXRpb246ICdlbmQnLFxuICAgICAgLy8gQWxsb3dzIHlvdSB0byBjb3JyZWN0IGxhYmVsIHBvc2l0aW9uaW5nIG9uIHRoaXMgYXhpcyBieSBwb3NpdGl2ZSBvciBuZWdhdGl2ZSB4IGFuZCB5IG9mZnNldC5cbiAgICAgIGxhYmVsT2Zmc2V0OiB7XG4gICAgICAgIHg6IDAsXG4gICAgICAgIHk6IDBcbiAgICAgIH0sXG4gICAgICAvLyBJZiBsYWJlbHMgc2hvdWxkIGJlIHNob3duIG9yIG5vdFxuICAgICAgc2hvd0xhYmVsOiB0cnVlLFxuICAgICAgLy8gSWYgdGhlIGF4aXMgZ3JpZCBzaG91bGQgYmUgZHJhd24gb3Igbm90XG4gICAgICBzaG93R3JpZDogdHJ1ZSxcbiAgICAgIC8vIEludGVycG9sYXRpb24gZnVuY3Rpb24gdGhhdCBhbGxvd3MgeW91IHRvIGludGVyY2VwdCB0aGUgdmFsdWUgZnJvbSB0aGUgYXhpcyBsYWJlbFxuICAgICAgbGFiZWxJbnRlcnBvbGF0aW9uRm5jOiBDaGFydGlzdC5ub29wLFxuICAgICAgLy8gU2V0IHRoZSBheGlzIHR5cGUgdG8gYmUgdXNlZCB0byBwcm9qZWN0IHZhbHVlcyBvbiB0aGlzIGF4aXMuIElmIG5vdCBkZWZpbmVkLCBDaGFydGlzdC5TdGVwQXhpcyB3aWxsIGJlIHVzZWQgZm9yIHRoZSBYLUF4aXMsIHdoZXJlIHRoZSB0aWNrcyBvcHRpb24gd2lsbCBiZSBzZXQgdG8gdGhlIGxhYmVscyBpbiB0aGUgZGF0YSBhbmQgdGhlIHN0cmV0Y2ggb3B0aW9uIHdpbGwgYmUgc2V0IHRvIHRoZSBnbG9iYWwgZnVsbFdpZHRoIG9wdGlvbi4gVGhpcyB0eXBlIGNhbiBiZSBjaGFuZ2VkIHRvIGFueSBheGlzIGNvbnN0cnVjdG9yIGF2YWlsYWJsZSAoZS5nLiBDaGFydGlzdC5GaXhlZFNjYWxlQXhpcyksIHdoZXJlIGFsbCBheGlzIG9wdGlvbnMgc2hvdWxkIGJlIHByZXNlbnQgaGVyZS5cbiAgICAgIHR5cGU6IHVuZGVmaW5lZFxuICAgIH0sXG4gICAgLy8gT3B0aW9ucyBmb3IgWS1BeGlzXG4gICAgYXhpc1k6IHtcbiAgICAgIC8vIFRoZSBvZmZzZXQgb2YgdGhlIGxhYmVscyB0byB0aGUgY2hhcnQgYXJlYVxuICAgICAgb2Zmc2V0OiA0MCxcbiAgICAgIC8vIFBvc2l0aW9uIHdoZXJlIGxhYmVscyBhcmUgcGxhY2VkLiBDYW4gYmUgc2V0IHRvIGBzdGFydGAgb3IgYGVuZGAgd2hlcmUgYHN0YXJ0YCBpcyBlcXVpdmFsZW50IHRvIGxlZnQgb3IgdG9wIG9uIHZlcnRpY2FsIGF4aXMgYW5kIGBlbmRgIGlzIGVxdWl2YWxlbnQgdG8gcmlnaHQgb3IgYm90dG9tIG9uIGhvcml6b250YWwgYXhpcy5cbiAgICAgIHBvc2l0aW9uOiAnc3RhcnQnLFxuICAgICAgLy8gQWxsb3dzIHlvdSB0byBjb3JyZWN0IGxhYmVsIHBvc2l0aW9uaW5nIG9uIHRoaXMgYXhpcyBieSBwb3NpdGl2ZSBvciBuZWdhdGl2ZSB4IGFuZCB5IG9mZnNldC5cbiAgICAgIGxhYmVsT2Zmc2V0OiB7XG4gICAgICAgIHg6IDAsXG4gICAgICAgIHk6IDBcbiAgICAgIH0sXG4gICAgICAvLyBJZiBsYWJlbHMgc2hvdWxkIGJlIHNob3duIG9yIG5vdFxuICAgICAgc2hvd0xhYmVsOiB0cnVlLFxuICAgICAgLy8gSWYgdGhlIGF4aXMgZ3JpZCBzaG91bGQgYmUgZHJhd24gb3Igbm90XG4gICAgICBzaG93R3JpZDogdHJ1ZSxcbiAgICAgIC8vIEludGVycG9sYXRpb24gZnVuY3Rpb24gdGhhdCBhbGxvd3MgeW91IHRvIGludGVyY2VwdCB0aGUgdmFsdWUgZnJvbSB0aGUgYXhpcyBsYWJlbFxuICAgICAgbGFiZWxJbnRlcnBvbGF0aW9uRm5jOiBDaGFydGlzdC5ub29wLFxuICAgICAgLy8gU2V0IHRoZSBheGlzIHR5cGUgdG8gYmUgdXNlZCB0byBwcm9qZWN0IHZhbHVlcyBvbiB0aGlzIGF4aXMuIElmIG5vdCBkZWZpbmVkLCBDaGFydGlzdC5BdXRvU2NhbGVBeGlzIHdpbGwgYmUgdXNlZCBmb3IgdGhlIFktQXhpcywgd2hlcmUgdGhlIGhpZ2ggYW5kIGxvdyBvcHRpb25zIHdpbGwgYmUgc2V0IHRvIHRoZSBnbG9iYWwgaGlnaCBhbmQgbG93IG9wdGlvbnMuIFRoaXMgdHlwZSBjYW4gYmUgY2hhbmdlZCB0byBhbnkgYXhpcyBjb25zdHJ1Y3RvciBhdmFpbGFibGUgKGUuZy4gQ2hhcnRpc3QuRml4ZWRTY2FsZUF4aXMpLCB3aGVyZSBhbGwgYXhpcyBvcHRpb25zIHNob3VsZCBiZSBwcmVzZW50IGhlcmUuXG4gICAgICB0eXBlOiB1bmRlZmluZWQsXG4gICAgICAvLyBUaGlzIHZhbHVlIHNwZWNpZmllcyB0aGUgbWluaW11bSBoZWlnaHQgaW4gcGl4ZWwgb2YgdGhlIHNjYWxlIHN0ZXBzXG4gICAgICBzY2FsZU1pblNwYWNlOiAyMCxcbiAgICAgIC8vIFVzZSBvbmx5IGludGVnZXIgdmFsdWVzICh3aG9sZSBudW1iZXJzKSBmb3IgdGhlIHNjYWxlIHN0ZXBzXG4gICAgICBvbmx5SW50ZWdlcjogZmFsc2VcbiAgICB9LFxuICAgIC8vIFNwZWNpZnkgYSBmaXhlZCB3aWR0aCBmb3IgdGhlIGNoYXJ0IGFzIGEgc3RyaW5nIChpLmUuICcxMDBweCcgb3IgJzUwJScpXG4gICAgd2lkdGg6IHVuZGVmaW5lZCxcbiAgICAvLyBTcGVjaWZ5IGEgZml4ZWQgaGVpZ2h0IGZvciB0aGUgY2hhcnQgYXMgYSBzdHJpbmcgKGkuZS4gJzEwMHB4JyBvciAnNTAlJylcbiAgICBoZWlnaHQ6IHVuZGVmaW5lZCxcbiAgICAvLyBJZiB0aGUgbGluZSBzaG91bGQgYmUgZHJhd24gb3Igbm90XG4gICAgc2hvd0xpbmU6IHRydWUsXG4gICAgLy8gSWYgZG90cyBzaG91bGQgYmUgZHJhd24gb3Igbm90XG4gICAgc2hvd1BvaW50OiB0cnVlLFxuICAgIC8vIElmIHRoZSBsaW5lIGNoYXJ0IHNob3VsZCBkcmF3IGFuIGFyZWFcbiAgICBzaG93QXJlYTogZmFsc2UsXG4gICAgLy8gVGhlIGJhc2UgZm9yIHRoZSBhcmVhIGNoYXJ0IHRoYXQgd2lsbCBiZSB1c2VkIHRvIGNsb3NlIHRoZSBhcmVhIHNoYXBlIChpcyBub3JtYWxseSAwKVxuICAgIGFyZWFCYXNlOiAwLFxuICAgIC8vIFNwZWNpZnkgaWYgdGhlIGxpbmVzIHNob3VsZCBiZSBzbW9vdGhlZC4gVGhpcyB2YWx1ZSBjYW4gYmUgdHJ1ZSBvciBmYWxzZSB3aGVyZSB0cnVlIHdpbGwgcmVzdWx0IGluIHNtb290aGluZyB1c2luZyB0aGUgZGVmYXVsdCBzbW9vdGhpbmcgaW50ZXJwb2xhdGlvbiBmdW5jdGlvbiBDaGFydGlzdC5JbnRlcnBvbGF0aW9uLmNhcmRpbmFsIGFuZCBmYWxzZSByZXN1bHRzIGluIENoYXJ0aXN0LkludGVycG9sYXRpb24ubm9uZS4gWW91IGNhbiBhbHNvIGNob29zZSBvdGhlciBzbW9vdGhpbmcgLyBpbnRlcnBvbGF0aW9uIGZ1bmN0aW9ucyBhdmFpbGFibGUgaW4gdGhlIENoYXJ0aXN0LkludGVycG9sYXRpb24gbW9kdWxlLCBvciB3cml0ZSB5b3VyIG93biBpbnRlcnBvbGF0aW9uIGZ1bmN0aW9uLiBDaGVjayB0aGUgZXhhbXBsZXMgZm9yIGEgYnJpZWYgZGVzY3JpcHRpb24uXG4gICAgbGluZVNtb290aDogdHJ1ZSxcbiAgICAvLyBPdmVycmlkaW5nIHRoZSBuYXR1cmFsIGxvdyBvZiB0aGUgY2hhcnQgYWxsb3dzIHlvdSB0byB6b29tIGluIG9yIGxpbWl0IHRoZSBjaGFydHMgbG93ZXN0IGRpc3BsYXllZCB2YWx1ZVxuICAgIGxvdzogdW5kZWZpbmVkLFxuICAgIC8vIE92ZXJyaWRpbmcgdGhlIG5hdHVyYWwgaGlnaCBvZiB0aGUgY2hhcnQgYWxsb3dzIHlvdSB0byB6b29tIGluIG9yIGxpbWl0IHRoZSBjaGFydHMgaGlnaGVzdCBkaXNwbGF5ZWQgdmFsdWVcbiAgICBoaWdoOiB1bmRlZmluZWQsXG4gICAgLy8gUGFkZGluZyBvZiB0aGUgY2hhcnQgZHJhd2luZyBhcmVhIHRvIHRoZSBjb250YWluZXIgZWxlbWVudCBhbmQgbGFiZWxzIGFzIGEgbnVtYmVyIG9yIHBhZGRpbmcgb2JqZWN0IHt0b3A6IDUsIHJpZ2h0OiA1LCBib3R0b206IDUsIGxlZnQ6IDV9XG4gICAgY2hhcnRQYWRkaW5nOiB7XG4gICAgICB0b3A6IDE1LFxuICAgICAgcmlnaHQ6IDE1LFxuICAgICAgYm90dG9tOiA1LFxuICAgICAgbGVmdDogMTBcbiAgICB9LFxuICAgIC8vIFdoZW4gc2V0IHRvIHRydWUsIHRoZSBsYXN0IGdyaWQgbGluZSBvbiB0aGUgeC1heGlzIGlzIG5vdCBkcmF3biBhbmQgdGhlIGNoYXJ0IGVsZW1lbnRzIHdpbGwgZXhwYW5kIHRvIHRoZSBmdWxsIGF2YWlsYWJsZSB3aWR0aCBvZiB0aGUgY2hhcnQuIEZvciB0aGUgbGFzdCBsYWJlbCB0byBiZSBkcmF3biBjb3JyZWN0bHkgeW91IG1pZ2h0IG5lZWQgdG8gYWRkIGNoYXJ0IHBhZGRpbmcgb3Igb2Zmc2V0IHRoZSBsYXN0IGxhYmVsIHdpdGggYSBkcmF3IGV2ZW50IGhhbmRsZXIuXG4gICAgZnVsbFdpZHRoOiBmYWxzZSxcbiAgICAvLyBJZiB0cnVlIHRoZSB3aG9sZSBkYXRhIGlzIHJldmVyc2VkIGluY2x1ZGluZyBsYWJlbHMsIHRoZSBzZXJpZXMgb3JkZXIgYXMgd2VsbCBhcyB0aGUgd2hvbGUgc2VyaWVzIGRhdGEgYXJyYXlzLlxuICAgIHJldmVyc2VEYXRhOiBmYWxzZSxcbiAgICAvLyBPdmVycmlkZSB0aGUgY2xhc3MgbmFtZXMgdGhhdCBnZXQgdXNlZCB0byBnZW5lcmF0ZSB0aGUgU1ZHIHN0cnVjdHVyZSBvZiB0aGUgY2hhcnRcbiAgICBjbGFzc05hbWVzOiB7XG4gICAgICBjaGFydDogJ2N0LWNoYXJ0LWxpbmUnLFxuICAgICAgbGFiZWw6ICdjdC1sYWJlbCcsXG4gICAgICBsYWJlbEdyb3VwOiAnY3QtbGFiZWxzJyxcbiAgICAgIHNlcmllczogJ2N0LXNlcmllcycsXG4gICAgICBsaW5lOiAnY3QtbGluZScsXG4gICAgICBwb2ludDogJ2N0LXBvaW50JyxcbiAgICAgIGFyZWE6ICdjdC1hcmVhJyxcbiAgICAgIGdyaWQ6ICdjdC1ncmlkJyxcbiAgICAgIGdyaWRHcm91cDogJ2N0LWdyaWRzJyxcbiAgICAgIHZlcnRpY2FsOiAnY3QtdmVydGljYWwnLFxuICAgICAgaG9yaXpvbnRhbDogJ2N0LWhvcml6b250YWwnLFxuICAgICAgc3RhcnQ6ICdjdC1zdGFydCcsXG4gICAgICBlbmQ6ICdjdC1lbmQnXG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGNoYXJ0XG4gICAqXG4gICAqL1xuICBmdW5jdGlvbiBjcmVhdGVDaGFydChvcHRpb25zKSB7XG4gICAgdGhpcy5kYXRhID0gQ2hhcnRpc3Qubm9ybWFsaXplRGF0YSh0aGlzLmRhdGEpO1xuICAgIHZhciBkYXRhID0ge1xuICAgICAgcmF3OiB0aGlzLmRhdGEsXG4gICAgICBub3JtYWxpemVkOiBDaGFydGlzdC5nZXREYXRhQXJyYXkodGhpcy5kYXRhLCBvcHRpb25zLnJldmVyc2VEYXRhLCB0cnVlKVxuICAgIH07XG5cbiAgICAvLyBDcmVhdGUgbmV3IHN2ZyBvYmplY3RcbiAgICB0aGlzLnN2ZyA9IENoYXJ0aXN0LmNyZWF0ZVN2Zyh0aGlzLmNvbnRhaW5lciwgb3B0aW9ucy53aWR0aCwgb3B0aW9ucy5oZWlnaHQsIG9wdGlvbnMuY2xhc3NOYW1lcy5jaGFydCk7XG4gICAgLy8gQ3JlYXRlIGdyb3VwcyBmb3IgbGFiZWxzLCBncmlkIGFuZCBzZXJpZXNcbiAgICB2YXIgZ3JpZEdyb3VwID0gdGhpcy5zdmcuZWxlbSgnZycpLmFkZENsYXNzKG9wdGlvbnMuY2xhc3NOYW1lcy5ncmlkR3JvdXApO1xuICAgIHZhciBzZXJpZXNHcm91cCA9IHRoaXMuc3ZnLmVsZW0oJ2cnKTtcbiAgICB2YXIgbGFiZWxHcm91cCA9IHRoaXMuc3ZnLmVsZW0oJ2cnKS5hZGRDbGFzcyhvcHRpb25zLmNsYXNzTmFtZXMubGFiZWxHcm91cCk7XG5cbiAgICB2YXIgY2hhcnRSZWN0ID0gQ2hhcnRpc3QuY3JlYXRlQ2hhcnRSZWN0KHRoaXMuc3ZnLCBvcHRpb25zLCBkZWZhdWx0T3B0aW9ucy5wYWRkaW5nKTtcbiAgICB2YXIgYXhpc1gsIGF4aXNZO1xuXG4gICAgaWYob3B0aW9ucy5heGlzWC50eXBlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGF4aXNYID0gbmV3IENoYXJ0aXN0LlN0ZXBBeGlzKENoYXJ0aXN0LkF4aXMudW5pdHMueCwgZGF0YSwgY2hhcnRSZWN0LCBDaGFydGlzdC5leHRlbmQoe30sIG9wdGlvbnMuYXhpc1gsIHtcbiAgICAgICAgdGlja3M6IGRhdGEucmF3LmxhYmVscyxcbiAgICAgICAgc3RyZXRjaDogb3B0aW9ucy5mdWxsV2lkdGhcbiAgICAgIH0pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXhpc1ggPSBvcHRpb25zLmF4aXNYLnR5cGUuY2FsbChDaGFydGlzdCwgQ2hhcnRpc3QuQXhpcy51bml0cy54LCBkYXRhLCBjaGFydFJlY3QsIG9wdGlvbnMuYXhpc1gpO1xuICAgIH1cblxuICAgIGlmKG9wdGlvbnMuYXhpc1kudHlwZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBheGlzWSA9IG5ldyBDaGFydGlzdC5BdXRvU2NhbGVBeGlzKENoYXJ0aXN0LkF4aXMudW5pdHMueSwgZGF0YSwgY2hhcnRSZWN0LCBDaGFydGlzdC5leHRlbmQoe30sIG9wdGlvbnMuYXhpc1ksIHtcbiAgICAgICAgaGlnaDogQ2hhcnRpc3QuaXNOdW0ob3B0aW9ucy5oaWdoKSA/IG9wdGlvbnMuaGlnaCA6IG9wdGlvbnMuYXhpc1kuaGlnaCxcbiAgICAgICAgbG93OiBDaGFydGlzdC5pc051bShvcHRpb25zLmxvdykgPyBvcHRpb25zLmxvdyA6IG9wdGlvbnMuYXhpc1kubG93XG4gICAgICB9KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGF4aXNZID0gb3B0aW9ucy5heGlzWS50eXBlLmNhbGwoQ2hhcnRpc3QsIENoYXJ0aXN0LkF4aXMudW5pdHMueSwgZGF0YSwgY2hhcnRSZWN0LCBvcHRpb25zLmF4aXNZKTtcbiAgICB9XG5cbiAgICBheGlzWC5jcmVhdGVHcmlkQW5kTGFiZWxzKGdyaWRHcm91cCwgbGFiZWxHcm91cCwgdGhpcy5zdXBwb3J0c0ZvcmVpZ25PYmplY3QsIG9wdGlvbnMsIHRoaXMuZXZlbnRFbWl0dGVyKTtcbiAgICBheGlzWS5jcmVhdGVHcmlkQW5kTGFiZWxzKGdyaWRHcm91cCwgbGFiZWxHcm91cCwgdGhpcy5zdXBwb3J0c0ZvcmVpZ25PYmplY3QsIG9wdGlvbnMsIHRoaXMuZXZlbnRFbWl0dGVyKTtcblxuICAgIC8vIERyYXcgdGhlIHNlcmllc1xuICAgIGRhdGEucmF3LnNlcmllcy5mb3JFYWNoKGZ1bmN0aW9uKHNlcmllcywgc2VyaWVzSW5kZXgpIHtcbiAgICAgIHZhciBzZXJpZXNFbGVtZW50ID0gc2VyaWVzR3JvdXAuZWxlbSgnZycpO1xuXG4gICAgICAvLyBXcml0ZSBhdHRyaWJ1dGVzIHRvIHNlcmllcyBncm91cCBlbGVtZW50LiBJZiBzZXJpZXMgbmFtZSBvciBtZXRhIGlzIHVuZGVmaW5lZCB0aGUgYXR0cmlidXRlcyB3aWxsIG5vdCBiZSB3cml0dGVuXG4gICAgICBzZXJpZXNFbGVtZW50LmF0dHIoe1xuICAgICAgICAnY3Q6c2VyaWVzLW5hbWUnOiBzZXJpZXMubmFtZSxcbiAgICAgICAgJ2N0Om1ldGEnOiBDaGFydGlzdC5zZXJpYWxpemUoc2VyaWVzLm1ldGEpXG4gICAgICB9KTtcblxuICAgICAgLy8gVXNlIHNlcmllcyBjbGFzcyBmcm9tIHNlcmllcyBkYXRhIG9yIGlmIG5vdCBzZXQgZ2VuZXJhdGUgb25lXG4gICAgICBzZXJpZXNFbGVtZW50LmFkZENsYXNzKFtcbiAgICAgICAgb3B0aW9ucy5jbGFzc05hbWVzLnNlcmllcyxcbiAgICAgICAgKHNlcmllcy5jbGFzc05hbWUgfHwgb3B0aW9ucy5jbGFzc05hbWVzLnNlcmllcyArICctJyArIENoYXJ0aXN0LmFscGhhTnVtZXJhdGUoc2VyaWVzSW5kZXgpKVxuICAgICAgXS5qb2luKCcgJykpO1xuXG4gICAgICB2YXIgcGF0aENvb3JkaW5hdGVzID0gW10sXG4gICAgICAgIHBhdGhEYXRhID0gW107XG5cbiAgICAgIGRhdGEubm9ybWFsaXplZFtzZXJpZXNJbmRleF0uZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgdmFsdWVJbmRleCkge1xuICAgICAgICB2YXIgcCA9IHtcbiAgICAgICAgICB4OiBjaGFydFJlY3QueDEgKyBheGlzWC5wcm9qZWN0VmFsdWUodmFsdWUsIHZhbHVlSW5kZXgsIGRhdGEubm9ybWFsaXplZFtzZXJpZXNJbmRleF0pLFxuICAgICAgICAgIHk6IGNoYXJ0UmVjdC55MSAtIGF4aXNZLnByb2plY3RWYWx1ZSh2YWx1ZSwgdmFsdWVJbmRleCwgZGF0YS5ub3JtYWxpemVkW3Nlcmllc0luZGV4XSlcbiAgICAgICAgfTtcbiAgICAgICAgcGF0aENvb3JkaW5hdGVzLnB1c2gocC54LCBwLnkpO1xuICAgICAgICBwYXRoRGF0YS5wdXNoKHtcbiAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgdmFsdWVJbmRleDogdmFsdWVJbmRleCxcbiAgICAgICAgICBtZXRhOiBDaGFydGlzdC5nZXRNZXRhRGF0YShzZXJpZXMsIHZhbHVlSW5kZXgpXG4gICAgICAgIH0pO1xuICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgICAgdmFyIHNlcmllc09wdGlvbnMgPSB7XG4gICAgICAgIGxpbmVTbW9vdGg6IENoYXJ0aXN0LmdldFNlcmllc09wdGlvbihzZXJpZXMsIG9wdGlvbnMsICdsaW5lU21vb3RoJyksXG4gICAgICAgIHNob3dQb2ludDogQ2hhcnRpc3QuZ2V0U2VyaWVzT3B0aW9uKHNlcmllcywgb3B0aW9ucywgJ3Nob3dQb2ludCcpLFxuICAgICAgICBzaG93TGluZTogQ2hhcnRpc3QuZ2V0U2VyaWVzT3B0aW9uKHNlcmllcywgb3B0aW9ucywgJ3Nob3dMaW5lJyksXG4gICAgICAgIHNob3dBcmVhOiBDaGFydGlzdC5nZXRTZXJpZXNPcHRpb24oc2VyaWVzLCBvcHRpb25zLCAnc2hvd0FyZWEnKSxcbiAgICAgICAgYXJlYUJhc2U6IENoYXJ0aXN0LmdldFNlcmllc09wdGlvbihzZXJpZXMsIG9wdGlvbnMsICdhcmVhQmFzZScpXG4gICAgICB9O1xuXG4gICAgICB2YXIgc21vb3RoaW5nID0gdHlwZW9mIHNlcmllc09wdGlvbnMubGluZVNtb290aCA9PT0gJ2Z1bmN0aW9uJyA/XG4gICAgICAgIHNlcmllc09wdGlvbnMubGluZVNtb290aCA6IChzZXJpZXNPcHRpb25zLmxpbmVTbW9vdGggPyBDaGFydGlzdC5JbnRlcnBvbGF0aW9uLm1vbm90b25lQ3ViaWMoKSA6IENoYXJ0aXN0LkludGVycG9sYXRpb24ubm9uZSgpKTtcbiAgICAgIC8vIEludGVycG9sYXRpbmcgcGF0aCB3aGVyZSBwYXRoRGF0YSB3aWxsIGJlIHVzZWQgdG8gYW5ub3RhdGUgZWFjaCBwYXRoIGVsZW1lbnQgc28gd2UgY2FuIHRyYWNlIGJhY2sgdGhlIG9yaWdpbmFsXG4gICAgICAvLyBpbmRleCwgdmFsdWUgYW5kIG1ldGEgZGF0YVxuICAgICAgdmFyIHBhdGggPSBzbW9vdGhpbmcocGF0aENvb3JkaW5hdGVzLCBwYXRoRGF0YSk7XG5cbiAgICAgIC8vIElmIHdlIHNob3VsZCBzaG93IHBvaW50cyB3ZSBuZWVkIHRvIGNyZWF0ZSB0aGVtIG5vdyB0byBhdm9pZCBzZWNvbmRhcnkgbG9vcFxuICAgICAgLy8gUG9pbnRzIGFyZSBkcmF3biBmcm9tIHRoZSBwYXRoRWxlbWVudHMgcmV0dXJuZWQgYnkgdGhlIGludGVycG9sYXRpb24gZnVuY3Rpb25cbiAgICAgIC8vIFNtYWxsIG9mZnNldCBmb3IgRmlyZWZveCB0byByZW5kZXIgc3F1YXJlcyBjb3JyZWN0bHlcbiAgICAgIGlmIChzZXJpZXNPcHRpb25zLnNob3dQb2ludCkge1xuXG4gICAgICAgIHBhdGgucGF0aEVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24ocGF0aEVsZW1lbnQpIHtcbiAgICAgICAgICB2YXIgcG9pbnQgPSBzZXJpZXNFbGVtZW50LmVsZW0oJ2xpbmUnLCB7XG4gICAgICAgICAgICB4MTogcGF0aEVsZW1lbnQueCxcbiAgICAgICAgICAgIHkxOiBwYXRoRWxlbWVudC55LFxuICAgICAgICAgICAgeDI6IHBhdGhFbGVtZW50LnggKyAwLjAxLFxuICAgICAgICAgICAgeTI6IHBhdGhFbGVtZW50LnlcbiAgICAgICAgICB9LCBvcHRpb25zLmNsYXNzTmFtZXMucG9pbnQpLmF0dHIoe1xuICAgICAgICAgICAgJ2N0OnZhbHVlJzogW3BhdGhFbGVtZW50LmRhdGEudmFsdWUueCwgcGF0aEVsZW1lbnQuZGF0YS52YWx1ZS55XS5maWx0ZXIoQ2hhcnRpc3QuaXNOdW0pLmpvaW4oJywnKSxcbiAgICAgICAgICAgICdjdDptZXRhJzogcGF0aEVsZW1lbnQuZGF0YS5tZXRhXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB0aGlzLmV2ZW50RW1pdHRlci5lbWl0KCdkcmF3Jywge1xuICAgICAgICAgICAgdHlwZTogJ3BvaW50JyxcbiAgICAgICAgICAgIHZhbHVlOiBwYXRoRWxlbWVudC5kYXRhLnZhbHVlLFxuICAgICAgICAgICAgaW5kZXg6IHBhdGhFbGVtZW50LmRhdGEudmFsdWVJbmRleCxcbiAgICAgICAgICAgIG1ldGE6IHBhdGhFbGVtZW50LmRhdGEubWV0YSxcbiAgICAgICAgICAgIHNlcmllczogc2VyaWVzLFxuICAgICAgICAgICAgc2VyaWVzSW5kZXg6IHNlcmllc0luZGV4LFxuICAgICAgICAgICAgYXhpc1g6IGF4aXNYLFxuICAgICAgICAgICAgYXhpc1k6IGF4aXNZLFxuICAgICAgICAgICAgZ3JvdXA6IHNlcmllc0VsZW1lbnQsXG4gICAgICAgICAgICBlbGVtZW50OiBwb2ludCxcbiAgICAgICAgICAgIHg6IHBhdGhFbGVtZW50LngsXG4gICAgICAgICAgICB5OiBwYXRoRWxlbWVudC55XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgICB9XG5cbiAgICAgIGlmKHNlcmllc09wdGlvbnMuc2hvd0xpbmUpIHtcbiAgICAgICAgdmFyIGxpbmUgPSBzZXJpZXNFbGVtZW50LmVsZW0oJ3BhdGgnLCB7XG4gICAgICAgICAgZDogcGF0aC5zdHJpbmdpZnkoKVxuICAgICAgICB9LCBvcHRpb25zLmNsYXNzTmFtZXMubGluZSwgdHJ1ZSk7XG5cbiAgICAgICAgdGhpcy5ldmVudEVtaXR0ZXIuZW1pdCgnZHJhdycsIHtcbiAgICAgICAgICB0eXBlOiAnbGluZScsXG4gICAgICAgICAgdmFsdWVzOiBkYXRhLm5vcm1hbGl6ZWRbc2VyaWVzSW5kZXhdLFxuICAgICAgICAgIHBhdGg6IHBhdGguY2xvbmUoKSxcbiAgICAgICAgICBjaGFydFJlY3Q6IGNoYXJ0UmVjdCxcbiAgICAgICAgICBpbmRleDogc2VyaWVzSW5kZXgsXG4gICAgICAgICAgc2VyaWVzOiBzZXJpZXMsXG4gICAgICAgICAgc2VyaWVzSW5kZXg6IHNlcmllc0luZGV4LFxuICAgICAgICAgIGF4aXNYOiBheGlzWCxcbiAgICAgICAgICBheGlzWTogYXhpc1ksXG4gICAgICAgICAgZ3JvdXA6IHNlcmllc0VsZW1lbnQsXG4gICAgICAgICAgZWxlbWVudDogbGluZVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgLy8gQXJlYSBjdXJyZW50bHkgb25seSB3b3JrcyB3aXRoIGF4ZXMgdGhhdCBzdXBwb3J0IGEgcmFuZ2UhXG4gICAgICBpZihzZXJpZXNPcHRpb25zLnNob3dBcmVhICYmIGF4aXNZLnJhbmdlKSB7XG4gICAgICAgIC8vIElmIGFyZWFCYXNlIGlzIG91dHNpZGUgdGhlIGNoYXJ0IGFyZWEgKDwgbWluIG9yID4gbWF4KSB3ZSBuZWVkIHRvIHNldCBpdCByZXNwZWN0aXZlbHkgc28gdGhhdFxuICAgICAgICAvLyB0aGUgYXJlYSBpcyBub3QgZHJhd24gb3V0c2lkZSB0aGUgY2hhcnQgYXJlYS5cbiAgICAgICAgdmFyIGFyZWFCYXNlID0gTWF0aC5tYXgoTWF0aC5taW4oc2VyaWVzT3B0aW9ucy5hcmVhQmFzZSwgYXhpc1kucmFuZ2UubWF4KSwgYXhpc1kucmFuZ2UubWluKTtcblxuICAgICAgICAvLyBXZSBwcm9qZWN0IHRoZSBhcmVhQmFzZSB2YWx1ZSBpbnRvIHNjcmVlbiBjb29yZGluYXRlc1xuICAgICAgICB2YXIgYXJlYUJhc2VQcm9qZWN0ZWQgPSBjaGFydFJlY3QueTEgLSBheGlzWS5wcm9qZWN0VmFsdWUoYXJlYUJhc2UpO1xuXG4gICAgICAgIC8vIEluIG9yZGVyIHRvIGZvcm0gdGhlIGFyZWEgd2UnbGwgZmlyc3Qgc3BsaXQgdGhlIHBhdGggYnkgbW92ZSBjb21tYW5kcyBzbyB3ZSBjYW4gY2h1bmsgaXQgdXAgaW50byBzZWdtZW50c1xuICAgICAgICBwYXRoLnNwbGl0QnlDb21tYW5kKCdNJykuZmlsdGVyKGZ1bmN0aW9uIG9ubHlTb2xpZFNlZ21lbnRzKHBhdGhTZWdtZW50KSB7XG4gICAgICAgICAgLy8gV2UgZmlsdGVyIG9ubHkgXCJzb2xpZFwiIHNlZ21lbnRzIHRoYXQgY29udGFpbiBtb3JlIHRoYW4gb25lIHBvaW50LiBPdGhlcndpc2UgdGhlcmUncyBubyBuZWVkIGZvciBhbiBhcmVhXG4gICAgICAgICAgcmV0dXJuIHBhdGhTZWdtZW50LnBhdGhFbGVtZW50cy5sZW5ndGggPiAxO1xuICAgICAgICB9KS5tYXAoZnVuY3Rpb24gY29udmVydFRvQXJlYShzb2xpZFBhdGhTZWdtZW50cykge1xuICAgICAgICAgIC8vIFJlY2VpdmluZyB0aGUgZmlsdGVyZWQgc29saWQgcGF0aCBzZWdtZW50cyB3ZSBjYW4gbm93IGNvbnZlcnQgdGhvc2Ugc2VnbWVudHMgaW50byBmaWxsIGFyZWFzXG4gICAgICAgICAgdmFyIGZpcnN0RWxlbWVudCA9IHNvbGlkUGF0aFNlZ21lbnRzLnBhdGhFbGVtZW50c1swXTtcbiAgICAgICAgICB2YXIgbGFzdEVsZW1lbnQgPSBzb2xpZFBhdGhTZWdtZW50cy5wYXRoRWxlbWVudHNbc29saWRQYXRoU2VnbWVudHMucGF0aEVsZW1lbnRzLmxlbmd0aCAtIDFdO1xuXG4gICAgICAgICAgLy8gQ2xvbmluZyB0aGUgc29saWQgcGF0aCBzZWdtZW50IHdpdGggY2xvc2luZyBvcHRpb24gYW5kIHJlbW92aW5nIHRoZSBmaXJzdCBtb3ZlIGNvbW1hbmQgZnJvbSB0aGUgY2xvbmVcbiAgICAgICAgICAvLyBXZSB0aGVuIGluc2VydCBhIG5ldyBtb3ZlIHRoYXQgc2hvdWxkIHN0YXJ0IGF0IHRoZSBhcmVhIGJhc2UgYW5kIGRyYXcgYSBzdHJhaWdodCBsaW5lIHVwIG9yIGRvd25cbiAgICAgICAgICAvLyBhdCB0aGUgZW5kIG9mIHRoZSBwYXRoIHdlIGFkZCBhbiBhZGRpdGlvbmFsIHN0cmFpZ2h0IGxpbmUgdG8gdGhlIHByb2plY3RlZCBhcmVhIGJhc2UgdmFsdWVcbiAgICAgICAgICAvLyBBcyB0aGUgY2xvc2luZyBvcHRpb24gaXMgc2V0IG91ciBwYXRoIHdpbGwgYmUgYXV0b21hdGljYWxseSBjbG9zZWRcbiAgICAgICAgICByZXR1cm4gc29saWRQYXRoU2VnbWVudHMuY2xvbmUodHJ1ZSlcbiAgICAgICAgICAgIC5wb3NpdGlvbigwKVxuICAgICAgICAgICAgLnJlbW92ZSgxKVxuICAgICAgICAgICAgLm1vdmUoZmlyc3RFbGVtZW50LngsIGFyZWFCYXNlUHJvamVjdGVkKVxuICAgICAgICAgICAgLmxpbmUoZmlyc3RFbGVtZW50LngsIGZpcnN0RWxlbWVudC55KVxuICAgICAgICAgICAgLnBvc2l0aW9uKHNvbGlkUGF0aFNlZ21lbnRzLnBhdGhFbGVtZW50cy5sZW5ndGggKyAxKVxuICAgICAgICAgICAgLmxpbmUobGFzdEVsZW1lbnQueCwgYXJlYUJhc2VQcm9qZWN0ZWQpO1xuXG4gICAgICAgIH0pLmZvckVhY2goZnVuY3Rpb24gY3JlYXRlQXJlYShhcmVhUGF0aCkge1xuICAgICAgICAgIC8vIEZvciBlYWNoIG9mIG91ciBuZXdseSBjcmVhdGVkIGFyZWEgcGF0aHMsIHdlJ2xsIG5vdyBjcmVhdGUgcGF0aCBlbGVtZW50cyBieSBzdHJpbmdpZnlpbmcgb3VyIHBhdGggb2JqZWN0c1xuICAgICAgICAgIC8vIGFuZCBhZGRpbmcgdGhlIGNyZWF0ZWQgRE9NIGVsZW1lbnRzIHRvIHRoZSBjb3JyZWN0IHNlcmllcyBncm91cFxuICAgICAgICAgIHZhciBhcmVhID0gc2VyaWVzRWxlbWVudC5lbGVtKCdwYXRoJywge1xuICAgICAgICAgICAgZDogYXJlYVBhdGguc3RyaW5naWZ5KClcbiAgICAgICAgICB9LCBvcHRpb25zLmNsYXNzTmFtZXMuYXJlYSwgdHJ1ZSk7XG5cbiAgICAgICAgICAvLyBFbWl0IGFuIGV2ZW50IGZvciBlYWNoIGFyZWEgdGhhdCB3YXMgZHJhd25cbiAgICAgICAgICB0aGlzLmV2ZW50RW1pdHRlci5lbWl0KCdkcmF3Jywge1xuICAgICAgICAgICAgdHlwZTogJ2FyZWEnLFxuICAgICAgICAgICAgdmFsdWVzOiBkYXRhLm5vcm1hbGl6ZWRbc2VyaWVzSW5kZXhdLFxuICAgICAgICAgICAgcGF0aDogYXJlYVBhdGguY2xvbmUoKSxcbiAgICAgICAgICAgIHNlcmllczogc2VyaWVzLFxuICAgICAgICAgICAgc2VyaWVzSW5kZXg6IHNlcmllc0luZGV4LFxuICAgICAgICAgICAgYXhpc1g6IGF4aXNYLFxuICAgICAgICAgICAgYXhpc1k6IGF4aXNZLFxuICAgICAgICAgICAgY2hhcnRSZWN0OiBjaGFydFJlY3QsXG4gICAgICAgICAgICBpbmRleDogc2VyaWVzSW5kZXgsXG4gICAgICAgICAgICBncm91cDogc2VyaWVzRWxlbWVudCxcbiAgICAgICAgICAgIGVsZW1lbnQ6IGFyZWFcbiAgICAgICAgICB9KTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgIH1cbiAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgdGhpcy5ldmVudEVtaXR0ZXIuZW1pdCgnY3JlYXRlZCcsIHtcbiAgICAgIGJvdW5kczogYXhpc1kuYm91bmRzLFxuICAgICAgY2hhcnRSZWN0OiBjaGFydFJlY3QsXG4gICAgICBheGlzWDogYXhpc1gsXG4gICAgICBheGlzWTogYXhpc1ksXG4gICAgICBzdmc6IHRoaXMuc3ZnLFxuICAgICAgb3B0aW9uczogb3B0aW9uc1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGNyZWF0ZXMgYSBuZXcgbGluZSBjaGFydC5cbiAgICpcbiAgICogQG1lbWJlcm9mIENoYXJ0aXN0LkxpbmVcbiAgICogQHBhcmFtIHtTdHJpbmd8Tm9kZX0gcXVlcnkgQSBzZWxlY3RvciBxdWVyeSBzdHJpbmcgb3IgZGlyZWN0bHkgYSBET00gZWxlbWVudFxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSBUaGUgZGF0YSBvYmplY3QgdGhhdCBuZWVkcyB0byBjb25zaXN0IG9mIGEgbGFiZWxzIGFuZCBhIHNlcmllcyBhcnJheVxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIFRoZSBvcHRpb25zIG9iamVjdCB3aXRoIG9wdGlvbnMgdGhhdCBvdmVycmlkZSB0aGUgZGVmYXVsdCBvcHRpb25zLiBDaGVjayB0aGUgZXhhbXBsZXMgZm9yIGEgZGV0YWlsZWQgbGlzdC5cbiAgICogQHBhcmFtIHtBcnJheX0gW3Jlc3BvbnNpdmVPcHRpb25zXSBTcGVjaWZ5IGFuIGFycmF5IG9mIHJlc3BvbnNpdmUgb3B0aW9uIGFycmF5cyB3aGljaCBhcmUgYSBtZWRpYSBxdWVyeSBhbmQgb3B0aW9ucyBvYmplY3QgcGFpciA9PiBbW21lZGlhUXVlcnlTdHJpbmcsIG9wdGlvbnNPYmplY3RdLFttb3JlLi4uXV1cbiAgICogQHJldHVybiB7T2JqZWN0fSBBbiBvYmplY3Qgd2hpY2ggZXhwb3NlcyB0aGUgQVBJIGZvciB0aGUgY3JlYXRlZCBjaGFydFxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiAvLyBDcmVhdGUgYSBzaW1wbGUgbGluZSBjaGFydFxuICAgKiB2YXIgZGF0YSA9IHtcbiAgICogICAvLyBBIGxhYmVscyBhcnJheSB0aGF0IGNhbiBjb250YWluIGFueSBzb3J0IG9mIHZhbHVlc1xuICAgKiAgIGxhYmVsczogWydNb24nLCAnVHVlJywgJ1dlZCcsICdUaHUnLCAnRnJpJ10sXG4gICAqICAgLy8gT3VyIHNlcmllcyBhcnJheSB0aGF0IGNvbnRhaW5zIHNlcmllcyBvYmplY3RzIG9yIGluIHRoaXMgY2FzZSBzZXJpZXMgZGF0YSBhcnJheXNcbiAgICogICBzZXJpZXM6IFtcbiAgICogICAgIFs1LCAyLCA0LCAyLCAwXVxuICAgKiAgIF1cbiAgICogfTtcbiAgICpcbiAgICogLy8gQXMgb3B0aW9ucyB3ZSBjdXJyZW50bHkgb25seSBzZXQgYSBzdGF0aWMgc2l6ZSBvZiAzMDB4MjAwIHB4XG4gICAqIHZhciBvcHRpb25zID0ge1xuICAgKiAgIHdpZHRoOiAnMzAwcHgnLFxuICAgKiAgIGhlaWdodDogJzIwMHB4J1xuICAgKiB9O1xuICAgKlxuICAgKiAvLyBJbiB0aGUgZ2xvYmFsIG5hbWUgc3BhY2UgQ2hhcnRpc3Qgd2UgY2FsbCB0aGUgTGluZSBmdW5jdGlvbiB0byBpbml0aWFsaXplIGEgbGluZSBjaGFydC4gQXMgYSBmaXJzdCBwYXJhbWV0ZXIgd2UgcGFzcyBpbiBhIHNlbGVjdG9yIHdoZXJlIHdlIHdvdWxkIGxpa2UgdG8gZ2V0IG91ciBjaGFydCBjcmVhdGVkLiBTZWNvbmQgcGFyYW1ldGVyIGlzIHRoZSBhY3R1YWwgZGF0YSBvYmplY3QgYW5kIGFzIGEgdGhpcmQgcGFyYW1ldGVyIHdlIHBhc3MgaW4gb3VyIG9wdGlvbnNcbiAgICogbmV3IENoYXJ0aXN0LkxpbmUoJy5jdC1jaGFydCcsIGRhdGEsIG9wdGlvbnMpO1xuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiAvLyBVc2Ugc3BlY2lmaWMgaW50ZXJwb2xhdGlvbiBmdW5jdGlvbiB3aXRoIGNvbmZpZ3VyYXRpb24gZnJvbSB0aGUgQ2hhcnRpc3QuSW50ZXJwb2xhdGlvbiBtb2R1bGVcbiAgICpcbiAgICogdmFyIGNoYXJ0ID0gbmV3IENoYXJ0aXN0LkxpbmUoJy5jdC1jaGFydCcsIHtcbiAgICogICBsYWJlbHM6IFsxLCAyLCAzLCA0LCA1XSxcbiAgICogICBzZXJpZXM6IFtcbiAgICogICAgIFsxLCAxLCA4LCAxLCA3XVxuICAgKiAgIF1cbiAgICogfSwge1xuICAgKiAgIGxpbmVTbW9vdGg6IENoYXJ0aXN0LkludGVycG9sYXRpb24uY2FyZGluYWwoe1xuICAgKiAgICAgdGVuc2lvbjogMC4yXG4gICAqICAgfSlcbiAgICogfSk7XG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIC8vIENyZWF0ZSBhIGxpbmUgY2hhcnQgd2l0aCByZXNwb25zaXZlIG9wdGlvbnNcbiAgICpcbiAgICogdmFyIGRhdGEgPSB7XG4gICAqICAgLy8gQSBsYWJlbHMgYXJyYXkgdGhhdCBjYW4gY29udGFpbiBhbnkgc29ydCBvZiB2YWx1ZXNcbiAgICogICBsYWJlbHM6IFsnTW9uZGF5JywgJ1R1ZXNkYXknLCAnV2VkbmVzZGF5JywgJ1RodXJzZGF5JywgJ0ZyaWRheSddLFxuICAgKiAgIC8vIE91ciBzZXJpZXMgYXJyYXkgdGhhdCBjb250YWlucyBzZXJpZXMgb2JqZWN0cyBvciBpbiB0aGlzIGNhc2Ugc2VyaWVzIGRhdGEgYXJyYXlzXG4gICAqICAgc2VyaWVzOiBbXG4gICAqICAgICBbNSwgMiwgNCwgMiwgMF1cbiAgICogICBdXG4gICAqIH07XG4gICAqXG4gICAqIC8vIEluIGFkZGl0aW9uIHRvIHRoZSByZWd1bGFyIG9wdGlvbnMgd2Ugc3BlY2lmeSByZXNwb25zaXZlIG9wdGlvbiBvdmVycmlkZXMgdGhhdCB3aWxsIG92ZXJyaWRlIHRoZSBkZWZhdWx0IGNvbmZpZ3V0YXRpb24gYmFzZWQgb24gdGhlIG1hdGNoaW5nIG1lZGlhIHF1ZXJpZXMuXG4gICAqIHZhciByZXNwb25zaXZlT3B0aW9ucyA9IFtcbiAgICogICBbJ3NjcmVlbiBhbmQgKG1pbi13aWR0aDogNjQxcHgpIGFuZCAobWF4LXdpZHRoOiAxMDI0cHgpJywge1xuICAgKiAgICAgc2hvd1BvaW50OiBmYWxzZSxcbiAgICogICAgIGF4aXNYOiB7XG4gICAqICAgICAgIGxhYmVsSW50ZXJwb2xhdGlvbkZuYzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICogICAgICAgICAvLyBXaWxsIHJldHVybiBNb24sIFR1ZSwgV2VkIGV0Yy4gb24gbWVkaXVtIHNjcmVlbnNcbiAgICogICAgICAgICByZXR1cm4gdmFsdWUuc2xpY2UoMCwgMyk7XG4gICAqICAgICAgIH1cbiAgICogICAgIH1cbiAgICogICB9XSxcbiAgICogICBbJ3NjcmVlbiBhbmQgKG1heC13aWR0aDogNjQwcHgpJywge1xuICAgKiAgICAgc2hvd0xpbmU6IGZhbHNlLFxuICAgKiAgICAgYXhpc1g6IHtcbiAgICogICAgICAgbGFiZWxJbnRlcnBvbGF0aW9uRm5jOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgKiAgICAgICAgIC8vIFdpbGwgcmV0dXJuIE0sIFQsIFcgZXRjLiBvbiBzbWFsbCBzY3JlZW5zXG4gICAqICAgICAgICAgcmV0dXJuIHZhbHVlWzBdO1xuICAgKiAgICAgICB9XG4gICAqICAgICB9XG4gICAqICAgfV1cbiAgICogXTtcbiAgICpcbiAgICogbmV3IENoYXJ0aXN0LkxpbmUoJy5jdC1jaGFydCcsIGRhdGEsIG51bGwsIHJlc3BvbnNpdmVPcHRpb25zKTtcbiAgICpcbiAgICovXG4gIGZ1bmN0aW9uIExpbmUocXVlcnksIGRhdGEsIG9wdGlvbnMsIHJlc3BvbnNpdmVPcHRpb25zKSB7XG4gICAgQ2hhcnRpc3QuTGluZS5zdXBlci5jb25zdHJ1Y3Rvci5jYWxsKHRoaXMsXG4gICAgICBxdWVyeSxcbiAgICAgIGRhdGEsXG4gICAgICBkZWZhdWx0T3B0aW9ucyxcbiAgICAgIENoYXJ0aXN0LmV4dGVuZCh7fSwgZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpLFxuICAgICAgcmVzcG9uc2l2ZU9wdGlvbnMpO1xuICB9XG5cbiAgLy8gQ3JlYXRpbmcgbGluZSBjaGFydCB0eXBlIGluIENoYXJ0aXN0IG5hbWVzcGFjZVxuICBDaGFydGlzdC5MaW5lID0gQ2hhcnRpc3QuQmFzZS5leHRlbmQoe1xuICAgIGNvbnN0cnVjdG9yOiBMaW5lLFxuICAgIGNyZWF0ZUNoYXJ0OiBjcmVhdGVDaGFydFxuICB9KTtcblxufSh3aW5kb3csIGRvY3VtZW50LCBDaGFydGlzdCkpO1xuOy8qKlxuICogVGhlIGJhciBjaGFydCBtb2R1bGUgb2YgQ2hhcnRpc3QgdGhhdCBjYW4gYmUgdXNlZCB0byBkcmF3IHVuaXBvbGFyIG9yIGJpcG9sYXIgYmFyIGFuZCBncm91cGVkIGJhciBjaGFydHMuXG4gKlxuICogQG1vZHVsZSBDaGFydGlzdC5CYXJcbiAqL1xuLyogZ2xvYmFsIENoYXJ0aXN0ICovXG4oZnVuY3Rpb24od2luZG93LCBkb2N1bWVudCwgQ2hhcnRpc3Qpe1xuICAndXNlIHN0cmljdCc7XG5cbiAgLyoqXG4gICAqIERlZmF1bHQgb3B0aW9ucyBpbiBiYXIgY2hhcnRzLiBFeHBhbmQgdGhlIGNvZGUgdmlldyB0byBzZWUgYSBkZXRhaWxlZCBsaXN0IG9mIG9wdGlvbnMgd2l0aCBjb21tZW50cy5cbiAgICpcbiAgICogQG1lbWJlcm9mIENoYXJ0aXN0LkJhclxuICAgKi9cbiAgdmFyIGRlZmF1bHRPcHRpb25zID0ge1xuICAgIC8vIE9wdGlvbnMgZm9yIFgtQXhpc1xuICAgIGF4aXNYOiB7XG4gICAgICAvLyBUaGUgb2Zmc2V0IG9mIHRoZSBjaGFydCBkcmF3aW5nIGFyZWEgdG8gdGhlIGJvcmRlciBvZiB0aGUgY29udGFpbmVyXG4gICAgICBvZmZzZXQ6IDMwLFxuICAgICAgLy8gUG9zaXRpb24gd2hlcmUgbGFiZWxzIGFyZSBwbGFjZWQuIENhbiBiZSBzZXQgdG8gYHN0YXJ0YCBvciBgZW5kYCB3aGVyZSBgc3RhcnRgIGlzIGVxdWl2YWxlbnQgdG8gbGVmdCBvciB0b3Agb24gdmVydGljYWwgYXhpcyBhbmQgYGVuZGAgaXMgZXF1aXZhbGVudCB0byByaWdodCBvciBib3R0b20gb24gaG9yaXpvbnRhbCBheGlzLlxuICAgICAgcG9zaXRpb246ICdlbmQnLFxuICAgICAgLy8gQWxsb3dzIHlvdSB0byBjb3JyZWN0IGxhYmVsIHBvc2l0aW9uaW5nIG9uIHRoaXMgYXhpcyBieSBwb3NpdGl2ZSBvciBuZWdhdGl2ZSB4IGFuZCB5IG9mZnNldC5cbiAgICAgIGxhYmVsT2Zmc2V0OiB7XG4gICAgICAgIHg6IDAsXG4gICAgICAgIHk6IDBcbiAgICAgIH0sXG4gICAgICAvLyBJZiBsYWJlbHMgc2hvdWxkIGJlIHNob3duIG9yIG5vdFxuICAgICAgc2hvd0xhYmVsOiB0cnVlLFxuICAgICAgLy8gSWYgdGhlIGF4aXMgZ3JpZCBzaG91bGQgYmUgZHJhd24gb3Igbm90XG4gICAgICBzaG93R3JpZDogdHJ1ZSxcbiAgICAgIC8vIEludGVycG9sYXRpb24gZnVuY3Rpb24gdGhhdCBhbGxvd3MgeW91IHRvIGludGVyY2VwdCB0aGUgdmFsdWUgZnJvbSB0aGUgYXhpcyBsYWJlbFxuICAgICAgbGFiZWxJbnRlcnBvbGF0aW9uRm5jOiBDaGFydGlzdC5ub29wLFxuICAgICAgLy8gVGhpcyB2YWx1ZSBzcGVjaWZpZXMgdGhlIG1pbmltdW0gd2lkdGggaW4gcGl4ZWwgb2YgdGhlIHNjYWxlIHN0ZXBzXG4gICAgICBzY2FsZU1pblNwYWNlOiAzMCxcbiAgICAgIC8vIFVzZSBvbmx5IGludGVnZXIgdmFsdWVzICh3aG9sZSBudW1iZXJzKSBmb3IgdGhlIHNjYWxlIHN0ZXBzXG4gICAgICBvbmx5SW50ZWdlcjogZmFsc2VcbiAgICB9LFxuICAgIC8vIE9wdGlvbnMgZm9yIFktQXhpc1xuICAgIGF4aXNZOiB7XG4gICAgICAvLyBUaGUgb2Zmc2V0IG9mIHRoZSBjaGFydCBkcmF3aW5nIGFyZWEgdG8gdGhlIGJvcmRlciBvZiB0aGUgY29udGFpbmVyXG4gICAgICBvZmZzZXQ6IDQwLFxuICAgICAgLy8gUG9zaXRpb24gd2hlcmUgbGFiZWxzIGFyZSBwbGFjZWQuIENhbiBiZSBzZXQgdG8gYHN0YXJ0YCBvciBgZW5kYCB3aGVyZSBgc3RhcnRgIGlzIGVxdWl2YWxlbnQgdG8gbGVmdCBvciB0b3Agb24gdmVydGljYWwgYXhpcyBhbmQgYGVuZGAgaXMgZXF1aXZhbGVudCB0byByaWdodCBvciBib3R0b20gb24gaG9yaXpvbnRhbCBheGlzLlxuICAgICAgcG9zaXRpb246ICdzdGFydCcsXG4gICAgICAvLyBBbGxvd3MgeW91IHRvIGNvcnJlY3QgbGFiZWwgcG9zaXRpb25pbmcgb24gdGhpcyBheGlzIGJ5IHBvc2l0aXZlIG9yIG5lZ2F0aXZlIHggYW5kIHkgb2Zmc2V0LlxuICAgICAgbGFiZWxPZmZzZXQ6IHtcbiAgICAgICAgeDogMCxcbiAgICAgICAgeTogMFxuICAgICAgfSxcbiAgICAgIC8vIElmIGxhYmVscyBzaG91bGQgYmUgc2hvd24gb3Igbm90XG4gICAgICBzaG93TGFiZWw6IHRydWUsXG4gICAgICAvLyBJZiB0aGUgYXhpcyBncmlkIHNob3VsZCBiZSBkcmF3biBvciBub3RcbiAgICAgIHNob3dHcmlkOiB0cnVlLFxuICAgICAgLy8gSW50ZXJwb2xhdGlvbiBmdW5jdGlvbiB0aGF0IGFsbG93cyB5b3UgdG8gaW50ZXJjZXB0IHRoZSB2YWx1ZSBmcm9tIHRoZSBheGlzIGxhYmVsXG4gICAgICBsYWJlbEludGVycG9sYXRpb25GbmM6IENoYXJ0aXN0Lm5vb3AsXG4gICAgICAvLyBUaGlzIHZhbHVlIHNwZWNpZmllcyB0aGUgbWluaW11bSBoZWlnaHQgaW4gcGl4ZWwgb2YgdGhlIHNjYWxlIHN0ZXBzXG4gICAgICBzY2FsZU1pblNwYWNlOiAyMCxcbiAgICAgIC8vIFVzZSBvbmx5IGludGVnZXIgdmFsdWVzICh3aG9sZSBudW1iZXJzKSBmb3IgdGhlIHNjYWxlIHN0ZXBzXG4gICAgICBvbmx5SW50ZWdlcjogZmFsc2VcbiAgICB9LFxuICAgIC8vIFNwZWNpZnkgYSBmaXhlZCB3aWR0aCBmb3IgdGhlIGNoYXJ0IGFzIGEgc3RyaW5nIChpLmUuICcxMDBweCcgb3IgJzUwJScpXG4gICAgd2lkdGg6IHVuZGVmaW5lZCxcbiAgICAvLyBTcGVjaWZ5IGEgZml4ZWQgaGVpZ2h0IGZvciB0aGUgY2hhcnQgYXMgYSBzdHJpbmcgKGkuZS4gJzEwMHB4JyBvciAnNTAlJylcbiAgICBoZWlnaHQ6IHVuZGVmaW5lZCxcbiAgICAvLyBPdmVycmlkaW5nIHRoZSBuYXR1cmFsIGhpZ2ggb2YgdGhlIGNoYXJ0IGFsbG93cyB5b3UgdG8gem9vbSBpbiBvciBsaW1pdCB0aGUgY2hhcnRzIGhpZ2hlc3QgZGlzcGxheWVkIHZhbHVlXG4gICAgaGlnaDogdW5kZWZpbmVkLFxuICAgIC8vIE92ZXJyaWRpbmcgdGhlIG5hdHVyYWwgbG93IG9mIHRoZSBjaGFydCBhbGxvd3MgeW91IHRvIHpvb20gaW4gb3IgbGltaXQgdGhlIGNoYXJ0cyBsb3dlc3QgZGlzcGxheWVkIHZhbHVlXG4gICAgbG93OiB1bmRlZmluZWQsXG4gICAgLy8gUGFkZGluZyBvZiB0aGUgY2hhcnQgZHJhd2luZyBhcmVhIHRvIHRoZSBjb250YWluZXIgZWxlbWVudCBhbmQgbGFiZWxzIGFzIGEgbnVtYmVyIG9yIHBhZGRpbmcgb2JqZWN0IHt0b3A6IDUsIHJpZ2h0OiA1LCBib3R0b206IDUsIGxlZnQ6IDV9XG4gICAgY2hhcnRQYWRkaW5nOiB7XG4gICAgICB0b3A6IDE1LFxuICAgICAgcmlnaHQ6IDE1LFxuICAgICAgYm90dG9tOiA1LFxuICAgICAgbGVmdDogMTBcbiAgICB9LFxuICAgIC8vIFNwZWNpZnkgdGhlIGRpc3RhbmNlIGluIHBpeGVsIG9mIGJhcnMgaW4gYSBncm91cFxuICAgIHNlcmllc0JhckRpc3RhbmNlOiAxNSxcbiAgICAvLyBJZiBzZXQgdG8gdHJ1ZSB0aGlzIHByb3BlcnR5IHdpbGwgY2F1c2UgdGhlIHNlcmllcyBiYXJzIHRvIGJlIHN0YWNrZWQuIENoZWNrIHRoZSBgc3RhY2tNb2RlYCBvcHRpb24gZm9yIGZ1cnRoZXIgc3RhY2tpbmcgb3B0aW9ucy5cbiAgICBzdGFja0JhcnM6IGZhbHNlLFxuICAgIC8vIElmIHNldCB0byAnb3ZlcmxhcCcgdGhpcyBwcm9wZXJ0eSB3aWxsIGZvcmNlIHRoZSBzdGFja2VkIGJhcnMgdG8gZHJhdyBmcm9tIHRoZSB6ZXJvIGxpbmUuXG4gICAgLy8gSWYgc2V0IHRvICdhY2N1bXVsYXRlJyB0aGlzIHByb3BlcnR5IHdpbGwgZm9ybSBhIHRvdGFsIGZvciBlYWNoIHNlcmllcyBwb2ludC4gVGhpcyB3aWxsIGFsc28gaW5mbHVlbmNlIHRoZSB5LWF4aXMgYW5kIHRoZSBvdmVyYWxsIGJvdW5kcyBvZiB0aGUgY2hhcnQuIEluIHN0YWNrZWQgbW9kZSB0aGUgc2VyaWVzQmFyRGlzdGFuY2UgcHJvcGVydHkgd2lsbCBoYXZlIG5vIGVmZmVjdC5cbiAgICBzdGFja01vZGU6ICdhY2N1bXVsYXRlJyxcbiAgICAvLyBJbnZlcnRzIHRoZSBheGVzIG9mIHRoZSBiYXIgY2hhcnQgaW4gb3JkZXIgdG8gZHJhdyBhIGhvcml6b250YWwgYmFyIGNoYXJ0LiBCZSBhd2FyZSB0aGF0IHlvdSBhbHNvIG5lZWQgdG8gaW52ZXJ0IHlvdXIgYXhpcyBzZXR0aW5ncyBhcyB0aGUgWSBBeGlzIHdpbGwgbm93IGRpc3BsYXkgdGhlIGxhYmVscyBhbmQgdGhlIFggQXhpcyB0aGUgdmFsdWVzLlxuICAgIGhvcml6b250YWxCYXJzOiBmYWxzZSxcbiAgICAvLyBJZiBzZXQgdG8gdHJ1ZSB0aGVuIGVhY2ggYmFyIHdpbGwgcmVwcmVzZW50IGEgc2VyaWVzIGFuZCB0aGUgZGF0YSBhcnJheSBpcyBleHBlY3RlZCB0byBiZSBhIG9uZSBkaW1lbnNpb25hbCBhcnJheSBvZiBkYXRhIHZhbHVlcyByYXRoZXIgdGhhbiBhIHNlcmllcyBhcnJheSBvZiBzZXJpZXMuIFRoaXMgaXMgdXNlZnVsIGlmIHRoZSBiYXIgY2hhcnQgc2hvdWxkIHJlcHJlc2VudCBhIHByb2ZpbGUgcmF0aGVyIHRoYW4gc29tZSBkYXRhIG92ZXIgdGltZS5cbiAgICBkaXN0cmlidXRlU2VyaWVzOiBmYWxzZSxcbiAgICAvLyBJZiB0cnVlIHRoZSB3aG9sZSBkYXRhIGlzIHJldmVyc2VkIGluY2x1ZGluZyBsYWJlbHMsIHRoZSBzZXJpZXMgb3JkZXIgYXMgd2VsbCBhcyB0aGUgd2hvbGUgc2VyaWVzIGRhdGEgYXJyYXlzLlxuICAgIHJldmVyc2VEYXRhOiBmYWxzZSxcbiAgICAvLyBPdmVycmlkZSB0aGUgY2xhc3MgbmFtZXMgdGhhdCBnZXQgdXNlZCB0byBnZW5lcmF0ZSB0aGUgU1ZHIHN0cnVjdHVyZSBvZiB0aGUgY2hhcnRcbiAgICBjbGFzc05hbWVzOiB7XG4gICAgICBjaGFydDogJ2N0LWNoYXJ0LWJhcicsXG4gICAgICBob3Jpem9udGFsQmFyczogJ2N0LWhvcml6b250YWwtYmFycycsXG4gICAgICBsYWJlbDogJ2N0LWxhYmVsJyxcbiAgICAgIGxhYmVsR3JvdXA6ICdjdC1sYWJlbHMnLFxuICAgICAgc2VyaWVzOiAnY3Qtc2VyaWVzJyxcbiAgICAgIGJhcjogJ2N0LWJhcicsXG4gICAgICBncmlkOiAnY3QtZ3JpZCcsXG4gICAgICBncmlkR3JvdXA6ICdjdC1ncmlkcycsXG4gICAgICB2ZXJ0aWNhbDogJ2N0LXZlcnRpY2FsJyxcbiAgICAgIGhvcml6b250YWw6ICdjdC1ob3Jpem9udGFsJyxcbiAgICAgIHN0YXJ0OiAnY3Qtc3RhcnQnLFxuICAgICAgZW5kOiAnY3QtZW5kJ1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBjaGFydFxuICAgKlxuICAgKi9cbiAgZnVuY3Rpb24gY3JlYXRlQ2hhcnQob3B0aW9ucykge1xuICAgIHRoaXMuZGF0YSA9IENoYXJ0aXN0Lm5vcm1hbGl6ZURhdGEodGhpcy5kYXRhKTtcbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgIHJhdzogdGhpcy5kYXRhLFxuICAgICAgbm9ybWFsaXplZDogb3B0aW9ucy5kaXN0cmlidXRlU2VyaWVzID8gQ2hhcnRpc3QuZ2V0RGF0YUFycmF5KHRoaXMuZGF0YSwgb3B0aW9ucy5yZXZlcnNlRGF0YSwgb3B0aW9ucy5ob3Jpem9udGFsQmFycyA/ICd4JyA6ICd5JykubWFwKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBbdmFsdWVdO1xuICAgICAgfSkgOiBDaGFydGlzdC5nZXREYXRhQXJyYXkodGhpcy5kYXRhLCBvcHRpb25zLnJldmVyc2VEYXRhLCBvcHRpb25zLmhvcml6b250YWxCYXJzID8gJ3gnIDogJ3knKVxuICAgIH07XG5cbiAgICB2YXIgaGlnaExvdztcblxuICAgIC8vIENyZWF0ZSBuZXcgc3ZnIGVsZW1lbnRcbiAgICB0aGlzLnN2ZyA9IENoYXJ0aXN0LmNyZWF0ZVN2ZyhcbiAgICAgIHRoaXMuY29udGFpbmVyLFxuICAgICAgb3B0aW9ucy53aWR0aCxcbiAgICAgIG9wdGlvbnMuaGVpZ2h0LFxuICAgICAgb3B0aW9ucy5jbGFzc05hbWVzLmNoYXJ0ICsgKG9wdGlvbnMuaG9yaXpvbnRhbEJhcnMgPyAnICcgKyBvcHRpb25zLmNsYXNzTmFtZXMuaG9yaXpvbnRhbEJhcnMgOiAnJylcbiAgICApO1xuXG4gICAgLy8gRHJhd2luZyBncm91cHMgaW4gY29ycmVjdCBvcmRlclxuICAgIHZhciBncmlkR3JvdXAgPSB0aGlzLnN2Zy5lbGVtKCdnJykuYWRkQ2xhc3Mob3B0aW9ucy5jbGFzc05hbWVzLmdyaWRHcm91cCk7XG4gICAgdmFyIHNlcmllc0dyb3VwID0gdGhpcy5zdmcuZWxlbSgnZycpO1xuICAgIHZhciBsYWJlbEdyb3VwID0gdGhpcy5zdmcuZWxlbSgnZycpLmFkZENsYXNzKG9wdGlvbnMuY2xhc3NOYW1lcy5sYWJlbEdyb3VwKTtcblxuICAgIGlmKG9wdGlvbnMuc3RhY2tCYXJzICYmIGRhdGEubm9ybWFsaXplZC5sZW5ndGggIT09IDApIHtcbiAgICAgIC8vIElmIHN0YWNrZWQgYmFycyB3ZSBuZWVkIHRvIGNhbGN1bGF0ZSB0aGUgaGlnaCBsb3cgZnJvbSBzdGFja2VkIHZhbHVlcyBmcm9tIGVhY2ggc2VyaWVzXG4gICAgICB2YXIgc2VyaWFsU3VtcyA9IENoYXJ0aXN0LnNlcmlhbE1hcChkYXRhLm5vcm1hbGl6ZWQsIGZ1bmN0aW9uIHNlcmlhbFN1bXMoKSB7XG4gICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpLm1hcChmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfSkucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGN1cnIpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogcHJldi54ICsgKGN1cnIgJiYgY3Vyci54KSB8fCAwLFxuICAgICAgICAgICAgeTogcHJldi55ICsgKGN1cnIgJiYgY3Vyci55KSB8fCAwXG4gICAgICAgICAgfTtcbiAgICAgICAgfSwge3g6IDAsIHk6IDB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBoaWdoTG93ID0gQ2hhcnRpc3QuZ2V0SGlnaExvdyhbc2VyaWFsU3Vtc10sIENoYXJ0aXN0LmV4dGVuZCh7fSwgb3B0aW9ucywge1xuICAgICAgICByZWZlcmVuY2VWYWx1ZTogMFxuICAgICAgfSksIG9wdGlvbnMuaG9yaXpvbnRhbEJhcnMgPyAneCcgOiAneScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBoaWdoTG93ID0gQ2hhcnRpc3QuZ2V0SGlnaExvdyhkYXRhLm5vcm1hbGl6ZWQsIENoYXJ0aXN0LmV4dGVuZCh7fSwgb3B0aW9ucywge1xuICAgICAgICByZWZlcmVuY2VWYWx1ZTogMFxuICAgICAgfSksIG9wdGlvbnMuaG9yaXpvbnRhbEJhcnMgPyAneCcgOiAneScpO1xuICAgIH1cbiAgICAvLyBPdmVycmlkZXMgb2YgaGlnaCAvIGxvdyBmcm9tIHNldHRpbmdzXG4gICAgaGlnaExvdy5oaWdoID0gK29wdGlvbnMuaGlnaCB8fCAob3B0aW9ucy5oaWdoID09PSAwID8gMCA6IGhpZ2hMb3cuaGlnaCk7XG4gICAgaGlnaExvdy5sb3cgPSArb3B0aW9ucy5sb3cgfHwgKG9wdGlvbnMubG93ID09PSAwID8gMCA6IGhpZ2hMb3cubG93KTtcblxuICAgIHZhciBjaGFydFJlY3QgPSBDaGFydGlzdC5jcmVhdGVDaGFydFJlY3QodGhpcy5zdmcsIG9wdGlvbnMsIGRlZmF1bHRPcHRpb25zLnBhZGRpbmcpO1xuXG4gICAgdmFyIHZhbHVlQXhpcyxcbiAgICAgIGxhYmVsQXhpc1RpY2tzLFxuICAgICAgbGFiZWxBeGlzLFxuICAgICAgYXhpc1gsXG4gICAgICBheGlzWTtcblxuICAgIC8vIFdlIG5lZWQgdG8gc2V0IHN0ZXAgY291bnQgYmFzZWQgb24gc29tZSBvcHRpb25zIGNvbWJpbmF0aW9uc1xuICAgIGlmKG9wdGlvbnMuZGlzdHJpYnV0ZVNlcmllcyAmJiBvcHRpb25zLnN0YWNrQmFycykge1xuICAgICAgLy8gSWYgZGlzdHJpYnV0ZWQgc2VyaWVzIGFyZSBlbmFibGVkIGFuZCBiYXJzIG5lZWQgdG8gYmUgc3RhY2tlZCwgd2UnbGwgb25seSBoYXZlIG9uZSBiYXIgYW5kIHRoZXJlZm9yZSBzaG91bGRcbiAgICAgIC8vIHVzZSBvbmx5IHRoZSBmaXJzdCBsYWJlbCBmb3IgdGhlIHN0ZXAgYXhpc1xuICAgICAgbGFiZWxBeGlzVGlja3MgPSBkYXRhLnJhdy5sYWJlbHMuc2xpY2UoMCwgMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElmIGRpc3RyaWJ1dGVkIHNlcmllcyBhcmUgZW5hYmxlZCBidXQgc3RhY2tlZCBiYXJzIGFyZW4ndCwgd2Ugc2hvdWxkIHVzZSB0aGUgc2VyaWVzIGxhYmVsc1xuICAgICAgLy8gSWYgd2UgYXJlIGRyYXdpbmcgYSByZWd1bGFyIGJhciBjaGFydCB3aXRoIHR3byBkaW1lbnNpb25hbCBzZXJpZXMgZGF0YSwgd2UganVzdCB1c2UgdGhlIGxhYmVscyBhcnJheVxuICAgICAgLy8gYXMgdGhlIGJhcnMgYXJlIG5vcm1hbGl6ZWRcbiAgICAgIGxhYmVsQXhpc1RpY2tzID0gZGF0YS5yYXcubGFiZWxzO1xuICAgIH1cblxuICAgIC8vIFNldCBsYWJlbEF4aXMgYW5kIHZhbHVlQXhpcyBiYXNlZCBvbiB0aGUgaG9yaXpvbnRhbEJhcnMgc2V0dGluZy4gVGhpcyBzZXR0aW5nIHdpbGwgZmxpcCB0aGUgYXhlcyBpZiBuZWNlc3NhcnkuXG4gICAgaWYob3B0aW9ucy5ob3Jpem9udGFsQmFycykge1xuICAgICAgaWYob3B0aW9ucy5heGlzWC50eXBlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdmFsdWVBeGlzID0gYXhpc1ggPSBuZXcgQ2hhcnRpc3QuQXV0b1NjYWxlQXhpcyhDaGFydGlzdC5BeGlzLnVuaXRzLngsIGRhdGEsIGNoYXJ0UmVjdCwgQ2hhcnRpc3QuZXh0ZW5kKHt9LCBvcHRpb25zLmF4aXNYLCB7XG4gICAgICAgICAgaGlnaExvdzogaGlnaExvdyxcbiAgICAgICAgICByZWZlcmVuY2VWYWx1ZTogMFxuICAgICAgICB9KSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZUF4aXMgPSBheGlzWCA9IG9wdGlvbnMuYXhpc1gudHlwZS5jYWxsKENoYXJ0aXN0LCBDaGFydGlzdC5BeGlzLnVuaXRzLngsIGRhdGEsIGNoYXJ0UmVjdCwgQ2hhcnRpc3QuZXh0ZW5kKHt9LCBvcHRpb25zLmF4aXNYLCB7XG4gICAgICAgICAgaGlnaExvdzogaGlnaExvdyxcbiAgICAgICAgICByZWZlcmVuY2VWYWx1ZTogMFxuICAgICAgICB9KSk7XG4gICAgICB9XG5cbiAgICAgIGlmKG9wdGlvbnMuYXhpc1kudHlwZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGxhYmVsQXhpcyA9IGF4aXNZID0gbmV3IENoYXJ0aXN0LlN0ZXBBeGlzKENoYXJ0aXN0LkF4aXMudW5pdHMueSwgZGF0YSwgY2hhcnRSZWN0LCB7XG4gICAgICAgICAgdGlja3M6IGxhYmVsQXhpc1RpY2tzXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGFiZWxBeGlzID0gYXhpc1kgPSBvcHRpb25zLmF4aXNZLnR5cGUuY2FsbChDaGFydGlzdCwgQ2hhcnRpc3QuQXhpcy51bml0cy55LCBkYXRhLCBjaGFydFJlY3QsIG9wdGlvbnMuYXhpc1kpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZihvcHRpb25zLmF4aXNYLnR5cGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBsYWJlbEF4aXMgPSBheGlzWCA9IG5ldyBDaGFydGlzdC5TdGVwQXhpcyhDaGFydGlzdC5BeGlzLnVuaXRzLngsIGRhdGEsIGNoYXJ0UmVjdCwge1xuICAgICAgICAgIHRpY2tzOiBsYWJlbEF4aXNUaWNrc1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxhYmVsQXhpcyA9IGF4aXNYID0gb3B0aW9ucy5heGlzWC50eXBlLmNhbGwoQ2hhcnRpc3QsIENoYXJ0aXN0LkF4aXMudW5pdHMueCwgZGF0YSwgY2hhcnRSZWN0LCBvcHRpb25zLmF4aXNYKTtcbiAgICAgIH1cblxuICAgICAgaWYob3B0aW9ucy5heGlzWS50eXBlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdmFsdWVBeGlzID0gYXhpc1kgPSBuZXcgQ2hhcnRpc3QuQXV0b1NjYWxlQXhpcyhDaGFydGlzdC5BeGlzLnVuaXRzLnksIGRhdGEsIGNoYXJ0UmVjdCwgQ2hhcnRpc3QuZXh0ZW5kKHt9LCBvcHRpb25zLmF4aXNZLCB7XG4gICAgICAgICAgaGlnaExvdzogaGlnaExvdyxcbiAgICAgICAgICByZWZlcmVuY2VWYWx1ZTogMFxuICAgICAgICB9KSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZUF4aXMgPSBheGlzWSA9IG9wdGlvbnMuYXhpc1kudHlwZS5jYWxsKENoYXJ0aXN0LCBDaGFydGlzdC5BeGlzLnVuaXRzLnksIGRhdGEsIGNoYXJ0UmVjdCwgQ2hhcnRpc3QuZXh0ZW5kKHt9LCBvcHRpb25zLmF4aXNZLCB7XG4gICAgICAgICAgaGlnaExvdzogaGlnaExvdyxcbiAgICAgICAgICByZWZlcmVuY2VWYWx1ZTogMFxuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUHJvamVjdGVkIDAgcG9pbnRcbiAgICB2YXIgemVyb1BvaW50ID0gb3B0aW9ucy5ob3Jpem9udGFsQmFycyA/IChjaGFydFJlY3QueDEgKyB2YWx1ZUF4aXMucHJvamVjdFZhbHVlKDApKSA6IChjaGFydFJlY3QueTEgLSB2YWx1ZUF4aXMucHJvamVjdFZhbHVlKDApKTtcbiAgICAvLyBVc2VkIHRvIHRyYWNrIHRoZSBzY3JlZW4gY29vcmRpbmF0ZXMgb2Ygc3RhY2tlZCBiYXJzXG4gICAgdmFyIHN0YWNrZWRCYXJWYWx1ZXMgPSBbXTtcblxuICAgIGxhYmVsQXhpcy5jcmVhdGVHcmlkQW5kTGFiZWxzKGdyaWRHcm91cCwgbGFiZWxHcm91cCwgdGhpcy5zdXBwb3J0c0ZvcmVpZ25PYmplY3QsIG9wdGlvbnMsIHRoaXMuZXZlbnRFbWl0dGVyKTtcbiAgICB2YWx1ZUF4aXMuY3JlYXRlR3JpZEFuZExhYmVscyhncmlkR3JvdXAsIGxhYmVsR3JvdXAsIHRoaXMuc3VwcG9ydHNGb3JlaWduT2JqZWN0LCBvcHRpb25zLCB0aGlzLmV2ZW50RW1pdHRlcik7XG5cbiAgICAvLyBEcmF3IHRoZSBzZXJpZXNcbiAgICBkYXRhLnJhdy5zZXJpZXMuZm9yRWFjaChmdW5jdGlvbihzZXJpZXMsIHNlcmllc0luZGV4KSB7XG4gICAgICAvLyBDYWxjdWxhdGluZyBiaS1wb2xhciB2YWx1ZSBvZiBpbmRleCBmb3Igc2VyaWVzT2Zmc2V0LiBGb3IgaSA9IDAuLjQgYmlQb2wgd2lsbCBiZSAtMS41LCAtMC41LCAwLjUsIDEuNSBldGMuXG4gICAgICB2YXIgYmlQb2wgPSBzZXJpZXNJbmRleCAtIChkYXRhLnJhdy5zZXJpZXMubGVuZ3RoIC0gMSkgLyAyO1xuICAgICAgLy8gSGFsZiBvZiB0aGUgcGVyaW9kIHdpZHRoIGJldHdlZW4gdmVydGljYWwgZ3JpZCBsaW5lcyB1c2VkIHRvIHBvc2l0aW9uIGJhcnNcbiAgICAgIHZhciBwZXJpb2RIYWxmTGVuZ3RoO1xuICAgICAgLy8gQ3VycmVudCBzZXJpZXMgU1ZHIGVsZW1lbnRcbiAgICAgIHZhciBzZXJpZXNFbGVtZW50O1xuXG4gICAgICAvLyBXZSBuZWVkIHRvIHNldCBwZXJpb2RIYWxmTGVuZ3RoIGJhc2VkIG9uIHNvbWUgb3B0aW9ucyBjb21iaW5hdGlvbnNcbiAgICAgIGlmKG9wdGlvbnMuZGlzdHJpYnV0ZVNlcmllcyAmJiAhb3B0aW9ucy5zdGFja0JhcnMpIHtcbiAgICAgICAgLy8gSWYgZGlzdHJpYnV0ZWQgc2VyaWVzIGFyZSBlbmFibGVkIGJ1dCBzdGFja2VkIGJhcnMgYXJlbid0LCB3ZSBuZWVkIHRvIHVzZSB0aGUgbGVuZ3RoIG9mIHRoZSBub3JtYWl6ZWREYXRhIGFycmF5XG4gICAgICAgIC8vIHdoaWNoIGlzIHRoZSBzZXJpZXMgY291bnQgYW5kIGRpdmlkZSBieSAyXG4gICAgICAgIHBlcmlvZEhhbGZMZW5ndGggPSBsYWJlbEF4aXMuYXhpc0xlbmd0aCAvIGRhdGEubm9ybWFsaXplZC5sZW5ndGggLyAyO1xuICAgICAgfSBlbHNlIGlmKG9wdGlvbnMuZGlzdHJpYnV0ZVNlcmllcyAmJiBvcHRpb25zLnN0YWNrQmFycykge1xuICAgICAgICAvLyBJZiBkaXN0cmlidXRlZCBzZXJpZXMgYW5kIHN0YWNrZWQgYmFycyBhcmUgZW5hYmxlZCB3ZSdsbCBvbmx5IGdldCBvbmUgYmFyIHNvIHdlIHNob3VsZCBqdXN0IGRpdmlkZSB0aGUgYXhpc1xuICAgICAgICAvLyBsZW5ndGggYnkgMlxuICAgICAgICBwZXJpb2RIYWxmTGVuZ3RoID0gbGFiZWxBeGlzLmF4aXNMZW5ndGggLyAyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gT24gcmVndWxhciBiYXIgY2hhcnRzIHdlIHNob3VsZCBqdXN0IHVzZSB0aGUgc2VyaWVzIGxlbmd0aFxuICAgICAgICBwZXJpb2RIYWxmTGVuZ3RoID0gbGFiZWxBeGlzLmF4aXNMZW5ndGggLyBkYXRhLm5vcm1hbGl6ZWRbc2VyaWVzSW5kZXhdLmxlbmd0aCAvIDI7XG4gICAgICB9XG5cbiAgICAgIC8vIEFkZGluZyB0aGUgc2VyaWVzIGdyb3VwIHRvIHRoZSBzZXJpZXMgZWxlbWVudFxuICAgICAgc2VyaWVzRWxlbWVudCA9IHNlcmllc0dyb3VwLmVsZW0oJ2cnKTtcblxuICAgICAgLy8gV3JpdGUgYXR0cmlidXRlcyB0byBzZXJpZXMgZ3JvdXAgZWxlbWVudC4gSWYgc2VyaWVzIG5hbWUgb3IgbWV0YSBpcyB1bmRlZmluZWQgdGhlIGF0dHJpYnV0ZXMgd2lsbCBub3QgYmUgd3JpdHRlblxuICAgICAgc2VyaWVzRWxlbWVudC5hdHRyKHtcbiAgICAgICAgJ2N0OnNlcmllcy1uYW1lJzogc2VyaWVzLm5hbWUsXG4gICAgICAgICdjdDptZXRhJzogQ2hhcnRpc3Quc2VyaWFsaXplKHNlcmllcy5tZXRhKVxuICAgICAgfSk7XG5cbiAgICAgIC8vIFVzZSBzZXJpZXMgY2xhc3MgZnJvbSBzZXJpZXMgZGF0YSBvciBpZiBub3Qgc2V0IGdlbmVyYXRlIG9uZVxuICAgICAgc2VyaWVzRWxlbWVudC5hZGRDbGFzcyhbXG4gICAgICAgIG9wdGlvbnMuY2xhc3NOYW1lcy5zZXJpZXMsXG4gICAgICAgIChzZXJpZXMuY2xhc3NOYW1lIHx8IG9wdGlvbnMuY2xhc3NOYW1lcy5zZXJpZXMgKyAnLScgKyBDaGFydGlzdC5hbHBoYU51bWVyYXRlKHNlcmllc0luZGV4KSlcbiAgICAgIF0uam9pbignICcpKTtcblxuICAgICAgZGF0YS5ub3JtYWxpemVkW3Nlcmllc0luZGV4XS5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCB2YWx1ZUluZGV4KSB7XG4gICAgICAgIHZhciBwcm9qZWN0ZWQsXG4gICAgICAgICAgYmFyLFxuICAgICAgICAgIHByZXZpb3VzU3RhY2ssXG4gICAgICAgICAgbGFiZWxBeGlzVmFsdWVJbmRleDtcblxuICAgICAgICAvLyBXZSBuZWVkIHRvIHNldCBsYWJlbEF4aXNWYWx1ZUluZGV4IGJhc2VkIG9uIHNvbWUgb3B0aW9ucyBjb21iaW5hdGlvbnNcbiAgICAgICAgaWYob3B0aW9ucy5kaXN0cmlidXRlU2VyaWVzICYmICFvcHRpb25zLnN0YWNrQmFycykge1xuICAgICAgICAgIC8vIElmIGRpc3RyaWJ1dGVkIHNlcmllcyBhcmUgZW5hYmxlZCBidXQgc3RhY2tlZCBiYXJzIGFyZW4ndCwgd2UgY2FuIHVzZSB0aGUgc2VyaWVzSW5kZXggZm9yIGxhdGVyIHByb2plY3Rpb25cbiAgICAgICAgICAvLyBvbiB0aGUgc3RlcCBheGlzIGZvciBsYWJlbCBwb3NpdGlvbmluZ1xuICAgICAgICAgIGxhYmVsQXhpc1ZhbHVlSW5kZXggPSBzZXJpZXNJbmRleDtcbiAgICAgICAgfSBlbHNlIGlmKG9wdGlvbnMuZGlzdHJpYnV0ZVNlcmllcyAmJiBvcHRpb25zLnN0YWNrQmFycykge1xuICAgICAgICAgIC8vIElmIGRpc3RyaWJ1dGVkIHNlcmllcyBhbmQgc3RhY2tlZCBiYXJzIGFyZSBlbmFibGVkLCB3ZSB3aWxsIG9ubHkgZ2V0IG9uZSBiYXIgYW5kIHRoZXJlZm9yZSBhbHdheXMgdXNlXG4gICAgICAgICAgLy8gMCBmb3IgcHJvamVjdGlvbiBvbiB0aGUgbGFiZWwgc3RlcCBheGlzXG4gICAgICAgICAgbGFiZWxBeGlzVmFsdWVJbmRleCA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gT24gcmVndWxhciBiYXIgY2hhcnRzIHdlIGp1c3QgdXNlIHRoZSB2YWx1ZSBpbmRleCB0byBwcm9qZWN0IG9uIHRoZSBsYWJlbCBzdGVwIGF4aXNcbiAgICAgICAgICBsYWJlbEF4aXNWYWx1ZUluZGV4ID0gdmFsdWVJbmRleDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFdlIG5lZWQgdG8gdHJhbnNmb3JtIGNvb3JkaW5hdGVzIGRpZmZlcmVudGx5IGJhc2VkIG9uIHRoZSBjaGFydCBsYXlvdXRcbiAgICAgICAgaWYob3B0aW9ucy5ob3Jpem9udGFsQmFycykge1xuICAgICAgICAgIHByb2plY3RlZCA9IHtcbiAgICAgICAgICAgIHg6IGNoYXJ0UmVjdC54MSArIHZhbHVlQXhpcy5wcm9qZWN0VmFsdWUodmFsdWUgJiYgdmFsdWUueCA/IHZhbHVlLnggOiAwLCB2YWx1ZUluZGV4LCBkYXRhLm5vcm1hbGl6ZWRbc2VyaWVzSW5kZXhdKSxcbiAgICAgICAgICAgIHk6IGNoYXJ0UmVjdC55MSAtIGxhYmVsQXhpcy5wcm9qZWN0VmFsdWUodmFsdWUgJiYgdmFsdWUueSA/IHZhbHVlLnkgOiAwLCBsYWJlbEF4aXNWYWx1ZUluZGV4LCBkYXRhLm5vcm1hbGl6ZWRbc2VyaWVzSW5kZXhdKVxuICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHJvamVjdGVkID0ge1xuICAgICAgICAgICAgeDogY2hhcnRSZWN0LngxICsgbGFiZWxBeGlzLnByb2plY3RWYWx1ZSh2YWx1ZSAmJiB2YWx1ZS54ID8gdmFsdWUueCA6IDAsIGxhYmVsQXhpc1ZhbHVlSW5kZXgsIGRhdGEubm9ybWFsaXplZFtzZXJpZXNJbmRleF0pLFxuICAgICAgICAgICAgeTogY2hhcnRSZWN0LnkxIC0gdmFsdWVBeGlzLnByb2plY3RWYWx1ZSh2YWx1ZSAmJiB2YWx1ZS55ID8gdmFsdWUueSA6IDAsIHZhbHVlSW5kZXgsIGRhdGEubm9ybWFsaXplZFtzZXJpZXNJbmRleF0pXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgdGhlIGxhYmVsIGF4aXMgaXMgYSBzdGVwIGJhc2VkIGF4aXMgd2Ugd2lsbCBvZmZzZXQgdGhlIGJhciBpbnRvIHRoZSBtaWRkbGUgb2YgYmV0d2VlbiB0d28gc3RlcHMgdXNpbmdcbiAgICAgICAgLy8gdGhlIHBlcmlvZEhhbGZMZW5ndGggdmFsdWUuIEFsc28gd2UgZG8gYXJyYW5nZSB0aGUgZGlmZmVyZW50IHNlcmllcyBzbyB0aGF0IHRoZXkgYWxpZ24gdXAgdG8gZWFjaCBvdGhlciB1c2luZ1xuICAgICAgICAvLyB0aGUgc2VyaWVzQmFyRGlzdGFuY2UuIElmIHdlIGRvbid0IGhhdmUgYSBzdGVwIGF4aXMsIHRoZSBiYXIgcG9zaXRpb25zIGNhbiBiZSBjaG9zZW4gZnJlZWx5IHNvIHdlIHNob3VsZCBub3RcbiAgICAgICAgLy8gYWRkIGFueSBhdXRvbWF0ZWQgcG9zaXRpb25pbmcuXG4gICAgICAgIGlmKGxhYmVsQXhpcyBpbnN0YW5jZW9mIENoYXJ0aXN0LlN0ZXBBeGlzKSB7XG4gICAgICAgICAgLy8gT2Zmc2V0IHRvIGNlbnRlciBiYXIgYmV0d2VlbiBncmlkIGxpbmVzLCBidXQgb25seSBpZiB0aGUgc3RlcCBheGlzIGlzIG5vdCBzdHJldGNoZWRcbiAgICAgICAgICBpZighbGFiZWxBeGlzLm9wdGlvbnMuc3RyZXRjaCkge1xuICAgICAgICAgICAgcHJvamVjdGVkW2xhYmVsQXhpcy51bml0cy5wb3NdICs9IHBlcmlvZEhhbGZMZW5ndGggKiAob3B0aW9ucy5ob3Jpem9udGFsQmFycyA/IC0xIDogMSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIFVzaW5nIGJpLXBvbGFyIG9mZnNldCBmb3IgbXVsdGlwbGUgc2VyaWVzIGlmIG5vIHN0YWNrZWQgYmFycyBvciBzZXJpZXMgZGlzdHJpYnV0aW9uIGlzIHVzZWRcbiAgICAgICAgICBwcm9qZWN0ZWRbbGFiZWxBeGlzLnVuaXRzLnBvc10gKz0gKG9wdGlvbnMuc3RhY2tCYXJzIHx8IG9wdGlvbnMuZGlzdHJpYnV0ZVNlcmllcykgPyAwIDogYmlQb2wgKiBvcHRpb25zLnNlcmllc0JhckRpc3RhbmNlICogKG9wdGlvbnMuaG9yaXpvbnRhbEJhcnMgPyAtMSA6IDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRW50ZXIgdmFsdWUgaW4gc3RhY2tlZCBiYXIgdmFsdWVzIHVzZWQgdG8gcmVtZW1iZXIgcHJldmlvdXMgc2NyZWVuIHZhbHVlIGZvciBzdGFja2luZyB1cCBiYXJzXG4gICAgICAgIHByZXZpb3VzU3RhY2sgPSBzdGFja2VkQmFyVmFsdWVzW3ZhbHVlSW5kZXhdIHx8IHplcm9Qb2ludDtcbiAgICAgICAgc3RhY2tlZEJhclZhbHVlc1t2YWx1ZUluZGV4XSA9IHByZXZpb3VzU3RhY2sgLSAoemVyb1BvaW50IC0gcHJvamVjdGVkW2xhYmVsQXhpcy5jb3VudGVyVW5pdHMucG9zXSk7XG5cbiAgICAgICAgLy8gU2tpcCBpZiB2YWx1ZSBpcyB1bmRlZmluZWRcbiAgICAgICAgaWYodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBwb3NpdGlvbnMgPSB7fTtcbiAgICAgICAgcG9zaXRpb25zW2xhYmVsQXhpcy51bml0cy5wb3MgKyAnMSddID0gcHJvamVjdGVkW2xhYmVsQXhpcy51bml0cy5wb3NdO1xuICAgICAgICBwb3NpdGlvbnNbbGFiZWxBeGlzLnVuaXRzLnBvcyArICcyJ10gPSBwcm9qZWN0ZWRbbGFiZWxBeGlzLnVuaXRzLnBvc107XG5cbiAgICAgICAgaWYob3B0aW9ucy5zdGFja0JhcnMgJiYgKG9wdGlvbnMuc3RhY2tNb2RlID09PSAnYWNjdW11bGF0ZScgfHwgIW9wdGlvbnMuc3RhY2tNb2RlKSkge1xuICAgICAgICAgIC8vIFN0YWNrIG1vZGU6IGFjY3VtdWxhdGUgKGRlZmF1bHQpXG4gICAgICAgICAgLy8gSWYgYmFycyBhcmUgc3RhY2tlZCB3ZSB1c2UgdGhlIHN0YWNrZWRCYXJWYWx1ZXMgcmVmZXJlbmNlIGFuZCBvdGhlcndpc2UgYmFzZSBhbGwgYmFycyBvZmYgdGhlIHplcm8gbGluZVxuICAgICAgICAgIC8vIFdlIHdhbnQgYmFja3dhcmRzIGNvbXBhdGliaWxpdHksIHNvIHRoZSBleHBlY3RlZCBmYWxsYmFjayB3aXRob3V0IHRoZSAnc3RhY2tNb2RlJyBvcHRpb25cbiAgICAgICAgICAvLyB0byBiZSB0aGUgb3JpZ2luYWwgYmVoYXZpb3VyIChhY2N1bXVsYXRlKVxuICAgICAgICAgIHBvc2l0aW9uc1tsYWJlbEF4aXMuY291bnRlclVuaXRzLnBvcyArICcxJ10gPSBwcmV2aW91c1N0YWNrO1xuICAgICAgICAgIHBvc2l0aW9uc1tsYWJlbEF4aXMuY291bnRlclVuaXRzLnBvcyArICcyJ10gPSBzdGFja2VkQmFyVmFsdWVzW3ZhbHVlSW5kZXhdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIERyYXcgZnJvbSB0aGUgemVybyBsaW5lIG5vcm1hbGx5XG4gICAgICAgICAgLy8gVGhpcyBpcyBhbHNvIHRoZSBzYW1lIGNvZGUgZm9yIFN0YWNrIG1vZGU6IG92ZXJsYXBcbiAgICAgICAgICBwb3NpdGlvbnNbbGFiZWxBeGlzLmNvdW50ZXJVbml0cy5wb3MgKyAnMSddID0gemVyb1BvaW50O1xuICAgICAgICAgIHBvc2l0aW9uc1tsYWJlbEF4aXMuY291bnRlclVuaXRzLnBvcyArICcyJ10gPSBwcm9qZWN0ZWRbbGFiZWxBeGlzLmNvdW50ZXJVbml0cy5wb3NdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTGltaXQgeCBhbmQgeSBzbyB0aGF0IHRoZXkgYXJlIHdpdGhpbiB0aGUgY2hhcnQgcmVjdFxuICAgICAgICBwb3NpdGlvbnMueDEgPSBNYXRoLm1pbihNYXRoLm1heChwb3NpdGlvbnMueDEsIGNoYXJ0UmVjdC54MSksIGNoYXJ0UmVjdC54Mik7XG4gICAgICAgIHBvc2l0aW9ucy54MiA9IE1hdGgubWluKE1hdGgubWF4KHBvc2l0aW9ucy54MiwgY2hhcnRSZWN0LngxKSwgY2hhcnRSZWN0LngyKTtcbiAgICAgICAgcG9zaXRpb25zLnkxID0gTWF0aC5taW4oTWF0aC5tYXgocG9zaXRpb25zLnkxLCBjaGFydFJlY3QueTIpLCBjaGFydFJlY3QueTEpO1xuICAgICAgICBwb3NpdGlvbnMueTIgPSBNYXRoLm1pbihNYXRoLm1heChwb3NpdGlvbnMueTIsIGNoYXJ0UmVjdC55MiksIGNoYXJ0UmVjdC55MSk7XG5cbiAgICAgICAgLy8gQ3JlYXRlIGJhciBlbGVtZW50XG4gICAgICAgIGJhciA9IHNlcmllc0VsZW1lbnQuZWxlbSgnbGluZScsIHBvc2l0aW9ucywgb3B0aW9ucy5jbGFzc05hbWVzLmJhcikuYXR0cih7XG4gICAgICAgICAgJ2N0OnZhbHVlJzogW3ZhbHVlLngsIHZhbHVlLnldLmZpbHRlcihDaGFydGlzdC5pc051bSkuam9pbignLCcpLFxuICAgICAgICAgICdjdDptZXRhJzogQ2hhcnRpc3QuZ2V0TWV0YURhdGEoc2VyaWVzLCB2YWx1ZUluZGV4KVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmV2ZW50RW1pdHRlci5lbWl0KCdkcmF3JywgQ2hhcnRpc3QuZXh0ZW5kKHtcbiAgICAgICAgICB0eXBlOiAnYmFyJyxcbiAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgaW5kZXg6IHZhbHVlSW5kZXgsXG4gICAgICAgICAgbWV0YTogQ2hhcnRpc3QuZ2V0TWV0YURhdGEoc2VyaWVzLCB2YWx1ZUluZGV4KSxcbiAgICAgICAgICBzZXJpZXM6IHNlcmllcyxcbiAgICAgICAgICBzZXJpZXNJbmRleDogc2VyaWVzSW5kZXgsXG4gICAgICAgICAgYXhpc1g6IGF4aXNYLFxuICAgICAgICAgIGF4aXNZOiBheGlzWSxcbiAgICAgICAgICBjaGFydFJlY3Q6IGNoYXJ0UmVjdCxcbiAgICAgICAgICBncm91cDogc2VyaWVzRWxlbWVudCxcbiAgICAgICAgICBlbGVtZW50OiBiYXJcbiAgICAgICAgfSwgcG9zaXRpb25zKSk7XG4gICAgICB9LmJpbmQodGhpcykpO1xuICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICB0aGlzLmV2ZW50RW1pdHRlci5lbWl0KCdjcmVhdGVkJywge1xuICAgICAgYm91bmRzOiB2YWx1ZUF4aXMuYm91bmRzLFxuICAgICAgY2hhcnRSZWN0OiBjaGFydFJlY3QsXG4gICAgICBheGlzWDogYXhpc1gsXG4gICAgICBheGlzWTogYXhpc1ksXG4gICAgICBzdmc6IHRoaXMuc3ZnLFxuICAgICAgb3B0aW9uczogb3B0aW9uc1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIGNyZWF0ZXMgYSBuZXcgYmFyIGNoYXJ0IGFuZCByZXR1cm5zIEFQSSBvYmplY3QgdGhhdCB5b3UgY2FuIHVzZSBmb3IgbGF0ZXIgY2hhbmdlcy5cbiAgICpcbiAgICogQG1lbWJlcm9mIENoYXJ0aXN0LkJhclxuICAgKiBAcGFyYW0ge1N0cmluZ3xOb2RlfSBxdWVyeSBBIHNlbGVjdG9yIHF1ZXJ5IHN0cmluZyBvciBkaXJlY3RseSBhIERPTSBlbGVtZW50XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIFRoZSBkYXRhIG9iamVjdCB0aGF0IG5lZWRzIHRvIGNvbnNpc3Qgb2YgYSBsYWJlbHMgYW5kIGEgc2VyaWVzIGFycmF5XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gVGhlIG9wdGlvbnMgb2JqZWN0IHdpdGggb3B0aW9ucyB0aGF0IG92ZXJyaWRlIHRoZSBkZWZhdWx0IG9wdGlvbnMuIENoZWNrIHRoZSBleGFtcGxlcyBmb3IgYSBkZXRhaWxlZCBsaXN0LlxuICAgKiBAcGFyYW0ge0FycmF5fSBbcmVzcG9uc2l2ZU9wdGlvbnNdIFNwZWNpZnkgYW4gYXJyYXkgb2YgcmVzcG9uc2l2ZSBvcHRpb24gYXJyYXlzIHdoaWNoIGFyZSBhIG1lZGlhIHF1ZXJ5IGFuZCBvcHRpb25zIG9iamVjdCBwYWlyID0+IFtbbWVkaWFRdWVyeVN0cmluZywgb3B0aW9uc09iamVjdF0sW21vcmUuLi5dXVxuICAgKiBAcmV0dXJuIHtPYmplY3R9IEFuIG9iamVjdCB3aGljaCBleHBvc2VzIHRoZSBBUEkgZm9yIHRoZSBjcmVhdGVkIGNoYXJ0XG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIC8vIENyZWF0ZSBhIHNpbXBsZSBiYXIgY2hhcnRcbiAgICogdmFyIGRhdGEgPSB7XG4gICAqICAgbGFiZWxzOiBbJ01vbicsICdUdWUnLCAnV2VkJywgJ1RodScsICdGcmknXSxcbiAgICogICBzZXJpZXM6IFtcbiAgICogICAgIFs1LCAyLCA0LCAyLCAwXVxuICAgKiAgIF1cbiAgICogfTtcbiAgICpcbiAgICogLy8gSW4gdGhlIGdsb2JhbCBuYW1lIHNwYWNlIENoYXJ0aXN0IHdlIGNhbGwgdGhlIEJhciBmdW5jdGlvbiB0byBpbml0aWFsaXplIGEgYmFyIGNoYXJ0LiBBcyBhIGZpcnN0IHBhcmFtZXRlciB3ZSBwYXNzIGluIGEgc2VsZWN0b3Igd2hlcmUgd2Ugd291bGQgbGlrZSB0byBnZXQgb3VyIGNoYXJ0IGNyZWF0ZWQgYW5kIGFzIGEgc2Vjb25kIHBhcmFtZXRlciB3ZSBwYXNzIG91ciBkYXRhIG9iamVjdC5cbiAgICogbmV3IENoYXJ0aXN0LkJhcignLmN0LWNoYXJ0JywgZGF0YSk7XG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIC8vIFRoaXMgZXhhbXBsZSBjcmVhdGVzIGEgYmlwb2xhciBncm91cGVkIGJhciBjaGFydCB3aGVyZSB0aGUgYm91bmRhcmllcyBhcmUgbGltaXR0ZWQgdG8gLTEwIGFuZCAxMFxuICAgKiBuZXcgQ2hhcnRpc3QuQmFyKCcuY3QtY2hhcnQnLCB7XG4gICAqICAgbGFiZWxzOiBbMSwgMiwgMywgNCwgNSwgNiwgN10sXG4gICAqICAgc2VyaWVzOiBbXG4gICAqICAgICBbMSwgMywgMiwgLTUsIC0zLCAxLCAtNl0sXG4gICAqICAgICBbLTUsIC0yLCAtNCwgLTEsIDIsIC0zLCAxXVxuICAgKiAgIF1cbiAgICogfSwge1xuICAgKiAgIHNlcmllc0JhckRpc3RhbmNlOiAxMixcbiAgICogICBsb3c6IC0xMCxcbiAgICogICBoaWdoOiAxMFxuICAgKiB9KTtcbiAgICpcbiAgICovXG4gIGZ1bmN0aW9uIEJhcihxdWVyeSwgZGF0YSwgb3B0aW9ucywgcmVzcG9uc2l2ZU9wdGlvbnMpIHtcbiAgICBDaGFydGlzdC5CYXIuc3VwZXIuY29uc3RydWN0b3IuY2FsbCh0aGlzLFxuICAgICAgcXVlcnksXG4gICAgICBkYXRhLFxuICAgICAgZGVmYXVsdE9wdGlvbnMsXG4gICAgICBDaGFydGlzdC5leHRlbmQoe30sIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKSxcbiAgICAgIHJlc3BvbnNpdmVPcHRpb25zKTtcbiAgfVxuXG4gIC8vIENyZWF0aW5nIGJhciBjaGFydCB0eXBlIGluIENoYXJ0aXN0IG5hbWVzcGFjZVxuICBDaGFydGlzdC5CYXIgPSBDaGFydGlzdC5CYXNlLmV4dGVuZCh7XG4gICAgY29uc3RydWN0b3I6IEJhcixcbiAgICBjcmVhdGVDaGFydDogY3JlYXRlQ2hhcnRcbiAgfSk7XG5cbn0od2luZG93LCBkb2N1bWVudCwgQ2hhcnRpc3QpKTtcbjsvKipcbiAqIFRoZSBwaWUgY2hhcnQgbW9kdWxlIG9mIENoYXJ0aXN0IHRoYXQgY2FuIGJlIHVzZWQgdG8gZHJhdyBwaWUsIGRvbnV0IG9yIGdhdWdlIGNoYXJ0c1xuICpcbiAqIEBtb2R1bGUgQ2hhcnRpc3QuUGllXG4gKi9cbi8qIGdsb2JhbCBDaGFydGlzdCAqL1xuKGZ1bmN0aW9uKHdpbmRvdywgZG9jdW1lbnQsIENoYXJ0aXN0KSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICAvKipcbiAgICogRGVmYXVsdCBvcHRpb25zIGluIGxpbmUgY2hhcnRzLiBFeHBhbmQgdGhlIGNvZGUgdmlldyB0byBzZWUgYSBkZXRhaWxlZCBsaXN0IG9mIG9wdGlvbnMgd2l0aCBjb21tZW50cy5cbiAgICpcbiAgICogQG1lbWJlcm9mIENoYXJ0aXN0LlBpZVxuICAgKi9cbiAgdmFyIGRlZmF1bHRPcHRpb25zID0ge1xuICAgIC8vIFNwZWNpZnkgYSBmaXhlZCB3aWR0aCBmb3IgdGhlIGNoYXJ0IGFzIGEgc3RyaW5nIChpLmUuICcxMDBweCcgb3IgJzUwJScpXG4gICAgd2lkdGg6IHVuZGVmaW5lZCxcbiAgICAvLyBTcGVjaWZ5IGEgZml4ZWQgaGVpZ2h0IGZvciB0aGUgY2hhcnQgYXMgYSBzdHJpbmcgKGkuZS4gJzEwMHB4JyBvciAnNTAlJylcbiAgICBoZWlnaHQ6IHVuZGVmaW5lZCxcbiAgICAvLyBQYWRkaW5nIG9mIHRoZSBjaGFydCBkcmF3aW5nIGFyZWEgdG8gdGhlIGNvbnRhaW5lciBlbGVtZW50IGFuZCBsYWJlbHMgYXMgYSBudW1iZXIgb3IgcGFkZGluZyBvYmplY3Qge3RvcDogNSwgcmlnaHQ6IDUsIGJvdHRvbTogNSwgbGVmdDogNX1cbiAgICBjaGFydFBhZGRpbmc6IDUsXG4gICAgLy8gT3ZlcnJpZGUgdGhlIGNsYXNzIG5hbWVzIHRoYXQgYXJlIHVzZWQgdG8gZ2VuZXJhdGUgdGhlIFNWRyBzdHJ1Y3R1cmUgb2YgdGhlIGNoYXJ0XG4gICAgY2xhc3NOYW1lczoge1xuICAgICAgY2hhcnRQaWU6ICdjdC1jaGFydC1waWUnLFxuICAgICAgY2hhcnREb251dDogJ2N0LWNoYXJ0LWRvbnV0JyxcbiAgICAgIHNlcmllczogJ2N0LXNlcmllcycsXG4gICAgICBzbGljZVBpZTogJ2N0LXNsaWNlLXBpZScsXG4gICAgICBzbGljZURvbnV0OiAnY3Qtc2xpY2UtZG9udXQnLFxuICAgICAgbGFiZWw6ICdjdC1sYWJlbCdcbiAgICB9LFxuICAgIC8vIFRoZSBzdGFydCBhbmdsZSBvZiB0aGUgcGllIGNoYXJ0IGluIGRlZ3JlZXMgd2hlcmUgMCBwb2ludHMgbm9ydGguIEEgaGlnaGVyIHZhbHVlIG9mZnNldHMgdGhlIHN0YXJ0IGFuZ2xlIGNsb2Nrd2lzZS5cbiAgICBzdGFydEFuZ2xlOiAwLFxuICAgIC8vIEFuIG9wdGlvbmFsIHRvdGFsIHlvdSBjYW4gc3BlY2lmeS4gQnkgc3BlY2lmeWluZyBhIHRvdGFsIHZhbHVlLCB0aGUgc3VtIG9mIHRoZSB2YWx1ZXMgaW4gdGhlIHNlcmllcyBtdXN0IGJlIHRoaXMgdG90YWwgaW4gb3JkZXIgdG8gZHJhdyBhIGZ1bGwgcGllLiBZb3UgY2FuIHVzZSB0aGlzIHBhcmFtZXRlciB0byBkcmF3IG9ubHkgcGFydHMgb2YgYSBwaWUgb3IgZ2F1Z2UgY2hhcnRzLlxuICAgIHRvdGFsOiB1bmRlZmluZWQsXG4gICAgLy8gSWYgc3BlY2lmaWVkIHRoZSBkb251dCBDU1MgY2xhc3NlcyB3aWxsIGJlIHVzZWQgYW5kIHN0cm9rZXMgd2lsbCBiZSBkcmF3biBpbnN0ZWFkIG9mIHBpZSBzbGljZXMuXG4gICAgZG9udXQ6IGZhbHNlLFxuICAgIC8vIFNwZWNpZnkgdGhlIGRvbnV0IHN0cm9rZSB3aWR0aCwgY3VycmVudGx5IGRvbmUgaW4gamF2YXNjcmlwdCBmb3IgY29udmVuaWVuY2UuIE1heSBtb3ZlIHRvIENTUyBzdHlsZXMgaW4gdGhlIGZ1dHVyZS5cbiAgICAvLyBUaGlzIG9wdGlvbiBjYW4gYmUgc2V0IGFzIG51bWJlciBvciBzdHJpbmcgdG8gc3BlY2lmeSBhIHJlbGF0aXZlIHdpZHRoIChpLmUuIDEwMCBvciAnMzAlJykuXG4gICAgZG9udXRXaWR0aDogNjAsXG4gICAgLy8gSWYgYSBsYWJlbCBzaG91bGQgYmUgc2hvd24gb3Igbm90XG4gICAgc2hvd0xhYmVsOiB0cnVlLFxuICAgIC8vIExhYmVsIHBvc2l0aW9uIG9mZnNldCBmcm9tIHRoZSBzdGFuZGFyZCBwb3NpdGlvbiB3aGljaCBpcyBoYWxmIGRpc3RhbmNlIG9mIHRoZSByYWRpdXMuIFRoaXMgdmFsdWUgY2FuIGJlIGVpdGhlciBwb3NpdGl2ZSBvciBuZWdhdGl2ZS4gUG9zaXRpdmUgdmFsdWVzIHdpbGwgcG9zaXRpb24gdGhlIGxhYmVsIGF3YXkgZnJvbSB0aGUgY2VudGVyLlxuICAgIGxhYmVsT2Zmc2V0OiAwLFxuICAgIC8vIFRoaXMgb3B0aW9uIGNhbiBiZSBzZXQgdG8gJ2luc2lkZScsICdvdXRzaWRlJyBvciAnY2VudGVyJy4gUG9zaXRpb25lZCB3aXRoICdpbnNpZGUnIHRoZSBsYWJlbHMgd2lsbCBiZSBwbGFjZWQgb24gaGFsZiB0aGUgZGlzdGFuY2Ugb2YgdGhlIHJhZGl1cyB0byB0aGUgYm9yZGVyIG9mIHRoZSBQaWUgYnkgcmVzcGVjdGluZyB0aGUgJ2xhYmVsT2Zmc2V0Jy4gVGhlICdvdXRzaWRlJyBvcHRpb24gd2lsbCBwbGFjZSB0aGUgbGFiZWxzIGF0IHRoZSBib3JkZXIgb2YgdGhlIHBpZSBhbmQgJ2NlbnRlcicgd2lsbCBwbGFjZSB0aGUgbGFiZWxzIGluIHRoZSBhYnNvbHV0ZSBjZW50ZXIgcG9pbnQgb2YgdGhlIGNoYXJ0LiBUaGUgJ2NlbnRlcicgb3B0aW9uIG9ubHkgbWFrZXMgc2Vuc2UgaW4gY29uanVuY3Rpb24gd2l0aCB0aGUgJ2xhYmVsT2Zmc2V0JyBvcHRpb24uXG4gICAgbGFiZWxQb3NpdGlvbjogJ2luc2lkZScsXG4gICAgLy8gQW4gaW50ZXJwb2xhdGlvbiBmdW5jdGlvbiBmb3IgdGhlIGxhYmVsIHZhbHVlXG4gICAgbGFiZWxJbnRlcnBvbGF0aW9uRm5jOiBDaGFydGlzdC5ub29wLFxuICAgIC8vIExhYmVsIGRpcmVjdGlvbiBjYW4gYmUgJ25ldXRyYWwnLCAnZXhwbG9kZScgb3IgJ2ltcGxvZGUnLiBUaGUgbGFiZWxzIGFuY2hvciB3aWxsIGJlIHBvc2l0aW9uZWQgYmFzZWQgb24gdGhvc2Ugc2V0dGluZ3MgYXMgd2VsbCBhcyB0aGUgZmFjdCBpZiB0aGUgbGFiZWxzIGFyZSBvbiB0aGUgcmlnaHQgb3IgbGVmdCBzaWRlIG9mIHRoZSBjZW50ZXIgb2YgdGhlIGNoYXJ0LiBVc3VhbGx5IGV4cGxvZGUgaXMgdXNlZnVsIHdoZW4gbGFiZWxzIGFyZSBwb3NpdGlvbmVkIGZhciBhd2F5IGZyb20gdGhlIGNlbnRlci5cbiAgICBsYWJlbERpcmVjdGlvbjogJ25ldXRyYWwnLFxuICAgIC8vIElmIHRydWUgdGhlIHdob2xlIGRhdGEgaXMgcmV2ZXJzZWQgaW5jbHVkaW5nIGxhYmVscywgdGhlIHNlcmllcyBvcmRlciBhcyB3ZWxsIGFzIHRoZSB3aG9sZSBzZXJpZXMgZGF0YSBhcnJheXMuXG4gICAgcmV2ZXJzZURhdGE6IGZhbHNlLFxuICAgIC8vIElmIHRydWUgZW1wdHkgdmFsdWVzIHdpbGwgYmUgaWdub3JlZCB0byBhdm9pZCBkcmF3aW5nIHVubmNlc3Nhcnkgc2xpY2VzIGFuZCBsYWJlbHNcbiAgICBpZ25vcmVFbXB0eVZhbHVlczogZmFsc2VcbiAgfTtcblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyBTVkcgYW5jaG9yIHBvc2l0aW9uIGJhc2VkIG9uIGRpcmVjdGlvbiBhbmQgY2VudGVyIHBhcmFtZXRlclxuICAgKlxuICAgKiBAcGFyYW0gY2VudGVyXG4gICAqIEBwYXJhbSBsYWJlbFxuICAgKiBAcGFyYW0gZGlyZWN0aW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIGRldGVybWluZUFuY2hvclBvc2l0aW9uKGNlbnRlciwgbGFiZWwsIGRpcmVjdGlvbikge1xuICAgIHZhciB0b1RoZVJpZ2h0ID0gbGFiZWwueCA+IGNlbnRlci54O1xuXG4gICAgaWYodG9UaGVSaWdodCAmJiBkaXJlY3Rpb24gPT09ICdleHBsb2RlJyB8fFxuICAgICAgIXRvVGhlUmlnaHQgJiYgZGlyZWN0aW9uID09PSAnaW1wbG9kZScpIHtcbiAgICAgIHJldHVybiAnc3RhcnQnO1xuICAgIH0gZWxzZSBpZih0b1RoZVJpZ2h0ICYmIGRpcmVjdGlvbiA9PT0gJ2ltcGxvZGUnIHx8XG4gICAgICAhdG9UaGVSaWdodCAmJiBkaXJlY3Rpb24gPT09ICdleHBsb2RlJykge1xuICAgICAgcmV0dXJuICdlbmQnO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJ21pZGRsZSc7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgdGhlIHBpZSBjaGFydFxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9uc1xuICAgKi9cbiAgZnVuY3Rpb24gY3JlYXRlQ2hhcnQob3B0aW9ucykge1xuICAgIHRoaXMuZGF0YSA9IENoYXJ0aXN0Lm5vcm1hbGl6ZURhdGEodGhpcy5kYXRhKTtcbiAgICB2YXIgc2VyaWVzR3JvdXBzID0gW10sXG4gICAgICBsYWJlbHNHcm91cCxcbiAgICAgIGNoYXJ0UmVjdCxcbiAgICAgIHJhZGl1cyxcbiAgICAgIGxhYmVsUmFkaXVzLFxuICAgICAgdG90YWxEYXRhU3VtLFxuICAgICAgc3RhcnRBbmdsZSA9IG9wdGlvbnMuc3RhcnRBbmdsZSxcbiAgICAgIGRhdGFBcnJheSA9IENoYXJ0aXN0LmdldERhdGFBcnJheSh0aGlzLmRhdGEsIG9wdGlvbnMucmV2ZXJzZURhdGEpO1xuXG4gICAgLy8gQ3JlYXRlIFNWRy5qcyBkcmF3XG4gICAgdGhpcy5zdmcgPSBDaGFydGlzdC5jcmVhdGVTdmcodGhpcy5jb250YWluZXIsIG9wdGlvbnMud2lkdGgsIG9wdGlvbnMuaGVpZ2h0LG9wdGlvbnMuZG9udXQgPyBvcHRpb25zLmNsYXNzTmFtZXMuY2hhcnREb251dCA6IG9wdGlvbnMuY2xhc3NOYW1lcy5jaGFydFBpZSk7XG4gICAgLy8gQ2FsY3VsYXRlIGNoYXJ0aW5nIHJlY3RcbiAgICBjaGFydFJlY3QgPSBDaGFydGlzdC5jcmVhdGVDaGFydFJlY3QodGhpcy5zdmcsIG9wdGlvbnMsIGRlZmF1bHRPcHRpb25zLnBhZGRpbmcpO1xuICAgIC8vIEdldCBiaWdnZXN0IGNpcmNsZSByYWRpdXMgcG9zc2libGUgd2l0aGluIGNoYXJ0UmVjdFxuICAgIHJhZGl1cyA9IE1hdGgubWluKGNoYXJ0UmVjdC53aWR0aCgpIC8gMiwgY2hhcnRSZWN0LmhlaWdodCgpIC8gMik7XG4gICAgLy8gQ2FsY3VsYXRlIHRvdGFsIG9mIGFsbCBzZXJpZXMgdG8gZ2V0IHJlZmVyZW5jZSB2YWx1ZSBvciB1c2UgdG90YWwgcmVmZXJlbmNlIGZyb20gb3B0aW9uYWwgb3B0aW9uc1xuICAgIHRvdGFsRGF0YVN1bSA9IG9wdGlvbnMudG90YWwgfHwgZGF0YUFycmF5LnJlZHVjZShmdW5jdGlvbihwcmV2aW91c1ZhbHVlLCBjdXJyZW50VmFsdWUpIHtcbiAgICAgIHJldHVybiBwcmV2aW91c1ZhbHVlICsgY3VycmVudFZhbHVlO1xuICAgIH0sIDApO1xuXG4gICAgdmFyIGRvbnV0V2lkdGggPSBDaGFydGlzdC5xdWFudGl0eShvcHRpb25zLmRvbnV0V2lkdGgpO1xuICAgIGlmIChkb251dFdpZHRoLnVuaXQgPT09ICclJykge1xuICAgICAgZG9udXRXaWR0aC52YWx1ZSAqPSByYWRpdXMgLyAxMDA7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhpcyBpcyBhIGRvbnV0IGNoYXJ0IHdlIG5lZWQgdG8gYWRqdXN0IG91ciByYWRpdXMgdG8gZW5hYmxlIHN0cm9rZXMgdG8gYmUgZHJhd24gaW5zaWRlXG4gICAgLy8gVW5mb3J0dW5hdGVseSB0aGlzIGlzIG5vdCBwb3NzaWJsZSB3aXRoIHRoZSBjdXJyZW50IFNWRyBTcGVjXG4gICAgLy8gU2VlIHRoaXMgcHJvcG9zYWwgZm9yIG1vcmUgZGV0YWlsczogaHR0cDovL2xpc3RzLnczLm9yZy9BcmNoaXZlcy9QdWJsaWMvd3d3LXN2Zy8yMDAzT2N0LzAwMDAuaHRtbFxuICAgIHJhZGl1cyAtPSBvcHRpb25zLmRvbnV0ID8gZG9udXRXaWR0aC52YWx1ZSAvIDIgIDogMDtcblxuICAgIC8vIElmIGxhYmVsUG9zaXRpb24gaXMgc2V0IHRvIGBvdXRzaWRlYCBvciBhIGRvbnV0IGNoYXJ0IGlzIGRyYXduIHRoZW4gdGhlIGxhYmVsIHBvc2l0aW9uIGlzIGF0IHRoZSByYWRpdXMsXG4gICAgLy8gaWYgcmVndWxhciBwaWUgY2hhcnQgaXQncyBoYWxmIG9mIHRoZSByYWRpdXNcbiAgICBpZihvcHRpb25zLmxhYmVsUG9zaXRpb24gPT09ICdvdXRzaWRlJyB8fCBvcHRpb25zLmRvbnV0KSB7XG4gICAgICBsYWJlbFJhZGl1cyA9IHJhZGl1cztcbiAgICB9IGVsc2UgaWYob3B0aW9ucy5sYWJlbFBvc2l0aW9uID09PSAnY2VudGVyJykge1xuICAgICAgLy8gSWYgbGFiZWxQb3NpdGlvbiBpcyBjZW50ZXIgd2Ugc3RhcnQgd2l0aCAwIGFuZCB3aWxsIGxhdGVyIHdhaXQgZm9yIHRoZSBsYWJlbE9mZnNldFxuICAgICAgbGFiZWxSYWRpdXMgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBEZWZhdWx0IG9wdGlvbiBpcyAnaW5zaWRlJyB3aGVyZSB3ZSB1c2UgaGFsZiB0aGUgcmFkaXVzIHNvIHRoZSBsYWJlbCB3aWxsIGJlIHBsYWNlZCBpbiB0aGUgY2VudGVyIG9mIHRoZSBwaWVcbiAgICAgIC8vIHNsaWNlXG4gICAgICBsYWJlbFJhZGl1cyA9IHJhZGl1cyAvIDI7XG4gICAgfVxuICAgIC8vIEFkZCB0aGUgb2Zmc2V0IHRvIHRoZSBsYWJlbFJhZGl1cyB3aGVyZSBhIG5lZ2F0aXZlIG9mZnNldCBtZWFucyBjbG9zZWQgdG8gdGhlIGNlbnRlciBvZiB0aGUgY2hhcnRcbiAgICBsYWJlbFJhZGl1cyArPSBvcHRpb25zLmxhYmVsT2Zmc2V0O1xuXG4gICAgLy8gQ2FsY3VsYXRlIGVuZCBhbmdsZSBiYXNlZCBvbiB0b3RhbCBzdW0gYW5kIGN1cnJlbnQgZGF0YSB2YWx1ZSBhbmQgb2Zmc2V0IHdpdGggcGFkZGluZ1xuICAgIHZhciBjZW50ZXIgPSB7XG4gICAgICB4OiBjaGFydFJlY3QueDEgKyBjaGFydFJlY3Qud2lkdGgoKSAvIDIsXG4gICAgICB5OiBjaGFydFJlY3QueTIgKyBjaGFydFJlY3QuaGVpZ2h0KCkgLyAyXG4gICAgfTtcblxuICAgIC8vIENoZWNrIGlmIHRoZXJlIGlzIG9ubHkgb25lIG5vbi16ZXJvIHZhbHVlIGluIHRoZSBzZXJpZXMgYXJyYXkuXG4gICAgdmFyIGhhc1NpbmdsZVZhbEluU2VyaWVzID0gdGhpcy5kYXRhLnNlcmllcy5maWx0ZXIoZnVuY3Rpb24odmFsKSB7XG4gICAgICByZXR1cm4gdmFsLmhhc093blByb3BlcnR5KCd2YWx1ZScpID8gdmFsLnZhbHVlICE9PSAwIDogdmFsICE9PSAwO1xuICAgIH0pLmxlbmd0aCA9PT0gMTtcblxuICAgIC8vaWYgd2UgbmVlZCB0byBzaG93IGxhYmVscyB3ZSBjcmVhdGUgdGhlIGxhYmVsIGdyb3VwIG5vd1xuICAgIGlmKG9wdGlvbnMuc2hvd0xhYmVsKSB7XG4gICAgICBsYWJlbHNHcm91cCA9IHRoaXMuc3ZnLmVsZW0oJ2cnLCBudWxsLCBudWxsLCB0cnVlKTtcbiAgICB9XG5cbiAgICAvLyBEcmF3IHRoZSBzZXJpZXNcbiAgICAvLyBpbml0aWFsaXplIHNlcmllcyBncm91cHNcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZGF0YS5zZXJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vIElmIGN1cnJlbnQgdmFsdWUgaXMgemVybyBhbmQgd2UgYXJlIGlnbm9yaW5nIGVtcHR5IHZhbHVlcyB0aGVuIHNraXAgdG8gbmV4dCB2YWx1ZVxuICAgICAgaWYgKGRhdGFBcnJheVtpXSA9PT0gMCAmJiBvcHRpb25zLmlnbm9yZUVtcHR5VmFsdWVzKSBjb250aW51ZTtcblxuICAgICAgdmFyIHNlcmllcyA9IHRoaXMuZGF0YS5zZXJpZXNbaV07XG4gICAgICBzZXJpZXNHcm91cHNbaV0gPSB0aGlzLnN2Zy5lbGVtKCdnJywgbnVsbCwgbnVsbCwgdHJ1ZSk7XG5cbiAgICAgIC8vIElmIHRoZSBzZXJpZXMgaXMgYW4gb2JqZWN0IGFuZCBjb250YWlucyBhIG5hbWUgb3IgbWV0YSBkYXRhIHdlIGFkZCBhIGN1c3RvbSBhdHRyaWJ1dGVcbiAgICAgIHNlcmllc0dyb3Vwc1tpXS5hdHRyKHtcbiAgICAgICAgJ2N0OnNlcmllcy1uYW1lJzogc2VyaWVzLm5hbWVcbiAgICAgIH0pO1xuXG4gICAgICAvLyBVc2Ugc2VyaWVzIGNsYXNzIGZyb20gc2VyaWVzIGRhdGEgb3IgaWYgbm90IHNldCBnZW5lcmF0ZSBvbmVcbiAgICAgIHNlcmllc0dyb3Vwc1tpXS5hZGRDbGFzcyhbXG4gICAgICAgIG9wdGlvbnMuY2xhc3NOYW1lcy5zZXJpZXMsXG4gICAgICAgIChzZXJpZXMuY2xhc3NOYW1lIHx8IG9wdGlvbnMuY2xhc3NOYW1lcy5zZXJpZXMgKyAnLScgKyBDaGFydGlzdC5hbHBoYU51bWVyYXRlKGkpKVxuICAgICAgXS5qb2luKCcgJykpO1xuXG4gICAgICB2YXIgZW5kQW5nbGUgPSBzdGFydEFuZ2xlICsgZGF0YUFycmF5W2ldIC8gdG90YWxEYXRhU3VtICogMzYwO1xuXG4gICAgICAvLyBVc2Ugc2xpZ2h0IG9mZnNldCBzbyB0aGVyZSBhcmUgbm8gdHJhbnNwYXJlbnQgaGFpcmxpbmUgaXNzdWVzXG4gICAgICB2YXIgb3ZlcmxhcHBpZ1N0YXJ0QW5nbGUgPSBNYXRoLm1heCgwLCBzdGFydEFuZ2xlIC0gKGkgPT09IDAgfHwgaGFzU2luZ2xlVmFsSW5TZXJpZXMgPyAwIDogMC4yKSk7XG5cbiAgICAgIC8vIElmIHdlIG5lZWQgdG8gZHJhdyB0aGUgYXJjIGZvciBhbGwgMzYwIGRlZ3JlZXMgd2UgbmVlZCB0byBhZGQgYSBoYWNrIHdoZXJlIHdlIGNsb3NlIHRoZSBjaXJjbGVcbiAgICAgIC8vIHdpdGggWiBhbmQgdXNlIDM1OS45OSBkZWdyZWVzXG4gICAgICBpZihlbmRBbmdsZSAtIG92ZXJsYXBwaWdTdGFydEFuZ2xlID49IDM1OS45OSkge1xuICAgICAgICBlbmRBbmdsZSA9IG92ZXJsYXBwaWdTdGFydEFuZ2xlICsgMzU5Ljk5O1xuICAgICAgfVxuXG4gICAgICB2YXIgc3RhcnQgPSBDaGFydGlzdC5wb2xhclRvQ2FydGVzaWFuKGNlbnRlci54LCBjZW50ZXIueSwgcmFkaXVzLCBvdmVybGFwcGlnU3RhcnRBbmdsZSksXG4gICAgICAgIGVuZCA9IENoYXJ0aXN0LnBvbGFyVG9DYXJ0ZXNpYW4oY2VudGVyLngsIGNlbnRlci55LCByYWRpdXMsIGVuZEFuZ2xlKTtcblxuICAgICAgLy8gQ3JlYXRlIGEgbmV3IHBhdGggZWxlbWVudCBmb3IgdGhlIHBpZSBjaGFydC4gSWYgdGhpcyBpc24ndCBhIGRvbnV0IGNoYXJ0IHdlIHNob3VsZCBjbG9zZSB0aGUgcGF0aCBmb3IgYSBjb3JyZWN0IHN0cm9rZVxuICAgICAgdmFyIHBhdGggPSBuZXcgQ2hhcnRpc3QuU3ZnLlBhdGgoIW9wdGlvbnMuZG9udXQpXG4gICAgICAgIC5tb3ZlKGVuZC54LCBlbmQueSlcbiAgICAgICAgLmFyYyhyYWRpdXMsIHJhZGl1cywgMCwgZW5kQW5nbGUgLSBzdGFydEFuZ2xlID4gMTgwLCAwLCBzdGFydC54LCBzdGFydC55KTtcblxuICAgICAgLy8gSWYgcmVndWxhciBwaWUgY2hhcnQgKG5vIGRvbnV0KSB3ZSBhZGQgYSBsaW5lIHRvIHRoZSBjZW50ZXIgb2YgdGhlIGNpcmNsZSBmb3IgY29tcGxldGluZyB0aGUgcGllXG4gICAgICBpZighb3B0aW9ucy5kb251dCkge1xuICAgICAgICBwYXRoLmxpbmUoY2VudGVyLngsIGNlbnRlci55KTtcbiAgICAgIH1cblxuICAgICAgLy8gQ3JlYXRlIHRoZSBTVkcgcGF0aFxuICAgICAgLy8gSWYgdGhpcyBpcyBhIGRvbnV0IGNoYXJ0IHdlIGFkZCB0aGUgZG9udXQgY2xhc3MsIG90aGVyd2lzZSBqdXN0IGEgcmVndWxhciBzbGljZVxuICAgICAgdmFyIHBhdGhFbGVtZW50ID0gc2VyaWVzR3JvdXBzW2ldLmVsZW0oJ3BhdGgnLCB7XG4gICAgICAgIGQ6IHBhdGguc3RyaW5naWZ5KClcbiAgICAgIH0sIG9wdGlvbnMuZG9udXQgPyBvcHRpb25zLmNsYXNzTmFtZXMuc2xpY2VEb251dCA6IG9wdGlvbnMuY2xhc3NOYW1lcy5zbGljZVBpZSk7XG5cbiAgICAgIC8vIEFkZGluZyB0aGUgcGllIHNlcmllcyB2YWx1ZSB0byB0aGUgcGF0aFxuICAgICAgcGF0aEVsZW1lbnQuYXR0cih7XG4gICAgICAgICdjdDp2YWx1ZSc6IGRhdGFBcnJheVtpXSxcbiAgICAgICAgJ2N0Om1ldGEnOiBDaGFydGlzdC5zZXJpYWxpemUoc2VyaWVzLm1ldGEpXG4gICAgICB9KTtcblxuICAgICAgLy8gSWYgdGhpcyBpcyBhIGRvbnV0LCB3ZSBhZGQgdGhlIHN0cm9rZS13aWR0aCBhcyBzdHlsZSBhdHRyaWJ1dGVcbiAgICAgIGlmKG9wdGlvbnMuZG9udXQpIHtcbiAgICAgICAgcGF0aEVsZW1lbnQuYXR0cih7XG4gICAgICAgICAgJ3N0eWxlJzogJ3N0cm9rZS13aWR0aDogJyArIGRvbnV0V2lkdGgudmFsdWUgKyAncHgnXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAvLyBGaXJlIG9mZiBkcmF3IGV2ZW50XG4gICAgICB0aGlzLmV2ZW50RW1pdHRlci5lbWl0KCdkcmF3Jywge1xuICAgICAgICB0eXBlOiAnc2xpY2UnLFxuICAgICAgICB2YWx1ZTogZGF0YUFycmF5W2ldLFxuICAgICAgICB0b3RhbERhdGFTdW06IHRvdGFsRGF0YVN1bSxcbiAgICAgICAgaW5kZXg6IGksXG4gICAgICAgIG1ldGE6IHNlcmllcy5tZXRhLFxuICAgICAgICBzZXJpZXM6IHNlcmllcyxcbiAgICAgICAgZ3JvdXA6IHNlcmllc0dyb3Vwc1tpXSxcbiAgICAgICAgZWxlbWVudDogcGF0aEVsZW1lbnQsXG4gICAgICAgIHBhdGg6IHBhdGguY2xvbmUoKSxcbiAgICAgICAgY2VudGVyOiBjZW50ZXIsXG4gICAgICAgIHJhZGl1czogcmFkaXVzLFxuICAgICAgICBzdGFydEFuZ2xlOiBzdGFydEFuZ2xlLFxuICAgICAgICBlbmRBbmdsZTogZW5kQW5nbGVcbiAgICAgIH0pO1xuXG4gICAgICAvLyBJZiB3ZSBuZWVkIHRvIHNob3cgbGFiZWxzIHdlIG5lZWQgdG8gYWRkIHRoZSBsYWJlbCBmb3IgdGhpcyBzbGljZSBub3dcbiAgICAgIGlmKG9wdGlvbnMuc2hvd0xhYmVsKSB7XG4gICAgICAgIC8vIFBvc2l0aW9uIGF0IHRoZSBsYWJlbFJhZGl1cyBkaXN0YW5jZSBmcm9tIGNlbnRlciBhbmQgYmV0d2VlbiBzdGFydCBhbmQgZW5kIGFuZ2xlXG4gICAgICAgIHZhciBsYWJlbFBvc2l0aW9uID0gQ2hhcnRpc3QucG9sYXJUb0NhcnRlc2lhbihjZW50ZXIueCwgY2VudGVyLnksIGxhYmVsUmFkaXVzLCBzdGFydEFuZ2xlICsgKGVuZEFuZ2xlIC0gc3RhcnRBbmdsZSkgLyAyKSxcbiAgICAgICAgICBpbnRlcnBvbGF0ZWRWYWx1ZSA9IG9wdGlvbnMubGFiZWxJbnRlcnBvbGF0aW9uRm5jKHRoaXMuZGF0YS5sYWJlbHMgJiYgIUNoYXJ0aXN0LmlzRmFsc2V5QnV0WmVybyh0aGlzLmRhdGEubGFiZWxzW2ldKSA/IHRoaXMuZGF0YS5sYWJlbHNbaV0gOiBkYXRhQXJyYXlbaV0sIGkpO1xuXG4gICAgICAgIGlmKGludGVycG9sYXRlZFZhbHVlIHx8IGludGVycG9sYXRlZFZhbHVlID09PSAwKSB7XG4gICAgICAgICAgdmFyIGxhYmVsRWxlbWVudCA9IGxhYmVsc0dyb3VwLmVsZW0oJ3RleHQnLCB7XG4gICAgICAgICAgICBkeDogbGFiZWxQb3NpdGlvbi54LFxuICAgICAgICAgICAgZHk6IGxhYmVsUG9zaXRpb24ueSxcbiAgICAgICAgICAgICd0ZXh0LWFuY2hvcic6IGRldGVybWluZUFuY2hvclBvc2l0aW9uKGNlbnRlciwgbGFiZWxQb3NpdGlvbiwgb3B0aW9ucy5sYWJlbERpcmVjdGlvbilcbiAgICAgICAgICB9LCBvcHRpb25zLmNsYXNzTmFtZXMubGFiZWwpLnRleHQoJycgKyBpbnRlcnBvbGF0ZWRWYWx1ZSk7XG5cbiAgICAgICAgICAvLyBGaXJlIG9mZiBkcmF3IGV2ZW50XG4gICAgICAgICAgdGhpcy5ldmVudEVtaXR0ZXIuZW1pdCgnZHJhdycsIHtcbiAgICAgICAgICAgIHR5cGU6ICdsYWJlbCcsXG4gICAgICAgICAgICBpbmRleDogaSxcbiAgICAgICAgICAgIGdyb3VwOiBsYWJlbHNHcm91cCxcbiAgICAgICAgICAgIGVsZW1lbnQ6IGxhYmVsRWxlbWVudCxcbiAgICAgICAgICAgIHRleHQ6ICcnICsgaW50ZXJwb2xhdGVkVmFsdWUsXG4gICAgICAgICAgICB4OiBsYWJlbFBvc2l0aW9uLngsXG4gICAgICAgICAgICB5OiBsYWJlbFBvc2l0aW9uLnlcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBTZXQgbmV4dCBzdGFydEFuZ2xlIHRvIGN1cnJlbnQgZW5kQW5nbGUuXG4gICAgICAvLyAoZXhjZXB0IGZvciBsYXN0IHNsaWNlKVxuICAgICAgc3RhcnRBbmdsZSA9IGVuZEFuZ2xlO1xuICAgIH1cblxuICAgIHRoaXMuZXZlbnRFbWl0dGVyLmVtaXQoJ2NyZWF0ZWQnLCB7XG4gICAgICBjaGFydFJlY3Q6IGNoYXJ0UmVjdCxcbiAgICAgIHN2ZzogdGhpcy5zdmcsXG4gICAgICBvcHRpb25zOiBvcHRpb25zXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2QgY3JlYXRlcyBhIG5ldyBwaWUgY2hhcnQgYW5kIHJldHVybnMgYW4gb2JqZWN0IHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVkcmF3IHRoZSBjaGFydC5cbiAgICpcbiAgICogQG1lbWJlcm9mIENoYXJ0aXN0LlBpZVxuICAgKiBAcGFyYW0ge1N0cmluZ3xOb2RlfSBxdWVyeSBBIHNlbGVjdG9yIHF1ZXJ5IHN0cmluZyBvciBkaXJlY3RseSBhIERPTSBlbGVtZW50XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIFRoZSBkYXRhIG9iamVjdCBpbiB0aGUgcGllIGNoYXJ0IG5lZWRzIHRvIGhhdmUgYSBzZXJpZXMgcHJvcGVydHkgd2l0aCBhIG9uZSBkaW1lbnNpb25hbCBkYXRhIGFycmF5LiBUaGUgdmFsdWVzIHdpbGwgYmUgbm9ybWFsaXplZCBhZ2FpbnN0IGVhY2ggb3RoZXIgYW5kIGRvbid0IG5lY2Vzc2FyaWx5IG5lZWQgdG8gYmUgaW4gcGVyY2VudGFnZS4gVGhlIHNlcmllcyBwcm9wZXJ0eSBjYW4gYWxzbyBiZSBhbiBhcnJheSBvZiB2YWx1ZSBvYmplY3RzIHRoYXQgY29udGFpbiBhIHZhbHVlIHByb3BlcnR5IGFuZCBhIGNsYXNzTmFtZSBwcm9wZXJ0eSB0byBvdmVycmlkZSB0aGUgQ1NTIGNsYXNzIG5hbWUgZm9yIHRoZSBzZXJpZXMgZ3JvdXAuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gVGhlIG9wdGlvbnMgb2JqZWN0IHdpdGggb3B0aW9ucyB0aGF0IG92ZXJyaWRlIHRoZSBkZWZhdWx0IG9wdGlvbnMuIENoZWNrIHRoZSBleGFtcGxlcyBmb3IgYSBkZXRhaWxlZCBsaXN0LlxuICAgKiBAcGFyYW0ge0FycmF5fSBbcmVzcG9uc2l2ZU9wdGlvbnNdIFNwZWNpZnkgYW4gYXJyYXkgb2YgcmVzcG9uc2l2ZSBvcHRpb24gYXJyYXlzIHdoaWNoIGFyZSBhIG1lZGlhIHF1ZXJ5IGFuZCBvcHRpb25zIG9iamVjdCBwYWlyID0+IFtbbWVkaWFRdWVyeVN0cmluZywgb3B0aW9uc09iamVjdF0sW21vcmUuLi5dXVxuICAgKiBAcmV0dXJuIHtPYmplY3R9IEFuIG9iamVjdCB3aXRoIGEgdmVyc2lvbiBhbmQgYW4gdXBkYXRlIG1ldGhvZCB0byBtYW51YWxseSByZWRyYXcgdGhlIGNoYXJ0XG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIC8vIFNpbXBsZSBwaWUgY2hhcnQgZXhhbXBsZSB3aXRoIGZvdXIgc2VyaWVzXG4gICAqIG5ldyBDaGFydGlzdC5QaWUoJy5jdC1jaGFydCcsIHtcbiAgICogICBzZXJpZXM6IFsxMCwgMiwgNCwgM11cbiAgICogfSk7XG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIC8vIERyYXdpbmcgYSBkb251dCBjaGFydFxuICAgKiBuZXcgQ2hhcnRpc3QuUGllKCcuY3QtY2hhcnQnLCB7XG4gICAqICAgc2VyaWVzOiBbMTAsIDIsIDQsIDNdXG4gICAqIH0sIHtcbiAgICogICBkb251dDogdHJ1ZVxuICAgKiB9KTtcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogLy8gVXNpbmcgZG9udXQsIHN0YXJ0QW5nbGUgYW5kIHRvdGFsIHRvIGRyYXcgYSBnYXVnZSBjaGFydFxuICAgKiBuZXcgQ2hhcnRpc3QuUGllKCcuY3QtY2hhcnQnLCB7XG4gICAqICAgc2VyaWVzOiBbMjAsIDEwLCAzMCwgNDBdXG4gICAqIH0sIHtcbiAgICogICBkb251dDogdHJ1ZSxcbiAgICogICBkb251dFdpZHRoOiAyMCxcbiAgICogICBzdGFydEFuZ2xlOiAyNzAsXG4gICAqICAgdG90YWw6IDIwMFxuICAgKiB9KTtcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogLy8gRHJhd2luZyBhIHBpZSBjaGFydCB3aXRoIHBhZGRpbmcgYW5kIGxhYmVscyB0aGF0IGFyZSBvdXRzaWRlIHRoZSBwaWVcbiAgICogbmV3IENoYXJ0aXN0LlBpZSgnLmN0LWNoYXJ0Jywge1xuICAgKiAgIHNlcmllczogWzIwLCAxMCwgMzAsIDQwXVxuICAgKiB9LCB7XG4gICAqICAgY2hhcnRQYWRkaW5nOiAzMCxcbiAgICogICBsYWJlbE9mZnNldDogNTAsXG4gICAqICAgbGFiZWxEaXJlY3Rpb246ICdleHBsb2RlJ1xuICAgKiB9KTtcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogLy8gT3ZlcnJpZGluZyB0aGUgY2xhc3MgbmFtZXMgZm9yIGluZGl2aWR1YWwgc2VyaWVzIGFzIHdlbGwgYXMgYSBuYW1lIGFuZCBtZXRhIGRhdGEuXG4gICAqIC8vIFRoZSBuYW1lIHdpbGwgYmUgd3JpdHRlbiBhcyBjdDpzZXJpZXMtbmFtZSBhdHRyaWJ1dGUgYW5kIHRoZSBtZXRhIGRhdGEgd2lsbCBiZSBzZXJpYWxpemVkIGFuZCB3cml0dGVuXG4gICAqIC8vIHRvIGEgY3Q6bWV0YSBhdHRyaWJ1dGUuXG4gICAqIG5ldyBDaGFydGlzdC5QaWUoJy5jdC1jaGFydCcsIHtcbiAgICogICBzZXJpZXM6IFt7XG4gICAqICAgICB2YWx1ZTogMjAsXG4gICAqICAgICBuYW1lOiAnU2VyaWVzIDEnLFxuICAgKiAgICAgY2xhc3NOYW1lOiAnbXktY3VzdG9tLWNsYXNzLW9uZScsXG4gICAqICAgICBtZXRhOiAnTWV0YSBPbmUnXG4gICAqICAgfSwge1xuICAgKiAgICAgdmFsdWU6IDEwLFxuICAgKiAgICAgbmFtZTogJ1NlcmllcyAyJyxcbiAgICogICAgIGNsYXNzTmFtZTogJ215LWN1c3RvbS1jbGFzcy10d28nLFxuICAgKiAgICAgbWV0YTogJ01ldGEgVHdvJ1xuICAgKiAgIH0sIHtcbiAgICogICAgIHZhbHVlOiA3MCxcbiAgICogICAgIG5hbWU6ICdTZXJpZXMgMycsXG4gICAqICAgICBjbGFzc05hbWU6ICdteS1jdXN0b20tY2xhc3MtdGhyZWUnLFxuICAgKiAgICAgbWV0YTogJ01ldGEgVGhyZWUnXG4gICAqICAgfV1cbiAgICogfSk7XG4gICAqL1xuICBmdW5jdGlvbiBQaWUocXVlcnksIGRhdGEsIG9wdGlvbnMsIHJlc3BvbnNpdmVPcHRpb25zKSB7XG4gICAgQ2hhcnRpc3QuUGllLnN1cGVyLmNvbnN0cnVjdG9yLmNhbGwodGhpcyxcbiAgICAgIHF1ZXJ5LFxuICAgICAgZGF0YSxcbiAgICAgIGRlZmF1bHRPcHRpb25zLFxuICAgICAgQ2hhcnRpc3QuZXh0ZW5kKHt9LCBkZWZhdWx0T3B0aW9ucywgb3B0aW9ucyksXG4gICAgICByZXNwb25zaXZlT3B0aW9ucyk7XG4gIH1cblxuICAvLyBDcmVhdGluZyBwaWUgY2hhcnQgdHlwZSBpbiBDaGFydGlzdCBuYW1lc3BhY2VcbiAgQ2hhcnRpc3QuUGllID0gQ2hhcnRpc3QuQmFzZS5leHRlbmQoe1xuICAgIGNvbnN0cnVjdG9yOiBQaWUsXG4gICAgY3JlYXRlQ2hhcnQ6IGNyZWF0ZUNoYXJ0LFxuICAgIGRldGVybWluZUFuY2hvclBvc2l0aW9uOiBkZXRlcm1pbmVBbmNob3JQb3NpdGlvblxuICB9KTtcblxufSh3aW5kb3csIGRvY3VtZW50LCBDaGFydGlzdCkpO1xuXG5yZXR1cm4gQ2hhcnRpc3Q7XG5cbn0pKTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJySDFKUEdcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi9ub2RlX21vZHVsZXMvY2hhcnRpc3QvZGlzdC9jaGFydGlzdC5qc1wiLFwiLy4uLy4uL25vZGVfbW9kdWxlcy9jaGFydGlzdC9kaXN0XCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuZXhwb3J0cy5yZWFkID0gZnVuY3Rpb24gKGJ1ZmZlciwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG1cbiAgdmFyIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBuQml0cyA9IC03XG4gIHZhciBpID0gaXNMRSA/IChuQnl0ZXMgLSAxKSA6IDBcbiAgdmFyIGQgPSBpc0xFID8gLTEgOiAxXG4gIHZhciBzID0gYnVmZmVyW29mZnNldCArIGldXG5cbiAgaSArPSBkXG5cbiAgZSA9IHMgJiAoKDEgPDwgKC1uQml0cykpIC0gMSlcbiAgcyA+Pj0gKC1uQml0cylcbiAgbkJpdHMgKz0gZUxlblxuICBmb3IgKDsgbkJpdHMgPiAwOyBlID0gZSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KSB7fVxuXG4gIG0gPSBlICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIGUgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IG1MZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgbSA9IG0gKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBpZiAoZSA9PT0gMCkge1xuICAgIGUgPSAxIC0gZUJpYXNcbiAgfSBlbHNlIGlmIChlID09PSBlTWF4KSB7XG4gICAgcmV0dXJuIG0gPyBOYU4gOiAoKHMgPyAtMSA6IDEpICogSW5maW5pdHkpXG4gIH0gZWxzZSB7XG4gICAgbSA9IG0gKyBNYXRoLnBvdygyLCBtTGVuKVxuICAgIGUgPSBlIC0gZUJpYXNcbiAgfVxuICByZXR1cm4gKHMgPyAtMSA6IDEpICogbSAqIE1hdGgucG93KDIsIGUgLSBtTGVuKVxufVxuXG5leHBvcnRzLndyaXRlID0gZnVuY3Rpb24gKGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtLCBjXG4gIHZhciBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgcnQgPSAobUxlbiA9PT0gMjMgPyBNYXRoLnBvdygyLCAtMjQpIC0gTWF0aC5wb3coMiwgLTc3KSA6IDApXG4gIHZhciBpID0gaXNMRSA/IDAgOiAobkJ5dGVzIC0gMSlcbiAgdmFyIGQgPSBpc0xFID8gMSA6IC0xXG4gIHZhciBzID0gdmFsdWUgPCAwIHx8ICh2YWx1ZSA9PT0gMCAmJiAxIC8gdmFsdWUgPCAwKSA/IDEgOiAwXG5cbiAgdmFsdWUgPSBNYXRoLmFicyh2YWx1ZSlcblxuICBpZiAoaXNOYU4odmFsdWUpIHx8IHZhbHVlID09PSBJbmZpbml0eSkge1xuICAgIG0gPSBpc05hTih2YWx1ZSkgPyAxIDogMFxuICAgIGUgPSBlTWF4XG4gIH0gZWxzZSB7XG4gICAgZSA9IE1hdGguZmxvb3IoTWF0aC5sb2codmFsdWUpIC8gTWF0aC5MTjIpXG4gICAgaWYgKHZhbHVlICogKGMgPSBNYXRoLnBvdygyLCAtZSkpIDwgMSkge1xuICAgICAgZS0tXG4gICAgICBjICo9IDJcbiAgICB9XG4gICAgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICB2YWx1ZSArPSBydCAvIGNcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgKz0gcnQgKiBNYXRoLnBvdygyLCAxIC0gZUJpYXMpXG4gICAgfVxuICAgIGlmICh2YWx1ZSAqIGMgPj0gMikge1xuICAgICAgZSsrXG4gICAgICBjIC89IDJcbiAgICB9XG5cbiAgICBpZiAoZSArIGVCaWFzID49IGVNYXgpIHtcbiAgICAgIG0gPSAwXG4gICAgICBlID0gZU1heFxuICAgIH0gZWxzZSBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIG0gPSAodmFsdWUgKiBjIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKVxuICAgICAgZSA9IGUgKyBlQmlhc1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gdmFsdWUgKiBNYXRoLnBvdygyLCBlQmlhcyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSAwXG4gICAgfVxuICB9XG5cbiAgZm9yICg7IG1MZW4gPj0gODsgYnVmZmVyW29mZnNldCArIGldID0gbSAmIDB4ZmYsIGkgKz0gZCwgbSAvPSAyNTYsIG1MZW4gLT0gOCkge31cblxuICBlID0gKGUgPDwgbUxlbikgfCBtXG4gIGVMZW4gKz0gbUxlblxuICBmb3IgKDsgZUxlbiA+IDA7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IGUgJiAweGZmLCBpICs9IGQsIGUgLz0gMjU2LCBlTGVuIC09IDgpIHt9XG5cbiAgYnVmZmVyW29mZnNldCArIGkgLSBkXSB8PSBzICogMTI4XG59XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwickgxSlBHXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vbm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanNcIixcIi8uLi8uLi9ub2RlX21vZHVsZXMvaWVlZTc1NFwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnByb2Nlc3MubmV4dFRpY2sgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYW5TZXRJbW1lZGlhdGUgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5zZXRJbW1lZGlhdGU7XG4gICAgdmFyIGNhblBvc3QgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5wb3N0TWVzc2FnZSAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lclxuICAgIDtcblxuICAgIGlmIChjYW5TZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiB3aW5kb3cuc2V0SW1tZWRpYXRlKGYpIH07XG4gICAgfVxuXG4gICAgaWYgKGNhblBvc3QpIHtcbiAgICAgICAgdmFyIHF1ZXVlID0gW107XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICB2YXIgc291cmNlID0gZXYuc291cmNlO1xuICAgICAgICAgICAgaWYgKChzb3VyY2UgPT09IHdpbmRvdyB8fCBzb3VyY2UgPT09IG51bGwpICYmIGV2LmRhdGEgPT09ICdwcm9jZXNzLXRpY2snKSB7XG4gICAgICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZuID0gcXVldWUuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICAgICAgcXVldWUucHVzaChmbik7XG4gICAgICAgICAgICB3aW5kb3cucG9zdE1lc3NhZ2UoJ3Byb2Nlc3MtdGljaycsICcqJyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZm4sIDApO1xuICAgIH07XG59KSgpO1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn1cblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcInJIMUpQR1wiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanNcIixcIi8uLi8uLi9ub2RlX21vZHVsZXMvcHJvY2Vzc1wiKSJdfQ==
