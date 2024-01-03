import React from 'react'

import ContactInformation from 'ContactInformation'

export default {
  title: 'ContactInformation',

  parameters: {
    component: ContactInformation,
  },
}

export const Default = () => (
  <ContactInformation onOpenContactForm="hello" companyId="123ABC" />
)
