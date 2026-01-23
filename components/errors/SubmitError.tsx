import React from "react";

interface Props {
  isError: boolean;
  error: any;
}

const SubmitError = ({ isError, error }: Props) => {
  if (!isError) return null;

  const errorMessage = error?.response?.data?.message;

  return (
    <div className="rounded-lg border border-red-500 bg-rose-50 p-3 text-xs text-red-500">
      {Array.isArray(errorMessage) ? (
        errorMessage.map((err: string, index: number) => (
          <p key={index}>* {err}</p>
        ))
      ) : (
        <p>
          {errorMessage ??
            error?.message ??
            "An error occurred. Please try again."}
        </p>
      )}
    </div>
  );
};

export default SubmitError;
