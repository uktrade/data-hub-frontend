import React from 'react'
import { storiesOf } from '@storybook/react'
import ContactInformation from 'ContactInformation'

const stories = storiesOf('ContactInformation', module)

stories.add('Default', () => (
  <ContactInformation onOpenContactForm="hello" companyId="123ABC" />
))
