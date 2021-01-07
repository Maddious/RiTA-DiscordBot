
{ Readable } = require 'stream'

class __CorrectedStream extends Readable

  constructor: (@contentStream, @eolc, @providedEncoding = 'utf8')->
    super()

    hasEneded = false

    @contentStream.on 'open', => 

      @contentStream.on 'data', (chunk)=>
        unless hasEneded
          [ _, chunk] = LineEndingCorrector.__correct chunk, @eolc
          @push chunk, @providedEncoding

      @contentStream.on 'end', =>
        unless hasEneded
          @push null
        hasEneded = true

    @setEncoding @providedEncoding

  _read: (n)=> null


class LineEndingCorrector
  
  @defualtEolName: 'LF'

  @eolNameList: [ 'CRLF', 'CR', 'LF' ]

  @__extractOptions: (optionMap)->
    optionMap = {} if not optionMap or typeof optionMap isnt 'object'
    if not ('eolc' of optionMap) or not (optionMap.eolc in LineEndingCorrector.eolNameList)
      optionMap.eolc = LineEndingCorrector.defualtEolName 
    if not ('encoding' of optionMap) or typeof optionMap.encoding isnt 'string'
      optionMap.encoding = 'utf8'
    return optionMap

  @__correct: (content, desiredEolName)->
    if desiredEolName is 'CRLF'
      parts = content.split /\r\n|\n|\r/g
      newContent = parts.join '\r\n'
      return [ (content isnt newContent), newContent ]
    else if desiredEolName is 'LF'
      parts = content.split /\r\n|\n|\r/g
      newContent = parts.join '\n'
      return [ (content isnt newContent), newContent ]
    else if desiredEolName is 'CR'
      parts = content.split /\r\n|\n|\r/g
      newContent = parts.join '\r'
      return [ (content isnt newContent), newContent ]

  @__CorrectedStream: __CorrectedStream

  @correctSync: (content, optionMap)->
    throw new Error "Expected String" if typeof content isnt 'string'
    { eolc } = LineEndingCorrector.__extractOptions optionMap
    return LineEndingCorrector.__correct content, eolc

  @correct: (content, optionMap, cbfn)->
    setImmediate =>
      try
        [ wasAltered, output ] = LineEndingCorrector.correctSync content, optionMap
      catch ex
        return cbfn ex
      return cbfn null, wasAltered, output
  
  @correctStream: (contentStream, optionMap)->
    { eolc, encoding } = LineEndingCorrector.__extractOptions optionMap
    return new LineEndingCorrector.__CorrectedStream contentStream, eolc, encoding

@LineEndingCorrector = LineEndingCorrector

