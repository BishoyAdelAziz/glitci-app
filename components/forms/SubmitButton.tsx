"use client";

import ButtonLoader from "../Loaders/ButtonLoader";
import SubmitError from "../errors/SubmitError";

interface Props {
  text: string;
  isPending: boolean;
  isError: boolean;
  error?: any; // TanStack Query mutation error
  className?: string;
}

const SubmitButton = ({
  text,
  isPending,
  isError,
  error,
  className = "",
}: Props) => {
  return (
    <div className={`w-full space-y-2 ${className}`}>
      <button
        type="submit"
        disabled={isPending}
        className="flex w-full justify-center rounded-[30px] bg-linear-to-r from-[#DE4646] to-[#B72D2D] p-4 transition-all ease-in-out duration-700 font-noor-bold text-white hover:bg-linear-to-l hover:from-[#B72D2D] hover:to-[#DE4646] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? <ButtonLoader /> : text}
      </button>

      {isError && error && <SubmitError isError={true} error={error} />}
    </div>
  );
};

export default SubmitButton;
