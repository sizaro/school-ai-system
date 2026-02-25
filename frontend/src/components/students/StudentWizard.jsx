import React, { useState, useEffect } from "react";
import Drawer from "../common/Drawer";
import StepStudentInfo from "./steps/StepStudentInfo";
import StepGuardianInfo from "./steps/StepGuardianInfo";
import StepMedicalReview from "./steps/StepMedicalReview";
import StepPayment from "./steps/StepPayment";

export default function StudentWizard({ isOpen, onClose, student = null }) {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    student: {
      firstName: "",
      middleName: "",
      lastName: "",
      gender: "",
      dateOfBirth: "",
      nationality: "",
      nationalIdNumber: "",
      classLevel: "",
      stream: "",
      admissionDate: "",
      previousSchool: "",
      photo: null,
      photoPreview: null,
    },
    guardian: {
      relationshipToStudent: "",
      firstName: "",
      lastName: "",
      gender: "",
      nationalIdNumber: "",
      phone: "",
      alternativePhone: "",
      email: "",
      occupation: "",
      address: "",
      district: "",
    },
    medical: {
      bloodGroup: "",
      medicalConditions: "",
      allergies: "",
    },
    payment: {
      registrationFee: "",
      receiptNumber: "",
      paymentDate: "",
    },
  });

  // Edit mode prefill
  useEffect(() => {
    if (student) {
      setFormData(student);
    }
  }, [student]);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = () => {
    if (student) {
      console.log("Updating student:", formData);
    } else {
      console.log("Creating student:", formData);
    }

    onClose();
    setStep(1);
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col h-full p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {student ? "Edit Student" : "Register Student"}
          </h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* STEP INDICATOR */}
        <div className="flex gap-4 mb-6 text-sm">
          <span className={step === 1 ? "font-bold" : ""}>Student</span>
          <span className={step === 2 ? "font-bold" : ""}>Guardian</span>
          <span className={step === 3 ? "font-bold" : ""}>Medical</span>
          <span className={step === 4 ? "font-bold" : ""}>Payment</span>
        </div>

        {/* STEP CONTENT */}
        <div className="flex-1 overflow-y-auto">
          {step === 1 && (
            <StepStudentInfo
              formData={formData}
              setFormData={setFormData}
            />
          )}

          {step === 2 && (
            <StepGuardianInfo
              formData={formData}
              setFormData={setFormData}
            />
          )}

          {step === 3 && (
            <StepMedicalReview
              formData={formData}
            />
          )}

          {step === 4 && (
            <StepPayment
              formData={formData}
            />
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-between mt-6">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Back
          </button>

          {step < 4 ? (
            <button
              onClick={nextStep}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              {student ? "Update Student" : "Add Student"}
            </button>
          )}
        </div>
      </div>
    </Drawer>
  );
}