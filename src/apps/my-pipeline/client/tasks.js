import pipelineApi from './api'
import { addSuccessMessage } from '../../../client/utils/flash-messages'

export async function getPipelineByCompany({ companyId }) {
  const { data } = await pipelineApi.list({ company_id: companyId })

  return {
    companyId,
    count: data.count,
    results: data.results,
  }
}

export async function addCompanyToPipeline({ values, companyId }) {
  const { data } = await pipelineApi.create({
    company: companyId,
    name: values.name,
    status: values.category,
  })
  addSuccessMessage('Pipeline changes for this company have been saved')
  return data
}

export async function getPipelineItem({ pipelineItemId }) {
  const { data } = await pipelineApi.get(pipelineItemId)
  return data
}

export async function editPipelineItem({ values, pipelineItemId }) {
  const { data } = await pipelineApi.update(pipelineItemId, {
    name: values.name,
    status: values.category,
  })
  addSuccessMessage('Pipeline changes for this company have been saved')
  return data
}
