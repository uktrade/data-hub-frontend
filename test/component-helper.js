const path = require('path')
const expect = require('chai').expect
const html = require('html')
const htmlBeautifier = require('js-beautify').html
const { JSDOM } = require('jsdom')

const nunjucksConfig = require('../config/nunjucks')

const nunjucks = nunjucksConfig(null, {
  root: path.normalize(`${__dirname}/..`),
})

const COMPONENTS_PATH = '_components/'
const COMPONENT_EXT = 'njk'

const normaliseHtml = (string) => {
  const beautiful = htmlBeautifier(string, {
    indent_size: 2,
    max_preserve_newlines: 0,
  })

  return html.prettyPrint(beautiful, {
    indent_size: 2,
  })
}

const renderComponent = (name, input) => {
  const componentPath = `${COMPONENTS_PATH}${name}.${COMPONENT_EXT}`
  return normaliseHtml(nunjucks.render(componentPath, input))
}

const renderComponentToDom = (name, input) => {
  const renderedComponent = renderComponent(name, input)
  return (new JSDOM(renderedComponent)).window.document.body.querySelector('body>:first-child')
}

const expectComponent = (name, input, expected) => {
  // Normalise HTML whitespace, to make diffing simpler
  expect(
    renderComponent(name, input)
  ).to.equal(
    normaliseHtml(expected)
  )
}

function domTokenToArray (obj) {
  let array = []
  // iterate backwards ensuring that length is an UInt32
  for (let i = obj.length >>> 0; i--;) {
    array[i] = obj[i]
  }
  return array
}

module.exports = {
  expectComponent,
  renderComponentToDom,
  domTokenToArray,
}
