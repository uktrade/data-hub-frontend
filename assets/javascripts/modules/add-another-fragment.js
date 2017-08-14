const {
  insertAfter,
  resetFieldValues,
  regenIds,
  closest,
  hide,
  show,
} = require('../_deprecated/lib/element-stuff')

const wrapperClass = 'js-addanother'
const defaultAddButtonClass = 'js-addanother__add'
const defaultRemoveButtonClass = 'js-addanother__remove'

/**
 * AddAnotherFragment
 *
 * Component that scans markup to find elements that require a 'add another' button
 * The target element defines a selector to define what page fragment should be duplicated
 * when the user preses add another. The contents of the cloned fragment will have it's fields reset.
 * The component also inserts a 'remove' button that will allow values to also be removed.
 *
 * The selector used to activate the component is 'js-add-another-fragment'
 *
 * The element that includes the activation class must also provide data attributes to define
 * it's behaviour
 *
 * data-fragment-selector: The css selector that defines the element to clone.
 * data-fragment-allow-remove-all: (Optional) By default the component won't let the user delete the last instance
 *                                 of the defined element. If the user needs to be able to delete all instances
 *                                 then provide a value 'yes'
 * data-fragment-add-button-selector: (Optional) By default the component will add a 'add another' button
 *                                 to the end of the wrapper fragment. If an add button already exists
 *                                 within the markup then the css selector to that button can be specified.
 * data-fragment-add-button-text: (Optional) Allow the text for the 'add another' button to be specified
 * data-fragment-remove-selector: (Optional) If the initial markup includes a remove button then this
 *                                selector will attach the remove event handler to it intead of adding a button
 * data-fragment-remove-button-text: (Optional) Allow the text for the 'add another' button to be specified
 *
 * e.g.
 * <div class="js-add-another-fragment" data-fragment-selector=".js-adviser">
 *   <div class="c-form-group js-adviser">
 *     <label for="adviser">Adviser</label>
 *     <select name="adviser">
 *       <option value="">---Select Adviser--</option>
 *       ...
 *     </select>
 *   </div>
 * </div>
 */
const AddAnotherFragment = {}

AddAnotherFragment.prototype = {
  /**
   * init
   *
   * Main setup method
   * Gets params, generates a template for new fragments
   * and adds and activates add and delete buttons
   */
  init () {
    this.parseProperties()
    this.lastFragment = this.wrapper.querySelector(`${this.fragmentSelector}:last-of-type`)
    this.getTemplate()
    this.addPlaceholder()
    this.setupAddAndRemoveButtons()
    this.bindEvents()
  },

  /**
   * setupAddAndRemoveButtons
   *
   * Parse the content and render additional markup,
   * or decorate existing markup if required
   */
  setupAddAndRemoveButtons () {
    if (!this.overrideAddButton) {
      this.insertAddButton()
    }
    this.decorateAddButton()

    if (!this.overrideRemoveButton) {
      this.insertRemoveButtons()
    }
    this.decorateRemoveButtons()
    this.updateRemoveButtonVisibility()
  },

  /**
   * parseProperties
   *
   * Look at the wrapper element for parameters and properties
   * that describe the behaviour of the component
   */
  parseProperties () {
    this.fragmentSelector = this.wrapper.getAttribute('data-selector')

    this.allowRemoveAll = this.wrapper.hasAttribute('data-allow-remove-all')

    this.overrideAddButton = this.wrapper.hasAttribute('data-add-button-selector')
    this.addButtonSelector = this.wrapper.getAttribute('data-add-button-selector') || `.${defaultAddButtonClass} a`
    this.addText = this.wrapper.getAttribute('data-add-button-text') || 'Add another'

    this.overrideRemoveButton = this.wrapper.hasAttribute('data-remove-button-selector')
    this.removeButtonSelector = this.wrapper.getAttribute('data-remove-button-selector') || `.${defaultRemoveButtonClass} a`
    this.removeText = this.wrapper.getAttribute('data-remove-button-text') || 'Remove'
  },

  /**
   * addEventListeners
   *
   * Attach an event listener to the wrapper
   * element that waits for the use to click on
   * the add and remove buttons, and intercept and redirects
   * those events, so events don't have to be attached to each
   * link
   */
  bindEvents () {
    this.wrapper.addEventListener('click', this.clickHandler.bind(this))
  },

  /**
   * getTemplate
   *
   * Takes a copy of a fragment and resets the field values
   * so it can be used as a blueprint for a new fragment
   *
   */
  getTemplate () {
    this.templateFragment = this.lastFragment
    resetFieldValues(this.templateFragment)
  },

  /**
   * addPlaceholder
   *
   * Insert a placeholder under the last existing fragment,
   * so new fragments are always inserted in to the corect place
   * even when adding a new fragment when there are none.
   */
  addPlaceholder () {
    this.placeHolder = this.document.createElement('div')
    insertAfter(this.placeHolder, this.lastFragment)
  },

  /**
   * decorateAddButton
   *
   * Adds a data attribute to the add button so the event handler
   * recognises it is an add button for this component.
   */
  decorateAddButton () {
    const addButton = this.wrapper.querySelector(this.addButtonSelector)
    if (addButton) {
      addButton.setAttribute('data-method', 'add')
    }
  },

  /**
   * decorateRemoveButton
   *
   * Adds a data attribute to all remove buttons so the event handler
   * recognises them as a remove button for this component.
   */
  decorateRemoveButtons () {
    Array
      .from(this.wrapper.querySelectorAll(this.removeButtonSelector))
      .forEach((element) => {
        element.setAttribute('data-method', 'remove')
      })
  },

  /**
   * insertAddButton
   *
   * Creates a new button to 'add another' and appends it after the
   * placeholder that indicates the end of the fragments
   */
  insertAddButton () {
    const addButtonElement = this.document.createElement('a')
    addButtonElement.href = '#'
    addButtonElement.innerHTML = this.addText

    const addButtonWrapper = this.document.createElement('p')
    addButtonWrapper.className = `c-form-group c-form-group--actions ${defaultAddButtonClass}`
    addButtonWrapper.appendChild(addButtonElement)

    insertAfter(addButtonWrapper, this.placeHolder)
  },

  /**
   * insertRemoveButtons
   *
   * Adds a 'remove' button to the each of each of the fragments.
   */
  insertRemoveButtons () {
    Array.from(this.wrapper.querySelectorAll(this.fragmentSelector))
      .forEach((fragment) => {
        const removeButtonElement = this.document.createElement('a')
        removeButtonElement.innerHTML = this.removeText
        removeButtonElement.href = '#'

        const p = this.document.createElement('p')
        p.className = `c-form-group c-form-group--actions ${defaultRemoveButtonClass}`
        p.appendChild(removeButtonElement)

        fragment.appendChild(p)
      })
  },

  /**
   * updateRemoveButtonVisibility
   *
   * Determines if remove buttons can be seen based on rules around
   * allowing a user to delete, or not delete all fragments
   */
  updateRemoveButtonVisibility () {
    const removeButtons = Array.from(this.wrapper.querySelectorAll(this.removeButtonSelector))

    // Don't allow the last fragment to be deleted unless it's the desired behaviour
    if (removeButtons.length === 1 && !this.allowRemoveAll) {
      hide(removeButtons[0])
    } else {
      removeButtons.forEach((fragment) => show(fragment))
    }
  },

  // When the user presses 'add another', clone a template
  // Then reset any fields id's within it
  addClickHandler (event) {
    event.preventDefault()
    event.target.blur()

    const clonedFragment = this.templateFragment.cloneNode(true)
    regenIds(clonedFragment)

    // Add the fragment below the last one, unless there are none left,
    // in which case add it before the 'add another' button
    this.wrapper.insertBefore(clonedFragment, this.placeHolder)

    this.updateRemoveButtonVisibility()
  },

  // Handle when a user clicks on a 'remove' link
  // Gets the selector for the fragment to remove and removes it.
  // Then updates the last fragment in case we just deleted it.
  removeClickHandler (event) {
    event.preventDefault()
    event.target.blur()

    // Remove the fragment that contains the remove button
    const fragment = closest(event.target, this.fragmentSelector)
    this.wrapper.removeChild(fragment)

    this.updateRemoveButtonVisibility()
  },

  // Listen for button clicks on the wrapper and direct events to the correct
  // handler if they are to add or remove
  clickHandler (event) {
    const target = event.target
    if (!target.hasAttribute('data-method')) {
      return
    }

    switch (target.getAttribute('data-method')) {
      case 'add':
        this.addClickHandler(event)
        break
      case 'remove':
        this.removeClickHandler(event)
        break
    }
  },
}

module.exports = {
  init (page = document) {
    const targetElements = Array.from(page.querySelectorAll(`.${wrapperClass}`))
    targetElements.forEach((targetElement) => {
      const addAnotherFragment = Object.create(AddAnotherFragment.prototype, {
        wrapper: {
          value: targetElement,
        },
        document: {
          value: page,
        },
      })
      addAnotherFragment.init()
    })
  },
}
