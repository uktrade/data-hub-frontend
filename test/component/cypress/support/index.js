/* eslint-disable */
import '@cypress/code-coverage/support'
import { MemoryRouter } from 'react-router-dom'

require('./commands')

// Cypress.Commands.add('mount', (component, options = {}) => {
//   const { routerProps = { initialEntries: ['/'] }, ...mountOptions } = options

//   const wrapped = <MemoryRouter {...routerProps}>{component}</MemoryRouter>

//   return mount(wrapped, mountOptions)
// })
