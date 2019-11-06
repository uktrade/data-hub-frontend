@contacts-interaction-collection @collection
Feature: View collection of interactions for a contact

  @contacts-interactions-collection--view
  Scenario: View contacts interaction collection

    When I navigate to the `contacts.interactions` page using `contact` `Dean Cox` fixture
    And the results summary for a interaction collection is present
    And I can view the collection
    And the result count should be greater than 0
