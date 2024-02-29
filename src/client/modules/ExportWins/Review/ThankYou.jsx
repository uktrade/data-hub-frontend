/* eslint-disable prettier/prettier */
import _ from 'lodash'
import React from 'react'
import { H2 } from 'govuk-react'
import {
  FOCUSABLE,
  SPACING,
  FONT_SIZE,
  BORDER_WIDTH,
  CAPTION_SIZES,
  FONT_WEIGHTS,
} from '@govuk-react/constants'
import styled from 'styled-components';

import Layout from "./Layout";
import { GREEN, WHITE, BLUE, RED } from '../../../utils/colours';
import FlashMessages from '../../../components/LocalHeader/FlashMessages';

const STATUS_COLOURS = {
  success: GREEN,
  important: BLUE,
  error: RED,
}

const Root = styled.div(({status}) => ({
  border: `${BORDER_WIDTH} solid ${STATUS_COLOURS[status]}`,
  ...FOCUSABLE,
}))

const Heading = styled(H2)(({status}) => ({
  background: STATUS_COLOURS[status],
  color: WHITE,
  padding: SPACING.SCALE_2,
  margin: 0,
  fontSize: FONT_SIZE.SIZE_20,
}))

const Content = styled.div({
  padding: SPACING.SCALE_2,
  fontSize: CAPTION_SIZES.MEDIUM,
  fontWeight: FONT_WEIGHTS.bold,
})

const Panel = ({status, title = _.capitalize(status), children, ...props}) =>
  <Root {...props} status={status}>
    <Heading status={status}>{title}</Heading>
    <Content status={status}>
      {children}
    </Content>
  </Root>

export default () =>
  <Layout
    title="Export win reviewed"
    headingContent={
      <>
        {/* <Panel status="success">
          Thank you for taking the time to review this export win
        </Panel> */}
        <FlashMessages />
      </>
    }
  >
    Your feedback will help us to improve our support services.
  </Layout>
