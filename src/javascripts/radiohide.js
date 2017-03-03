const { addClass, removeClass } = require('@uktrade/trade_elements').elementstuff

function clearInnerFields (element) {
  const radios = element.querySelectorAll('input[type="radio"]:checked')
  const checkboxes = element.querySelectorAll('input[type="radio"]:checked')
  const otherInputs = element.querySelectorAll('input[type="text"], textarea, select')

  for (let pos = 0; pos < radios.length; pos += 1) {
    const item = radios.item(pos)
    item.checked = false
    removeClass(item.parentNode, 'selected')
  }

  for (let pos = 0; pos < checkboxes.length; pos += 1) {
    const item = checkboxes.item(pos)
    item.selected = false
    removeClass(item.parentNode, 'selected')
  }

  for (let pos = 0; pos < otherInputs.length; pos += 1) {
    otherInputs.item(pos).value = ''
  }
}

function radioHide (name, hideFor, targetElementSelector, defaultHidden) {
  const targetElement = document.querySelector(targetElementSelector)

  function updateVisible () {
    const selectedElement = document.querySelector(`input[name="${name}"]:checked`)

    if (!selectedElement && defaultHidden || selectedElement.value === hideFor) {
      addClass(targetElement, 'hidden')
      clearInnerFields(targetElement)
    } else {
      removeClass(targetElement, 'hidden')
    }
  }

  document.querySelector('form').addEventListener('change', function (event) {
    if (event.target.name && event.target.name === name) {
      updateVisible()
    }
  })

  updateVisible()
}

module.exports = radioHide
