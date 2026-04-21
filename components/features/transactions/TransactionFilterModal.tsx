"use client";

import React, { useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { useForm, useWatch } from "react-hook-form";
import { ROUTES_BY_TYPE } from "@/config/Transactionroutes";
import { TransactionType } from "@/types/transactions";

interface TransactionFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: TransactionType;
  currentCategory: string | undefined;
  onApply: (category: string | undefined) => void;
}

interface FilterForm {
  category: string;
}

export default function TransactionFilterModal({
  isOpen,
  onClose,
  type,
  currentCategory,
  onApply,
}: TransactionFilterModalProps) {
  const { register, control, reset } = useForm<FilterForm>({
    defaultValues: {
      category: currentCategory || "all",
    },
  });

  const categories = ROUTES_BY_TYPE[type] || [];
  const watchedCategory = useWatch({ control, name: "category" });

  // Update live when radio button changes
  useEffect(() => {
    if (watchedCategory !== undefined && isOpen) {
      onApply(watchedCategory === "all" ? undefined : watchedCategory);
    }
  }, [watchedCategory, isOpen, onApply]);

  useEffect(() => {
    if (isOpen) {
      reset({ category: currentCategory || "all" });
    }
  }, [isOpen, currentCategory, reset]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="p-6 bg-white dark:bg-slate-900 rounded-xl relative overflow-hidden">
        <h3 className="text-lg font-bold leading-6 text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4">
          Filter Transactions by Category
        </h3>
        <div className="mt-4">
          <form className="space-y-4">
            {/* ALL Categories Option */}
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                value="all"
                className="h-4 w-4 text-[#DE4646] focus:ring-[#DE4646]"
                {...register("category")}
              />
              <span className="text-gray-700 dark:text-gray-300 font-medium">All Categories</span>
            </label>

            {/* Dynamic Categories Option */}
            {categories.map((cat) => (
              <label key={cat.slug} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  value={cat.category}
                  className="h-4 w-4 text-[#DE4646] focus:ring-[#DE4646]"
                  {...register("category")}
                />
                <span className="text-gray-700 dark:text-gray-300 font-medium">{cat.label}</span>
              </label>
            ))}
          </form>
        </div>

        <div className="mt-6 flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

