import React from 'react'
import { connect } from 'react-redux'
import { GridRow, GridCol } from 'govuk-react'

import { TASK_GET_CONTACT_ACTIVITIES, ID, state2props } from './state'
import { CONTACTS__ACTIVITIES_LOADED } from '../../../actions'
import Task from '../../../components/Task'
import Activity from '../../../components/ActivityFeed/Activity'
import {
  CollectionHeader,
  CollectionSort,
  RoutedPagination,
  SectionHeader,
} from '../../../components'
import { ACTIVITIES_PER_PAGE } from '../../../../apps/contacts/constants'
import { CONTACT_ACTIVITY_SORT_SELECT_OPTIONS } from '../../../../apps/companies/apps/activity-feed/constants'
import ActivityList from '../../../components/ActivityFeed/activities/card/ActivityList'
import ContactLayout from '../../../components/Layout/ContactLayout'
import { ContactResource } from '../../../components/Resource'

const ContactActivity = ({
  contactId,
  activities,
  total,
  page = 1,
  selectedSortBy,
  permissions,
}) => {
  const totalPages = Math.ceil(total / ACTIVITIES_PER_PAGE)

  return (
    <ContactResource id={contactId}>
      {(contact) => (
        <ContactLayout contact={contact} permissions={permissions}>
          <GridRow>
            <GridCol setWidth="full">
              <SectionHeader type="contact-activity">
                Contact activity
              </SectionHeader>

              <p>
                An activity could include a meeting, call, email, event or other
                interactions where you have been in touch with a contact or
                provided a service.
              </p>
              <Task.Status
                name={TASK_GET_CONTACT_ACTIVITIES}
                id={ID}
                progressMessage="Loading contact activities"
                startOnRender={{
                  payload: { contactId, page, selectedSortBy },
                  onSuccessDispatch: CONTACTS__ACTIVITIES_LOADED,
                }}
              >
                {() =>
                  activities && (
                    <>
                      <CollectionHeader
                        totalItems={total}
                        collectionName="activity"
                        data-test="collection-header"
                      />
                      <CollectionSort
                        sortOptions={CONTACT_ACTIVITY_SORT_SELECT_OPTIONS}
                        totalPages={totalPages}
                      />
                      <ActivityList>
                        {activities.map((activity, index) => (
                          <li key={`activity-${index}`}>
                            <Activity activity={activity} />
                          </li>
                        ))}
                      </ActivityList>
                      <RoutedPagination initialPage={page} items={total} />
                    </>
                  )
                }
              </Task.Status>
            </GridCol>
          </GridRow>
        </ContactLayout>
      )}
    </ContactResource>
  )
}

export default connect(state2props)(ContactActivity)
