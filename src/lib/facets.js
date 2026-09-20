// Maps each refine-search facet label to the field on a flattened job record
// (jobs table columns, plus `company` = the joined company name).
export const FACET_FIELD_MAP = {
    Designation: 'title',
    Location: 'location',
    'Date Posted': 'date_bucket',
    Industry: 'industry',
    'Job Type': 'job_type',
    'Job Function': 'job_function',
    Seniority: 'seniority',
    Experience: 'experience',
    Relocation: 'relocation',
    'Company Name': 'company',
    'Company Type': 'company_type',
    'Company Rating': 'company_rating_bucket',
    'Company Size': 'company_size',
};

export const MATCH_TOGGLE_LABELS = [
    'Work Hive Exclusive',
    'Salary Match',
    'Profile Match',
    'Experience Match',
    'Education Match',
    'Skills Match',
];
