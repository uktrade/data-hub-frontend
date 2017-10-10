const { assign, pick } = require('lodash')

const { getDitCompany } = require('../../companies/repos')
const { getContact } = require('../../contacts/repos')
const { getInvestment } = require('../../investment-projects/repos')

async function getRelated (req, res, next) {
  if (res.locals.interaction) {
    res.locals = assign({}, res.locals, pick(res.locals.interaction, ['company', 'contact', 'investment']))
  } else {
    const token = req.session.token
    const { company, contact, investment } = req.query

    if (company) {
      res.locals.company = await getDitCompany(token, company)
    }

    if (contact) {
      res.locals.contact = await getContact(token, contact)
    }

    if (investment) {
      res.locals.investment = await getInvestment(token, investment)
    }
  }

  next()
}

module.exports = getRelated
