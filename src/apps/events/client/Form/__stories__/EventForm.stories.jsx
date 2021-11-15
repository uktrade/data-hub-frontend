import React from 'react'
import { storiesOf } from '@storybook/react'

import EventForm from '../EventForm'

const CREATE_EVENT = {
  isComplete: true,
  createdEventId: undefined,
  createdEventName: undefined,
  progress: undefined,
  eventId: undefined,
  updatedEventId: undefined,
  updatedEventName: undefined,
}

const UPDATE_EVENT = {
  isComplete: true,
  createdEventId: undefined,
  createdEventName: undefined,
  progress: undefined,
  eventId: '60274a64-9136-453b-8326-4c7fe9395f15',
  updatedEventId: undefined,
  updatedEventName: undefined,
}

storiesOf('Event Form/Create Event Form', module)
  .addParameters({
    options: { theme: undefined },
  })
  .add('As default Event', () => <EventForm {...CREATE_EVENT}></EventForm>)

storiesOf('Event Form/Update Event Form', module)
  .addParameters({
    options: { theme: undefined },
  })
  .add('As default Event', () => <EventForm {...UPDATE_EVENT}></EventForm>)
