const { Router } = require('express')
const urls = require('../../lib/urls')

const {
  renderAddToPipeline,
  addCompanyToPipeline,
} = require('./controllers/add')

const {
  renderEditPipeline,
  editCompanyOnPipeline,
} = require('./controllers/edit')

const companyPipelineRouter = Router()
const myPipelineRouter = Router()

companyPipelineRouter
  .get(urls.companies.pipelineAdd.route, renderAddToPipeline)
  .post(urls.companies.pipelineAdd.route, addCompanyToPipeline)

myPipelineRouter
  .get(urls.pipeline.edit.route, renderEditPipeline)
  .post(urls.pipeline.edit.route, editCompanyOnPipeline)

module.exports = {
  companyPipelineRouter,
  myPipelineRouter,
}
