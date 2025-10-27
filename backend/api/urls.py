from django.urls import path
from . import views

urlpatterns = [

    # -----------------------------------------------------------
    # STUDENT MANAGEMENT (New System)
    # -----------------------------------------------------------
    # List all students (filtered by user role) and CREATE new student registration (POST)
    path("students/", views.StudentListCreateView.as_view(), name="student-list-create"),

    # Retrieve, Update, or Destroy a specific student record
    path("students/<int:pk>/", views.StudentRetrieveUpdateDestroyView.as_view(), name="student-detail"),

    # -----------------------------------------------------------
    # LEGACY: NOTE MANAGEMENT (Kept as requested)
    # -----------------------------------------------------------
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
]
