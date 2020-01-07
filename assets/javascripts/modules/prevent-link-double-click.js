const CONSTANTS = {
  selectors: {
    anchor: 'js-prevent-double-click',
  },
  events: {
    click: 'click',
  },
}

const PreventLinkDoubleClick = {
  counter: 0,

  init() {
    if (document.querySelectorAll(`.${CONSTANTS.selectors.anchor}`).length) {
      this.bindEvents()
    }
  },

  preventDoubleClick(event) {
    const target = event.target
    const targetAnchor = target.closest(`.${CONSTANTS.selectors.anchor}`)

    if (!targetAnchor) {
      return
    }

    if (this.counter >= 1) {
      event.preventDefault()
    } else {
      this.counter += 1
    }
  },

  bindEvents() {
    document.addEventListener(
      CONSTANTS.events.click,
      this.preventDoubleClick.bind(this)
    )
  },
}

module.exports = PreventLinkDoubleClick
