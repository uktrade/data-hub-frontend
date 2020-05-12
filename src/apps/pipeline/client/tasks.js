import axios from 'axios'
import urls from '../../../lib/urls'

export async function getPipelineByCompany({ companyId }) {
  const pipelineItemRes = await axios.get(
    `/api-proxy/v4/pipeline-item?company_id=${companyId}`
  )
  return {
    companyId,
    count: pipelineItemRes.data.count,
    results: pipelineItemRes.data.results,
  }
}

export async function addCompanyToPipeline({ values, companyId, csrfToken }) {
  await axios.post(
    `${urls.companies.pipeline(companyId, { _csrf: csrfToken })}`,
    {
      name: null,
      status: values.category,
    }
  )
  return companyId
}
