@companies-edit @edit
Feature: Company details

  @companies-edit--headquarters
  Scenario: Update company headquarters

    When I navigate to the `companies.list` page
    And I choose the first item in the collection

    When I click the Company summary edit button
    When I change "headquarter_type" radio button option to "Not a headquarters"
    And I submit the form
    Then I see the success message
    And details view data for "Headquarter type" should contain "Not a headquarters"

    When I click the Company summary edit button
    When I change "headquarter_type" radio button option to "European HQ"
    And I submit the form
    Then I see the success message
    And details view data for "Headquarter type" should contain "European HQ"

    When I click the Company summary edit button
    When I change "headquarter_type" radio button option to "UK HQ"
    And I submit the form
    Then I see the success message
    And details view data for "Headquarter type" should contain "UK HQ"

    When I click the Company summary edit button
    When I change "headquarter_type" radio button option to "Global HQ"
    And I submit the form
    Then I see the success message
    And details view data for "Headquarter type" should contain "Global HQ"

  @companies-edit--one-list
  Scenario: Update one list company

    When I navigate to the `companies.fixture` page using `company` `One List Corp` fixture
    When I click the Global headquarters summary edit button
    Then I cannot see the field "headquarter_type"
    And I cannot see the field "sector"

  # TODO add more editing and viewing in details work
