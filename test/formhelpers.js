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

module.exports = {
  expectTextAreaWithLabel,
  expectTextFieldWithLabel,
  expectDateFieldWithLabel,
  expectDropdownWithLabel
}
