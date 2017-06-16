describe('Trim Body Params Middleware Test', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.nextSpy = this.sandbox.spy()
    this.trimBodyParams = require('~/src/middleware/trimBodyParams')()
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  it('when body is empty should not modify body', () => {
    const mockReq = {
      body: {},
    }

    this.trimBodyParams(
      mockReq,
      {},
      this.nextSpy)

    expect(this.nextSpy.calledOnce).to.be.true
    expect(mockReq.body).to.deep.equal({})
  })

  it('when body has values strings should be trimmed', () => {
    const mockReq = {
      body: {
        example: '    test   ',
      },
    }

    this.trimBodyParams(
      mockReq,
      {},
      this.nextSpy)

    expect(this.nextSpy.calledOnce).to.be.true
    expect(mockReq.body.example).to.equal('test')
  })

  it('when body has arrays the strings values should be trimmed', () => {
    const mockReq = {
      body: {
        example: '    test   ',
        exampleArray: [
          '  an',
          ' example    ',
          '   test',
        ],
      },
    }

    this.trimBodyParams(
      mockReq,
      {},
      this.nextSpy)

    expect(this.nextSpy.calledOnce).to.be.true
    expect(mockReq.body.example).to.equal('test')
    expect(mockReq.body.exampleArray[0]).to.equal('an')
    expect(mockReq.body.exampleArray[1]).to.equal('example')
    expect(mockReq.body.exampleArray[2]).to.equal('test')
  })
})
