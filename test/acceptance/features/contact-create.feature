@contact-create
Feature: Create New Contact
  As an existing user
  I would like to create a new contact for a company

  @contact-create-option
  Scenario: Verify Add new Contact option
    Given I am an authenticated user on Data Hub website
    When I navigate to Contacts page of any company
    Then I verify an option to add a new contact

  @contact-create-primary
  Scenario: Add a new Primary Contact
    Given I am an authenticated user on Data Hub website
    When I add a new Primary Contact
    Then I see the contact creation confirmation message
    And I verify my newly added contact in company profile

  @contact-create-primary-new-company-address
  Scenario: Add a new Primary Contact with new Company address
    Given I am an authenticated user on Data Hub website
    When I add a new Primary Contact with a new company address
    Then I see the contact creation confirmation message
    And I verify my newly added contact in company profile

  @contact-create-non-primary
  Scenario: Add a new non-Primary Contact
    Given I am an authenticated user on Data Hub website
    When I add a new non Primary Contact
    Then I see the contact creation confirmation message
    And I verify my newly added contact in company profile

  @contact-create-verify
  Scenario: Verify newly added contact under search landing page
    Given I am an authenticated user on Data Hub website
    When I add a new Primary Contact
    Then I see the contact creation confirmation message
    And I verify my newly added contact under search landing page

