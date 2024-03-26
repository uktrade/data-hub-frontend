import React from 'react'
import styled from 'styled-components'
import { H1 } from 'govuk-react'
import { FONT_SIZE, FONT_WEIGHTS, SPACING } from '@govuk-react/constants'

import Footer from '../../../components/Footer'
import { BLACK, WHITE, LIGHT_GREY } from '../../../utils/colours'

const Grid = styled.div({
  minHeight: '100vh',
  display: 'grid',
  gridTemplateRows: 'auto auto 1fr minmax(min-content, 30px)',
  gridTemplateColumns: `1fr min(100vw, calc(960px + ${SPACING.SCALE_5} * 2)) 1fr`,
  gridTemplateAreas: `
    ". main-bar ."
    ". header ."
    ". main ."
    "footer footer footer"
  `,
})

const MainBarBackground = styled.div({
  gridRow: 'main-bar',
  gridColumn: '1 / -1',
  background: BLACK,
})

const MainBar = styled.div({
  gridArea: 'main-bar',
  alignSelf: 'center',
  fontWeight: FONT_WEIGHTS.bold,
  fontSize: FONT_SIZE.SIZE_27,
  color: WHITE,
  padding: SPACING.SCALE_5,
})

const HeaderBackground = styled.div({
  gridRow: 'header',
  gridColumn: '1 / -1',
  background: LIGHT_GREY,
})

const Header = styled.header({
  gridArea: 'header',
  alignSelf: 'center',
  padding: SPACING.SCALE_5,
  paddingBottom: SPACING.SCALE_5,
})

const Main = styled.main({
  gridArea: 'main',
  padding: SPACING.SCALE_5,
})

const GridCellFooter = styled(Footer)({
  gridArea: 'footer',
  ul: {
    padding: 0,
  },
})

const Title = styled(H1)({
  margin: 0,
  marginBottom: SPACING.SCALE_5,
})

const Layout = ({ children, title, supertitle, headingContent }) => (
  <Grid>
    <MainBarBackground />
    <MainBar>Department for Business & Trade</MainBar>
    <HeaderBackground />
    <Header>
      <p>{supertitle}</p>
      <Title>{title}</Title>
      {headingContent}
    </Header>
    <Main>{children}</Main>
    <GridCellFooter
      links={{
        'Privacy Policy': 'http://example.com/not-implemented-yet',
        'Accessibility Statement': 'http://example.com/not-implemented-yet',
      }}
    />
  </Grid>
)

export default Layout
