type WithId = {
    id: string
}

type WithNameAndId = WithId & {
    name: string
}

export type ExportWin = {
    id: string
    adviser: WithNameAndId
    company: WithNameAndId
    customer_name: string
    customer_job_title: string
    customer_email_address: string
    customer_location: WithId
    business_type: string
    description: string
    name_of_customer: string
    name_of_export: string
    type: WithId
    date: string
    country: WithNameAndId
    total_expected_export_value: number
    goods_vs_services: WithNameAndId
    total_expected_non_export_value: number
    total_expected_odi_value: number
    sector: WithNameAndId
    is_prosperity_fund_related: boolean
    hvc: WithNameAndId & {
        campaign_id: string
        financial_year: number
    }
    hvo_programme: WithNameAndId
    has_hvo_specialist_involvement: boolean
    is_e_exported: boolean
    type_of_support: WithNameAndId[]
    associated_programme: WithNameAndId[]
    is_personally_confirmed: boolean
    is_line_manager_confirmed: boolean
    lead_officer: WithNameAndId
    lead_officer_name: string
    help_text: string
    lead_officer_email_address: string
    line_manager: WithNameAndId
    line_manager_name: string
    team_type: WithNameAndId
    hq_team: WithNameAndId
    business_potential: WithNameAndId
    export_experience: WithNameAndId
    location: string
    complete: boolean
    audit: string
    match_id: number
    company_name: string
    cdms_reference: string
}

export type ExportWins = ExportWin[]

export type Props = {
    results: ExportWins
}
