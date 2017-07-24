const path = require('path')
const expect = require('chai').expect
const html = require('html')
const htmlBeautifier = require('js-beautify').html
const { JSDOM } = require('jsdom')

const nunjucksConfig = require('~/config/nunjucks')

const nunjucks = nunjucksConfig(null, {
  root: path.normalize(rootPath),
})

const COMPONENTS_PATH = '_components/'
const MACROS_PATH = '_macros/'
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

function getMacros (fileName) {
  const filePath = `${MACROS_PATH}${fileName}.${EXT}`

  function renderMacro (name, caller, props, ...rest) {
    const importString = `{% from "${filePath}" import ${name} %}`
    const args = rest.length ? `,${[...rest].map(JSON.stringify)}` : ''
    let macroOutput

    if (caller) {
      macroOutput = nunjucks.renderString(`
        ${importString}
        {% call ${name}(${JSON.stringify(props, undefined, 1)}${args}) %}
          ${caller.join(' ')}
        {% endcall %}
      `)
    } else {
      macroOutput = nunjucks.renderString(`${importString} {{ ${name}(${JSON.stringify(props, undefined, 1)}${args}) }}`)
    }

    return normaliseHtml(macroOutput)
  }

  return {
    render (macroName, props, ...rest) {
      return renderMacro(macroName, null, props, ...rest)
    },

    renderWithCaller (macroName, caller, props, ...rest) {
      return renderMacro(macroName, caller, props, ...rest)
    },

    renderToDom (macroName, props, ...rest) {
      const macroOutput = this.render(macroName, props, ...rest)
      return (new JSDOM(macroOutput)).window.document.body.firstElementChild
    },

    renderWithCallerToDom (macroName, props, ...rest) {
      return function (...caller) {
        if (!caller.length) { return null }
        const macroOutput = this.renderWithCaller(macroName, caller, props, ...rest)
        return (new JSDOM(macroOutput)).window.document.body.firstElementChild
      }.bind(this)
    },
  }
}

const renderComponent = (name, input) => {
  const componentPath = `${COMPONENTS_PATH}${name}.${EXT}`
  return normaliseHtml(nunjucks.render(componentPath, input))
}

const renderComponentToDom = (name, input) => {
  const renderedComponent = renderComponent(name, input)
  return (new JSDOM(renderedComponent)).window.document.body.firstElementChild
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
  getMacros,
  renderComponentToDom,
  domTokenToArray,
}
