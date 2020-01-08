const { INVESTMENT_TAB_ITEMS } = require('../constants')

const setInvestmentTabItems = (req, res, next) => {
  const { root } = res.locals.paths
  res.locals.investmentTabItems = INVESTMENT_TAB_ITEMS.map((item) => {
    const url = `${root}/${item.path}`
    return {
      ...item,
      url,
      isActive: res.locals.CURRENT_PATH === url,
    }
  })
  next()
}

module.exports = setInvestmentTabItems
