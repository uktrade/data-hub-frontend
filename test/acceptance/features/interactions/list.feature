@interactions-list
Feature: View collection of interactions
  As an existing user
  I would like to view all the Interactions in one place
  And be able to read the interaction details as expected

  @interactions-list--browse
  Scenario: Browse to interactions from dashboard

    Given the interactionsAndServices link in the global nav is clicked
    Then the interaction list is displayed

  @interactions-list--name @ignore
  Scenario: View first and last name of interacted contact

    Given I add a new Business card interaction
    When I navigate to interactions collections
    Then I view the first and last name of the contact involved in the interaction

  @interactions-list--subject @ignore
  Scenario: View subject line of interaction

    Given I add a new Business card interaction
    When I navigate to interactions collections
    Then I view the subject line of the interaction

  @interactions-list--datestamp @ignore
  Scenario: View date of interaction

    Given I add a new Business card interaction
    When I navigate to interactions collections
    Then the date of the interaction is as expected

  @interactions-list--company @ignore
  Scenario: View company name of interaction

    Given I add a new Business card interaction
    When I navigate to interactions collections
    Then I view the company name of the interaction

  @interactions-list--link @ignore
  Scenario: Verify link to interaction details page

    Given I add a new Business card interaction
    When I navigate to interactions collections
    Then I view the subject line of the interaction
    Then clicking the interaction name takes me to the interaction details page
