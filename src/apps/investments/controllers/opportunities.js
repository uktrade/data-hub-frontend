const renderOpportunitiesView = (req, res, next) => {
  try {
    res
      .breadcrumb('UK opportunities')
      .render('investments/views/opportunities', {
        heading: 'UK opportunities',
        props: {
          opportunityId: req.params.opportunityId,
        },
      })
  } catch (error) {
    next(error)
  }
}

const renderOpportunityDetailsView = (req, res, next) => {
  try {
    res.render('investments/views/opportunity-details', {
      props: {
        opportunityId: req.params.opportunityId,
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { renderOpportunitiesView, renderOpportunityDetailsView }
