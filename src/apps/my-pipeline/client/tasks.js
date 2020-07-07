import axios from 'axios'
import pipelineApi from './api'
import { addMessage } from '../../../client/utils/flash-messages'
import { transformValueForApi } from '../../../common/date'

function transformValuesForApi(values, oldValues = {}) {
  const data = {
    name: values.name,
    status: values.category,
  }

  function addValue(key, value) {
    const existingValue = oldValues[key]
    const hasExistingValue = Array.isArray(existingValue)
      ? !!existingValue.length
      : !!existingValue

    if (hasExistingValue || (Array.isArray(value) ? value.length : value)) {
      data[key] = value || null
    }
  }

  addValue('likelihood_to_win', parseInt(values.likelihood, 10))
  addValue('sector', values.sector?.value)
  addValue(
    'contacts',
    values.contacts ? values.contacts.map(({ value }) => value) : []
  )
  addValue('potential_value', values.export_value)
  addValue('expected_win_date', transformValueForApi(values.expected_win_date))

  return data
}

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
    ...transformValuesForApi(values),
  })
  addMessage('success', 'Pipeline changes for this company have been saved')
  return data
}

export async function getPipelineItem({ pipelineItemId }) {
  const { data } = await pipelineApi.get(pipelineItemId)
  return data
}

export async function getCompanyContacts({ companyId }) {
  const { data } = await axios.get('/api-proxy/v3/contact', {
    params: { company_id: companyId, limit: 500 },
  })

  return data.results
}

export async function editPipelineItem({
  values,
  pipelineItemId,
  currentPipelineItem,
}) {
  const { data } = await pipelineApi.update(
    pipelineItemId,
    transformValuesForApi(values, currentPipelineItem)
  )
  addMessage('success', 'Pipeline changes for this company have been saved')
  return data
}

export async function archivePipelineItem({ values, pipelineItemId }) {
  const { data } = await pipelineApi.archive(pipelineItemId, {
    reason: values.reason,
  })
  addMessage('success', 'Pipeline changes for this company have been saved')
  return data
}

export async function unarchivePipelineItem({ pipelineName, pipelineItemId }) {
  const { data } = await pipelineApi.unarchive(pipelineItemId)
  addMessage('success', `You have unarchived ${pipelineName}`)
  return data
}

export async function deletePipelineItem({ pipelineName, pipelineItemId }) {
  const { status } = await pipelineApi.delete(pipelineItemId)
  addMessage('success', `You have deleted ${pipelineName} from your pipeline`)
  return status
}
