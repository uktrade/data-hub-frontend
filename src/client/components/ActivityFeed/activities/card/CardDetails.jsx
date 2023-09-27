import React from 'react'
import Details from '@govuk-react/details'
import Link from '@govuk-react/link'
import styled from 'styled-components'
import { SPACING, MEDIA_QUERIES, FONT_SIZE } from '@govuk-react/constants'
import { VisuallyHidden } from 'govuk-react'
import PropTypes from 'prop-types'

import Analytics from '../../../Analytics'

const GovUkDetails = styled(Details)`
  font-size: ${FONT_SIZE.SIZE_16};
  margin: ${SPACING.SCALE_2} 0 0;

  & > div {
    padding: ${SPACING.SCALE_1};
    padding-bottom: ${SPACING.SCALE_3};
    margin: ${SPACING.SCALE_1} 0 ${SPACING.SCALE_1} 4px;

    & > a {
      padding: ${SPACING.SCALE_4} 0 ${SPACING.SCALE_2} ${SPACING.SCALE_2};
    }
  }

  ${MEDIA_QUERIES.TABLET} {
    margin-top: -${SPACING.SCALE_3};
  }
`

export default class CardDetails extends React.PureComponent {
  static propTypes = {
    summary: PropTypes.string.isRequired,
    summaryVisuallyHidden: PropTypes.string,
    showDetails: PropTypes.bool.isRequired,
    link: PropTypes.shape({
      url: PropTypes.string,
      text: PropTypes.string,
    }),
    children: PropTypes.node.isRequired,
    analyticsAccordionType: PropTypes.string,
  }

  static defaultProps = {
    link: null,
  }

  renderLink = (link) => {
    if (!link) {
      return null
    }

    return <Link href={link.url}>{link.text}</Link>
  }

  render() {
    const {
      summary,
      showDetails,
      link,
      children,
      summaryVisuallyHidden,
      analyticsAccordionType,
    } = this.props

    const SummaryWithHiddenContent = (
      <>
        {summary}
        <VisuallyHidden>{summaryVisuallyHidden}</VisuallyHidden>
      </>
    )

    return (
      <Analytics>
        {(pushAnalytics) => (
          <GovUkDetails
            summary={summaryVisuallyHidden ? SummaryWithHiddenContent : summary}
            open={showDetails}
            onClick={() => {
              pushAnalytics({
                event: 'viewInteractionEngagement',
                extra: {
                  accordionEngagement: 'clicked',
                  accordionType: analyticsAccordionType,
                },
              })
            }}
          >
            {children}
            {this.renderLink(link)}
          </GovUkDetails>
        )}
      </Analytics>
    )
  }
}
