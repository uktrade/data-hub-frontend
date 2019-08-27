@contacts-save
Feature: Create New Contact
  As a data hub user
  I would like to add a contact to data hub
  So that I can collect contact data

  @contacts-save--primary-new-company-address
  Scenario: Add a new primary contact with new company address
    When I navigate to the `companies.contacts` page using `company` `Lambda plc` fixture
    And I click the "Add contact" link
    Then there are contact fields
    When a primary contact with new company address is added
    And I submit the form
    Then I see the success message
    Then the Contact details key value details are displayed
      | key                   | value                                |
      | Job title             | contact.jobTitle                     |
      | Phone number          | contact.primaryPhoneNumber           |
      | Alternative telephone | contact.alternativePhoneNumber       |
      | Address               | contact.address                      |
      | Email                 | contact.emailAddress                 |
      | Alternative email     | contact.alternativeEmail             |
      | Notes                 | contact.notes                        |
      | Email marketing       | contact.acceptsEmailMarketingFromDit |
