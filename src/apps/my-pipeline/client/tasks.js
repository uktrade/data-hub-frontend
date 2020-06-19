import pipelineApi from './api'
import { addMessage } from '../../../client/utils/flash-messages'
import axios from 'axios'
import moment from 'moment'

function transformValuesForApi(values, oldValues = {}) {
  const data = {
    name: values.name,
    status: values.category,
  }

  function addValue(key, value) {
    const hasExistingValue = !!oldValues[key]

    if (hasExistingValue || value) {
      data[key] = value || null
    }
  }

  addValue('likelihood_to_win', parseInt(values.likelihood, 10))
  addValue('sector', values.sector?.value)
  addValue('contact', values.contact?.value)
  addValue('potential_value', values.export_value)

  const { month, year } = values.expected_win_date
  const expectedWinDate = moment(`${year}-${month}`, 'YYYY-MM', true)
  if (expectedWinDate.isValid()) {
    addValue('expected_win_date', expectedWinDate.format('YYYY-MM-DD'))
  } else {
    addValue('expected_win_date')
  }
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
  const { data: pipelineItem } = await pipelineApi.get(pipelineItemId)
  const { data: contactData } = await axios.get('/api-proxy/v3/contact', {
    params: { company_id: pipelineItem.company.id, limit: 500 },
  })

  return { pipelineItem, contacts: contactData.results }
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
