describe('#localNavMiddleware', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.localNavMiddleware = require('~/src/middleware/local-nav')

    this.nextSpy = this.sandbox.spy()
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  const NAV_ITEMS = [
    { path: '../first', label: 'First' },
    { path: '../second', label: 'Second' },
  ]

  it('should attach nav items props to locals', () => {
    const resMock = {
      locals: {
        CURRENT_PATH: '/sub-app/resource',
      },
    }

    this.localNavMiddleware(NAV_ITEMS)({}, resMock, this.nextSpy)

    expect(resMock.locals).to.haveOwnProperty('localNavItems')
    expect(resMock.locals.localNavItems[0].url).to.equal('/sub-app/first')
    expect(resMock.locals.localNavItems[0].isActive).to.be.false
    expect(this.nextSpy.calledOnce).to.be.true
  })

  it('should set new isActive to true for the current path', () => {
    const resMock = {
      locals: {
        CURRENT_PATH: '/sub-app/first',
      },
    }
    this.localNavMiddleware(NAV_ITEMS)({}, resMock, this.nextSpy)

    expect(resMock.locals).to.haveOwnProperty('localNavItems')
    expect(resMock.locals.localNavItems[0].url).to.equal('/sub-app/first')
    expect(resMock.locals.localNavItems[0].isActive).to.be.true
    expect(this.nextSpy.calledOnce).to.be.true
  })
})
