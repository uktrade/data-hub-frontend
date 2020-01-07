/* eslint-disable camelcase */
const { investmentTypes } = require('../../types')

const primarySector = `<span class='govuk-body govuk-!-font-weight-bold'>Primary sector</span>`
const capitalExpenditureValue = `<span class='govuk-body govuk-!-font-weight-bold'>capital expenditure value</span>`

const gvaMessages = {
  capitalExpenditureAndPrimarySectorRequired: `Add ${capitalExpenditureValue} and ${primarySector} (investment project summary) to calculate GVA`,
  capitalExpenditureRequired: `Add ${capitalExpenditureValue} and click "Save" to calculate GVA`,
  primarySector: `Add ${primarySector} (investment project summary) to calculate GVA`,
}

const grossValueAddedMessage = ({
  sector,
  investment_type,
  gross_value_added,
  foreign_equity_investment,
}) => {
  if (investment_type.name !== investmentTypes.FDI) {
    return null
  }

  if (gross_value_added) {
    return null
  }

  if (!foreign_equity_investment && !sector) {
    return gvaMessages.capitalExpenditureAndPrimarySectorRequired
  }

  if (!foreign_equity_investment) {
    return gvaMessages.capitalExpenditureRequired
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
