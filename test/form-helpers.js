
function expectHiddenField (rootElement, name, value) {
  const input = rootElement.querySelector(`input[type=hidden][name=${name}]`)
  expect(input).to.not.be.null
  if (value) {
    expect(input.value).to.equal(value)
  }
}

function expectTextFieldWithLabel (rootElement, name, label, value) {
  const wrapper = rootElement.querySelector(`div#${name}-wrapper`)
  expect(wrapper).to.not.be.null
  const labelElement = wrapper.querySelector('label')
  expect(labelElement).to.not.be.null
  expect(labelElement.textContent).to.include(label)
  const input = wrapper.querySelector(`input[type=text][name=${name}]`)
  expect(input).to.not.be.null

  if (value) {
    expect(input.value).to.equal(value)
  }
}

function expectTextAreaWithLabel (rootElement, name, label) {
  const wrapper = rootElement.querySelector(`div#${name}-wrapper`)
  expect(wrapper).to.not.be.null
  const labelElement = wrapper.querySelector('label')
  expect(labelElement).to.not.be.null
  expect(labelElement.textContent).to.include(label)
  const input = wrapper.querySelector(`textarea[name=${name}]`)
  expect(input).to.not.be.null
}

function expectDateFieldWithLabel (rootElement, name, label) {
  const wrapper = rootElement.querySelector(`div#${name}-wrapper`)
  expect(wrapper).to.not.be.null

  const labelElement = rootElement.querySelector('legend')
  expect(labelElement).to.not.be.null
  expect(labelElement.textContent).to.include(label)

  expect(rootElement.querySelector(`label[for=${name}_day]`)).to.not.be.null
  expect(rootElement.querySelector(`label[for=${name}_month]`)).to.not.be.null
  expect(rootElement.querySelector(`label[for=${name}_year]`)).to.not.be.null
  expect(rootElement.querySelector(`input[type=text][name=${name}_day]`)).to.not.be.null
  expect(rootElement.querySelector(`input[type=text][name=${name}_month]`)).to.not.be.null
  expect(rootElement.querySelector(`input[type=text][name=${name}_year]`)).to.not.be.null
}

function expectDropdownWithLabel (rootElement, name, label, value) {
  const wrapper = rootElement.querySelector(`div#${name}-wrapper`)
  expect(wrapper).to.not.be.null
  const labelElement = wrapper.querySelector('label')
  expect(labelElement).to.not.be.null
  expect(labelElement.textContent).to.include(label)
  const input = wrapper.querySelector(`[name=${name}]`)
  expect(input).to.not.be.null
  if (value) {
    expect(input.value).to.equal(value)
  }
}

function expectRadioWithLabel (rootElement, name, label, value) {
  const wrapper = rootElement.querySelector(`#${name}-wrapper`)
  expect(wrapper).to.not.be.null
  const selectedLabel = wrapper.querySelector('.selected')
  expect(selectedLabel).to.not.be.null
  const selectedInput = selectedLabel.querySelector('input[type=radio]:checked')
  expect(selectedInput.value).to.equal(value)
  const legend = wrapper.querySelector('legend')
  expect(legend).to.not.be.null
  expect(legend.textContent).to.include(label)
}

module.exports = {
  expectTextAreaWithLabel,
  expectTextFieldWithLabel,
  expectDateFieldWithLabel,
  expectDropdownWithLabel,
  expectRadioWithLabel,
  expectHiddenField,
}
