import React, { useEffect } from 'react'
import GridCol from '@govuk-react/grid-col'
import GridRow from '@govuk-react/grid-row'
import Footer from '../Footer'
import { Container } from '../../components'
import Header from '../Header'
import LocalHeader from '../LocalHeader/LocalHeader'

const Default = ({ heading, pageTitle, children }) => {
  useEffect(() => {
    document.title = `${pageTitle} - DIT Data Hub`
  }, [pageTitle])
  return (
    <>
      <Header />
      <LocalHeader
        heading={heading}
        breadcrumbs={[{ link: '/', text: 'Home' }, { text: heading }]}
      />
      <Container>
        <GridRow>
          <GridCol>{children}</GridCol>
        </GridRow>
      </Container>
      <Footer />
    </>
  )
}

export default Default
