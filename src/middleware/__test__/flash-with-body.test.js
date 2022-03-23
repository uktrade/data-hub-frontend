const { faker } = require('@faker-js/faker')
const flashWithBody = require('../flash-with-body')

const words = faker.lorem.words

describe('flashWithBody middleware', () => {
  let req, res, next
  before(() => {
    req = {
      flash: sinon.spy(),
    }
    res = {}
    next = sinon.spy()

    flashWithBody(req, res, next)
  })

  it('Should add the middleware function', () => {
    expect(typeof req.flashWithBody).to.equal('function')
  })

  it('Should stringify the data as JSON and change the type label', () => {
    const heading = words(5)
    const body = words(10)
    const id = words(1)

    req.flashWithBody('success', heading, body, id)

    expect(req.flash).to.have.been.calledOnceWithExactly(
      'success:with-body',
      JSON.stringify({ heading, body, id })
    )
  })

  it('Should call next', () => {
    expect(next).to.have.been.calledWithExactly()
  })
})
