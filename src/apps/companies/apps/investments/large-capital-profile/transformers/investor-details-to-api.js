const getRequiredChecksDate = (body, field) => {
  const day = body[`${field}-day`]
  const month = body[`${field}-month`]
  const year = body[`${field}-year`]
  if (day && month && year) {
    return `${year}-${month}-${day}`
  }

  return null
}

const nullifyIfEmptyString = (value) => {
  return value === '' ? null : value
}

const getAdviser = ({ conducted, clearedId, issuesIdentifiedId, adviser }) => {
  if (conducted === clearedId) {
    return adviser[0]
  }

  if (conducted === issuesIdentifiedId) {
    return adviser[1]
  }

  return null
}

const transformInvestorDetails = (body) => {
  const {
    investorType,
    globalAssetsUnderManagement,
    investableCapital,
    investorDescription,
    conducted,
  } = body

  const investorDetails = {
    investor_type: investorType,
    global_assets_under_management: nullifyIfEmptyString(globalAssetsUnderManagement),
    investable_capital: nullifyIfEmptyString(investableCapital),
    investor_description: investorDescription,
    required_checks_conducted: conducted,
  }

  const adviser = getAdviser(body)
  if (adviser) {
    investorDetails.required_checks_conducted_by = getAdviser(body)
  }

  const requiredChecksDate = getRequiredChecksDate(body, conducted)
  if (requiredChecksDate) {
    investorDetails.required_checks_conducted_on = requiredChecksDate
  }

  return investorDetails
}

module.exports = transformInvestorDetails
