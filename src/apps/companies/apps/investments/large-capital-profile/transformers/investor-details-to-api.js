const getRequiredChecksDate = (body) => {
  const day = body[`${body.requiredChecks}-day`]
  const month = body[`${body.requiredChecks}-month`]
  const year = body[`${body.requiredChecks}-year`]
  if (day && month && year) {
    return `${year}-${month}-${day}`
  }

  return null
}

const getRequiredChecksAdviser = (body) => {
  const adviserId = body[`${body.requiredChecks}-adviser`]
  return adviserId === undefined ? null : adviserId
}

const nullifyIfEmptyString = (value) => {
  return value === '' ? null : value
}

const transformInvestorDetails = (body) => {
  return {
    investor_type: body.investorType || null,
    global_assets_under_management: nullifyIfEmptyString(body.globalAssetsUnderManagement),
    investable_capital: nullifyIfEmptyString(body.investableCapital),
    investor_description: body.investorDescription,
    required_checks_conducted: body.requiredChecks,
    required_checks_conducted_on: getRequiredChecksDate(body),
    required_checks_conducted_by: getRequiredChecksAdviser(body),
  }
}

module.exports = transformInvestorDetails
