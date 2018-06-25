const axios = require('axios')
const createHistory = require('history').createBrowserHistory
const queryString = require('qs')

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
      const url = `?${queryString.stringify(params)}`
      try {
        history.replace(url, { data: res.data })
      } catch (err) {
        // state was too large for browser to handle. Do full page load.
        window.location.assign(url)
      }
    }

    return res
  },

  request (url, params = {}, showLoader = true) {
    const outlet = this.getOutlet()
    if (!outlet) { return }

    if (showLoader) {
      outlet.classList.add('u-loading')
    }

    if (params) {
      const url = `?${queryString.stringify(params)}`
      history.push(url)
    }

    return axios
      .get(`${url}?${queryString.stringify(params, { arrayFormat: 'repeat' })}`, {
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      })
      .then(res => this.updateOutlet(res, params))
  },
}

module.exports = XHR
