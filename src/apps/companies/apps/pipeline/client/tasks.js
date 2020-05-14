import axios from 'axios'
import urls from '../../../../../lib/urls'

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
    `${urls.companies.pipeline(companyId, { _csrf: csrfToken })}`,
    {
      company: companyId,
      name: values.name,
      status: values.category,
    }
  )
  return companyId
}
