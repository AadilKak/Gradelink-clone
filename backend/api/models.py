from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()
class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")

    def __str__(self):
        return self.title
    
# ----------------------------------------------------------------------
# 1. MASTER ENTITY: STUDENT
# This is the central record for the student.
# ----------------------------------------------------------------------
class Student(models.Model):
    # Foreign Key: Links the student record to the parent/user who created it (Parent or Admin).
    # CRITICAL UPDATE: SET_NULL ensures the student record remains if the User is deleted.
    parent_user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,  # Allows the database column to be NULL
        blank=True, # Allows forms to submit NULL
        related_name="student_registrations",
        verbose_name="Registering Parent/User"
    )

    # Status Field for Soft Deletion (Inactivation)
    is_active = models.BooleanField(default=True, verbose_name="Is Student Currently Active?")

    # Student Info Fields
    first_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, blank=True, verbose_name="Middle Name")
    last_name = models.CharField(max_length=100)
    
    SUFFIX_CHOICES = [
        ('JR', 'Jr.'), ('SR', 'Sr.'), ('II', 'II'), ('III', 'III'), ('IV', 'IV'), ('N', 'None')
    ]
    suffix = models.CharField(max_length=10, choices=SUFFIX_CHOICES, default='N', verbose_name="Suffix")
    
    birth_date = models.DateField(verbose_name="Date of Birth")
    SEX_CHOICES = [('M', 'Male'), ('F', 'Female'), ('O', 'Other')]
    sex = models.CharField(max_length=1, choices=SEX_CHOICES, verbose_name="Sex")
    entering_grade_program = models.CharField(max_length=50, verbose_name="Entering Grade/Program")

    # Contact & Origin
    mobile = models.CharField(max_length=15, blank=True, verbose_name="Mobile Phone")
    email = models.EmailField(blank=True, verbose_name="Email Address")
    recommended_by = models.CharField(max_length=255, blank=True, verbose_name="Who Recommended Us")
    
    birth_country = models.CharField(max_length=100, verbose_name="Birth Country")
    birth_city = models.CharField(max_length=100, verbose_name="Birth City")
    birth_state = models.CharField(max_length=50, verbose_name="Birth State")
    birth_zip = models.CharField(max_length=10, verbose_name="Birth Zip Code")

    # Audit fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Student: {self.first_name} {self.last_name}"


# ----------------------------------------------------------------------
# 2. RELATED ENTITY: HOME ADDRESS
# One-to-One link to Student (every student has one primary home address)
# ----------------------------------------------------------------------
class HomeAddress(models.Model):
    # OneToOneField ensures that this is the primary key and links directly to one student.
    student = models.OneToOneField(
        Student,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name="home_address"
    )

    address_line_1 = models.CharField(max_length=255, verbose_name="Street Address")
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=50)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100)

    def __str__(self):
        return f"Address for {self.student.first_name}: {self.address_line_1}"

# ----------------------------------------------------------------------
# 3. NEW RELATED ENTITY: GUARDIAN ADDRESS (For separate parent residences)
# ----------------------------------------------------------------------
class GuardianAddress(models.Model):
    # Note: This is NOT a primary key. It is linked 1:1 via ParentGuardian.
    address_line_1 = models.CharField(max_length=255, verbose_name="Street Address")
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=50)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100)

    def __str__(self):
        # We cannot easily retrieve the ParentGuardian name here, so we use the address
        return f"Guardian Address: {self.address_line_1}"

# ----------------------------------------------------------------------
# 4. RELATED ENTITY: PARENT/GUARDIAN INFO
# Foreign Key link to Student (one student can have multiple guardians)
# ----------------------------------------------------------------------
class ParentGuardian(models.Model):
    # Foreign Key: Links a parent record to a single student.
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="guardians"
    )
    
    # Role to distinguish Parent 1 (Primary) vs Parent 2 (Secondary)
    ROLE_CHOICES = [('P1', 'Primary Parent'), ('P2', 'Secondary Parent')]
    role = models.CharField(max_length=2, choices=ROLE_CHOICES, default='P1', verbose_name="Parent Role")

    # Personal Info
    first_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, blank=True, verbose_name="Middle Name")
    last_name = models.CharField(max_length=100)
    suffix = models.CharField(max_length=10, blank=True, verbose_name="Suffix")

    # Contact Info
    mobile = models.CharField(max_length=15)
    work_phone = models.CharField(max_length=15, blank=True, verbose_name="Work Phone")
    work_ext = models.CharField(max_length=10, blank=True, verbose_name="Extension")
    email = models.EmailField()

    # Professional & Education Info
    occupation = models.CharField(max_length=100)
    EMPLOYEE_CHOICES = [('E', 'Employee'), ('N', 'None/Self-Employed')]
    is_employee = models.CharField(max_length=1, choices=EMPLOYEE_CHOICES, default='N', verbose_name="Employment Status")
    employer_address = models.CharField(max_length=255, blank=True, verbose_name="Employer Address")

    EDUCATION_CHOICES = [
        ('HS', 'High School'), ('AA', 'Associate Degree'), 
        ('BA', 'Bachelor Degree'), ('MA', 'Master Degree'), 
        ('PHD', 'Doctorate'), ('OT', 'Other')
    ]
    education_level = models.CharField(max_length=10, choices=EDUCATION_CHOICES, verbose_name="Education Level")
    
    # Sensitive field: SSN
    # REAL WORLD ENCRYPTION: This CharField should be replaced with a field
    # that encrypts data at rest (e.g., EncryptedCharField from a third-party library).
    ssn = models.CharField(
        max_length=11, 
        blank=True, 
        verbose_name="SSN (Encrypted at Rest in Production)"
    ) 
    
    communication_preference = models.TextField(blank=True, verbose_name="Communication Preference")
    
    # NOTE: Address if different to child requires its own optional OneToOneField
    # to a separate Address model, but we will simplify and skip that for now.
    # --- NEW FIELDS FOR SEPARATE ADDRESS ---
    address_is_different = models.BooleanField(
        default=False, 
        verbose_name="Does this guardian live at a different address than the student?"
    )
    # Optional OneToOne link to the GuardianAddress model
    guardian_address = models.OneToOneField(
        'GuardianAddress', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name="guardian_resident"
    )
    def __str__(self):
        return f"{self.get_role_display()}: {self.last_name}"

# ----------------------------------------------------------------------
# 5. NEW RELATED ENTITY: MEDICAL HISTORY
# One-to-One link to Student
# ----------------------------------------------------------------------
class MedicalHistory(models.Model):
    student = models.OneToOneField(
        Student,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name="medical_history"
    )
    allergies = models.TextField(blank=True, verbose_name="Known Allergies (List)")
    medications = models.TextField(blank=True, verbose_name="Current Medications and Dosages")
    has_chronic_condition = models.BooleanField(default=False, verbose_name="Has Chronic Condition?")
    notes = models.TextField(blank=True, verbose_name="Additional Medical Notes")
    
    emergency_contact_name = models.CharField(max_length=100)
    emergency_contact_relationship = models.CharField(max_length=50)
    emergency_contact_phone = models.CharField(max_length=15)

    def __str__(self):
        return f"Medical History for {self.student.first_name}"
