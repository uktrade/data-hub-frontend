@interactions-collection
Feature: View collection of contacts
  As an existing user
  I would like to view all the interactions in one place
  And be able to read the interaction details as expected

  @interactions-collection--view-interaction
  Scenario: View interaction in interactions and services collection

    Given a company is created
    When navigating to the company contacts
    And a primary contact is added
    And navigating to the create company interactions and services step 1 page
    And selecting interaction
    And adding an interaction
    Then I see the success message
    When I navigate to the Interactions and services collection page
    Then there are Interactions headings
    And I can view the Interaction in the collection for interactions and services
      | label   | statePath              |
      | Contact | contact.header         |
      | Company | company.name           |
      | Date    |                        |
      | Adviser | interaction.ditAdviser |
    And the Interaction has badges for interactions and services
      | text |
      | Type |
      | text |
      | Type |
