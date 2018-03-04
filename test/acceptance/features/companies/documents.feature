@companies-documents @details
Feature: Company documents

  @companies-documents--document-link
  Scenario: Company has documents

    When I navigate to the `companies.Fixture` page using `company` `Venus Ltd` fixture
    And I click the Documents local nav link
    Then view should contain the Documents link

  @companies-documents--no-document-link
  Scenario: Company does not have documents

    When I navigate to the `companies.Fixture` page using `company` `Lambda plc` fixture
    When I click the Documents local nav link
    Then view should not contain the Documents link

  @companies-documents--lep @lep
  Scenario: Navigate to documents as LEP

    When I navigate to the `companies.Documents` page using `company` `Lambda plc` fixture
    Then I see the 403 error page

  @companies-documents--da @da
  Scenario: Navigate to documents as DA

    When I navigate to the `companies.Documents` page using `company` `Lambda plc` fixture
    Then I see the 403 error page
