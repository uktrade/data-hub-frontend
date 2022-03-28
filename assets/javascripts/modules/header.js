;(function (doc, helpers) {
  if (!(helpers.toggleClass && helpers.hasListenerSupport)) {
    return
  }

  var HEADER_JS_ENABLED_CLASS = 'js-datahub-header-enabled'
  var HEADER_CONTAINER_CLASS = 'js-datahub-header'
  var TOGGLE_BUTTON_CLASS = 'js-datahub-header-toggle'
  var CONTAINER_OPEN_CLASS = 'datahub-header--open'
  var TOGGLE_BUTTON_OPEN_CLASS = 'datahub-header__menu-button--open'

  function DatahubHeader($module) {
    // Check for module
    if (!$module) {
      return
    }
    // Check for button
    var $toggleButton = helpers.getByClass($module, TOGGLE_BUTTON_CLASS)

    if (!$toggleButton) {
      return
    }

    var toggleIds = $toggleButton.getAttribute('aria-controls').split(' ')

    if (!toggleIds.length) {
      return
    }

    this.$module = $module
    this.$toggleButton = $toggleButton
    this.toggleElems = []

    helpers.addClass($module, HEADER_JS_ENABLED_CLASS)

    var i = 0
    var l = toggleIds.length
    var toggleElem

    for (; i < l; i++) {
      toggleElem = doc.getElementById(toggleIds[i])
      if (toggleElem) {
        this.toggleElems.push(toggleElem)
      }
    }

    // Handle $toggleButton click events
    $toggleButton.addEventListener('click', this.handleClick.bind(this))
  }

  DatahubHeader.prototype.handleClick = function () {
    var i = 0
    var l = this.toggleElems.length
    var isAriaHidden =
      this.toggleElems[0].getAttribute('aria-hidden') === 'false'

    helpers.toggleClass(this.$module, CONTAINER_OPEN_CLASS)
    helpers.toggleClass(this.$toggleButton, TOGGLE_BUTTON_OPEN_CLASS)

    this.$toggleButton.setAttribute(
      'aria-expanded',
      this.$toggleButton.getAttribute('aria-expanded') !== 'true'
    )

    for (; i < l; i++) {
      this.toggleElems[i].setAttribute('aria-hidden', isAriaHidden)
    }
  }

  var container = helpers.getByClass(doc, HEADER_CONTAINER_CLASS)

  if (container) {
    new DatahubHeader(container)
  }
})(
  document,
  (function (doc) {
    //helpers taken from: https://github.com/cinsoft/jessie

    var helpers = {}

    function isHostObjectProperty(object, property) {
      var objectProperty = object[property]
      return typeof objectProperty == 'object' && null !== objectProperty
    }

    function isHostMethod(object, method) {
      var objectMethod = object[method]
      var type = typeof objectMethod
      return (
        type == 'function' ||
        (type == 'object' && null !== objectMethod) ||
        type == 'unknown'
      )
    }

    var html =
      isHostObjectProperty(doc, 'documentElement') && doc.documentElement
    var hasClassListSupport = html && isHostObjectProperty(html, 'classList')

    if (hasClassListSupport && isHostMethod(html.classList, 'remove')) {
      helpers.removeClass = function (el, className) {
        return el.classList.remove(className)
      }
    }

    if (hasClassListSupport && isHostMethod(html.classList, 'contains')) {
      helpers.hasClass = function (el, className) {
        return el.classList.contains(className)
      }
    }

    if (hasClassListSupport && isHostMethod(html.classList, 'add')) {
      helpers.addClass = function (el, className) {
        return el.classList.add(className)
      }
    }

    if (helpers.hasClass && helpers.addClass && helpers.removeClass) {
      helpers.toggleClass = function (el, className) {
        var toggle = helpers.hasClass(el, className)
          ? 'removeClass'
          : 'addClass'
        helpers[toggle](el, className)
      }
    }

    helpers.hasListenerSupport = html && isHostMethod(html, 'addEventListener')

    helpers.getByClass = function (parent, className) {
      var elem = parent.getElementsByClassName(className)

      if (elem && elem.length > 0) {
        return elem[0]
      }
    }

    return helpers
  })(document)
)
