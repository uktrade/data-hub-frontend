@contact-local-nav  @details
Feature: Contact local nav

  @contact-local-nav--staff
  Scenario: Contact local nav as DIT staff
    When I navigate to the `contacts.fixture` page using `contact` `Johnny Cakeman` fixture
    Then there should be a local nav
      | text                        |
      | Details                     |
      | Interactions                |
      | Audit history               |
      | Documents                   |
