import { useState, useEffect } from "react";
interface Props {
  departments:
    | {
        id: string;
        name: string;
        spent: string;
        budget: string;
        percent: string;
      }[]
    | undefined;
}
const DepartmentProgress = ({ name, spent, total }) => {
  // Calculate percentage for the bar width
  const [width, setWidth] = useState(0);
  const targetPercentage = Math.min((spent / total) * 100, 100);
  useEffect(() => {
    // 2. Trigger the growth after a tiny delay so the browser notices the change
    const timer = setTimeout(() => {
      setWidth(targetPercentage);
    }, 300);
    return () => clearTimeout(timer);
  }, [targetPercentage]);
  return (
    <div className="mb-6 font-poppins">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium ">{name}</span>
      </div>

      {/* Track */}
      <div className="w-full h-3 bg-[#EAEAEA] rounded-[10px] overflow-hidden">
        {/* Progress Bar with transition */}
        <div
          className="h-full bg-[#D83333] rounded-[10px] transition-all duration-5000 ease-initial"
          style={{ width: `${width}%` }}
        />
      </div>
      <div className="text-xs flex items-center justify-between pt-3 ">
        <strong className="">${spent.toLocaleString()}</strong> spend out of $
        {total.toLocaleString()}
      </div>
    </div>
  );
};

const SpendDashboard = ({ departments }: Props) => {
  console.log(departments);
  return departments?.map((department) => {
    return (
      <div className="w-full p-6" key={department.id}>
        <DepartmentProgress
          name={department.name}
          spent={department.spent}
          total={department.budget}
        />
      </div>
    );
  });
};

export default SpendDashboard;
