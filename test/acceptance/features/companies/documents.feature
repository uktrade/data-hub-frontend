@companies-documents @details
Feature: Company documents

  @companies-documents--lep @lep
  Scenario: Navigate to documents as LEP
    When I navigate to the `companies.documents` page using `company` `Lambda plc` fixture
    Then I see the 403 error page

  @companies-documents--da @da
  Scenario: Navigate to documents as DA
    When I navigate to the `companies.documents` page using `company` `Lambda plc` fixture
    Then I see the 403 error page
