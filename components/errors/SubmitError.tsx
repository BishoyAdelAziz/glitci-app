import React from "react";

interface FieldError {
  field: string;
  value: string;
  location: string;
  message: string;
}

interface Props {
  isError: boolean;
  error: any;
}

const SubmitError = ({ isError, error }: Props) => {
  if (!isError) return null;

  const responseData = error?.response?.data ?? error?.data;

  const errorArray = responseData?.error;

  const isArrayError = Array.isArray(errorArray) && errorArray.length > 0;
  const isEmptyArrayError =
    Array.isArray(errorArray) && errorArray.length === 0;

  const errorMessage = isArrayError
    ? (errorArray[0] as FieldError)?.message
    : isEmptyArrayError && responseData?.message
      ? responseData.message
      : (responseData?.message ??
        error?.message ??
        "An error occurred. Please try again.");

  return (
    <div className="rounded-lg border border-red-500 bg-rose-50 p-3 text-xs text-red-500">
      <p>* {errorMessage}</p>
    </div>
  );
};
export default SubmitError;
