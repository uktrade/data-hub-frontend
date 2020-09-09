const createMemoryHistory = require('history').createMemoryHistory

const HTML = `
  <html>
    <body>
      <div data-xhr="1"></div>
      <div data-xhr="2"></div>
      <div data-xhr="3">Not updated</div>
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
    global.document.createRange = () => {
      return {
        createContextualFragment(data) {
          return new JSDOM(data).window.document
        },
      }
    }
    XHR = proxyquire('../../assets/javascripts/lib/xhr', {
      history: { createBrowserHistory: () => history },
    })
  })

  describe('#updateOutlet', () => {
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
      sinon.stub(history, 'replace').throws('error')
      // can't simply reassign the assign function so need to delete window.location first
      // https://github.com/jsdom/jsdom/issues/2674
      delete window.location
      window.location = { assign: sinon.spy() }
      const res = { data: {} }
      const params = { a: 1, b: 2 }
      XHR.updateOutlet(res, params)
      expect(window.location.assign).to.be.calledWith('?a=1&b=2')
      // clean up and put window.location back
      window.location = location
    })
  })

  describe('#injectResponseInHtml', () => {
    beforeEach(() => {
      XHR.injectResponseInHtml(
        '<div data-xhr="1"><p>Updated 1</p></div><div data-xhr="2"><p>Updated 2</p></div>'
      )
    })

    it('should update container 1', () => {
      const container1 = global.window.document.querySelector(`[data-xhr="1"]`)
      expect(container1.innerHTML).to.equal('<p>Updated 1</p>')
    })

    it('should update container 2', () => {
      const container2 = global.window.document.querySelector(`[data-xhr="2"]`)
      expect(container2.innerHTML).to.equal('<p>Updated 2</p>')
    })

    it('should not update container 3', () => {
      const container3 = global.window.document.querySelector(`[data-xhr="3"]`)
      expect(container3.innerHTML).to.equal('Not updated')
    })
  })
})
