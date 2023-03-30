// import React from 'react'
// import { Form } from '../../../../../src/client/components'

// import FieldCurrency from '../../../../../src/client/components/Form/elements/FieldCurrency'
// import DataHubProvider from '../provider'

// describe('FieldSelect', () => {
//   const Component = (props) => (
//     <DataHubProvider>
//       <Form
//         id="export-form"
//         analyticsFormName="export-form"
//         cancelRedirectTo={() => ''}
//         submissionTaskName=""
//         initialValues={{}}
//       >
//         {() => <FieldCurrency name="currency-test" {...props} />}
//       </Form>
//     </DataHubProvider>
//   )

//   context('When the value entered is not a number', () => {
//     it('the expected error message should show', () => {
//       cy.mount(
//         <Component
//           label="Estimate amount in pounds"
//           hint="For example, £1,000"
//           required="Enter amount in pounds"
//         />
//       )
//       cy.get('[data-test=currency-test-input]').type('a')
//       // cy.get('[data-test=submit-button]').click()
//     })
//   })
// })
