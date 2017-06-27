const nunjucks = require('nunjucks')
const jsdom = require('jsdom')
const { JSDOM } = jsdom

const tradeElementsFilters = require('~/config/nunjucks/trade-elements-filters')
const dataHubFilters = require('~/config/nunjucks/filters')

const filters = Object.assign({}, tradeElementsFilters, dataHubFilters)

nunjucks.configure('views')
const nunenv = nunjucks.configure([
  `${rootPath}/src/apps`,
  `${rootPath}/src/templates`,
], {
  autoescape: true,
})

Object.keys(filters).forEach((filterName) => {
  nunenv.addFilter(filterName, filters[filterName])
})

function render (template, options) {
  options.getAssetPath = () => {} // Stub method set in middleware locals

  return new Promise((resolve, reject) => {
    try {
      const markup = nunjucks.render(template, options)
      const { document } = (new JSDOM(markup).window)
      resolve(document)
    } catch (error) {
      console.log(error)
      reject(error)
    }
  })
}

module.exports = { render }
