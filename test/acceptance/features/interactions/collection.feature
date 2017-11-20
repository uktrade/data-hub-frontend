@interactions-collection @collection
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
    Then I confirm I am on the Interactions page
    And the results count header for interactions is present
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

    Given a company is created
    When navigating to the company contacts
    And a primary contact is added
    And navigating to the create company interactions and services step 1 page
    And selecting service delivery
    And adding a service delivery
    Then I see the success message
    When I navigate to the Interactions and services collection page
    Then I confirm I am on the Interactions page
    And the results count header for interactions is present
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
