Feature: View Audit history of a contact
  As an existing user
  I would like to track changes to a contact record over time
  So that I can cross-check the validity and accuracy of a given contact record

  Scenario: View name of the person who made contact record changes

     Given I am an authenticated user on Data Hub website
     And I Amend a existing contact record
     When I search for this Contact record
     And I navigate to Audit History tab
     Then I see the name of the person who made the recent contact record changes

  Scenario: View time stamp when the contact record changes

     Given I am an authenticated user on Data Hub website
     And I Amend a existing contact record (amend phone number)
     When I search for this Contact record
     And I navigate to Audit History tab
     Then I see the date time stamp when the recent contact record changed

  Scenario: View the number of changes occurred on a contact record

     Given I am an authenticated user on Data Hub website
     And I Amend a existing contact record (amend phone number and lastname)
     When I search for this Contact record
     And I navigate to Audit History tab
     Then I see the total number of changes occurred recently on this contact record

  Scenario: View changed field names of a contact record

     Given I am an authenticated user on Data Hub website
     And I Amend a existing contact record (amend phone number)
     When I search for this Contact record
     And I navigate to Audit History tab
     Then I see the total number of changes occurred recently on this contact record
     When I click on the number of changes occurred link/popdown
     Then I see the field names that were recently changed

  Scenario: Changed Contact name not searchable

     Given I am an authenticated user on Data Hub website
     And I Amend a existing contact records first and last name to a new one
     When I search for this contact record using his old first and last name
     Then I verify the search results should not return the user details
     When I search for the contact record using his newly changed first and last name
     Then I verify the search results show the user details
     When I navigate to contacts Audit history tab
     Then I verify the changed first and last name of the contact

  Scenario: View audit log for Archived contact

    Given I am an authenticated user on Data Hub website
    And I archive an existing contact record
    When I search for this Contact record
    And I navigate to Audit History tab
    Then I see the details who archived the contact

  Scenario: View audit log for UnArchived contact

    Given I am an authenticated user on Data Hub website
    And I unarchive an existing contact record
    When I search for this Contact record
    And I navigate to Audit History tab
    Then I see the details who unarchived the contact
