const { get, find } = require('lodash')

const metadata = require('../../../../lib/metadata')
const { transformObjectToOption } = require('../../../transformers')

function renderCreateProjectPage (req, res) {
  return res
    .breadcrumb('Add investment project')
    .render('investment-projects/views/create/project')
}

function getHandler (req, res, next) {
  if (!res.locals.equityCompany) {
    return res.redirect('/investment-projects/create')
  }

  const investmentDetails = req.store.get('investment_details')

  if (investmentDetails) {
    const investmentType = find(metadata.investmentTypeOptions.map(transformObjectToOption), { value: investmentDetails.investment_type })
    const fdiType = find(metadata.fdiOptions.map(transformObjectToOption), { value: investmentDetails.fdi_type })
    const nonFdiType = find(metadata.nonFdiOptions.map(transformObjectToOption), { value: investmentDetails.non_fdi_type })

    res.locals.form = get(res, 'locals.form', { options: {} })
    res.locals.form.options = Object.assign({}, res.locals.form.options, {
      investmentDetails: {
        'investment_type': investmentType,
        'fdi_type': fdiType,
        'non_fdi_type': nonFdiType,
      },
    })
  }

  next()
}

function postHandler (req, res, next) {
  if (get(res.locals, 'form.errors')) {
    return next()
  }

  req.flash('success', 'Investment project created')
  return res.redirect(`/investment-projects/${res.locals.resultId}/details`)
}

module.exports = {
  getHandler,
  postHandler,
  renderCreateProjectPage,
}
