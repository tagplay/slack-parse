'use strict'

var trim = require('trim')
var word = require('is-word-character')
var whitespace = require('is-whitespace-character')
var locate = require('../locate/delete')

module.exports = strikethrough
strikethrough.locator = locate

var tilde = '~'
var backslash = '\\'

function strikethrough(eat, value, silent) {
  var self = this
  var index = 0
  var character = value.charAt(index)
  var now
  var pedantic
  var marker
  var queue
  var subvalue
  var length
  var prev

  if (character !== tilde) {
    return
  }

  pedantic = self.options.pedantic
  subvalue = character
  marker = character
  length = value.length
  index++
  queue = ''
  character = ''

  if (pedantic && whitespace(value.charAt(index))) {
    return
  }

  while (index < length) {
    prev = character
    character = value.charAt(index)

    if (character === marker && (!pedantic || !whitespace(prev))) {
      character = value.charAt(++index)

      if (character !== marker) {
        if (!trim(queue) || prev === marker) {
          return
        }

        if (!pedantic && word(character)) {
          queue += marker
          continue
        }

        /* istanbul ignore if - never used (yet) */
        if (silent) {
          return true
        }

        now = eat.now()
        now.column++
        now.offset++

        return eat(subvalue + queue + marker)({
          type: 'delete',
          children: self.tokenizeInline(queue, now)
        })
      }

      queue += marker
    }

    if (!pedantic && character === backslash) {
      queue += character
      character = value.charAt(++index)
    }

    queue += character
    index++
  }
}
