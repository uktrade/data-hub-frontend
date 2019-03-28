@companies-edit @edit
Feature: Company details

  @companies-edit--headquarters
  Scenario: Update company headquarters

    When I navigate to the `companies.business-details` page using `company` `Mars Exports Ltd` fixture

    When I click the Business hierarchy edit button
    When I change "headquarter_type" radio button option to "Not a headquarters"
    And I submit the form
    Then I see the success message
    And details view data for "Global HQ" should contain "None"

    When I click the Business hierarchy edit button
    When I change "headquarter_type" radio button option to "European HQ"
    And I submit the form
    Then I see the success message
    And details view data for "Headquarter type" should contain "European HQ"

    When I click the Business hierarchy edit button
    When I change "headquarter_type" radio button option to "UK HQ"
    And I submit the form
    Then I see the success message
    And details view data for "Headquarter type" should contain "UK HQ"

    When I click the Business hierarchy edit button
    When I change "headquarter_type" radio button option to "Global HQ"
    And I submit the form
    Then I see the success message
    And details view data for "Headquarter type" should contain "Global HQ"

  @companies-edit--archived-company
  Scenario: Archived company without Edit company details button

    When I navigate to the `companies.details` page using `company` `Archived Ltd` fixture
    And I should not see the "Edit company details" button

  # TODO add more editing and viewing in details work
