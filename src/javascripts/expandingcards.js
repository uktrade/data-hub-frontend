/* eslint no-new: 0 */
const { hide, toggleVisible, toggleClass } = require('../lib/elementstuff')

/**
 * Allow markup to indicate a hidden section containing sub
 * or detailed data. Simple toggles visibility of the section section
 *
 * @class ExpandingCard
 */
class ExpandingCard {
    constructor (element) {
        this.cacheElements(element)
        this.enhanceMarkup()
        this.addEvents()
        this.initialState()
    }
    
    /**
     * Gets pointes to the important elements used throughout this code
     *
     * @param {HTMLElement} element
     *
     * @memberof ExpandingCard
     */
    cacheElements (element) {
        this.wrapperElement = element
        this.toggleButton = element.querySelector('.expanding-card__button')
        this.revealElement = element.querySelector('.expanding-card__reveal')
    }
    
    /**
     * Turns the plain markup into the markup needed
     * for the control.  Modifies the link add an indicator to show expansion state
     *
     *
     * @memberof ExpandingCard
     */
    enhanceMarkup () {
        const buttonText = this.toggleButton.innerText
        const markup = `<span class="expanding-card__button-indicator"></span>
        <span class="expanding-card__button-text">${buttonText}</span>`
        this.toggleButton.innerHTML = markup
        this.indicator = this.toggleButton.querySelector('.expanding-card__button-indicator')
    }
    
    /**
     * Attach event handers to the DOM
     *
     *
     * @memberof ExpandingCard
     */
    addEvents () {
        this.toggleButton.addEventListener('click', this.clickToggleButton, true)
    }
    
    /**
     * Handle when a user clicks on the expansion button
     *
     *
     * @memberof ExpandingCard
     */
    clickToggleButton = (event) => {
        toggleVisible(this.revealElement)
        toggleClass(this.wrapperElement, 'expanding-card--open')
        this.toggleButton.blur()
    }
    
    /**
     * Set the intial visibilit of a section
     * If the page is called with a #, and that matches the id
     * of the wrapper then we leave this one open, otherwise close it
     * This is for when a person navigates back to a list from another page
     * and we want to restore the state.
     *
     * @memberof ExpandingCard
     */
    initialState () {
        // Get the url hash and the wrapper id to compare
        const hash = window.location.hash.substr(1)
        const id = this.wrapperElement.id
        
        // Does the id for this element match the hash, if so then
        // keep this open
        if (id && hash && id === hash) {
            toggleClass(this.wrapperElement, 'expanding-card--open')
            return
        }
        
        hide(this.revealElement)
    }
}

// Search the page for markup to add behaviour to
const expandingCards = document.querySelectorAll('.expanding-card')
for (let pos = 0; pos < expandingCards.length; pos += 1) {
    const expandingCard = expandingCards.item(pos)
    new ExpandingCard(expandingCard)
}

module.exports = ExpandingCard
