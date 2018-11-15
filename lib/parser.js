'use strict'

var xtend = require('xtend')
var toggle = require('state-toggle')
var vfileLocation = require('vfile-location')
var unescape = require('./unescape')
var decode = require('./decode')
var tokenizer = require('./tokenizer')

module.exports = Parser

function Parser(doc, file) {
  this.file = file
  this.offset = {}
  this.options = xtend(this.options)
  this.setOptions({})

  this.inBlock = false
  this.inLink = false
  this.atStart = true

  this.toOffset = vfileLocation(file).toOffset
  this.unescape = unescape(this, 'escape')
  this.decode = decode(this)
}

var proto = Parser.prototype

// Expose core.
proto.setOptions = require('./set-options')
proto.parse = require('./parse')

// Expose `defaults`.
proto.options = require('./defaults')

// Enter and exit helpers.
proto.exitStart = toggle('atStart', true)
proto.enterLink = toggle('inLink', false)
proto.enterBlock = toggle('inBlock', false)

// Nodes that can interupt a paragraph:
//
// ```markdown
// A paragraph, followed by a thematic break.
// ___
// ```
//
// In the above example, the thematic break “interupts” the paragraph.
proto.interruptParagraph = [
  ['fencedCode'],
  ['blockquote']
]

// Nodes that can interupt a blockquote:
//
// ```markdown
// > A paragraph.
// ___
// ```
//
// In the above example, the thematic break “interupts” the blockquote.
proto.interruptBlockquote = [
  ['fencedCode', {commonmark: true}]
]

// Handlers.
proto.blockTokenizers = {
  newline: require('./tokenize/newline'),
  fencedCode: require('./tokenize/code-fenced'),
  blockquote: require('./tokenize/blockquote'),
  paragraph: require('./tokenize/paragraph')
}

proto.inlineTokenizers = {
  escape: require('./tokenize/escape'),
  link: require('./tokenize/link'),
  strong: require('./tokenize/strong'),
  emphasis: require('./tokenize/emphasis'),
  deletion: require('./tokenize/delete'),
  code: require('./tokenize/code-inline'),
  break: require('./tokenize/break'),
  text: require('./tokenize/text')
}

// Expose precedence.
proto.blockMethods = keys(proto.blockTokenizers)
proto.inlineMethods = keys(proto.inlineTokenizers)

// Tokenizers.
proto.tokenizeBlock = tokenizer('block')
proto.tokenizeInline = tokenizer('inline')
proto.tokenizeFactory = tokenizer

// Get all keys in `value`.
function keys(value) {
  var result = []
  var key

  for (key in value) {
    result.push(key)
  }

  return result
}
