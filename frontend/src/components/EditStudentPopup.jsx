import { useState, useEffect } from "react";
import api from "../api";
import "../styles/CreateStudentForm.css";

function EditStudentPopup({ studentData, onUpdated, onClose }) {
  const [student, setStudent] = useState(studentData || {});
  const [homeAddress, setHomeAddress] = useState(studentData?.home_address || {});
  const [guardian, setGuardian] = useState(studentData?.guardians?.[0] || {});
  const [medicalHistory, setMedicalHistory] = useState(studentData?.medical_history || {});

  useEffect(() => {
    if (studentData) {
      setStudent(studentData);
      setHomeAddress(studentData.home_address || {});
      setGuardian(studentData.guardians?.[0] || {});
      setMedicalHistory(studentData.medical_history || {});
    }
  }, [studentData]);

  const updateStudent = (e) => {
    e.preventDefault();

    const payload = {
      ...student,
      home_address: homeAddress,
      guardians: [guardian],
      medical_history: medicalHistory,
    };

    api
      .put(`/api/students/${student.id}/`, payload)
      .then((res) => {
        if (res.status === 200) alert("Student updated!");
        else alert("Failed to update student.");
        onUpdated();
        onClose();
      })
      .catch((err) => {
        if (err.response) {
          console.error("Backend response:", err.response.data);
          alert("Error: " + JSON.stringify(err.response.data, null, 2));
        } else {
          console.error("Axios error:", err);
          alert("Error: " + err.message);
        }
      });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Student</h2>
        <form onSubmit={updateStudent} className="student-form-grid">

          <div>
            <label>First Name</label>
            <input
              required
              value={student.first_name || ""}
              onChange={(e) => setStudent({ ...student, first_name: e.target.value })}
            />
          </div>
          <div>
            <label>Last Name</label>
            <input
              required
              value={student.last_name || ""}
              onChange={(e) => setStudent({ ...student, last_name: e.target.value })}
            />
          </div>
          <div>
            <label>Entering Grade/Program</label>
            <input
              required
              value={student.entering_grade_program || ""}
              onChange={(e) => setStudent({ ...student, entering_grade_program: e.target.value })}
            />
          </div>

          <div>
            <label>Guardian First Name</label>
            <input
              value={guardian.first_name || ""}
              onChange={(e) => setGuardian({ ...guardian, first_name: e.target.value })}
            />
          </div>
          <div>
            <label>Guardian Email</label>
            <input
              value={guardian.email || ""}
              onChange={(e) => setGuardian({ ...guardian, email: e.target.value })}
            />
          </div>

          <div className="modal-buttons">
            <button type="submit">Save Changes</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditStudentPopup;
