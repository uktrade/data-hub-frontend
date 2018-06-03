@proposition-add
Feature: Add a new proposition in Data hub

  @proposition-add--proposition-submit
  Scenario: Companies proposition is saved

    When I navigate to the `investments.propositions` page using `investmentProject` `New hotel (commitment to invest)` fixture
    And I click the "Add proposition" link
    Then there are proposition fields
    When a proposition is added
      | key                      | value                                    |
    Then I see the success message
    And the results summary for a proposition collection is present