const path = require('path')
const { JSDOM } = require('jsdom')

const nunjucksConfig = require('~/config/nunjucks')
const { normaliseHtml } = require('./component-helper')

const nunjucks = nunjucksConfig(null, {
  root: path.normalize(rootPath),
})

const MACROS_PATH = '_macros/'
const EXT = 'njk'

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

module.exports = {
  getMacros,
}
