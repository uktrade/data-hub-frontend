const { nullEmptyFields, convertYesNoToBoolean } = require('../../../lib/property-helpers')
const companyRepository = require('../repos')

async function saveCompanyForm (token, companyForm) {
  return new Promise(async (resolve, reject) => {
    try {
      let dataToSave = convertYesNoToBoolean(companyForm)
      dataToSave = nullEmptyFields(dataToSave)
      const savedContact = await companyRepository.saveCompany(token, dataToSave)
      resolve(savedContact)
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = {
  saveCompanyForm,
}
