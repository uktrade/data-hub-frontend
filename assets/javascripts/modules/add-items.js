/* eslint-disable no-new */
const Vue = require('vue')

const assign = require('lodash/assign')
const pickBy = require('lodash/pickBy')
const {
  insertAfter,
  resetFieldValues,
  regenIds,
  closest,
  removeElement,
  updateCypressDataAttribute,
} = require('../lib/helpers')

const Typeahead = require('../vue/typeahead.vue').default
const { highlight } = require('../vue/filters')

Vue.filter('highlight', highlight)

let addButtonClass = 'js-AddItems__add'
const addTypeaheadButtonClass = 'js-AddItems__add--typeahead'
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
    addTypeaheadButtonSelector: `.${addTypeaheadButtonClass}`,
    addButtonText: 'Add another {{itemName}}',
    removeButtonSelector: `.${removeButtonClass}`,
    removeButtonText: 'Remove',
    encType: false,
  },

  init(wrapper = document, options) {
    this.wrapper = wrapper
    this.settings = assign({}, this.defaults, options)

    this.cacheEls()
    this.bindEvents()
    this.render()
    this.setEncType()
  },

  cacheEls() {
    const lastItem = this.wrapper.querySelector(this.settings.itemSelector)
    if (lastItem) {
      this.itemContainer = lastItem.parentNode
      this.template = lastItem.cloneNode(true)
    }
    this.addButton = this.wrapper.querySelector(this.settings.addButtonSelector)
  },

  bindEvents() {
    this.wrapper.addEventListener('click', this.clickHandler.bind(this))
  },

  render() {
    this.insertAddButton()
    if (this.settings.canRemove) {
      this.insertRemoveButtons()
    }

    this.decorateButtons()
    this.updateButtonState()
  },

  decorateButtons() {
    const removeButtons = Array.from(
      this.wrapper.querySelectorAll(this.settings.removeButtonSelector)
    )
    const addButton = this.wrapper.querySelector(
      this.settings.addButtonSelector
    )
    const addTypeaheadButton = this.wrapper.querySelector(
      this.settings.addTypeaheadButtonSelector
    )

    if (addButton) {
      addButton.setAttribute('data-method', 'add')
      addButton.innerText = this.settings.addButtonText.replace(
        '{{itemName}}',
        this.settings.itemName
      )

      if (removeButtons.length === 0) {
        addButton.innerText = addButton.innerText.replace('another', '')
      }
    }

    if (addTypeaheadButton) {
      addTypeaheadButton.setAttribute('data-method', 'add-typeahead')
      addTypeaheadButton.innerText = this.settings.addButtonText.replace(
        '{{itemName}}',
        this.settings.itemName
      )

      if (!removeButtons.length) {
        addTypeaheadButton.innerText = addTypeaheadButton.innerText.replace(
          'another',
          ''
        )
      }
    }

    removeButtons.forEach((element) => {
      element.setAttribute('data-method', 'remove')
      element.innerHTML = this.settings.removeButtonText.replace(
        '{{itemName}}',
        this.settings.itemName
      )
    })
  },

  insertAddButton() {
    if (
      this.wrapper.querySelector(this.settings.addButtonSelector) ||
      this.wrapper.querySelector(this.settings.addTypeaheadButtonSelector)
    ) {
      return
    }

    if (this.wrapper.getAttribute('data-add-button-type') === 'typeahead') {
      addButtonClass = addTypeaheadButtonClass
    }

    const addButtonElement = this.document.createElement('button')
    addButtonElement.className = `govuk-button govuk-button--secondary ${addButtonClass}`

    const addButtonWrapper = this.document.createElement('p')
    addButtonWrapper.className = 'c-form-group c-form-group--compact'
    addButtonWrapper.appendChild(addButtonElement)

    this.wrapper.appendChild(addButtonWrapper)
  },

  insertRemoveButtons() {
    Array.from(
      this.wrapper.querySelectorAll(this.settings.itemSelector)
    ).forEach((item) => {
      if (item.querySelector(this.settings.removeButtonSelector)) {
        return
      }

      const removeButtonElement = this.document.createElement('button')
      removeButtonElement.className = `govuk-button button--link ${removeButtonClass}`

      item.appendChild(removeButtonElement)
    })
  },

  updateButtonState() {
    const removeButtons = Array.from(
      this.wrapper.querySelectorAll(this.settings.removeButtonSelector)
    )

    if (removeButtons.length === 1 && !this.settings.canRemoveAll) {
      removeElement(removeButtons[0])
    }
  },

  clickHandler(event) {
    const target = event.target

    if (!target.hasAttribute('data-method')) {
      return
    }

    switch (target.getAttribute('data-method')) {
      case 'add':
        this.addItem()
        break
      case 'add-typeahead':
        this.addTypeaheadItem()
        break
      case 'remove':
        const element = closest(target, this.settings.itemSelector)
        this.removeItem(element)
        break
    }

    event.preventDefault()
    this.render()
  },

  setEncType() {
    const pageForm = document.querySelector('form')

    if (pageForm && pageForm.enctype) {
      this.encType = pageForm.enctype
    }
  },

  getItemAttribute() {
    if (this.encType === 'multipart/form-data') {
      return 'name'
    } else {
      return 'id'
    }
  },

  addItem() {
    const lastItem = this.wrapper.querySelector(
      `${this.settings.itemSelector}:last-of-type`
    )
    const attr = this.getItemAttribute()
    const newItem = regenIds(this.template.cloneNode(true), attr)
    const itemsLength = this.wrapper.querySelectorAll(
      `${this.settings.itemSelector}`
    ).length

    resetFieldValues(newItem)

    if (!lastItem) {
      return this.itemContainer.appendChild(newItem)
    }

    if (itemsLength > 0) {
      updateCypressDataAttribute(newItem, itemsLength)
    }

    insertAfter(newItem, lastItem)
  },
  addTypeaheadItem() {
    const lastItem = this.wrapper.querySelector(
      `${this.settings.itemSelector}:last-of-type`
    )
    const attr = this.getItemAttribute()
    const newItem = regenIds(this.template.cloneNode(true), attr)
    const typeaheadWrapper = newItem.querySelector('.js-vue-wrapper')
    const typeaheadType = typeaheadWrapper.getAttribute('data-typeahead-type')
    typeaheadWrapper.innerHTML = this.buildTypeaheadTemplate(typeaheadType)
    this.buildTypeahead(typeaheadWrapper)

    if (!lastItem) {
      return this.itemContainer.appendChild(newItem)
    }

    insertAfter(newItem, lastItem)
  },
  removeItem(item) {
    if (this.settings.canRemove) {
      item.parentNode.removeChild(item)
    }
  },
  buildTypeaheadTemplate(name) {
    return `<typeahead
            entity="adviser"
            model="[]"
            selected-value=""
            name="${name}"
            :hide-label="true"
            label="Advisers"
            placeholder="Search team member"
            :multiple-select="false"
            value=""
            classes="c-form-group c-form-group--no-filter"></typeahead>`
  },
  buildTypeahead(wrapper) {
    new Vue({
      el: wrapper,
      components: {
        typeahead: Typeahead,
      },
    })
  },
}

module.exports = {
  init(page = document) {
    const elements = Array.from(page.querySelectorAll('.js-AddItems'))

    elements.forEach((element) => {
      const settings = {
        canRemove:
          !element.hasAttribute('data-can-remove') ||
          element.getAttribute('data-can-remove') === 'true',
        canRemoveAll: element.hasAttribute('data-can-remove-all'),
        itemSelector: element.getAttribute('data-item-selector'),
        itemName: element.getAttribute('data-item-name'),
        addButtonSelector: element.getAttribute('data-add-button-selector'),
        addButtonText: element.getAttribute('data-add-button-text'),
        removeButtonSelector: element.getAttribute(
          'data-remove-button-selector'
        ),
        removeButtonText: element.getAttribute('data-remove-button-text'),
      }

      const addItems = Object.create(AddItems, {
        document: {
          value: page,
        },
      })
      addItems.init(
        element,
        pickBy(settings, (setting) => {
          return setting !== null && setting !== undefined
        })
      )
    })
  },
}
