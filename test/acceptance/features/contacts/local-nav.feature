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

  @contact-local-nav--lep @lep
  Scenario: Contact local nav as LEP
    When I navigate to the `contacts.fixture` page using `contact` `Johnny Cakeman` fixture
    Then there should be a local nav
      | text                        |
      | Details                     |
      | Audit history               |

  @contact-local-nav--da @da
  Scenario: Contact local nav as DA
    When I navigate to the `contacts.fixture` page using `contact` `Johnny Cakeman` fixture
    Then there should be a local nav
      | text                        |
      | Details                     |
      | Audit history               |
