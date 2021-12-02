import React from 'react'
import { storiesOf } from '@storybook/react'

import EventForm from '..'

storiesOf('Task/Form/Event Form/Create Event Form', module)
  .addParameters({
    options: { theme: undefined },
  })
  .add('Add event', () => <EventForm />)

storiesOf('Task/Form/Event Form/Update Event Form', module)
  .addParameters({
    options: { theme: undefined },
  })
  .add('Edit event', () => (
    <EventForm eventId="60274a64-9136-453b-8326-4c7fe9395f15"></EventForm>
  ))
