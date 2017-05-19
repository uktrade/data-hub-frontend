/**
 * Conditional sub fields
 *
 * Supports the ability to conditionally show and hide content based on the
 * value of a field.
 *
 * The element to be shown requires 2 attributes:
 * [data-controlled-by] - this is the name of the field which controls it
 * [data-control-value] - the value by which this element should be displayed
 *
 * It also requires a basic bit of style to work:
 *
 * [data-controlled-by] {
 *   display: none;
 * }
 * [data-controlled-by].is-active {
 *   display: block;
 * }
 *
 * Note: it is recommend to only apply this if javascript is enabled
 *
 * @example
 *
 * <label>
 *   <input name="control-field" value="yes" type="radio">Yes
 * </label>
 * <label>
 *   <input name="control-field" value="no" type="radio">No
 * </label>
 *
 * <div class="js-ConditionalSubfield" data-controlled-by="control-field" data-control-value="yes">
 *   Visible when `control-field` equals `yes`
 * </div>
 *
 */

const uniq = require('lodash/uniq')

const { addClass, removeClass } = require('../../lib/element-stuff.js')

const ConditionalSubfields = {
  selector: 'js-ConditionalSubfield',
  activeClass: 'is-active',
  onChangeHandler: null,
  controllers: [],
  wrapper: null,

  init (wrapper = document) {
    this.wrapper = wrapper

    this.cacheEls()

    if (this.controllers.length) {
      this.bindEvents()
      this.render()
    }
  },

  cacheEls () {
    const conditionalSubFields = this.wrapper.getElementsByClassName(this.selector)

    this.onChangeHandler = this.onChange.bind(this)
    this.controllers = uniq([...conditionalSubFields].map((controller, i) => {
      return controller.getAttribute('data-controlled-by')
    }))
  },

  bindEvents () {
    this.wrapper.addEventListener('change', this.onChangeHandler)
  },

  render () {
    this.controllers.forEach((controller) => {
      const fields = this.wrapper.querySelectorAll(`[name="${controller}"]`)

      fields.forEach(this._handleField)
    })
  },

  destroy () {
    this.wrapper.removeEventListener('change', this.onChangeHandler)
  },

  onChange (evt) {
    const field = evt.target

    if (this.controllers.includes(field.name)) {
      this._handleField(field)
    }
  },

  _handleField (controlInput) {
    const subFields = this.wrapper.querySelectorAll(`[data-controlled-by="${controlInput.name}"]`)

    subFields.forEach((subField, i) => {
      const controlInputValue = subField.getAttribute('data-control-value') + ''
      let isVisible = false

      if (controlInput.tagName === 'SELECT') {
        isVisible = controlInput.value === controlInputValue
      } else if (controlInputValue && controlInputValue !== '*' && controlInput.checked) {
        isVisible = controlInput.value === controlInputValue
      }

      this._toggleSubField(subField, isVisible)
    })
  },

  _toggleSubField (subField, isVisible) {
    if (isVisible) {
      addClass(subField, this.activeClass)
    } else {
      removeClass(subField, this.activeClass)
    }

    subField.setAttribute('aria-expanded', isVisible)
    subField.setAttribute('aria-hidden', !isVisible)

    if (!isVisible && !subField.getAttribute('data-persist-values')) {
      const children = subField.querySelectorAll('input, select, checkbox, textarea')

      children.forEach((field, i) => {
        field.value = ''
        field.checked = false

        const event = this.wrapper.createEvent('HTMLEvents')
        event.initEvent('change', true, false)
        field.dispatchEvent(event)
      })
    }
  }
}

module.exports = ConditionalSubfields
