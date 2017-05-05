/* eslint no-new: 0 */
const { hide, toggleVisible, toggleClass } = require('../lib/elementstuff')

class ExpandingCard {
  constructor (element) {
    this.cacheElements(element)
    this.enhanceMarkup()
    this.addEvents()
    hide(this.revealElement)
  }

  cacheElements (element) {
    this.wrapperElement = element
    this.toggleButton = element.querySelector('.expanding-card__button')
    this.revealElement = element.querySelector('.expanding-card__reveal')
  }

  enhanceMarkup () {
    // modify the link add an indicator to show expansion state
    const buttonText = this.toggleButton.innerText
    const markup = `<span class="expanding-card__button-indicator"><span>
      <span class="expanding-card__button-text">${buttonText}</span>`
    this.toggleButton.innerHTML = markup
    this.indicator = this.toggleButton.querySelector('.expanding-card__button-indicator')
  }

  addEvents () {
    this.toggleButton.addEventListener('click', this.clickToggleButton, true)
  }

  clickToggleButton = (event) => {
    toggleVisible(this.revealElement)
    toggleClass(this.wrapperElement, 'expanding-card--open')
    this.toggleButton.blur()
  }
}

const expandingCards = document.querySelectorAll('.expanding-card')
for (let pos = 0; pos < expandingCards.length; pos += 1) {
  const expandingCard = expandingCards.item(pos)
  new ExpandingCard(expandingCard)
}

module.exports = ExpandingCard

