import React from 'react'
import { useParams } from 'react-router-dom'

import { DefaultLayout } from '../../../../components'
import { InvestmentResource } from '../../../../components/Resource'

const InvestmentName = (props) => (
  <InvestmentResource.Inline {...props}>
    {(project) => project.name}
  </InvestmentResource.Inline>
)

const AddProjectDocument = () => {
  const { projectId } = useParams()

  return (
    <DefaultLayout
      heading="Add evidence"
      pageTitle={
        <>
          Add evidence - <InvestmentName id={projectId} /> - Projects -
          Investments
        </>
      }
    ></DefaultLayout>
  )
}

export default AddProjectDocument
