import axios from 'axios'
import urls from '../../../lib/urls'

export async function getPipelineByCompany({ companyId }) {
  const { data } = await axios.get(
    `/api-proxy/v4/pipeline-item?company_id=${companyId}`
  )
  return {
    companyId,
    count: data.count,
    results: data.results,
  }
}

export async function addCompanyToPipeline({ values, companyId, csrfToken }) {
  await axios.post(
    `${urls.companies.pipelineAdd(companyId, { _csrf: csrfToken })}`,
    {
      company: companyId,
      name: values.name,
      status: values.category,
    }
  )
  return companyId
}

export async function getPipelineItem({ pipelineItemId }) {
  const { data } = await axios.get(
    `/api-proxy/v4/pipeline-item/${pipelineItemId}`
  )
  return data
}

export async function editPipelineItem({ values, pipelineItemId, csrfToken }) {
  await axios.post(
    `${urls.pipeline.edit(pipelineItemId, { _csrf: csrfToken })}`,
    {
      name: values.name,
      status: values.category,
    }
  )
  return pipelineItemId
}
