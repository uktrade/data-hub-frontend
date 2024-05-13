import React from 'react'
import { Routes, Route } from 'react-router-dom'

import { Reminders } from '../../../../../src/client/modules/Reminders/Reminders.jsx'

describe('Reminders', () => {
  it('should navigate to the default URL when the reminderType is missing', () => {
    cy.mountWithProvider(
      <Routes>
        <Route path="/foo/bar" element={<Reminders defaultUrl="/success" />} />
        <Route path="/success" element={<>Success</>} />
      </Routes>,
      { initialPath: '/foo/bar' }
    )
    cy.contains('Success')
  })
})
