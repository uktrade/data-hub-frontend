/* eslint-disable */
const {addClass, removeClass} = require('../lib/elementstuff')

function addEventListenerList (list, event, fn) {
  for (const element of list) {
    element.addEventListener(event, fn, false)
  }
}

class Tabs {

  constructor (element) {
    this.cacheEls(element)
    this.bindEvents()

    let hash = window.location.hash.substring(1)
    let tabElement

    if (hash) {
      tabElement = element.querySelector(`#tab-${hash}`)
    }

    if (!tabElement || tabElement.length === 0) {
      tabElement = this.tabs[0]
    }

    this.toggleTab(tabElement)
  }

  cacheEls (element) {
    this.element = element
    this.tabs = this.element.querySelectorAll('.tabs-nav a')
    this.panels = this.element.querySelectorAll('.tabs-panel')
  }

  bindEvents () {
    addEventListenerList(this.tabs, 'click', this.clickTab)
  }

  clickTab = (event) => {
    event.preventDefault()
    this.toggleTab(event.target)
  }

  toggleTab (tab) {
    if (!tab || tab.length === 0) return

    removeClass(this.tabs, 'selected')
    removeClass(this.panels, 'selected')

    if (tab.length < 1) {
      return
    }

    const activePanelId = tab.href.split('#')[1]
    const activePanel = document.querySelector('#' + activePanelId)

    addClass(tab, 'selected')
    addClass(activePanel, 'selected')

    Tabs.updateUrl(activePanelId.substr(12))
  }

  static updateUrl (tab) {
    if (typeof window.history.pushState === 'function') {
      const fullUrl = window.location.href
      let pos = fullUrl.indexOf('#')
      if (pos === -1) pos = fullUrl.length
      const newUrl = fullUrl.substring(0, pos) + '#' + tab
      window.history.pushState(null, null, newUrl)
    }
  }

  static activateAll () {
    const tabWrappers = document.querySelectorAll('.js-tabs')
    for (let pos = 0; pos < tabWrappers.length; pos += 1) {
      const elem = tabWrappers.item(pos)
      new Tabs(elem)
    }
  }
}

Tabs.activateAll()
