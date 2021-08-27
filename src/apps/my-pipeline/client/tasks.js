import axios from 'axios'
import pipelineApi from './api'
import { addMessage } from '../../../client/utils/flash-messages'
import { transformValueForAPI } from '../../../client/utils/date'

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
  addValue('expected_win_date', transformValueForAPI(values.expected_win_date))

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

  addMessage('success', `You added ${values.name} to your pipeline`)
  return data
}

export async function getPipelineItem({ pipelineItemId }) {
  const { data } = await pipelineApi.get(pipelineItemId)
  return data
}

export async function getCompanyContacts({ companyId, features }) {
  const contactEndpointVersion = features['address-area-contact-required-field']
    ? 'v4'
    : 'v3'
  const { data } = await axios.get(
    `/api-proxy/${contactEndpointVersion}/contact`,
    {
      params: { company_id: companyId, limit: 500 },
    }
  )

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
  addMessage('success', `You saved changes to ${values.name}`)
  return data
}

export async function archivePipelineItem({
  values,
  pipelineItemId,
  projectName,
}) {
  const { data } = await pipelineApi.archive(pipelineItemId, {
    reason: values.reason,
  })
  addMessage('success', `You archived ${projectName}`)
  return data
}

export async function unarchivePipelineItem({ projectName, pipelineItemId }) {
  const { data } = await pipelineApi.unarchive(pipelineItemId)
  addMessage('success', `You unarchived ${projectName}`)
  return data
}

export async function deletePipelineItem({ projectName, pipelineItemId }) {
  const { status } = await pipelineApi.delete(pipelineItemId)
  addMessage('success', `You deleted ${projectName} from your pipeline`)
  return status
}
