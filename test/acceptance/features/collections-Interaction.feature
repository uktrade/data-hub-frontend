@collections-interaction
Feature: View collection of interactions
  As an existing user
  I would like to view all the Interactions in one place
  And be able to read the interaction details as expected

  Background:
    Given I am an authenticated user on the data hub website

  @collections-interaction-name
  Scenario: View first and last name of interacted contact

    When I add a new Business card interaction
    And I navigate to interactions collections
    Then I view the first and last name of the contact involved in the interaction


  @collections-interaction-subject
  Scenario: View subject line of interaction

    When I add a new Business card interaction
    And I navigate to interactions collections
    Then I view the subject line of the interaction


  @collections-interaction-datestamp
  Scenario: View date of interaction

    When I add a new Business card interaction
    And I navigate to interactions collections
    Then the date of the interaction is as expected

  @collections-interaction-company
  Scenario: View company name of interaction

    When I add a new Business card interaction
    And I navigate to interactions collections
    Then I view the company name of the interaction


  @collections-interaction-link
  Scenario: Verify link to interaction details page

    When I add a new Business card interaction
    And I navigate to interactions collections
    Then I view the subject line of the interaction
    Then clicking the interaction name takes me to the interaction details page
