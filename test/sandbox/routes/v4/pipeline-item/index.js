var pipelineItemLambdaPlc = require('../../../fixtures/v4/pipeline-item/pipeline-item-lambda-plc.json')
var pipelineNoResult = require('../../../fixtures/v4/pipeline-item/pipeline-item-no-results.json')
var pipelineCreate = require('../../../fixtures/v4/pipeline-item/pipeline-item-create.json')
var lambdaPlc = require('../../../fixtures/v4/company/company-lambda-plc.json')

exports.getPipelineItems = function(req, res) {
  if (req.query.company_id === lambdaPlc.id) {
    res.json(pipelineItemLambdaPlc)
    return
  }
  res.json(pipelineNoResult)
}

exports.postPipelineItems = function(req, res) {
  var company = _.assign(
    {},
    {
      id: lambdaPlc.id,
      name: lambdaPlc.name,
    },
    pipelineCreate
  )
  res.json(company)
}
