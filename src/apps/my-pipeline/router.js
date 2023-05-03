const { Router } = require('express')

const myPipelineRouter = Router()
const companyPipelineRouter = Router()

// Redirect /my-pipeline to /export
myPipelineRouter.get('/', (req, res) => res.redirect('/export'))

// Redirect /my-pipeline/:status to /export
myPipelineRouter.get('/:status', (req, res) => res.redirect('/export'))

// Redirect
// From: /companies/<company-id>/my-pipeline
// To:   /export/create?companyId=<company-id>
companyPipelineRouter.get('/:companyId/my-pipeline', (req, res) =>
  res.redirect(`/export/create?companyId=${req.params.companyId}`)
)

module.exports = {
  myPipelineRouter,
  companyPipelineRouter,
}
