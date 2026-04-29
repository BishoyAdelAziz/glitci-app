import { Employee } from "@/types/employees";
import { formatPhoneNumber } from "@/utils/functions";
import ActionsMenu from "@/components/ui/ActionsMenu";
import { EyeIcon } from "@/components/ui/ActionsMenu";
import { EditIcon } from "@/components/ui/ActionsMenu";
import { TrashIcon } from "@/components/ui/ActionsMenu";
import Image from "next/image";
interface Props {
  employee: Employee; // ← remove null, card always has real employee
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}
export default function UserCard({ employee, onDelete, onEdit }: Props) {
  return (
    <div className=" relative shadow-[0_4px_8.2px_0_rgba(0,0,0,0.25)] dark:shadow-[0_4px_8.2px_0_rgba(255,255,255,0.10)] p-6 rounded-[20px]  bg-white dark:bg-gray-800">
      <div className="absolute top-2 right-2">
        <ActionsMenu
          actions={[
            {
              label: "View",
              icon: <EyeIcon />,
              href: `/employees/${employee?.id}`,
            },
            {
              label: "Edit",
              icon: <EditIcon />,
              onClick: () => onEdit(employee), // ← wrap to pass employee
            },
            {
              label: "Delete",
              icon: <TrashIcon />,
              onClick: () => onEdit(employee), // ← wrap to pass employee
              variant: "danger",
            },
          ]}
        />
      </div>
      <div className="flex flex-col items-stretch justify-center gap-6 w-full">
        <div className="flex items-center justify-start gap-4">
          <div className="relative inline-block">
            <Image
              alt="User Profile"
              width={100}
              height={100}
              src="/images/User-Image.jpg"
              className="rounded-full"
            />
            <div className="absolute bottom-1 right-2 w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
          </div>
          <div className="flex flex-col items-start justify-center">
            <h4 className="font-poppins font-bold text-nowrap">
              {employee?.name}
            </h4>
            <p className="font-poppins font-normal text-[#979797] text-nowrap">
              {employee?.role}
            </p>
          </div>
        </div>
        <div className="h-0.5 bg-gray-400/30 w-ful"></div>

        <div className="flex items-start justify-start gap-4">
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 8.71429L14.0218 9.8447C12.9189 10.4749 12.3674 10.7901 11.7834 10.9136C11.2666 11.0229 10.7334 11.0229 10.2166 10.9136C9.63258 10.7901 9.08113 10.4749 7.97822 9.8447L6 8.71429M7.77778 15H14.2222C14.8445 15 15.1557 15 15.3933 14.8754C15.6024 14.7659 15.7724 14.591 15.8789 14.376C16 14.1315 16 13.8115 16 13.1714V8.82857C16 8.18851 16 7.86848 15.8789 7.62401C15.7724 7.40897 15.6024 7.23413 15.3933 7.12457C15.1557 7 14.8445 7 14.2222 7H7.77778C7.1555 7 6.84436 7 6.60668 7.12457C6.39761 7.23413 6.22763 7.40897 6.12111 7.62401C6 7.86848 6 8.18851 6 8.82857V13.1714C6 13.8115 6 14.1315 6.12111 14.376C6.22763 14.591 6.39761 14.7659 6.60668 14.8754C6.84436 15 7.15549 15 7.77778 15Z"
              stroke="#979797"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="11"
              cy="11"
              r="10.75"
              stroke="#979797"
              strokeWidth="0.5"
            />
          </svg>

          <p className="font-poppins font-normal text-[#979797] text-md">
            {employee?.email}
          </p>
        </div>
        <div className="h-0.5 bg-gray-400/30 w-ful"></div>
        <div className="flex items-start justify-start gap-4">
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="11"
              cy="11"
              r="10.75"
              stroke="#979797"
              strokeWidth="0.5"
            />
            <path
              d="M11.5 10.2414C12.1685 10.2414 12.8097 9.96528 13.2824 9.4738C13.7552 8.98233 14.0208 8.31574 14.0208 7.62069C14.0208 6.92564 13.7552 6.25906 13.2824 5.76758C12.8097 5.27611 12.1685 5 11.5 5C10.8315 5 10.1903 5.27611 9.71756 5.76758C9.24483 6.25906 8.97925 6.92564 8.97925 7.62069C8.97925 8.31574 9.24483 8.98233 9.71756 9.4738C10.1903 9.96528 10.8315 10.2414 11.5 10.2414ZM11.5 11.3928C8.1485 11.3928 6 13.3156 6 14.2518V16H17V14.2518C17 13.1197 14.966 11.3928 11.5 11.3928Z"
              fill="#979797"
            />
          </svg>

          <p className="font-poppins font-normal text-[#979797] text-md">
            Web Developer
          </p>
        </div>
        <div className="h-0.5 bg-gray-400/30 w-ful"></div>
        <div className="flex items-start justify-start gap-4">
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="11"
              cy="11"
              r="10.75"
              stroke="#979797"
              strokeWidth="0.5"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.82391 11.7897L7.81892 9.65573C7.7744 9.60757 7.72136 9.56926 7.66287 9.543C7.60438 9.51675 7.54159 9.50306 7.47811 9.50274C7.41463 9.50242 7.35172 9.51547 7.293 9.54113C7.23428 9.56679 7.1809 9.60456 7.13595 9.65227L6.13915 10.7149C6.04942 10.812 5.9994 10.9429 6.00001 11.0791C6.00061 11.2153 6.0518 11.3457 6.1424 11.4418L9.24827 14.7457C9.39939 14.907 9.60417 14.9984 9.81818 15C10.0322 15.0016 10.2382 14.9133 10.3914 14.7544L10.8223 14.2957L15.8714 8.92191C15.9565 8.8257 16.0026 8.69775 15.9999 8.56566C15.9971 8.43357 15.9458 8.30792 15.8568 8.21579L14.8583 7.15314C14.772 7.05803 14.6539 7.00304 14.5296 7.00012C14.4054 6.99721 14.2851 7.0466 14.1949 7.13756L9.82391 11.7897Z"
              fill="#979797"
            />
          </svg>

          <p className="font-poppins font-normal text-[#979797] text-md">
            {employee?.employmentType}
          </p>
        </div>
      </div>
    </div>
  );
}
