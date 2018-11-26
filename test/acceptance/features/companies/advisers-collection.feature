@companies-advisers-collection @collection
Feature: View advisers for a company

  @companies-advisers-collection--ghq-one-list
  Scenario: View advisers for a GHQ on the One List

    When I navigate to the `companies.advisers` page using `company` `One List Corp` fixture
    Then details content heading should contain "Advisers on the core team"
    And the data details 1 are displayed
      | Team                                            | Location   | Global Account Manager |
      | IST - Sector Advisory Services                  | London	   | Travis Greene          |
    And the data details 2 are displayed
      | Team                                            | Location   | Adviser on core team   |
      | Heart of the South West LEP                     | South West | Holly Collins          |
      | IG - Specialists - Knowledge Intensive Industry | London	   | Jenny Carey            |
