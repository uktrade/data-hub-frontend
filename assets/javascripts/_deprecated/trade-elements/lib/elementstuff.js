/* eslint-disable */
const regularExp1 = '(\\s|^)'
const regularExp2 = '(\\s|$)'

function addClass (element, className) {
  if (!element) return
  if (isNodeList(element)) {
    for (let pos = element.length - 1; pos > -1; pos -= 1) {
      addClass(element.item(pos), className)
    }
  } else if (element.classList) {
    element.classList.add(className)
  } else if (!hasClass(element, className)) {
    element.className += ' ' + className
  }
}

function removeClass (element, className) {
  if (!element) return
  if (isNodeList(element)) {
    for (let pos = element.length - 1; pos > -1; pos -= 1) {
      removeClass(element.item(pos), className)
    }
  } else if (element.classList) {
    element.classList.remove(className)
  } else if (hasClass(element, className)) {
    const regClass = new RegExp(regularExp1 + className + regularExp2)
    element.className = element.className.replace(regClass, ' ')
  }
}

function hasClass (element, className) {
  if (!element) return
  if (element.classList) {
    return element.classList.contains(className)
  }
  return element.className.match(new RegExp(regularExp1 + className + regularExp2))
}

function toggleClass (element, className) {
  if (!element) return
  if (isNodeList(element)) {
    for (let pos = element.length - 1; pos > -1; pos -= 1) {
      toggleClass(element.item(pos), className)
    }
  } else if (hasClass(element, className)) {
    removeClass(element, className)
  } else {
    addClass(element, className)
  }
}

function generateID () {
  let d = new Date().getTime()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

function isNodeList (nodes) {
  const stringRepr = Object.prototype.toString.call(nodes)

  return typeof nodes === 'object' &&
    /^\[object (HTMLCollection|NodeList|Object)\]$/.test(stringRepr) &&
    (typeof nodes.length === 'number') &&
    (nodes.length === 0 || (typeof nodes[0] === 'object' && nodes[0].nodeType > 0))
}

function findDoc (el) {
  while (el.parentNode) {
    el = el.parentNode
  }
  return el
}

function insertAfter (newElement, targetElement) {
  // target is what you want it to go after. Look for this elements parent.
  const parent = targetElement.parentNode

  // if the parents lastchild is the targetElement...
  if (parent.lastChild === targetElement) {
    // add the newElement after the target element.
    parent.appendChild(newElement)
  } else {
    // else the target has siblings, insert the new element between the target and it's next sibling.
    parent.insertBefore(newElement, targetElement.nextSibling)
  }
}

function hide (element) {
  addClass(element, 'hidden')
  element.setAttribute('aria-hidden', true)
}

function show (element) {
  removeClass(element, 'hidden')
  element.setAttribute('aria-hidden', false)
}

function createElementFromMarkup (markup, docToCreateIn) {
  const documentRef = docToCreateIn || document
  let tmp = documentRef.createElement('body')
  tmp.innerHTML = markup
  return tmp.firstElementChild
}

function removeElement (element) {
  if (!element) return
  element.parentNode.removeChild(element)
}

module.exports = {
  addClass,
  removeClass,
  hasClass,
  toggleClass,
  generateID,
  isNodeList,
  findDoc,
  insertAfter,
  hide,
  show,
  createElementFromMarkup,
  removeElement
}
