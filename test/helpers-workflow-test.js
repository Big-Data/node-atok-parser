/*
 * Parser Helpers Workflow tests
**/
var assert = require('assert')

var atokParser = require('..')
var options = {}

describe('Parser Helpers Workflow', function () {
  describe('mixin', function () {
    var Parser = atokParser.createParserFromFile('./parsers/workflowHelperParser.js', 'options')
    var p = new Parser()
    var number, word, string, float, match

    it('should parse the input data', function (done) {
      function handler (token, idx, type) {
        switch (type) {
          case 'number':
            assert.equal(token, 123)
            number = true
          break
          case 'word':
            assert.equal(token, 'abc')
            word = true
          break
          case 'string':
            assert.equal(token, '~$')
            string = true
          break
          case 'float':
            assert.equal(token, 456.789e7)
            float = true
          break
          case 'match':
            assert.equal(token, '12ab')
            match = true
          break
          default:
            done( new Error('Unknown type: ' + type) )
        }
      }

      p.on('data', handler)
      p.write(' "~$" (12ab) abc 123 456.789e7 ')
      assert(string)
      assert(match)
      assert(word)
      assert(number)
      assert(float)
      done()
    })
  })
})