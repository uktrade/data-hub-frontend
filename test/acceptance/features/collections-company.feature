@collections-company
Feature: View collection of company
  As an existing user
  I would like to view all the companies in one place
  And be able to read the company details as expected

  @collections-company-name
  Scenario: View company name under collections

     Given I am an authenticated user on Data Hub website
     When I create a new company
     When I search for this company name
     Then I see company name in the list


  @collections-company-sector
  Scenario: View sector of company under collections

     Given I am an authenticated user on Data Hub website
     And I create a new company
     When I search for this company name
     Then I see sector of the company in the list

  @collections-company-region
  Scenario: View region of UK based company under collections

     Given I am an authenticated user on Data Hub website
     And I create a new company based in UK
     When I search for this company name
     Then I see region of the company in the list

  @collections-company-trading-address
  Scenario: View trading address under collections

     Given I am an authenticated user on Data Hub website
     And I create a new company
     When I search for this company name
     Then I see trading address of the company in the list

  @collections-company-primary-address
  Scenario: View primary address under collections

     Given I am an authenticated user on Data Hub website
     And I create a new company
     When I search for this company name
     Then I see primary address of the company in the list

  @collections-company-link
  Scenario: Verify link to company details page

     Given I am an authenticated user on Data Hub website
     And I create a new company
     When I search for this company name
     And I click on the first company name link
     Then I navigate to this company details page
