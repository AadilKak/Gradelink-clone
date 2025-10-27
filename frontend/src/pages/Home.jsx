import { useState, useEffect } from "react";
import api from "../api";
import "../styles/Home.css";
import CreateStudentPopup from "../components/CreateStudentForm";
import StudentCard from "../components/StudentCard";

export default function Home() {
  const [showCreate, setShowCreate] = useState(false);
  const [students, setStudents] = useState([]);
    useEffect(() => {
            getStudents();
        }, []);
    const getStudents = () => {
    api
        .get("/api/students/")
        .then((res) => res.data)
        .then((data) => {
        setStudents(data);
        console.log(data); // full student list
        })
        .catch((err) => {
        if (err.response) {
            console.error("Backend response:", err.response.data);
            alert("Error fetching students: " + JSON.stringify(err.response.data, null, 2));
        } else {
            console.error("Axios error:", err);
            alert("Error fetching students: " + err.message);
        }
        });
    };

    // Delete a student
    const deleteStudent = (id) => {
    api
        .delete(`/api/students/${id}/`)
        .then((res) => {
        if (res.status === 204) alert("Student deleted!");
        else alert("Failed to delete student.");
        getStudents(); // refresh the list after deletion
        })
        .catch((err) => {
        if (err.response) {
            console.error("Backend response:", err.response.data);
            alert("Error deleting student: " + JSON.stringify(err.response.data, null, 2));
        } else {
            console.error("Axios error:", err);
            alert("Error deleting student: " + err.message);
        }
        });
    };
  const handleCreated = (student) => {
    
    setStudents((prev) => [...prev, student]);
  };

  return (
  <div className="p-6 students-section">
  {/* Project title - smaller, left aligned */}
  <h1 className="project-title">Student Enrollment System</h1>

  {/* Students enrolled section */}
  <div className="students-header centered">
    <h2 className="section-title">Students Enrolled</h2>
    <button
      onClick={() => setShowCreate(true)}
      className="enroll-button"
    >
      Enroll a Student
    </button>
  </div>

  {showCreate && (
    <CreateStudentPopup
      onClose={() => setShowCreate(false)}
      onCreated={handleCreated}
    />
  )}

  <div className="students-grid centered">
    <div className="students-container centered">
      {students.map((student) => (
        <StudentCard
          key={student.id}
          student={student}
          onDelete={deleteStudent}
        />
      ))}
    </div>
  </div>
</div>
);

}