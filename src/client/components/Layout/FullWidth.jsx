import React from 'react'
import Main from '@govuk-react/main'
import GridCol from '@govuk-react/grid-col'
import GridRow from '@govuk-react/grid-row'
import Footer from '../Footer'

const FullWidth = ({ children }) => (
  <>
    <Main>
      <GridRow>
        <GridCol>{children}</GridCol>
      </GridRow>
    </Main>
    <Footer />
  </>
)

export default FullWidth
