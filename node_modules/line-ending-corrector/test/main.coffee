
expect = require('chai').expect

fs = require 'fs'

{ LineEndingCorrector } = require './../index.coffee'

describe 'LineEndingCorrector', ->

  describe '.__extractOptions()', ->

    it 'existance', ->

      expect(LineEndingCorrector).to.have.property('__extractOptions').that.is.a('function')

    it 'input-output sets', ->

      fn = LineEndingCorrector.__extractOptions

      expect(fn()).to.deep.equal { eolc: 'LF', encoding: 'utf8' }

      expect(fn {}).to.deep.equal { eolc: 'LF', encoding: 'utf8' }

      expect(fn { garbage: 'yes' } ).to.deep.equal { garbage: 'yes', eolc: 'LF', encoding: 'utf8' }

      expect(fn { eolc: 'CRLF' }).to.deep.equal { eolc: 'CRLF', encoding: 'utf8' }

      expect(fn { eolc: null }).to.deep.equal { eolc: 'LF', encoding: 'utf8' }

      expect(fn { eolc: 'Random' }).to.deep.equal { eolc: 'LF', encoding: 'utf8' }

      expect(fn { encoding: null }).to.deep.equal { eolc: 'LF', encoding: 'utf8' }

      expect(fn { encoding: 'UnknownEncoding' }).to.deep.equal { eolc: 'LF', encoding: 'UnknownEncoding' }    

  describe '.__correct()', ->

    fn = LineEndingCorrector.__correct

    it 'existance', ->

      expect(LineEndingCorrector).to.have.property('__correct').that.is.a('function')

    it 'input-output set 1', ->
      
      input = 'Line1\nLine2'
      expectedOutput = 'Line1\nLine2'
      [ wasAltered, output ] = fn input, 'LF'
      expect(wasAltered).to.equal(false)
      expect(output).to.equal(expectedOutput)

    it 'input-output set 2', ->

      input = 'Line1\r\nLine2'
      expectedOutput = 'Line1\nLine2'
      [ wasAltered, output ] = fn input, 'LF'
      expect(wasAltered).to.equal(true)
      expect(output).to.equal(expectedOutput)

    it 'input-output set 3', ->

      input = 'Line1\r\nLine2\r\n\r\n\r\nAnotherLine\nAnotherLine\rSomething\n\n'
      expectedOutput = 'Line1\nLine2\n\n\nAnotherLine\nAnotherLine\nSomething\n\n'
      [ wasAltered, output ] = fn input, 'LF'
      expect(wasAltered).to.equal(true)
      expect(output).to.equal(expectedOutput)

    it 'input-output set 2.1', ->
      
      input = 'Line1\nLine2'
      expectedOutput = 'Line1\r\nLine2'
      [ wasAltered, output ] = fn input, 'CRLF'
      expect(wasAltered).to.equal(true)
      expect(output).to.equal(expectedOutput)

    it 'input-output set 2.2', ->

      input = 'Line1\r\nLine2'
      expectedOutput = 'Line1\r\nLine2'
      [ wasAltered, output ] = fn input, 'CRLF'
      expect(wasAltered).to.equal(false)
      expect(output).to.equal(expectedOutput)

    it 'input-output set 2.3', ->

      input = 'Line1\r\nLine2\r\n\r\n\r\nAnotherLine\nAnotherLine\rSomething\n\n'
      expectedOutput = 'Line1\r\nLine2\r\n\r\n\r\nAnotherLine\r\nAnotherLine\r\nSomething\r\n\r\n'
      [ wasAltered, output ] = fn input, 'CRLF'
      expect(wasAltered).to.equal(true)
      expect(output).to.equal(expectedOutput)


  describe '.__CorrectedStream class', ->

    __CorrectedStream = LineEndingCorrector.__CorrectedStream

    it 'existance', ->

      expect(LineEndingCorrector).to.have.property('__CorrectedStream').that.is.a('function')

    it 'input-output set 1', (done)->

      inputStream = fs.createReadStream './test/case-1-input', { encoding:'utf8' }

      outputStream = new __CorrectedStream inputStream, 'CRLF'

      outputSummary = ''

      outputStream.on 'data', (data)->
        outputSummary += data

      outputStream.on 'end', ->
        contents = fs.readFileSync './test/case-1-input', { encoding:'utf8' }
        [ _, expectedOutput ] = LineEndingCorrector.__correct contents, 'CRLF', 'utf8'
        expect(outputSummary).to.equal(expectedOutput)
        done()


  describe '.correctSync()', ->

    fn = LineEndingCorrector.correctSync

    it 'existance', ->

      expect(LineEndingCorrector).to.have.property('correctSync').that.is.a('function')

    it 'input-output set 1', ->
      
      input = 'Line1\nLine2'
      expectedOutput = 'Line1\nLine2'
      [ wasAltered, output ] = fn input, { eolc: 'LF' }
      expect(wasAltered).to.equal(false)
      expect(output).to.equal(expectedOutput)
      
    it 'input-output set 2', ->
      
      input = 'Line1\nLine2'
      expectedOutput = 'Line1\nLine2'
      expect(fn).to.throw(Error, 'Expected String')

  describe '.correct()', ->

    fn = LineEndingCorrector.correct

    it 'existance', ->

      expect(LineEndingCorrector).to.have.property('correct').that.is.a('function')

    it 'input-output set 1', (done)->
      
      input = 'Line1\nLine2'
      expectedOutput = 'Line1\nLine2'

      fn input, null, (err, wasAltered, output)=>
        expect(err).to.equal(null)
        expect(wasAltered).to.equal(false)
        expect(output).to.equal(expectedOutput)
        done()

    it 'input-output set 2', (done)->
      
      input = 'Line1\nLine2'
      expectedOutput = 'Line1\nLine2'

      fn null, null, (err, wasAltered, output)=>
        expect(err).to.not.equal(null)
        expect(err).to.have.property('message').that.equals('Expected String')
        done()

  describe '.correctStream()', ->

    fn = LineEndingCorrector.correctStream

    it 'existance', ->

      expect(LineEndingCorrector).to.have.property('correctStream').that.is.a('function')

    it 'input-output set 1', (done)->

      inputStream = fs.createReadStream './test/case-1-input', { encoding:'utf8' }

      outputStream = fn inputStream, { eolc: 'CRLF' }

      outputSummary = ''

      outputStream.on 'data', (data)->
        outputSummary += data

      outputStream.on 'end', ->
        contents = fs.readFileSync './test/case-1-input', { encoding:'utf8' }
        [ _, expectedOutput ] = LineEndingCorrector.__correct contents, 'CRLF', 'utf8'
        expect(outputSummary).to.equal(expectedOutput)
        done()







