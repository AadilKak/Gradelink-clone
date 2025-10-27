from django.shortcuts import render
from django.contrib.auth import get_user_model
from rest_framework import generics, permissions
from .serializers import UserSerializer, NoteSerializer, StudentRegistrationSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note
from .models import Student # Import the new Student model
# Get the configured User model (best practice)
User = get_user_model() 
class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)



# ----------------------------------------------------------------------
# 1. CUSTOM PERMISSION CLASS
# Enforces access rules: Admins see all, Owners see only theirs.
# ----------------------------------------------------------------------
class IsStaffOrOwner(permissions.BasePermission):
    """
    Custom permission to allow staff (Admins) full access, 
    but only the owner (Parent) can manage their own student records.
    """
    def has_permission(self, request, view):
        # All authenticated users (staff or parent) are allowed to hit the endpoint.
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # 1. Staff users (Admins) always have full permission.
        if request.user.is_staff:
            return True

        # 2. Check if the authenticated user is the one who registered the student.
        # obj is the Student instance; parent_user is the ForeignKey to the User model.
        return obj.parent_user == request.user

# ----------------------------------------------------------------------
# 2. STUDENT LIST & CREATE VIEW (Replaces NoteListCreate)
# Endpoint: GET /students/ (List) | POST /students/ (Create)
# ----------------------------------------------------------------------
class StudentListCreateView(generics.ListCreateAPIView):
    serializer_class = StudentRegistrationSerializer
    permission_classes = [IsStaffOrOwner]

    def get_queryset(self):
        """
        Dynamically filter the queryset based on the user's role.
        """
        user = self.request.user
        
        if user.is_staff:
            # Staff/Admin users see ALL student records.
            return Student.objects.all().order_by("-created_at")
        
        # Regular users (Parents) only see the students they registered.
        # This queryset filters the list before the permission check occurs on objects.
        return Student.objects.filter(parent_user=user).order_by("-created_at")

    # NOTE: The perform_create method is removed here because the complex
    # saving logic (linking the Student and all related models to request.user)
    # is now handled entirely within the StudentRegistrationSerializer's create() method.


# ----------------------------------------------------------------------
# 3. STUDENT DETAIL VIEW (Retrieve, Update, Delete)
# Endpoint: GET/PUT/PATCH/DELETE /students/<pk>/ (Detail)
# ----------------------------------------------------------------------
class StudentRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = StudentRegistrationSerializer
    permission_classes = [IsStaffOrOwner]
    # We use the primary key (pk) to look up the student record.

    def get_queryset(self):
        """
        Use the same queryset logic to secure the lookup: 
        Only admins see all; owners see only theirs.
        """
        user = self.request.user
        if user.is_staff:
            return Student.objects.all()
        
        # This prevents a non-admin user from accidentally accessing another user's student 
        # via a direct URL, reinforcing the has_object_permission check.
        return Student.objects.filter(parent_user=user)


# ----------------------------------------------------------------------
# 4. USER CREATION VIEW (Kept from original)
# ----------------------------------------------------------------------
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny] # Users can register accounts freely
