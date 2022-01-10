import React from 'react'
import { storiesOf } from '@storybook/react'
import { MemoryRouter, Route } from 'react-router'

import EventForm from '..'

storiesOf('Modules/Event Form/Create Event Form', module)
  .addParameters({
    options: { theme: undefined },
  })
  .add('Add event', () => <EventForm />)

storiesOf('Modules/Event Form/Update Event Form', module)
  .addParameters({
    options: { theme: undefined },
  })
  .add('Edit event', () => (
    <MemoryRouter
      initialEntries={['/events/60274a64-9136-453b-8326-4c7fe9395f15/edit']}
    >
      <Route component={() => <EventForm />} path="/events/:id/edit" />
    </MemoryRouter>
  ))
