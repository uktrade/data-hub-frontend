import React from 'react'
import { storiesOf } from '@storybook/react'
import ContactDetails from 'ContactDetails'

const stories = storiesOf('ContactDetails', module)

stories.add('Default', () => (
  <ContactDetails onOpenContactForm="hello" companyId="123ABC" />
))
