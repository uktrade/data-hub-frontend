const { convertYesNoToBoolean } = require('../../../lib/property-helpers')
const companyRepository = require('../repos')

async function saveCompanyForm (token, companyForm) {
  return new Promise(async (resolve, reject) => {
    try {
      const dataToSave = convertYesNoToBoolean(companyForm)
      const savedCompany = await companyRepository.saveCompany(token, dataToSave)
      resolve(savedCompany)
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = {
  saveCompanyForm,
}
