const { Router } = require('express')
const urls = require('../../lib/urls')

const { renderAddToPipeline } = require('./controllers/add')
const { renderEditPipeline } = require('./controllers/edit')
const { renderArchivePipelineItem } = require('./controllers/archive')

const companyPipelineRouter = Router()
const myPipelineRouter = Router()

companyPipelineRouter.get(urls.companies.pipelineAdd.route, renderAddToPipeline)

myPipelineRouter.get(urls.pipeline.edit.route, renderEditPipeline)
myPipelineRouter.get(urls.pipeline.archive.route, renderArchivePipelineItem)

module.exports = {
  companyPipelineRouter,
  myPipelineRouter,
}
