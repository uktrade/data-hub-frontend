export const totalInvestmentValidator = (value, foreignEquityInvestment) => {
  if (parseInt(value) < parseInt(foreignEquityInvestment)) {
    return 'Total investment must be >= to capital expenditure'
  }
  return null
}

export const capitalExpenditureValidator = (value) => {
  const minCapitalExpenditure = 15000000
  if (parseInt(value) < minCapitalExpenditure) {
    return 'Capital expenditure must be >= £15,000,000 for capital only project'
  }
  return null
}
