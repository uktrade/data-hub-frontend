import React from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { connect } from 'react-redux'

import { ID, TASK_GET_ONE_LIST_DETAILS, state2props } from './state'
import {
  ACCOUNT_MANAGER_FIELD_NAME,
  ONE_LIST_TEAM_FIELD_NAME,
  TIER_FIELD_NAME,
} from './constants'
import { DefaultLayout } from '../../../components'
import { buildCompanyBreadcrumbs } from '../utils'
import { ONE_LIST_DETAILS_LOADED } from '../../../actions'
import Task from '../../../components/Task'
import EditOneListForm from './EditOneListForm'
import urls from '../../../../lib/urls'

function useQuery() {
  const { search } = useLocation()

  return React.useMemo(() => new URLSearchParams(search), [search])
}

const EditOneList = ({
  oneListTeam,
  company,
  oneListTiers,
  globalAccountManager,
}) => {
  const { companyId } = useParams()
  const query = useQuery()
  const returnUrl = query.get('returnUrl')
  const heading = `Edit core team of ${company ? company.name : ''}`

  return (
    <DefaultLayout
      pageTitle={heading}
      heading={heading}
      breadcrumbs={
        company
          ? buildCompanyBreadcrumbs(
              [{ text: 'Edit core team' }],
              company.id,
              company.name
            )
          : [
              { link: urls.dashboard.index(), text: 'Home' },
              {
                link: urls.companies.index(),
                text: 'Companies',
              },
            ]
      }
      useReactRouter={false}
    >
      <Task.Status
        name={TASK_GET_ONE_LIST_DETAILS}
        id={ID}
        startOnRender={{
          payload: companyId,
          onSuccessDispatch: ONE_LIST_DETAILS_LOADED,
        }}
        progressMessage="Loading one list details"
      >
        {() =>
          company &&
          oneListTeam &&
          oneListTiers && (
            <EditOneListForm
              company={company}
              returnUrl={returnUrl}
              oneListTiers={oneListTiers}
              formInitialValues={{
                [TIER_FIELD_NAME]: company.one_list_group_tier?.id,
                [ACCOUNT_MANAGER_FIELD_NAME]: globalAccountManager,
                [ONE_LIST_TEAM_FIELD_NAME]: oneListTeam,
              }}
            />
          )
        }
      </Task.Status>
    </DefaultLayout>
  )
}

export default connect(state2props)(EditOneList)
