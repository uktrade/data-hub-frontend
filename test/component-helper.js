const path = require('path')
const expect = require('chai').expect
const html = require('html')
const htmlBeautifier = require('js-beautify').html

const nunjucksConfig = require('../config/nunjucks')

const nunjucks = nunjucksConfig(null, {
  root: path.normalize(`${__dirname}/..`)
})

const COMPONENTS_PATH = '_components/'
const COMPONENT_EXT = 'njk'

const normaliseHtml = (string) => {
  const beautiful = htmlBeautifier(string, {
    indent_size: 2,
    max_preserve_newlines: 0
  })

  return html.prettyPrint(beautiful, {
    indent_size: 2
  })
}

const renderComponent = (name, input) => {
  const componentPath = `${COMPONENTS_PATH}${name}.${COMPONENT_EXT}`
  return nunjucks.render(componentPath, input)
}

const expectComponent = (name, input, expected) => {
  // Normalise HTML whitespace, to make diffing simpler
  expect(
    normaliseHtml(renderComponent(name, input))
  ).to.equal(
    normaliseHtml(expected)
  )
}

module.exports.expectComponent = expectComponent
