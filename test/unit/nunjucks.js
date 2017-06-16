const nunjucks = require('nunjucks')
const jsdom = require('jsdom')
const { JSDOM } = jsdom

const tradeElementsFilters = require(`@uktrade/trade_elements/dist/nunjucks/filters`)
const dataHubFilters = require('~/config/nunjucks/filters')

const filters = Object.assign({}, tradeElementsFilters, dataHubFilters)

nunjucks.configure('views')
const nunenv = nunjucks.configure([
  `${rootPath}/src/views`,
  `${rootPath}/node_modules/@uktrade/trade_elements/dist/nunjucks`,
], {
  autoescape: true,
})

Object.keys(filters).forEach((filterName) => {
  nunenv.addFilter(filterName, filters[filterName])
})

function render (template, options) {
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
