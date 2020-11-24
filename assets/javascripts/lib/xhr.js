const axios = require('axios')
const createHistory = require('history').createBrowserHistory
const queryString = require('qs')

const history = createHistory()

history.listen((location, action) => {
  if (action === 'POP') {
    if (location.state) {
      XHR.injectResponseInHtml(location.state.data)
    } else if (
      window.location.pathname !== location.pathname &&
      window.location.search !== location.search
    ) {
      window.location.href = location.pathname + location.search
    }
  }
})

const XHR = {
  injectResponseInHtml(data) {
    const dataDocument = document.createRange().createContextualFragment(data)

    const xhrContainers = document.querySelectorAll('[data-xhr]')
    for (const prop in xhrContainers) {
      if (xhrContainers.hasOwnProperty(prop)) {
        const xhrContainer = xhrContainers[prop]
        const xhrContainerId = xhrContainer.getAttribute('data-xhr')
        const newContent = dataDocument.querySelector(
          `[data-xhr="${xhrContainerId}"]`
        )
        if (newContent) {
          xhrContainer.outerHTML = newContent.outerHTML
        }
      }
    }
  },

  updateOutlet(res, params) {
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

  request(url, params = {}, cancelToken = null) {
    if (params) {
      const url = `?${queryString.stringify(params)}`
      history.push(url)
    }
    const options = {
      ...{ headers: { 'X-Requested-With': 'XMLHttpRequest' } },
      ...(cancelToken && { cancelToken: cancelToken }),
    }
    return axios
      .get(
        `${url}?${queryString.stringify(params, { arrayFormat: 'repeat' })}`,
        options
      )
      .then((res) => this.updateOutlet(res, params))
      .catch((thrown) => {
        if (!axios.isCancel(thrown)) {
          throw thrown
        }
      })
  },
}

module.exports = XHR
