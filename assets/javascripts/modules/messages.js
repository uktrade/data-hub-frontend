const Messages = {
  init (wrapper = document) {
    this.wrapper = wrapper
    this.cacheEls()

    if (this.messages.length) {
      this.render()
    }
  },

  cacheEls () {
    this.messages = this.wrapper.children
  },

  removeElement (element) {
    const parent = element.parentNode

    parent.removeChild(element)

    if (parent.children.length === 0) {
      parent.remove()
    }
  },

  appendClose (element) {
    if (element.className.indexOf('error') === -1) {
      let link = document.createElement('a')

      link.innerHTML = 'Dismiss'
      link.className = 'c-messages__close'
      link.href = '#'
      link.onclick = (e) => {
        e.preventDefault()
        this.removeElement(element)
      }

      element.appendChild(link)
    }
  },

  render () {
    Array.from(this.messages).forEach(this.appendClose.bind(this))
  },
}

module.exports = {
  init () {
    const elements = document.querySelectorAll('.js-Messages')
    Array.from(elements).forEach(element => Messages.init(element))
  },
}
