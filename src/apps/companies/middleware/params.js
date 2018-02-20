const { get, isNull, find, includes, isUndefined, upperCase } = require('lodash')

const { getDitCompany, getCHCompany } = require('../repos')
const { getCompanyAddress } = require('../transformers/shared')

async function getCompany (req, res, next, id) {
  try {
    const company = await getDitCompany(req.session.token, id)
    const address = getCompanyAddress(company)

    res.locals.company = company
    res.locals.headingAddress = get(address, 'value')
    res.locals.companiesHouseCategory = get(company, 'companies_house_data.company_category')
    res.locals.addSubsidiaryUrl = `/companies/${company.id}/subsidiaries/add`
    res.locals.undoUrl = req.session.undoUrl

    if (!isNull(company.headquarter_type)) {
      // display the company headquarters badge

      if (company.headquarter_type.name === 'ghq') {
        res.locals.companyHeadquarters = {
          meta: [
            { label: 'Headquarter', type: 'title-badge', value: 'GLOBAL HQ' },
          ],
        }
      }
    } else {
      // display the companies headquarters link
      const companySubsidiarySessionStore = find(req.session.subsidiaries, (sessionCompany) => {
        return includes(sessionCompany.subs, company.id)
      })

      if (!isUndefined(companySubsidiarySessionStore)) {
        res.locals.companyMeta = [
          {
            label: upperCase(get(companySubsidiarySessionStore, 'headquarter_type.name')),
            value: companySubsidiarySessionStore.name,
            url: `/companies/${companySubsidiarySessionStore.id}`,
          },
        ]
      }
    }

    next()
  } catch (error) {
    next(error)
  }
}

async function getCompaniesHouseRecord (req, res, next, companyNumber) {
  try {
    const companiesHouseRecord = await getCHCompany(req.session.token, companyNumber)
    res.locals.companiesHouseCategory = companiesHouseRecord.company_category
    res.locals.companiesHouseRecord = companiesHouseRecord
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getCompany,
  getCompaniesHouseRecord,
}
