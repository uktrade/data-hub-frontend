import React from 'react'
import Link from '@govuk-react/link'
import Button from '@govuk-react/button'
import { connect } from 'react-redux'
import { GridCol, GridRow } from 'govuk-react'
import styled from 'styled-components'

import { Form, FormLayout } from '../../../components'

import urls from '../../../../lib/urls'
import { TASK_ARCHIVE_TASK, buttonState2props } from './state'
import { FORM_LAYOUT } from '../../../../common/constants'
import { GREY_3, TEXT_COLOUR } from '../../../utils/colours'

const StyledGridCol = styled(GridCol)`
  margin-left: -75px;
`

export const TaskButtons = ({ task, editUrl }) => (
  <GridRow>
    <GridCol setWidth={'28%'}>
      {!task.archived && (
        <FormLayout setWidth={FORM_LAYOUT.THREE_QUARTERS}>
          <Form
            id="archive-task-form"
            analyticsFormName="archiveTaskForm"
            redirectTo={() =>
              urls.investments.projects.tasks.index(
                task.investmentProjectTask.investmentProject.id
              )
            }
            cancelRedirectTo={false}
            submissionTaskName={TASK_ARCHIVE_TASK}
            transformPayload={() => ({
              taskId: task.id,
            })}
            flashMessage={() => 'Task marked as complete'}
            submitButtonLabel="Mark as complete"
            initialValues={task}
          >
            {() => <></>}
          </Form>
        </FormLayout>
      )}
    </GridCol>
    <StyledGridCol setWidth={'20%'}>
      <Button
        buttonColour={GREY_3}
        buttonTextColour={TEXT_COLOUR}
        as={Link}
        href={editUrl}
        data-test="edit-form-button"
      >
        Edit
      </Button>
    </StyledGridCol>
  </GridRow>
)

export default connect(buttonState2props)(TaskButtons)
