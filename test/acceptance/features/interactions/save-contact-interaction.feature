@save-contact-interaction
Feature: Create New Contact Interaction
  As an existing user
  I would like to save a new Interaction for a company contact

  Background:
    Given I am an authenticated user on the data hub website
    And I navigate to contact interactions

  @save-contact-interaction--add-email
  Scenario: Add an email interaction from a contact
    And I click on the "Add interaction" button
    And I select the "A standard interaction" radio option
    Then I click the "Continue" button
    And I change form dropdown "dit_team" to "A"
    And I change "service" to "A"
    And I change form text field "subject" to "Test subject"
    And I change form text field "notes" to "Test notes"
    And I change form dropdown "communication_channel" to "Email/Website"
    Then I submit the form
    Then details view should contain a company
    And details should contain a contact
    And details view data for "Service provider" should contain "A"
    And details view data for "Service" should contain "A"
    And details view data for "Subject" should contain "Test subject"
    And details view data for "Notes" should contain "Test notes"
    And details view data for "DIT adviser" should contain "QA"
    And details view data for "Communication channel" should contain "Email/Website"

  @save-contact-interaction--show-error
  Scenario: Add an email interaction from a contact
    And I click on the "Add interaction" button
    And I select the "A standard interaction" radio option
    Then I click the "Continue" button
    And I change form dropdown "dit_team" to "A"
    And I change "service" to "A"
    And I change form text field "notes" to "Test notes"
    And I change form dropdown "communication_channel" to "Email/Website"
    Then I submit the form
    Then I see form error summary
    And I verify the form field "subject" has an error


  @save-contact-interaction--adds-interaction-to-contact
  Scenario: Add an email interaction from a contact
    When I navigate to the Interactions page for "David Clarke" at "AT&T"
    Then I add an "Email/Website" interaction with subject "Test For List"
    And I navigate to the Interactions page for "David Clarke" at "AT&T"
    Then the first item in the list has a "subject" containing "Test For List"
