import React from 'react'
import { H1, H3 } from '@govuk-react/heading'
import styled from 'styled-components'
import Button from '@govuk-react/button'

import { MEDIA_QUERIES, SPACING, FONT_SIZE } from '@govuk-react/constants'

import { tasks } from '../../../../lib/urls'
import { DARK_GREY } from '../../../utils/colours'
import NoTaskImage from './img-tasks.jpg'

const StyledContainer = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  ${MEDIA_QUERIES.TABLET} {
    margin: 25px 0 50px 0;
  }
  ${MEDIA_QUERIES.DESKTOP} {
    margin: 45px 0 95px 0;
  }
`

const StyledParagraph = styled('p')`
  color: ${DARK_GREY};
  ${MEDIA_QUERIES.TABLET} {
    margin-bottom: 25px;
    font-size: ${FONT_SIZE.SIZE_19};
  }
`

const StyledImage = styled('img')`
  display: none;
  ${MEDIA_QUERIES.TABLET} {
    display: block;
    width: 380px;
    margin-bottom: ${SPACING.SCALE_3};
  }
  ${MEDIA_QUERIES.DESKTOP} {
    width: 460px;
    margin: ${SPACING.SCALE_3} 0 35px 0;
  }
`

const NoTasks = () => (
  <StyledContainer>
    <H3 as={H1}>You don't currently have any tasks</H3>
    <StyledParagraph>
      You can create your own tasks or collaborate with colleagues and assign
      tasks to other users.
    </StyledParagraph>
    <Button as={'a'} href={tasks.create()}>
      Add a task
    </Button>
    <StyledImage src={NoTaskImage} alt="An image of a list of tasks" />
  </StyledContainer>
)

export default NoTasks
