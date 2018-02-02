@omis-collection
Feature: OMIS collection

  @omis-collection--lep @lep
  Scenario: Navigate to OMIS shows 403 for LEPs

    When I navigate to the `omis.List` page
    Then I see the 403 error page
