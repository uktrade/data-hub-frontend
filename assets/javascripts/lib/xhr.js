const axios = require('axios')
const createHistory = require('history').createBrowserHistory
const { buildQueryString } = require('../../../src/lib/url-helpers')

const history = createHistory()

history.listen((location, action) => {
  if (action === 'POP') {
    if (location.state) {
      XHR.injectResponseInHtml(location.state.data)
    } else {
      window.location.href = location.pathname + location.search
    }
  }
})

const XHR = {
  getOutlet () {
    return document.getElementById('xhr-outlet')
  },

  injectResponseInHtml (data) {
    const outlet = this.getOutlet()
    if (!outlet) { return }

    outlet.outerHTML = data
  },

  updateOutlet (res, params) {
    this.injectResponseInHtml(res.data)

    if (params) {
      history.push(buildQueryString(params), { data: res.data })
    }

    return res
  },

  request (url, params = {}, showLoader = true) {
    const outlet = this.getOutlet()
    if (!outlet) { return }

    if (showLoader) {
      outlet.classList.add('u-loading')
    }

    return axios
      .get(url, {
        params,
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      })
      .then(res => this.updateOutlet(res, params))
  },
}

module.exports = XHR
