const { investmentTypes } = require('~/src/apps/investment-projects/types')

const getInvestmentTypeDetails = (investmentType, fdiType) => {
  if (investmentType.name === investmentTypes.FDI) {
    return `${investmentType.name}, ${fdiType.name}`
  }
  return investmentType.name
}

module.exports = {
  getInvestmentTypeDetails,
}
