import React from 'react'

import urls from '../../../../lib/urls'

import { DefaultLayout, FormLayout } from '../../../components'
import Heading from '../Heading'

const SettingsLayout = ({ entity, reminderSettingsURL, children }) => (
  <DefaultLayout
    heading={
      <Heading preHeading={`Settings for ${entity} with`}>
        no recent interaction
      </Heading>
    }
    pageTitle={`Settings for ${entity} with no recent interaction`}
    breadcrumbs={[
      {
        link: urls.dashboard(),
        text: 'Home',
      },
      {
        link: reminderSettingsURL,
        text: 'Reminders and email notifications settings',
      },
      {
        text: `Settings for ${entity} with no recent interaction`,
      },
    ]}
  >
    <FormLayout setWidth="three-quarters">{children}</FormLayout>
  </DefaultLayout>
)

export default SettingsLayout
