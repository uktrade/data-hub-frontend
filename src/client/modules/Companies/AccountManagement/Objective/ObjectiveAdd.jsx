import React from 'react'
import { useParams } from 'react-router-dom'

import ObjectiveForm from './ObjectiveForm'
import { CompanyResource } from '../../../../components/Resource'

const ObjectiveAdd = () => {
  const { companyId } = useParams()
  return (
    <CompanyResource id={companyId}>
      {(company) => <ObjectiveForm company={company} />}
    </CompanyResource>
  )
}

export default ObjectiveAdd
