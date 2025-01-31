import { transformResponeToStovaEventDetails } from './transformers'

export const getStovaEventDetails = () => {
  return Promise.resolve(
    transformResponeToStovaEventDetails({
      stova_event_id: 2367,
      url: 'https://simmons.net/',
      city: 'Lake William',
      code: '12345',
      name: 'why',
      state: 'Montana',
      country: 'Canada',
      max_reg: 1561,
      end_date: '2024-10-08 10:48:36.204478+00:00',
      timezone: 'America/Grenada',
      folder_id: 3479,
      live_date: '2024-10-08 10:48:36.204549+00:00',
      close_date: '2024-10-08 10:48:36.204570+00:00',
      created_by: 'example@example.com',
      price_type: 'net',
      start_date: '2024-10-08 10:48:36.204592+00:00',
      description: 'star',
      modified_by: 'example@example.com',
      contact_info: 'molinakaren@example.com',
      created_date: '2024-10-08 10:48:36.204839+00:00',
      location_city: 'Port Laurenside',
      location_name: '271 Carlos Key\nWest Sarah WV 98592',
      modified_date: '2024-10-08 10:48:36.205154+00:00',
      client_contact: 'example-contact-info@example.com',
      location_state: 'Arkansas',
      default_language: 'sa',
      location_country: 'United States Minor Outlying Islands',
      approval_required: true,
      location_address1: '61797 Mikayla Crossing',
      location_address2: '45871 Burke Lock',
      location_address3: '47683 Schmidt Club Suite 021',
      location_postcode: '85054',
      standard_currency: 'MNT',
    })
  )
}
