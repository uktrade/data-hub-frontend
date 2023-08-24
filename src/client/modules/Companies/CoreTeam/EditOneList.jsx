import React, { useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'

import { TASK_SAVE_ONE_LIST_DETAILS } from './state'

import {
  NONE,
  ACCOUNT_MANAGER_FIELD_NAME,
  ONE_LIST_TEAM_FIELD_NAME,
  TIER_FIELD_NAME,
} from './constants'
import {
  DefaultLayout,
  FieldAdvisersTypeahead,
  FieldRadios,
  Form,
  FormLayout,
  Step,
} from '../../../components'
import urls from '../../../../lib/urls'
import { FORM_LAYOUT } from '../../../../common/constants'
import {
  CompanyOneListTeamResource,
  CompanyResource,
  OneListTiersResource,
} from '../../../components/Resource'
import { buildCompanyBreadcrumbs } from '../utils'
import Effect from '../../../components/Effect'
import {
  parseAdviserData,
  parseTeamMembers,
  transformOneListTiers,
} from './transformers'

function useQuery() {
  const { search } = useLocation()

  return React.useMemo(() => new URLSearchParams(search), [search])
}

const EditOneListForm = ({
  company,
  oneListTiers,
  formInitialValues,
  returnUrl,
}) => (
  <Form
    id="edit-one-list"
    name={TASK_SAVE_ONE_LIST_DETAILS}
    initialValues={formInitialValues}
    submissionTaskName={TASK_SAVE_ONE_LIST_DETAILS}
    analyticsFormName="editOneList"
    transformPayload={(values) => ({ values, companyId: company.id })}
    redirectTo={() =>
      returnUrl ? returnUrl : urls.companies.businessDetails(company.id)
    }
    flashMessage={() => 'One List information has been updated.'}
    showStepInUrl={true}
  >
    {({ values }) => (
      <>
        {/* TODO if there is a request to skip the first step, but company is missing a one list tier, need to show the first step */}

        <Step name="oneListTier">
          <FieldRadios
            label="Company One List tier"
            name={TIER_FIELD_NAME}
            options={oneListTiers}
            required="Select a company One List tier"
          />
        </Step>

        {values.one_list_tier !== NONE && (
          <FormLayout setWidth={FORM_LAYOUT.THREE_QUARTERS}>
            <Step name="oneListAdvisers">
              <FieldAdvisersTypeahead
                name={ACCOUNT_MANAGER_FIELD_NAME}
                label="Global Account Manager"
                required="Select at least one adviser"
              />
              <FieldAdvisersTypeahead
                name={ONE_LIST_TEAM_FIELD_NAME}
                label="Advisers on the core team (optional)"
                isMulti={true}
              />
            </Step>
          </FormLayout>
        )}
      </>
    )}
  </Form>
)

const EditOneList = ({}) => {
  const { companyId } = useParams()
  const query = useQuery()
  const returnUrl = query.get('returnUrl')

  const [oneListTeam, setOneListTeam] = useState(undefined)
  const [company, setCompany] = useState(undefined)
  const [oneListTiers, setOneListTiers] = useState(undefined)

  return (
    <DefaultLayout
      pageTitle={`Add or edit ${company && company.name} One List information`}
      heading={`Add or edit ${company && company.name} One List information`}
      breadcrumbs={
        company
          ? buildCompanyBreadcrumbs(
              [{ text: 'Edit One List information' }],
              company.id,
              company.name
            )
          : []
      }
      useReactRouter={false}
    >
      <CompanyOneListTeamResource id={companyId}>
        {(oneListTeam) => (
          <Effect
            dependencyList={[]}
            effect={() => setOneListTeam(oneListTeam)}
          />
        )}
      </CompanyOneListTeamResource>
      <OneListTiersResource>
        {(tiers) => (
          <Effect
            dependencyList={[]}
            effect={() => setOneListTiers(transformOneListTiers(tiers))}
          />
        )}
      </OneListTiersResource>
      <CompanyResource id={companyId}>
        {(company) => (
          <Effect dependencyList={[]} effect={() => setCompany(company)} />
        )}
      </CompanyResource>
      {company && oneListTeam && oneListTiers && (
        <EditOneListForm
          company={company}
          returnUrl={returnUrl}
          oneListTiers={oneListTiers}
          formInitialValues={{
            [TIER_FIELD_NAME]: company.oneListGroupTier?.id,
            [ACCOUNT_MANAGER_FIELD_NAME]:
              company.oneListGroupGlobalAccountManager &&
              parseAdviserData(company.oneListGroupGlobalAccountManager),
            [ONE_LIST_TEAM_FIELD_NAME]: parseTeamMembers(oneListTeam),
          }}
        />
      )}
    </DefaultLayout>
  )
}

export default EditOneList
