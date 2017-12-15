beforeEach(() => {
  sandbox = sinon.sandbox.create()
})

afterEach(() => {
  sandbox.restore()
  nock.cleanAll()
})
