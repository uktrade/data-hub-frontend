const axios = require('axios')
const createHistory = require('history').createBrowserHistory
const queryString = require('query-string')

const history = createHistory()

history.listen((location, action) => {
  if (action === 'POP') {
    if (location.state) {
      XHR.injectResponseInHtml(location.state.data)
    } else if (window.location.pathname !== location.pathname && window.location.search !== location.search) {
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
      history.push(`?${queryString.stringify(params)}`, { data: res.data })
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
      .get(`${url}?${queryString.stringify(params)}`, {
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      })
      .then(res => this.updateOutlet(res, params))
  },
}

module.exports = XHR
