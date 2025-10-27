export const initialFormData = {
    // Student fields (Primary Model)
    first_name: '', 
    last_name: '', 
    birth_date: '', 
    entering_grade: 'K', 
    suffix: '', 
    is_active: true,
    
    // Nested Models
    home_address: { street_1: '', street_2: '', city: '', state: '', zip_code: '', },
    medical_history: { physician_name: '', physician_phone: '', allergies: '', medications: '', },
    
    // Nested Array (Guaranteed 2 guardians for now)
    guardians: [
        // Guardian 1 (Primary)
        { first_name: '', last_name: '', relationship: 'P', mobile: '', work_phone: '', email: '', occupation: '', ssn: '', is_same_address: true, guardian_address: null, },
        // Guardian 2 (Secondary)
        { first_name: '', last_name: '', relationship: 'S', mobile: '', work_phone: '', email: '', occupation: '', ssn: '', is_same_address: true, guardian_address: null, }
    ],
};

export const GRADE_OPTIONS = ['K', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];

export const GUARDIAN_RELATIONSHIP_OPTIONS = [
    { value: 'P', label: 'Parent/Primary' },
    { value: 'S', label: 'Stepparent' },
    { value: 'G', label: 'Grandparent' },
    { value: 'O', label: 'Other' },
];

export const US_STATES = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];
// --- Authentication Constants ---
export const ACCESS_TOKEN = "access";
export const REFRESH_TOKEN = "refresh"