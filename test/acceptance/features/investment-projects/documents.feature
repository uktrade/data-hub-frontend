@investment-projects-documents @details
Feature: Investment project documents

  @investment-projects-documents--da @da
  Scenario: Navigate to documents as DA
    When I navigate to the `investments.documents` page using `investment project` `New golf course (DA)` fixture
    Then I see the 403 error page
