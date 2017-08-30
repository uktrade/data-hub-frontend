@collections-contact
Feature: View Collection of contacts
  As an existing user
  I would like to view all the Contacts in one place
  And be able to read the contact details as expected

  @collections-contact-name
  Scenario: View first and last name of contact under collections

    Given I am an authenticated user on Data Hub website
    And I create a new contact
    When I search for this Contact name
    Then I view a contacts tab
    When I click on contacts tab
    Then I see first and last name of the contact

  @collections-contact-company
  Scenario: View company name of contact under collections

    Given I am an authenticated user on Data Hub website
    And I create a new contact
    When I search for this Contact name
    Then I view a contacts tab
    When I click on contacts tab
    Then I see Company name of the contact

  @collections-contact-sector
  Scenario: View sector of contact under collections

    Given I am an authenticated user on Data Hub website
    And I create a new contact
    When I search for this Contact name
    Then I view a contacts tab
    When I click on contacts tab
    Then I see Sector of the contact

  @collections-contact-country
  Scenario: View country of contact under collections

    Given I am an authenticated user on Data Hub website
    And I create a new contact
    When I search for this Contact name
    Then I view a contacts tab
    When I click on contacts tab
    Then I see Country of the contact

  @collections-contact-timestamp
  Scenario: View time stamp of contact under collections

    Given I am an authenticated user on Data Hub website
    And I create a new contact
    When I search for this Contact name
    Then I view a contacts tab
    When I click on contacts tab
    Then I see a time stamp of the contact

  @collections-contact-primary
  Scenario: View primary status of contact under collections

    Given I am an authenticated user on Data Hub website
    And I create a new contact
    When I search for this Contact name
    Then I view a contacts tab
    When I click on contacts tab
    Then I see Primary or not status of the contact

  @collections-contact-link
  Scenario: Verify link to contact details page

    Given I am an authenticated user on Data Hub website
    And I create a new contact
    When I search for this Contact name
    Then I view a contacts tab
    When I click on contacts tab
    When I click on the first contact collection link
    Then I navigate to his contact details page

  @collections-contact-address-same-as-company
  Scenario: Verify contact with same address as company

    Given I am an authenticated user on Data Hub website
    And I create a new contact with same address as company
    When I search for this Contact name
    Then I view a contacts tab
    When I click on contacts tab
    Then I see Country of the contact same as the company

  @collections-contact-all
  Scenario: View Collection of contacts

    Given I am an authenticated user on Data Hub website
    And I create a new contact
    When I search for this Contact name
    Then I view a contacts tab
    When I click on contacts tab
    Then I see first and last name of the contact
    And I see Company name of the contact
    And I see Sector of the contact
    And I see Country of the contact
    And I see a time stamp of the contact
    And I see Primary or not status of the contact
    And I logout of Data Hub website
