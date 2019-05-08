@interaction-add-and-filter-collection-of-interactions
Feature: Add interaction and view collection of interactions
  As an existing user
  I would like to add an interaction
  And have the ability to filter a collection of interactions 
  So that I can easily find and read my newly created interaction details

  @add-and-view-export-interaction
  Scenario: Add and view interaction in interactions and services collection
    When I navigate to the `companies.interactions` page using `company` `Venus Ltd` fixture
    And I click the "Add interaction" link
    And I select export interaction
    When an interaction is added
      | key      | value                 |
    Then I see the success message
    When I navigate to the `interactions.list` page
    Then I confirm I am on the Interactions page
    And the results summary for a interaction collection is present
    Then I filter the collections to view the Interaction I have just created
    And I can view the interaction in the collection
      | text    | expected               |
      | Contact | contact.heading        |
      | Company | company.name           |
      | Date    | interaction.date       |
      | Adviser | interaction.ditAdviser |
    And the Interaction has badges
      | text    | expected               |
      | Type    | interaction.type       |

  @add-and-view-export-service-delivery
  Scenario: Add and view interaction in interactions and services collection
    When I navigate to the `companies.interactions` page using `company` `Venus Ltd` fixture
    And I click the "Add interaction" link
    And I select export service delivery
    And a service delivery is added
      | key             | value          |
    Then I see the success message
    When I navigate to the `interactions.list` page
    Then I confirm I am on the Interactions page
    And the results summary for a interaction collection is present
    Then I filter the collections to view the Service Delivery I have just created
    And I can view the interaction in the collection
      | text    | expected               |
      | Contact | contact.heading        |
      | Company | company.name           |
      | Date    | interaction.date       |
      | Adviser | interaction.ditAdviser |
    And the Interaction has badges
      | text    | expected               |
      | Type    | interaction.type       |

