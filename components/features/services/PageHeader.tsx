import { Dispatch, SetStateAction } from "react";
interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
export default function PageHeader({ isOpen, setIsOpen }: Props) {
  // Helper function to generate a consistent color based on name

  return (
    <div className="flex items-center justify-between ">
      <h3 className="capitalize font-bold text-2xl "></h3>

      <div className="flex items-center justify-evenly space-x-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-[30px] bg-linear-to-r from-[#DE4646] to-[#B72D2D] px-6 py-3 transition-all   ease-in-out duration-700 font-noor-bold text-white hover:bg-linear-to-l hover:from-[#B72D2D] hover:to-[#DE4646]"
        >
          + New Service
        </button>
      </div>
    </div>
  );
}
