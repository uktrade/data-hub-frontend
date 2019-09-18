const getElement = elementSelector => {
  return $(elementSelector)
}

const getElements = elementSelector => {
  return $$(elementSelector)
}

const clickOn = elementSelector => {
  const element = getElement(elementSelector)
  element.click()
}

const readText = elementSelector => {
  const element = getElement(elementSelector)
  return element.getText()
}

const selectOption = (elementSelector, optionText) => {
  const element = getElement(elementSelector)
  element.selectByVisibleText(optionText)
}

const enterText = (elementSelector, text) => {
  const element = getElement(elementSelector)
  element.setValue(text)
}

export default {
  clickOn,
  readText,
  selectOption,
  enterText,
  getElements,
  getElement,
}
