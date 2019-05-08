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

    // Note: at present this work is completely hidden from all users.
    // Temporarily hard-code the company adviser otherwise we are unable to POST into the API.
    // The next piece of work will address this circumvention by allowing the user to select an adviser.
    required_checks_conducted_by: 'a80ff5fd-8904-4940-bf96-fe8047e34be5', // adviser
  }

  const requiredChecksDate = getRequiredChecksDate(body, conducted)
  if (requiredChecksDate) {
    investorDetails.required_checks_conducted_on = requiredChecksDate
  }

  return investorDetails
}

module.exports = transformInvestorDetails
