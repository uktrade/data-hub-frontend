/* eslint-disable */
class FlashMessage {
  constructor (element) {
    this.element = element
    this.addCloseLink()
  }

  removeMessage () {
    this.element.parentNode.removeChild(this.element)
  }

  addCloseLink () {
    let removeMessage = this.removeMessage.bind(this)
    let closeLink = document.createElement('a')

    closeLink.innerHTML = 'Close'
    closeLink.href = '#'
    closeLink.onclick = (e) => {
      e.preventDefault()
      removeMessage()
    }

    this.element.appendChild(closeLink)
  }

  static activateAll () {
    const flashes = document.querySelectorAll('.flash-message')
    for (let pos = 0; pos < flashes.length; pos += 1) {
      const elem = flashes.item(pos)
      new FlashMessage(elem)
    }
  }
}

FlashMessage.activateAll()
