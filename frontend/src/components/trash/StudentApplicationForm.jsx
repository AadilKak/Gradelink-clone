import React from "react";
import { initialFormData } from "../../utils/constants"; 
// StudentApplicationForm: Placeholder for the multi-step form
function StudentApplicationForm({ onBack, onSubmit }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState(initialFormData);

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const renderStep = () => {
        switch(step) {
            case 1:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Step 1: Student Details</h3>
                        <p>Student Name: {formData.first_name}...</p>
                        <div className="flex justify-between pt-4">
                            <button onClick={onBack} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                            <button onClick={handleNext} className="px-4 py-2 bg-indigo-600 text-white rounded">Next: Address & Medical &rarr;</button>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Step 2: Address and Medical</h3>
                        <p>Home Address: {formData.home_address.street_1}...</p>
                         <div className="flex justify-between pt-4">
                            <button onClick={handleBack} className="px-4 py-2 bg-gray-300 rounded">&larr; Back</button>
                            <button onClick={handleNext} className="px-4 py-2 bg-indigo-600 text-white rounded">Next: Guardians &rarr;</button>
                        </div>
                    </div>
                );
            case 3:
                return (
                     <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Step 3: Guardian Information</h3>
                        <p>Guardian 1 Name: {formData.guardians[0].first_name}...</p>
                         <div className="flex justify-between pt-4">
                            <button onClick={handleBack} className="px-4 py-2 bg-gray-300 rounded">&larr; Back</button>
                            <button 
                                onClick={() => onSubmit(formData)} 
                                className="px-4 py-2 bg-green-600 text-white rounded font-bold"
                            >
                                Submit Application
                            </button>
                        </div>
                    </div>
                );
            default:
                return <p>Invalid Step</p>;
        }
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-indigo-700">New Student Application (Step {step} of 3)</h2>
            <div className="h-2 bg-gray-200 rounded-full mb-8">
                <div 
                    className="h-2 bg-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${(step / 3) * 100}%` }}
                ></div>
            </div>
            {renderStep()}
        </div>
    );
}