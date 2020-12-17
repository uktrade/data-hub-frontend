var now = new Date()
now.setHours(now.getHours() - 1.1)

var yesterday = new Date()
yesterday.setHours(yesterday.getHours() - 24)

exports.announcement = {
  count: 3,
  next_page: null,
  page: 1,
  page_count: 1,
  per_page: 30,
  previous_page: null,
  articles: [
    {
      id: 360001844497,
      url:
        'https://uktrade.zendesk.com/api/v2/help_center/en-gb/articles/360001844497-Using-Sectors-in-the-Find-Exporters-Tool.json',
      html_url:
        'https://uktrade.zendesk.com/hc/en-gb/articles/360001844497-Using-Sectors-in-the-Find-Exporters-Tool',
      author_id: 7637807865,
      comments_disabled: false,
      draft: false,
      promoted: false,
      position: 0,
      vote_sum: 1,
      vote_count: 1,
      section_id: 360000018069,
      created_at: yesterday,
      updated_at: '2019-06-25T13:54:08.540Z',
      name: 'Using Sectors in the Find Exporters Tool',
      title: 'Using Sectors in the Find Exporters Tool',
      source_locale: 'en-gb',
      locale: 'en-gb',
      outdated: false,
      outdated_locales: [],
      edited_at: '2019-06-25T13:54:08.540Z',
      user_segment_id: null,
      permission_group_id: 258809,
      label_names: [],
      body:
        '\u003cp\u003e\u003cstrong\u003ePsssst… Have you heard about Sectors? \u003c/strong\u003e\u003c/p\u003e\n\u003cp\u003e\u003cspan style="font-weight: 400;"\u003eAs part of our ongoing research into ways that we can improve the DDAT offering to the rest of the department, a common theme arose regarding sectors: sector teams and business teams all operate individual sectors lists. As a result, there is no common understanding of which companies belong to which sectors.\u003c/span\u003e\u003c/p\u003e\n\u003cp\u003e\u003cspan style="font-weight: 400;"\u003eThe DDAT directorate is collaborating with colleagues from across the department to standardise the way that we work with and analyse sectors. This is an all-encompassing body of work, and we are happy to report that it has already yielded early results.\u003c/span\u003e\u003c/p\u003e\n\u003cp\u003e\u003cspan style="font-weight: 400;"\u003eAs part of its ongoing development, the team responsible for the \u003c/span\u003e\u003ca href="https://find-exporters.datahub.trade.gov.uk/"\u003e\u003cspan style="font-weight: 400;"\u003eFind Exporters\u003c/span\u003e\u003c/a\u003e\u003cspan style="font-weight: 400;"\u003e tool have been focussed on adapting it to support the requirements of our sector focussed colleagues. Thanks to your feedback, the tool now contains a ‘sectors’ filter which highlights which companies operate in which DIT sectors. These have currently been mapped to their Standard Industrial Classification codes. \u003c/span\u003e\u003c/p\u003e\n\u003cp\u003e\u003cspan style="font-weight: 400;"\u003eEvery limited company in the UK has a SIC code which indicates the industry to which the majority of the companies’ output belongs. For instance, \u003c/span\u003e\u003ca href="https://www.datahub.trade.gov.uk/companies/ee94ae6d-a098-e211-a939-e4115bead28a"\u003e\u003cspan style="font-weight: 400;"\u003eBroadland Wineries Ltd\u003c/span\u003e\u003c/a\u003e\u003cspan style="font-weight: 400;"\u003e operate in the Food \u0026amp; Drinks sector based on their primary output being wines. \u003c/span\u003e\u003cimg src="https://lh4.googleusercontent.com/8JFUnbDteEEbQgCvHXj0gNGTpSToeJ89DM6srUEFTb40pxEL4Kw2YJIXurnsSObO5D3cCL6Qu1M7xrjSsTyUXO9Ygz6NCGY8gCwt2YJlwPB8pIKcQ48MriV6clBkSV3k_qzOvECx"\u003e\u003c/p\u003e\n\u003cp\u003e\u003cspan style="font-weight: 400;"\u003eAfter speaking to our colleagues in the Sector teams, we came to understand that SIC codes weren’t the natural way that our colleagues would classify businesses. To find a suitable work around this, \u003c/span\u003e\u003cspan style="font-weight: 400;"\u003eour data scientists build a method that learns from the data and expertise that ITAs have filled into DataHub over the years to automatically match all companies with SIC codes to one or more DataHub sectors\u003c/span\u003e\u003cspan style="font-weight: 400;"\u003e. \u003c/span\u003e\u003c/p\u003e\n\u003cp\u003e\u003cspan style="font-weight: 400;"\u003eWhen selected, the filter will show companies that fall within the chosen DIT sector. In some cases, where a company belongs to the supply chain of various DIT sectors, you may notice that it has been designated to more than one DIT sector.\u003c/span\u003e\u003cimg src="https://lh6.googleusercontent.com/Q0PUm7fgNxqR-DzDij5F3yhWpZfaeY-UFqtBQhDjrPhhPjtnttFZTbz-P1wWk1HyaabGiLJEb7_3AbZY-AuUyiNFLs0gF-gxggopDUK4"\u003e\u003c/p\u003e\n\u003cp\u003e\u003cspan style="font-weight: 400;"\u003eThe algorithm uses SIC codes obtained from Companies House data that feeds into the Find Exporters tool. These codes are self-declared by the businesses themselves and may not always reflect how the business is generally perceived. For example, the manufacturer of a popular, luxury snack brand identified themselves as being wholesalers of gift items. If you find any companies in the tool that you feel are not correctly matched to the right DIT sector, please email the \u003c/span\u003e\u003ca href="mailto:datascience@digital.trade.gov.uk"\u003e\u003cspan style="font-weight: 400;"\u003eData Science Team\u003c/span\u003e\u003c/a\u003e\u003cspan style="font-weight: 400;"\u003e so that we can update the matching algorithm.\u003c/span\u003e\u003c/p\u003e\n\u003cp\u003e\u003cspan style="font-weight: 400;"\u003eWe will continue working alongside our colleagues to define a clear understanding of sectors. If you would like to get involved with this research, please email the \u003c/span\u003e\u003ca href="mailto:datahubresearch@digital.trade.gov.uk"\u003e\u003cspan style="font-weight: 400;"\u003eData Hub research team\u003c/span\u003e\u003c/a\u003e\u003cspan style="font-weight: 400;"\u003e and one of our user researchers will get in touch to schedule a session.\u003c/span\u003e\u003c/p\u003e\n\u003cp\u003e\u003cbr\u003e\u003cspan style="font-weight: 400;"\u003eIf you have any additional feedback regarding the tool, please complete this \u003c/span\u003e\u003ca href="https://docs.google.com/forms/d/e/1FAIpQLSc-H72Kx9azBV4NvVTn-EmQ867gAZsVQ0UWEIpmD7Njcpm4BQ/viewform"\u003e\u003cspan style="font-weight: 400;"\u003eform\u003c/span\u003e\u003c/a\u003e\u003cspan style="font-weight: 400;"\u003e. \u003c/span\u003e\u003c/p\u003e',
    },
    {
      id: 360001834238,
      url:
        'https://uktrade.zendesk.com/api/v2/help_center/en-gb/articles/360001834238-Adding-more-activity-to-company-pages.json',
      html_url:
        'https://uktrade.zendesk.com/hc/en-gb/articles/360001834238-Adding-more-activity-to-company-pages',
      author_id: 8505956889,
      comments_disabled: false,
      draft: false,
      promoted: false,
      position: 0,
      vote_sum: 0,
      vote_count: 0,
      section_id: 360000018069,
      created_at: now,
      updated_at: '2019-06-25T13:54:08.540Z',
      name: 'Adding more activity to company pages',
      title: 'Adding more activity to company pages',
      source_locale: 'en-gb',
      locale: 'en-gb',
      outdated: false,
      outdated_locales: [],
      edited_at: '2019-06-25T13:54:08.540Z',
      user_segment_id: null,
      permission_group_id: 258809,
      label_names: [],
      body:
        '\u003cp\u003e\u003cspan style="font-weight: 400;"\u003eThe Data Hub team want to make it easier for you to get an accurate picture of what a company has been up to.\u003c/span\u003e\u003c/p\u003e\n\u003cp\u003e\u003cspan style="font-weight: 400;"\u003eThat’s why this week we will replace the list of recent interactions that currently appears on company pages with a new list of recent activity. This will continue to show DIT’s most recent interactions with a company, but will also show other recent activity by the company.\u003c/span\u003e\u003c/p\u003e\n\u003cp\u003e\u003cspan style="font-weight: 400;"\u003eInitially, this will include activity related to a company’s investment projects or OMIS orders. Over time we’ll add more types of activity to this list.\u003c/span\u003e\u003c/p\u003e\n\u003cp\u003e\u003cimg src="https://uktrade.zendesk.com/hc/article_attachments/360003111478/Screenshot_of_company_page_with_activity_feed.png" alt="Screenshot_of_company_page_with_activity_feed.png"\u003e\u003c/p\u003e\n\u003cp\u003e\u003cspan style="font-weight: 400;"\u003eWe plan to add information from Companies House, HMRC and the Intellectual Property Office. This will allow us to show when a company has filed its accounts, imported or exported goods, and registered new intellectual property. This information will help you to get a better understanding of a company and its trading potential.\u003c/span\u003e\u003c/p\u003e\n\u003cp\u003e\u003cspan style="font-weight: 400;"\u003eSeeing this recent activity all in one place will mean less time trawling through Data Hub to work out what’s going on, and more time for you to focus on working with businesses.\u003c/span\u003e\u003c/p\u003e',
    },
    {
      id: 360001808498,
      url:
        'https://uktrade.zendesk.com/api/v2/help_center/en-gb/articles/360001808498-Datahub-Survey-Closing-Date-21-June-2019.json',
      html_url:
        'https://uktrade.zendesk.com/hc/en-gb/articles/360001808498-Datahub-Survey-Closing-Date-21-June-2019',
      author_id: 9903012689,
      comments_disabled: true,
      draft: false,
      promoted: false,
      position: 0,
      vote_sum: 0,
      vote_count: 0,
      section_id: 360000018069,
      created_at: now,
      updated_at: '2019-06-25T13:54:08.540Z',
      name: 'Datahub Survey- Closing Date 21 June 2019',
      title: 'Datahub Survey- Closing Date 21 June 2019',
      source_locale: 'en-gb',
      locale: 'en-gb',
      outdated: false,
      outdated_locales: [],
      edited_at: '2019-06-25T13:54:08.540Z',
      user_segment_id: null,
      permission_group_id: 258809,
      label_names: [],
      body:
        '\u003cp\u003eDear Data Hub User,\u003c/p\u003e\n\u003cp\u003eWe would like you to share your experience of using Data Hub. We are continuously working to improve the service and we would like your feedback.\u003cbr\u003ePlease take the time to complete a two minute survey. Your response will be anonymous.\u003c/p\u003e\n\u003cp\u003eThe survey will close on 21 June 2019. Please click on the link below.\u003c/p\u003e\n\u003cp\u003e\u003ca href="https://eur02.safelinks.protection.outlook.com/?url=https%3A%2F%2Fditresearch.eu.qualtrics.com%2Fjfe%2Fform%2FSV_5ub2ocWjlpCosS1\u0026amp;data=02%7C01%7Cjonathan.lilley%40trade.gov.uk%7C6253d94c38144a7529a908d6ea832b22%7C8fa217ec33aa46fbad96dfe68006bb86%7C0%7C0%7C636954246422415815\u0026amp;sdata=r6yQGktmyINrDqO3h%2B%2FP1N5VlNUXv%2B9pYYkztneA%2BJI%3D\u0026amp;reserved=0" target="_self"\u003eDatahub Experience Survey\u003c/a\u003e\u003c/p\u003e\n\u003cp\u003e \u003c/p\u003e\n\u003cp\u003e \u003c/p\u003e\n\u003cp\u003e \u003c/p\u003e',
    },
  ],
  sort_by: 'position',
  sort_order: 'asc',
}

exports.emptyAnnouncement = {
  count: 0,
  next_page: null,
  page: 1,
  page_count: 1,
  per_page: 30,
  previous_page: null,
  articles: [],
  sort_by: 'position',
  sort_order: 'asc',
}
