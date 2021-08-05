import React from 'react'
import GridCol from '@govuk-react/grid-col'
import GridRow from '@govuk-react/grid-row'
import Footer from '../Footer'
import { Container } from '../../components'

const Default = ({ children }) => (
  <>
    <Container>
      <GridRow>
        <GridCol>{children}</GridCol>
      </GridRow>
    </Container>
    <Footer />
  </>
)

export default Default
