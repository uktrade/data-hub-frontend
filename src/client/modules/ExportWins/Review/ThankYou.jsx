import React from 'react'
import { Route } from 'react-router-dom'
import styled from 'styled-components'

import { GREEN, WHITE } from '../../../utils/colours'
import { StatusMessage } from '../../../components'

import Layout from './Layout'

const StyledStatusMessage = styled(StatusMessage)({
  background: WHITE,
  '& > *:first-child': {
    marginTop: 0,
  },
  '& > *:last-child': {
    marginBottom: 0,
  },
})

export default () => (
  <Route>
    {({ location: { search } }) => {
      const agree = search.includes('agree=yes')
      return (
        <Layout
          title={
            agree
              ? 'Export win reviewed'
              : 'Export win reviewed and changes are needed'
          }
          headingContent={
            agree ? (
              <StyledStatusMessage colour={GREEN}>
                Thank you for taking time to review this export win.
              </StyledStatusMessage>
            ) : (
              <StyledStatusMessage>
                <p>Thank you for reviewing this export win.</p>
                <p>
                  As you have asked for some changes to be made, we will review
                  your comments and may need to contact you if we need more
                  information.
                </p>
              </StyledStatusMessage>
            )
          }
        >
          Your feedback will help us to improve our support services.
        </Layout>
      )
    }}
  </Route>
)
