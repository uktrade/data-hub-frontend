const { JSDOM } = require('jsdom')
const createMemoryHistory = require('history').createMemoryHistory

const HTML = `
  <html>
    <body>
      <div id="xhr-outlet"></div>
    </body>
  </html>`

describe('XHR', () => {
  let XHR
  let history
  beforeEach(() => {
    history = createMemoryHistory()
    history.location = {}
    global.window = new JSDOM(HTML).window
    global.document = global.window.document
    XHR = proxyquire('~/assets/javascripts/lib/xhr', {
      'history': { createBrowserHistory: () => history },
    })
    this.sandbox = sinon.sandbox.create()
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('updateOutlet', () => {
    it('should call history.push if params are provided', () => {
      const res = { data: {} }
      const params = { a: 1, b: 2 }
      XHR.updateOutlet(res, params)
      expect(history.location.search).to.equal('?a=1&b=2')
    })
    it('should not call history.push if params are not provided', () => {
      const res = { data: {} }
      const params = {}
      XHR.updateOutlet(res, params)
      expect(history.location.search).to.equal('')
    })
    it('should perform page load if unable to pushState', () => {
      this.sandbox.stub(history, 'push').throws('error')
      this.sandbox.stub(window.location, 'assign')
      const res = { data: {} }
      const params = { a: 1, b: 2 }
      XHR.updateOutlet(res, params)
      expect(window.location.assign).to.be.calledWith('?a=1&b=2')
    })
  })
})
