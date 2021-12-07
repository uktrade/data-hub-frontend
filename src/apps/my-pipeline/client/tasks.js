import axios from 'axios'
import pipelineApi from './api'
import { addMessage } from '../../../client/utils/flash-messages'
import { transformValueForAPI } from '../../../client/utils/date'

function transformValuesForApi(values) {
  const sector = values.sector ? values.sector.value : null
  const potential_value = values.export_value ? values.export_value : null
  const likelihood_to_win = values.likelihood
    ? parseInt(values.likelihood, 10)
    : null
  const contacts = values.contacts
    ? values.contacts.map(({ value }) => value)
    : []
  const expected_win_date = values.expected_win_date
    ? transformValueForAPI(values.expected_win_date)
    : null

  const data = {
    name: values.name,
    status: values.category,
    sector: sector,
    potential_value: potential_value,
    likelihood_to_win: likelihood_to_win,
    contacts: contacts,
    expected_win_date: expected_win_date,
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
  return data
}

export async function getPipelineItem({ pipelineItemId }) {
  const { data } = await pipelineApi.get(pipelineItemId)
  return data
}

export async function getCompanyContacts({ companyId }) {
  const { data } = await axios.get(`/api-proxy/v4/contact`, {
    params: { company_id: companyId, limit: 500 },
  })

  return data.results
}

export async function editPipelineItem({ values, pipelineItemId }) {
  const { data } = await pipelineApi.update(
    pipelineItemId,
    transformValuesForApi(values)
  )
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
