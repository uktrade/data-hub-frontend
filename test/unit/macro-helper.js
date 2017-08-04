const { isEmpty } = require('lodash')
const path = require('path')
const { JSDOM } = require('jsdom')

const nunjucksConfig = require('~/config/nunjucks')
const { normaliseHtml } = require('./component-helper')

const nunjucks = nunjucksConfig(null, {
  root: path.normalize(rootPath),
})

const MACROS_PATH = '_macros/'
const EXT = 'njk'

function propsToJson (...props) {
  return `${[...props]
  .map(prop => JSON.stringify(prop, undefined, 1))
  .join(', ')}`
}

function getMacros (fileName, context = {}) {
  const filePath = `${MACROS_PATH}${fileName}.${EXT}`

  function renderMacro (name, { caller = null, params = [] } = {}) {
    let importString
    let macroOutput

    const macroSignature = `${name}(${propsToJson(...params)})`

    if (isEmpty(context)) {
      importString = `{% from "${filePath}" import ${name} %}`
    } else {
      importString = `{% from "${filePath}" import ${name} with context %}`
    }

    if (caller) {
      macroOutput = nunjucks.renderString(`
        ${importString}
        {% call ${macroSignature} %}
          ${caller.join(' ')}
        {% endcall %}
      `, context)
    } else {
      macroOutput = nunjucks.renderString(`${importString} {{ ${macroSignature} }}`, context)
    }

    return normaliseHtml(macroOutput)
  }

  return {
    render (macroName, ...params) {
      return renderMacro(macroName, { params })
    },

    renderWithCaller (macroName, caller, ...params) {
      return renderMacro(macroName, { caller, params })
    },

    renderToDom (macroName, ...params) {
      const macroOutput = this.render(macroName, ...params)
      return (new JSDOM(macroOutput)).window.document.body.firstElementChild
    },

    renderWithCallerToDom (macroName, ...params) {
      return function (...caller) {
        if (!caller.length) { return null }
        const macroOutput = this.renderWithCaller(macroName, caller, ...params)
        return (new JSDOM(macroOutput)).window.document.body.firstElementChild
      }.bind(this)
    },
  }
}

module.exports = {
  getMacros,
}
