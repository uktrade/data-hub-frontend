import React from 'react'
import GridCol from '@govuk-react/grid-col'
import GridRow from '@govuk-react/grid-row'
import Footer from '../Footer'
import { Container } from '../../components'
import Header from '../Header'
import LocalHeader from '../LocalHeader/LocalHeader'

const Default = ({ children }) => (
  <>
    <Header />
    <LocalHeader
      heading="Orders (OMIS)"
      breadcrumbs={[{ link: '/', text: 'Home' }, { text: 'Orders (OMIS)' }]}
    />
    <Container>
      <GridRow>
        <GridCol>{children}</GridCol>
      </GridRow>
    </Container>
    <Footer />
  </>
)

export default Default
