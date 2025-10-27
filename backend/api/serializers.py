from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Note
from django.db import transaction # Used to ensure all saves succeed or fail together
from .models import Student, HomeAddress, GuardianAddress, ParentGuardian, MedicalHistory


User = get_user_model()
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data)
        return user


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "content", "created_at", "author"]
        extra_kwargs = {"author": {"read_only": True}}


# ----------------------------------------------------------------------
# 2. SUB-ENTITY SERIALIZERS (One-to-One links)
# ----------------------------------------------------------------------

class HomeAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeAddress
        # Exclude 'student' as it's automatically set in the parent create method
        exclude = ['student']

class GuardianAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = GuardianAddress
        fields = '__all__'

class MedicalHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalHistory
        # Exclude 'student' as it's automatically set in the parent create method
        exclude = ['student']

# ----------------------------------------------------------------------
# 3. PARENT/GUARDIAN SERIALIZER (Handles optional nested address)
# ----------------------------------------------------------------------
class ParentGuardianSerializer(serializers.ModelSerializer):
    # Nesting the GuardianAddress is optional, based on address_is_different flag
    guardian_address = GuardianAddressSerializer(required=False, allow_null=True)

    class Meta:
        model = ParentGuardian
        # Exclude 'student' as it's set in the master create method
        exclude = ['student']
        extra_kwargs = {
            'ssn': {'write_only': True} # SSN is sensitive, only allow writing/updating
        }

# ----------------------------------------------------------------------
# 4. MASTER REGISTRATION SERIALIZER (Top-level endpoint for form submission)
# ----------------------------------------------------------------------
class StudentRegistrationSerializer(serializers.ModelSerializer):
    # Nesting the related models
    home_address = HomeAddressSerializer()
    # UPDATED: Allowing a minimum of 1 guardian (for single-parent households)
    guardians = ParentGuardianSerializer(many=True, min_length=1, max_length=2)
    medical_history = MedicalHistorySerializer()

    class Meta:
        model = Student
        # Include all Student fields plus the nested relations
        fields = (
            'id', 'first_name', 'middle_name', 'last_name', 'suffix', 
            'birth_date', 'sex', 'entering_grade_program', 
            'mobile', 'email', 'recommended_by', 'birth_country', 
            'birth_city', 'birth_state', 'birth_zip',
            'home_address', 'guardians', 'medical_history',
            'is_active', 'created_at' 
        )
        read_only_fields = ('is_active', 'created_at')

    # Custom validation now checks against the new 1-2 range and provides specific messages
    def validate_guardians(self, value):
        num_guardians = len(value)
        if num_guardians < 1:
            raise serializers.ValidationError("At least one parent/guardian record must be provided.")
        if num_guardians > 2:
            raise serializers.ValidationError("A maximum of two parent/guardian records is allowed.")
        return value

    # CRITICAL: Custom create method to save data across all related models atomically.
    @transaction.atomic
    def create(self, validated_data):
        # 1. Extract nested data
        home_address_data = validated_data.pop('home_address')
        guardians_data = validated_data.pop('guardians')
        medical_history_data = validated_data.pop('medical_history')

        # Get the current authenticated user from the request context
        user = self.context['request'].user
        
        # 2. Create the MASTER STUDENT record, linking it to the authenticated user
        student = Student.objects.create(parent_user=user, **validated_data)

        # 3. Create HomeAddress and MedicalHistory (OneToOne links)
        HomeAddress.objects.create(student=student, **home_address_data)
        MedicalHistory.objects.create(student=student, **medical_history_data)

        # 4. Create ParentGuardian records and their optional GuardianAddress
        for guardian_data in guardians_data:
            address_is_different = guardian_data.pop('address_is_different')
            guardian_address_data = guardian_data.pop('guardian_address', None)
            
            # Create the ParentGuardian instance
            parent_guardian = ParentGuardian.objects.create(student=student, **guardian_data)

            # If the address is different and data was provided, create the new address and link it
            if address_is_different and guardian_address_data:
                guardian_address_instance = GuardianAddress.objects.create(**guardian_address_data)
                
                # Update the ParentGuardian with the new address link
                parent_guardian.guardian_address = guardian_address_instance
                parent_guardian.save()

        return student
