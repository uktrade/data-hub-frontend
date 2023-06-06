import React from 'react'
import { DefaultLayout } from '../../../components'

const CompanyTree = () => {
  return (
    <DefaultLayout
      heading={'Company records'}
      pageTitle={'Company records'}
      breadcrumbs={[]}
      useReactRouter={false}
    >
      <h1>Company tree</h1>
    </DefaultLayout>
  )
}

export default CompanyTree
