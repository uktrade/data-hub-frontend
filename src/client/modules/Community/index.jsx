import React from 'react'
import { DefaultLayout } from '../../components'
// import { Link } from 'govuk-react'
import { H4 } from '@govuk-react/heading'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'

const Community = () => {
  return (
    <DefaultLayout
      heading={'CRM Community'}
      pageTitle={'Community'}
      subheading={
        'Find out about upcoming improvements to CRM and to help shape its future development.'
      }
      breadcrumbs={[]}
      useReactRouter={false}
    >
      <GridRow>
        <GridCol>
          <H4>Take a look at what we're working on</H4>
          <p>
            Our CRM roadmap shows what we're currently working on and the work
            that is lined up over the coming months
          </p>
        </GridCol>
        <GridCol>
          <H4>Discuss and give feedback</H4>

          <p>
            Do you have a great idea? We would love to hear it. Tell us your
            feedback or experience using our CRM tools.
          </p>
        </GridCol>
      </GridRow>
      <GridRow></GridRow>
    </DefaultLayout>
  )
}

export default Community
