const path = require('path')
const html = require('html')
const htmlBeautifier = require('js-beautify').html
const { JSDOM } = require('jsdom')

const nunjucksConfig = require('../../src/config/nunjucks')

const nunjucks = nunjucksConfig(null, {
  root: path.normalize(rootPath),
})

const COMPONENTS_PATH = '_components/'
const EXT = 'njk'

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
  const componentPath = `${COMPONENTS_PATH}${name}.${EXT}`
  return normaliseHtml(nunjucks.render(componentPath, input))
}

const renderComponentToDom = (name, input) => {
  const renderedComponent = renderComponent(name, input)
  return new JSDOM(renderedComponent).window.document.body.firstElementChild
}

function domTokenToArray(obj) {
  const array = []
  // iterate backwards ensuring that length is an UInt32
  for (let i = obj.length >>> 0; i--; ) {
    array[i] = obj[i]
  }
  return array
}

module.exports = {
  normaliseHtml,
  renderComponentToDom,
  domTokenToArray,
}
