import React from 'react'
import { connect } from 'react-redux'
import Task from '../../../components/Task'

const EventAventriAttendees = () => {
  return (
    <h1>Hello there</h1>
    // <CheckUserFeatureFlag userFeatureFlagName={CONTACT_ACTIVITY_FEATURE_FLAG}>
    //   {(isFeatureFlagEnabled) =>
    //     isFeatureFlagEnabled && (
    //       <Task.Status
    //       // task stuff
    //       >
    //         {() => {
    //           return (
    //             <GridRow data-test="eventAventriDetails">
    //               <GridCol setWidth="one-quarter">
    //                 <LocalNav data-test="event-aventri-details-nav">
    //                   <LocalNavLink
    //                     data-test="event-aventri-details-link"
    //                     href={urls.events.aventri.details(aventriEventId)}
    //                   >
    //                     Details
    //                   </LocalNavLink>
    //                 </LocalNav>
    //               </GridCol>
    //               <GridCol setWidth="three-quarters">
    //                 <StyledSummaryTable>
    //                   <SummaryTable.Row
    //                     heading="Type of event"
    //                     children={type}
    //                   />
    //                   <SummaryTable.Row
    //                     heading="Event date"
    //                     children={eventDate}
    //                   />
    //                   <SummaryTable.Row
    //                     heading="Event location type"
    //                     children={isEmpty(location) ? 'Not set' : location}
    //                   />
    //                   <SummaryTable.Row
    //                     heading="Address"
    //                     children={
    //                       isEmpty(fullAddress) ? 'Not set' : fullAddress
    //                     }
    //                   />
    //                 </StyledSummaryTable>
    //               </GridCol>
    //             </GridRow>
    //           )
    //         }}
    //       </Task.Status>
    //     )
    //   }
    // </CheckUserFeatureFlag>
  )
}

// export default connect(state2props)(EventAventriAttendees)
export default EventAventriAttendees
