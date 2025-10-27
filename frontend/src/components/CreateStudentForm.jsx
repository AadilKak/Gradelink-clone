import { useState } from "react";
import api from "../api";
import "../styles/CreateStudentForm.css";

function CreateStudentPopup({ onCreated, onClose }) {
  // Student basic info
  const [student, setStudent] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix: "N",
    birth_date: "",
    sex: "M",
    entering_grade_program: "",
    mobile: "",
    email: "",
    recommended_by: "",
    birth_country: "",
    birth_city: "",
    birth_state: "",
    birth_zip: ""
  });

  // Home address
  const [homeAddress, setHomeAddress] = useState({
    address_line_1: "",
    city: "",
    state: "",
    postal_code: "",
    country: ""
  });

  // One guardian
  const [guardian, setGuardian] = useState({
    role: "P1",
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix: "N",
    mobile: "",
    work_phone: "",
    work_ext: "",
    email: "",
    occupation: "",
    is_employee: "N",
    employer_address: "",
    education_level: "HS",
    ssn: "",
    communication_preference: "",
    address_is_different: false
  });

  // Medical history
  const [medicalHistory, setMedicalHistory] = useState({
    allergies: "",
    medications: "",
    has_chronic_condition: false,
    notes: "",
    emergency_contact_name: "",
    emergency_contact_relationship: "",
    emergency_contact_phone: ""
  });

  const createStudent = (e) => {
    e.preventDefault();

    const payload = {
      ...student,
      home_address: homeAddress,
      guardians: [guardian], // must be array
      medical_history: medicalHistory
    };

    api.post("/api/students/", payload)
  .then((res) => {
    if (res.status === 201) alert("Student created!");
    else alert("Failed to create student.");
    onCreated();
    onClose();
  })
  .catch((err) => {
    // If DRF returns validation errors
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
        <h2>Enroll a Student</h2>
        <form onSubmit={createStudent} className="student-form-grid">

          {/* Student Info */}
          <div>
            <label>First Name</label>
            <input required value={student.first_name} onChange={e => setStudent({...student, first_name: e.target.value})} />
          </div>
          <div>
            <label>Middle Name</label>
            <input value={student.middle_name} onChange={e => setStudent({...student, middle_name: e.target.value})} />
          </div>
          <div>
            <label>Last Name</label>
            <input required value={student.last_name} onChange={e => setStudent({...student, last_name: e.target.value})} />
          </div>
          <div>
            <label>Suffix</label>
            <select value={student.suffix} onChange={e => setStudent({...student, suffix: e.target.value})}>
              <option value="N">None</option>
              <option value="JR">Jr.</option>
              <option value="SR">Sr.</option>
              <option value="II">II</option>
              <option value="III">III</option>
              <option value="IV">IV</option>
            </select>
          </div>
          <div>
            <label>Birth Date</label>
            <input type="date" required value={student.birth_date} onChange={e => setStudent({...student, birth_date: e.target.value})} />
          </div>
          <div>
            <label>Sex</label>
            <select required value={student.sex} onChange={e => setStudent({...student, sex: e.target.value})}>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
            </select>
          </div>
          <div>
            <label>Entering Grade/Program</label>
            <input required value={student.entering_grade_program} onChange={e => setStudent({...student, entering_grade_program: e.target.value})} />
          </div>
          <div>
            <label>Mobile</label>
            <input value={student.mobile} onChange={e => setStudent({...student, mobile: e.target.value})} />
          </div>
          <div>
            <label>Email</label>
            <input value={student.email} onChange={e => setStudent({...student, email: e.target.value})} />
          </div>
          <div>
            <label>Recommended By</label>
            <input value={student.recommended_by} onChange={e => setStudent({...student, recommended_by: e.target.value})} />
          </div>
          <div>
            <label>Birth Country</label>
            <input required value={student.birth_country} onChange={e => setStudent({...student, birth_country: e.target.value})} />
          </div>
          <div>
            <label>Birth City</label>
            <input required value={student.birth_city} onChange={e => setStudent({...student, birth_city: e.target.value})} />
          </div>
          <div>
            <label>Birth State</label>
            <input required value={student.birth_state} onChange={e => setStudent({...student, birth_state: e.target.value})} />
          </div>
          <div>
            <label>Birth Zip</label>
            <input required value={student.birth_zip} onChange={e => setStudent({...student, birth_zip: e.target.value})} />
          </div>

          {/* Home Address */}
          <div>
            <label>Street</label>
            <input required value={homeAddress.address_line_1} onChange={e => setHomeAddress({...homeAddress, address_line_1: e.target.value})} />
          </div>
          <div>
            <label>City</label>
            <input required value={homeAddress.city} onChange={e => setHomeAddress({...homeAddress, city: e.target.value})} />
          </div>
          <div>
            <label>State</label>
            <input required value={homeAddress.state} onChange={e => setHomeAddress({...homeAddress, state: e.target.value})} />
          </div>
          <div>
            <label>Zip</label>
            <input required value={homeAddress.postal_code} onChange={e => setHomeAddress({...homeAddress, postal_code: e.target.value})} />
          </div>
          <div>
            <label>Country</label>
            <input required value={homeAddress.country} onChange={e => setHomeAddress({...homeAddress, country: e.target.value})} />
          </div>

          {/* Guardian */}
          <div>
            <label>Guardian First Name</label>
            <input
              required
              value={guardian.first_name}
              onChange={(e) => setGuardian({ ...guardian, first_name: e.target.value })}
            />
          </div>
          <div>
            <label>Guardian Last Name</label>
            <input
              required
              value={guardian.last_name}
              onChange={(e) => setGuardian({ ...guardian, last_name: e.target.value })}
            />
          </div>
          <div>
            <label>Guardian Email</label>
            <input
              required
              value={guardian.email}
              onChange={(e) => setGuardian({ ...guardian, email: e.target.value })}
            />
          </div>
          <div>
            <label>Guardian Mobile</label>
            <input
              required
              value={guardian.mobile}
              onChange={(e) => setGuardian({ ...guardian, mobile: e.target.value })}
            />
          </div>
          <div>
            <label>Relation/Occupation</label>
            <input
              required
              value={guardian.occupation}
              onChange={(e) => setGuardian({ ...guardian, occupation: e.target.value })}
            />
          </div>

          {/* Medical History */}
          <div>
            <label>Allergies</label>
            <input value={medicalHistory.allergies} onChange={e => setMedicalHistory({...medicalHistory, allergies: e.target.value})} />
          </div>
          <div>
            <label>Medications</label>
            <input value={medicalHistory.medications} onChange={e => setMedicalHistory({...medicalHistory, medications: e.target.value})} />
          </div>
          <div>
            <label>Emergency Contact Name</label>
            <input value={medicalHistory.emergency_contact_name} onChange={e => setMedicalHistory({...medicalHistory, emergency_contact_name: e.target.value})} />
          </div>
          <div>
            <label>Emergency Contact Relationship</label>
            <input value={medicalHistory.emergency_contact_relationship} onChange={e => setMedicalHistory({...medicalHistory, emergency_contact_relationship: e.target.value})} />
          </div>
          <div>
            <label>Emergency Contact Phone</label>
            <input value={medicalHistory.emergency_contact_phone} onChange={e => setMedicalHistory({...medicalHistory, emergency_contact_phone: e.target.value})} />
          </div>

          <div className="modal-buttons">
            <button type="submit">Create</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default CreateStudentPopup;
