import { useState } from "react";
import EditStudentPopup from "./EditStudentPopup";
import "../styles/StudentCard.css";

export default function StudentCard({ student, onDelete, onUpdated }) {
  const [showEdit, setShowEdit] = useState(false);

  return (
    <div className="student-container">
      <div className="student-info">
        <div className="student-name">
          {student.first_name} {student.last_name}
        </div>
        <div className="student-program">{student.entering_grade_program}</div>
        <div className="student-date">
          {new Date(student.created_at).toLocaleDateString()}
        </div>
      </div>

      <div className="student-buttons">
        <button className="edit-button" onClick={() => setShowEdit(true)}>Edit</button>
        <button className="delete-button" onClick={() => onDelete(student.id)}>Delete</button>
      </div>

      {showEdit && (
        <EditStudentPopup
          studentData={student}
          onUpdated={onUpdated}
          onClose={() => setShowEdit(false)}
        />
      )}
    </div>
  );
}