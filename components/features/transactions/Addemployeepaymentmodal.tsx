"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import EmployeeSalaryForm from "./EmployeeSalaryForm";
import EmployeeBonusForm from "./EmployeeBonusForm";
import EmployeePaymentForm from "./EmployeePaymentForm";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: PaymentTab;
}

type PaymentTab = "employee_salary" | "employee_bonus" | "employee_payment";

const TABS: { label: string; value: PaymentTab }[] = [
  { label: "Salary", value: "employee_salary" },
  { label: "Payment", value: "employee_payment" },
  { label: "Bonus", value: "employee_bonus" },
];

export default function AddEmployeePaymentModal({
  isOpen,
  onClose,
  defaultTab = "employee_salary",
}: Props) {
  const [activeTab, setActiveTab] = useState<PaymentTab>(defaultTab);

  const renderForm = () => {
    switch (activeTab) {
      case "employee_salary":
        return <EmployeeSalaryForm onClose={onClose} />;
      case "employee_bonus":
        return <EmployeeBonusForm onClose={onClose} />;
      case "employee_payment":
        return <EmployeePaymentForm onClose={onClose} />;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <div className="p-6 space-y-5 bg-white dark:bg-gray-900">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Add Employee Payment
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Record a salary or bonus payment to an employee
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.value
                  ? "bg-linear-to-r from-[#DE4646] to-[#B72D2D] text-white"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Isolated form per tab — each has its own useForm, schema, and API call */}
        {renderForm()}
      </div>
    </Modal>
  );
}
