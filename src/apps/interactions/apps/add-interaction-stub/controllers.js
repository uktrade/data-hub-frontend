const { getActiveEvents } = require('../../../events/repos')
const {
  transformContactToOption,
  transformObjectToOption,
} = require('../../../transformers')
const { getDitCompany } = require('../../../companies/repos')
const { getAdvisers } = require('../../../adviser/repos')
const { getOptions } = require('../../../../lib/options')

const transformServiceToOption = (service) => ({
  value: service.id,
  label: service.name,
  contexts: service.contexts,
  interaction_questions: service.interaction_questions,
})

async function renderAddInteractionStubForm(req, res, next) {
  try {
    const { user, token } = req.session
    const { company_id: companyId } = req.query
    const contactIds = [].concat(req.query['contact_id'] || []);
    const initialSubject = req.query['subject'] || '';
    const initialDate = (req.query['date'] || new Date().toISOString()).split('T')[0].split('-');
    var adviserIds = [].concat(req.query['adviser_id'] || []);


    const [
      company,
      { results: advisers },
      ,
    ] = await Promise.all([
      getDitCompany(req.session.token, companyId),
      getAdvisers(token),
    ])
    const companyContacts = company.contacts.map(transformContactToOption)
    const initialContacts = companyContacts.filter(contact => contactIds.includes(contact['value']))
    adviserIds.push(user.id);
    activeAdvisers = advisers.filter((adviser) => !adviser.archived).map(transformObjectToOption)
    const initialAdvisers = activeAdvisers.filter(adviser => adviserIds.includes(adviser['value']))

    res
      .breadcrumb(`Add stub interaction for ${company.name}`)
      .render('interactions/apps/add-interaction-stub/views/add-interaction-form', {
        props: {
          company,
          advisers: activeAdvisers,
          initialAdvisers: initialAdvisers,
          contacts: companyContacts,
          initialContacts: initialContacts,
          initialDate: {
            day: initialDate[2],
            month: initialDate[1],
            year: initialDate[0],
          },
          initialSubject: initialSubject,
        },
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderAddInteractionStubForm,
}
