import React from 'react'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'

import { state2props } from './state'

import { EYBLeadResource } from '../../../components/Resource'
import { DefaultLayout } from '../../../components'

const EYBLeadDetails = () => {
  const { eybLeadId } = useParams()
  return (
    <DefaultLayout
      heading={'EYB Lead'}
      pageTitle={'EYB Lead'}
      breadcrumbs={[]}
      useReactRouter={false}
    >
      <EYBLeadResource id={eybLeadId}>
        {(eybLead) => {
          return (
            <>
              <h1>{eybLead.company.name}</h1>
            </>
          )
        }}
      </EYBLeadResource>
    </DefaultLayout>
  )
}

export default connect(state2props)(EYBLeadDetails)
