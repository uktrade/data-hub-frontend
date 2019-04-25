/* eslint-disable camelcase */
const { investmentTypes } = require('../../types')

const foreignEquityInvestment = `<span class='govuk-body govuk-!-font-weight-bold'>Foreign equity investment value</span>`
const primarySector = `<span class='govuk-body govuk-!-font-weight-bold'>Primary sector</span>`

const gvaMessages = {
  foreignEquityAndPrimarySector: `Add ${foreignEquityInvestment} and ${primarySector} (investment project summary) to calculate GVA`,
  foreignEquityInvestment: `Add ${foreignEquityInvestment} and click "Save" to calculate GVA`,
  primarySector: `Add ${primarySector} (investment project summary) to calculate GVA`,
}

const grossValueAddedMessage = ({
  sector,
  investment_type,
  gross_value_added,
  foreign_equity_investment }) => {
  if (investment_type.name !== investmentTypes.FDI) {
    return null
  }

  if (gross_value_added) {
    return null
  }

  if (!foreign_equity_investment && !sector) {
    return gvaMessages.foreignEquityAndPrimarySector
  }

  if (!foreign_equity_investment) {
    return gvaMessages.foreignEquityInvestment
  }

  if (!sector) {
    return gvaMessages.primarySector
  }

  return null
}

module.exports = {
  grossValueAddedMessage,
  gvaMessages,
}
