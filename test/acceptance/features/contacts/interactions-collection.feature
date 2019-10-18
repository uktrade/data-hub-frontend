@contacts-interaction-collection @collection
Feature: View collection of interactions for a contact

  @contacts-interactions-collection--view
  Scenario: View contacts interaction collection

    When I navigate to the `contacts.interactions` page using `contact` `Dean Cox` fixture
    And the results summary for a interaction collection is present
    And I can view the collection
    And the result count should be greater than 0

  @contacts-interactions-collection--filter # TODO

  @contacts-interactions-collection--sort # TODO

  @contacts-interactions-collection--da @da
  Scenario: Navigate to interaction as DA

    When I navigate to the `contacts.interactions` page using `contact` `Johnny Cakeman` fixture
    Then I see the 403 error page
