@proposition-complete
Feature: Complete a proposition from a propositions list
  As an existing user
  I would like to complete a proposition from a propositions list

  @proposition-complete--view-propositions
  Scenario: View proposition in investment propositions list

    When I navigate to the `investments.propositions` page using `investmentProject` `New hotel (commitment to invest)` fixture
    And I click the "Add proposition" link
    When a proposition is added
      | key      | value                 |
    Then I see the success message