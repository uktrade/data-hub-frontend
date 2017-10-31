const { find, assign } = require('lodash')

const { searchInvestments } = require('../../search/services')
const { transformApiResponseToSearchCollection } = require('../../search/transformers')
const { updateInvestment } = require('../repos')
const metadata = require('../../../lib/metadata')
const {
  transformInvestmentProjectToListItem,
  transformInvestmentListItemToDisableMetaLinks,
} = require('../transformers')

async function selectAssociatedInvestmentProject (req, res, next) {
  if (!req.query.project) {
    return next()
  }

  try {
    const investmentId = req.params.investmentId

    await updateInvestment(req.session.token, investmentId, {
      associated_non_fdi_r_and_d_project: req.query.project,
    })

    req.flash('success', 'Investment details updated')
    res.redirect(`/investment-projects/${investmentId}/details`)
  } catch (error) {
    return next(error)
  }
}

async function searchForAssociatedInvestmentProject (req, res, next) {
  const searchTerm = req.query.term
  const page = req.query.page || '1'
  const token = req.session.token

  if (!searchTerm) {
    return next()
  }

  try {
    const investmentTypes = metadata.investmentTypeOptions

    const { id: nonFDIId } = find(investmentTypes, (item) => {
      return item.name.toLowerCase() === 'non-fdi'
    })

    res.locals.searchTerm = searchTerm

    res.locals.results = await searchInvestments({
      token,
      searchTerm,
      page,
      filters: {
        investment_type: nonFDIId,
      },
    })
      .then(transformApiResponseToSearchCollection(
        { query: req.query },
        transformInvestmentProjectToListItem,
        transformInvestmentListItemToDisableMetaLinks,
        (item) => {
          return assign({}, item, { url: `?project=${item.id}` })
        }
      ))
  } catch (error) {
    next(error)
  }

  next()
}

function renderAssociatedInvestmentProjectResults (req, res, next) {
  return res.render('investment-projects/views/associated')
}

async function removeAssociatedInvestmentProject (req, res, next) {
  try {
    await updateInvestment(req.session.token, req.params.investmentId, {
      associated_non_fdi_r_and_d_project: null,
    })

    req.flash('success', 'Investment details updated')
    res.redirect(`/investment-projects/${req.params.investmentId}/details`)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  selectAssociatedInvestmentProject,
  searchForAssociatedInvestmentProject,
  renderAssociatedInvestmentProjectResults,
  removeAssociatedInvestmentProject,
}
