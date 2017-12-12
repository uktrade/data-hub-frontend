const assign = require('lodash/assign')
const pickBy = require('lodash/pickBy')
const {
  insertAfter,
  resetFieldValues,
  regenIds,
  closest,
  removeElement,
} = require('../lib/helpers')

const addButtonClass = 'js-AddItems__add'
const removeButtonClass = 'js-AddItems__remove'

/**
 * AddItems
 *
 * Module that scans markup to find elements that require a 'add another' functionality
 * The target element defines a selector to define what page fragment should be duplicated.
 *
 * Settings can be passed using data attributes to customise how the module behaves:
 *
 * @param {boolean} [canRemove=true] - Whether any items can be removed
 * @param {boolean} [canRemoveAll=false] - Whether all items can be removed
 * @param {string} [itemSelector='.js-AddItems__item'] - The piece of HTML that should be duplicated
 * @param {string} [itemName='item'] - Name to use when adding/removing items
 * @param {string} [addButtonSelector='.js-AddItems__add'] - Selector for adding items. If one cannot be found a button will be added
 * @param {string} [addButtonText='Add another {{itemName}}'] - Text template to use for add button. `{{itemName}}` can be used to position the name of the item
 * @param {string} [removeButtonSelector='.js-AddItems__remove'] - Selector for removing items. If one cannot be found a button will be added to each item
 * @param {string} [removeButtonText='Remove'] - Text template to use for remove button. `{{itemName}}` can be used to position the name of the item
 *
 * @example
 * <div class="js-AddItems" data-item-selector=".js-adviser">
 *   <div>
 *     <div class="c-form-group js-adviser">
 *       <label for="adviser">Adviser</label>
 *       <select name="adviser">
 *         <option value="">---Select Adviser--</option>
 *         ...
 *       </select>
 *     </div>
 *   </div>
 * </div>
 */
const AddItems = {
  defaults: {
    canRemove: true,
    canRemoveAll: false,
    itemSelector: '.js-AddItems__item',
    itemName: 'item',
    addButtonSelector: `.${addButtonClass}`,
    addButtonText: 'Add another {{itemName}}',
    removeButtonSelector: `.${removeButtonClass}`,
    removeButtonText: 'Remove',
  },

  init (wrapper = document, options) {
    this.wrapper = wrapper
    this.settings = assign({}, this.defaults, options)

    this.cacheEls()
    this.bindEvents()
    this.render()
  },

  cacheEls () {
    const lastItem = this.wrapper.querySelector(this.settings.itemSelector)

    this.itemContainer = lastItem.parentNode
    this.template = lastItem.cloneNode(true)
    this.addButton = this.wrapper.querySelector(this.settings.addButtonSelector)
  },

  bindEvents () {
    this.wrapper.addEventListener('click', this.clickHandler.bind(this))
  },

  render () {
    this.insertAddButton()
    if (this.settings.canRemove) {
      this.insertRemoveButtons()
    }

    this.decorateButtons()
    this.updateButtonState()
  },

  decorateButtons () {
    const removeButtons = Array.from(this.wrapper.querySelectorAll(this.settings.removeButtonSelector))
    const addButton = this.wrapper.querySelector(this.settings.addButtonSelector)

    if (addButton) {
      addButton.setAttribute('data-method', 'add')
      addButton.innerText = this.settings.addButtonText.replace('{{itemName}}', this.settings.itemName)

      if (removeButtons.length === 0) {
        addButton.innerText = addButton.innerText.replace('another', '')
      }
    }

    removeButtons.forEach((element) => {
      element.setAttribute('data-method', 'remove')
      element.innerHTML = this.settings.removeButtonText.replace('{{itemName}}', this.settings.itemName)
    })
  },

  insertAddButton () {
    if (this.wrapper.querySelector(this.settings.addButtonSelector)) {
      return
    }

    const addButtonElement = this.document.createElement('button')
    addButtonElement.className = `button button--secondary ${addButtonClass}`

    const addButtonWrapper = this.document.createElement('p')
    addButtonWrapper.className = 'c-form-group c-form-group--compact'
    addButtonWrapper.appendChild(addButtonElement)

    this.wrapper.appendChild(addButtonWrapper)
  },

  insertRemoveButtons () {
    Array.from(this.wrapper.querySelectorAll(this.settings.itemSelector))
      .forEach((item) => {
        if (item.querySelector(this.settings.removeButtonSelector)) {
          return
        }

        const removeButtonElement = this.document.createElement('button')
        removeButtonElement.className = `button button--link ${removeButtonClass}`

        item.appendChild(removeButtonElement)
      })
  },

  updateButtonState () {
    const removeButtons = Array.from(this.wrapper.querySelectorAll(this.settings.removeButtonSelector))

    if (removeButtons.length === 1 && !this.settings.canRemoveAll) {
      removeElement(removeButtons[0])
    }
  },

  clickHandler (event) {
    const target = event.target

    if (!target.hasAttribute('data-method')) {
      return
    }

    switch (target.getAttribute('data-method')) {
      case 'add':
        this.addItem()
        break
      case 'remove':
        const element = closest(target, this.settings.itemSelector)
        this.removeItem(element)
        break
    }

    event.preventDefault()
    this.render()
  },

  addItem () {
    const lastItem = this.wrapper.querySelector(`${this.settings.itemSelector}:last-of-type`)
    const newItem = regenIds(this.template.cloneNode(true))

    resetFieldValues(newItem)

    if (!lastItem) {
      return this.itemContainer.appendChild(newItem)
    }

    insertAfter(newItem, lastItem)
  },

  removeItem (item) {
    if (this.settings.canRemove) {
      item.parentNode.removeChild(item)
    }
  },
}

module.exports = {
  init (page = document) {
    const elements = Array.from(page.querySelectorAll('.js-AddItems'))

    elements.forEach((element) => {
      const settings = {
        canRemove: !element.hasAttribute('data-can-remove') || (element.getAttribute('data-can-remove') === 'true'),
        canRemoveAll: element.hasAttribute('data-can-remove-all'),
        itemSelector: element.getAttribute('data-item-selector'),
        itemName: element.getAttribute('data-item-name'),
        addButtonSelector: element.getAttribute('data-add-button-selector'),
        addButtonText: element.getAttribute('data-add-button-text'),
        removeButtonSelector: element.getAttribute('data-remove-button-selector'),
        removeButtonText: element.getAttribute('data-remove-button-text'),
      }

      const addItems = Object.create(AddItems, {
        document: {
          value: page,
        },
      })
      addItems.init(element, pickBy(settings, (setting) => {
        return setting !== null && setting !== undefined
      }))
    })
  },
}
