const config = require('../../src/config')

const isItaTierDAccount = (company) =>
  company.one_list_group_tier &&
  company.one_list_group_tier.id === config.companies.tierTypes.typeD.itaAccount

module.exports = {
  isItaTierDAccount,
}
