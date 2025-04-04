import React from 'react'
import { connect } from 'react-redux'
import { GridRow, GridCol } from 'govuk-react'
import { useNavigate, useParams } from 'react-router-dom'
import qs from 'qs'

import { TASK_GET_CONTACT_ACTIVITIES, ID, state2props } from './state'
import { CONTACTS__ACTIVITIES_LOADED } from '../../../actions'
import Task from '../../../components/Task'
import {
  CollectionHeader,
  CollectionList,
  CollectionSort,
  RoutedPagination,
  SectionHeader,
} from '../../../components'
import ContactLayout from '../../../components/Layout/ContactLayout'
import { ContactResource } from '../../../components/Resource'
import { ItemTemplate } from '../../Companies/CompanyActivity'

const ContactActivity = ({ results, count }) => {
  const { contactId } = useParams()

  const totalPages = Math.ceil(count / 10)
  const qsParams = qs.parse(location.search.slice(1))
  const page = parseInt(qsParams.page, 10) || 1
  const navigate = useNavigate()

  return (
    <ContactLayout contactId={contactId}>
      <ContactResource id={contactId}>
        {(contact) => (
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
                  payload: { page, contact: contact.id },
                  onSuccessDispatch: CONTACTS__ACTIVITIES_LOADED,
                }}
              >
                {() =>
                  results && (
                    <div data-test="collection-list">
                      <CollectionHeader
                        totalItems={count}
                        collectionName="activity"
                        data-test="collection-header"
                      />
                      <CollectionSort
                        totalPages={totalPages}
                        shouldPluralize={false}
                      />
                      <CollectionList
                        items={results}
                        collectionItemTemplate={ItemTemplate}
                        showTagsInMetadata={true}
                        onPageClick={(currentPage) =>
                          navigate({
                            search: qs.stringify({
                              ...qsParams,
                              page: currentPage,
                            }),
                          })
                        }
                      />
                      <RoutedPagination initialPage={page} items={count || 0} />
                    </div>
                  )
                }
              </Task.Status>
            </GridCol>
          </GridRow>
        )}
      </ContactResource>
    </ContactLayout>
  )
}

export default connect(state2props)(ContactActivity)
