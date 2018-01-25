@interactions-collection @collection
Feature: View collection of interactions
  As an existing user
  I would like to view all the interactions in one place
  And be able to read the interaction details as expected

  @interactions-collection--view-interaction
  Scenario: View interaction in interactions and services collection

    Given I navigate to company fixture Venus Ltd
    When I click the Interactions local nav link
    And I click the "Add interaction" link
    And selecting interaction
    And an interaction is added
    Then I see the success message
    When I navigate to the Interactions and service collection page
    Then I confirm I am on the Interactions page
    And the results summary for a interaction collection is present
    Then I filter the collections to view the Interaction I have just created
    And I can view the Interaction in the collection
      | text    | expected               |
      | Contact | contact.heading        |
      | Company | company.name           |
      | Date    | interaction.date       |
      | Adviser | interaction.ditAdviser |
    And the Interaction has badges
      | text    | expected               |
      | Type    | interaction.type       |

  @interactions-collection--view-service-delivery
  Scenario: View service delivery in interactions and services collection

    Given I navigate to company fixture Venus Ltd
    When I click the Interactions local nav link
    And I click the "Add interaction" link
    And selecting service delivery
    And a service delivery is added
    Then I see the success message
    When I navigate to the Interactions and service collection page
    Then I confirm I am on the Interactions page
    And the results summary for a interaction collection is present
    Then I filter the collections to view the Service Delivery I have just created
    And I can view the Service delivery in the collection
      | text    | expected                   |
      | Contact | contact.heading            |
      | Company | company.name               |
      | Date    | serviceDelivery.date       |
      | Adviser | serviceDelivery.ditAdviser |
    And the Service delivery has badges
      | text    | expected                   |
      | Type    | serviceDelivery.type       |

  @interactions-collection--filter
  Scenario: filter interaction list

    Given I navigate to company fixture Venus Ltd
    When I click the Interactions local nav link
    And I click the "Add interaction" link
    And selecting interaction
    And an interaction is added
    Then I see the success message
    When I navigate to the Interactions and service collection page
    Then I confirm I am on the Interactions page
    And the results summary for a interaction collection is present
    Then I filter the interactions list by service provider
    Then the interactions should be filtered by service provider

  @interactions-collection--lep @lep
  Scenario: Navigate to interactions shows 403 for LEPs

    Given I navigate directly to /interactions
    Then I see the 403 error page

  @interactions-collection--da @da
  Scenario: Navigate to interactions shows 403 for DAs

    Given I navigate directly to /interactions
    Then I see the 403 error page
