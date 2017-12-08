@interactions-collection @collection
Feature: View collection of contacts
  As an existing user
  I would like to view all the interactions in one place
  And be able to read the interaction details as expected

  @interactions-collection--view-interaction
  Scenario: View interaction in interactions and services collection

    Given a company is created
    When I navigate to the company "Contacts" tab
    And I click the "Add contact" link
    And a primary contact is added
    When I submit the form
    Then I see the success message
    Then I wait and then refresh the page
    When I navigate to the company "Interactions" tab
    And I click the "Add interaction" link
    And selecting interaction
    And an interaction is added
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
    When I navigate to the company "Contacts" tab
    And I click the "Add contact" link
    And a primary contact is added
    When I submit the form
    Then I see the success message
    Then I wait and then refresh the page
    When I navigate to the company "Interactions" tab
    And I click the "Add interaction" link
    And selecting service delivery
    And a service delivery is added
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
