@event-attendees
Feature: Event attendees

@event-attendees--collection-list
Scenario: Event lists attendees
  When I navigate to the `events.attendees` page using `event` `Grand exhibition` fixture
  And the results summary for an attendee collection is present
  And I can view the collection
