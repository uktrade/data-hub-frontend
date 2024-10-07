import React, { useState, Fragment } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import PropTypes from 'prop-types'
import GridCol from '@govuk-react/grid-col'
import GridRow from '@govuk-react/grid-row'
import Button from '@govuk-react/button'
import { SPACING } from '@govuk-react/constants'
import Breadcrumbs from '@govuk-react/breadcrumbs'

import { GREY_1, GREY_4 } from '../../../client/utils/colours'
import Footer from '../Footer'
import Main, { InnerContainer } from '../Main'
import DataHubHeader from '../DataHubHeader'
import WatchTextContent from '../WatchTextContent'
import LocalHeaderHeading from '../LocalHeader/LocalHeaderHeading'

import { EYBLeadResource } from '../../../client/components/Resource'
import { buildEYBLeadBreadcrumbs } from '../../modules/Investments/utils'
import EYBLeadName from '../../modules/Investments/EYBLeads/EYBLeadName'

const GlobalStyles = createGlobalStyle`
  *, *:before, *:after {
    box-sizing: initial;
  }
`

const LocalHeader = styled('div')`
  background-color: ${GREY_4};
  paddingTop: SPACING.SCALE_5,
  textAlign: 'center',
`

const StyledHeader = styled(InnerContainer)`
  padding-bottom: ${SPACING.SCALE_5};
  padding-top: ${SPACING.SCALE_3};
`

const StyledMain = styled(Main)`
  padding-top: 0;
`

const BreadcrumbsWrapper = styled(Breadcrumbs)`
  margin-bottom: ${SPACING.SCALE_5};
  margin-top: 0;
`

const StyledSuperheading = styled('div')`
  fontsize: 20;
  lineheight: '32px';
  color: ${GREY_1};
`

const StyledButtonContainer = styled('div')`
  width: 100%;
  display: inline-block;
`

const StyledButtonLink = styled.a({
  marginBottom: 10,
  float: 'right',
})

const EYBLeadLayout = ({ id, children }) => {
  const [showVerticalNav, setShowVerticalNav] = useState(false)
  return (
    <>
      <WatchTextContent
        onTextContentChange={(text) => {
          document.title = text
        }}
      >
        EYB lead details - <EYBLeadName id={id} /> - EYB lead - Investments -
        DBT Data Hub
      </WatchTextContent>
      <GlobalStyles />
      <DataHubHeader
        showVerticalNav={showVerticalNav}
        onShowVerticalNav={setShowVerticalNav}
      />
      <LocalHeader
        aria-label="local header"
        data-auto-id="localHeader"
        data-test="localHeader"
        role="region"
      >
        <StyledHeader>
          <EYBLeadResource id={id}>
            {(eybLead) => {
              const breadcrumbs = buildEYBLeadBreadcrumbs({
                text: eybLead.company.name,
              })
              return (
                <>
                  <BreadcrumbsWrapper data-test="breadcrumbs">
                    {breadcrumbs?.map((breadcrumb) =>
                      breadcrumb.link ? (
                        <Breadcrumbs.Link
                          key={breadcrumb.link}
                          href={breadcrumb.link}
                        >
                          {breadcrumb.text}
                        </Breadcrumbs.Link>
                      ) : (
                        <Fragment key={breadcrumb.text}>
                          {breadcrumb.text}
                        </Fragment>
                      )
                    )}
                  </BreadcrumbsWrapper>
                  <GridRow>
                    <GridCol setWidth="two-thirds">
                      <StyledSuperheading data-test="superheading">
                        EYB lead
                      </StyledSuperheading>
                      <LocalHeaderHeading data-test="heading">
                        {eybLead.company.name}
                      </LocalHeaderHeading>
                    </GridCol>
                    <GridCol setWith="one-third">
                      <StyledButtonContainer>
                        <Button
                          as={StyledButtonLink}
                          data-test="header-add-interaction"
                          href=""
                          aria-label={`The new button`}
                        >
                          The new button
                        </Button>
                      </StyledButtonContainer>
                    </GridCol>
                  </GridRow>
                </>
              )
            }}
          </EYBLeadResource>
        </StyledHeader>
      </LocalHeader>
      <StyledMain>
        <GridRow>
          <GridCol>{children}</GridCol>
        </GridRow>
      </StyledMain>
      <Footer />
    </>
  )
}

EYBLeadLayout.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
}

export default EYBLeadLayout
