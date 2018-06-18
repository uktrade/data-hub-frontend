@companies-heirarchies @heirarchies
Feature: Company details

@companies-heirarchies-set-hq
  Scenario: Set a company to a Global HQ
    When I navigate to the `companies.fixture` page using `company` `Lambda plc` fixture
    Then I click the "Edit company details" link
    And I change "headquarter_type" radio button option to "Global HQ"
    And I submit the form
    Then I see the success message

@companies-heirarchies-link
  Scenario: Add a subsidiary

    When I navigate to the `companies.fixture` page using `company` `Lambda plc` fixture
    Then I click the "Subsidiaries" link
    Then I click the "Link a subsidiary" link
    And I change form text field "term" to Mars
    And I submit the form
    And I choose the first item in the collection
    Then I see the success message

@companies-heirarchies-details

  Scenario: View subsidiaries
    When I navigate to the `companies.fixture` page using `company` `Lambda plc` fixture
    Then I click the "Subsidiaries" link
    And I can view the collection

@companies-heirarchies-remove-subsidiary
  Scenario: Remove a subsidiary
    When I navigate to the `companies.fixture` page using `company` `Lambda plc` fixture
    Then I click the "Subsidiaries" link
    And I click the "Remove subsidiary" link
    Then I see the success message

@companies-heirarchies-teardown
  Scenario: Company can be set back to 'not a headquarters' again
    When I navigate to the `companies.fixture` page using `company` `Lambda plc` fixture
    Then I click the "Edit company details" link
    And I change "headquarter_type" radio button option to "Not a headquarters"
    And I submit the form
    Then I see the success message
