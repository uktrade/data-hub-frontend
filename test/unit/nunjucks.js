const nunjucks = require('nunjucks')
const jsdom = require('jsdom')

const { JSDOM } = jsdom

const tradeElementsFilters = require('~/src/config/nunjucks/trade-elements-filters')
const dataHubFilters = require('~/src/config/nunjucks/filters')

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
  // Stub methods set in middleware locals
  options.getAssetPath = () => {}
  options.getPageTitle = () => {}
  options.getBreadcrumbs = () => {}
  options.getMessages = () => {}

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

function renderFromRoot (template, options) {
  return render('../..' + template, options)
}

module.exports = { render, renderFromRoot }
