import Image from "next/image";
import userOne from "@/public/images/user-1.png";
import userTwo from "@/public/images/user-2.png";

export default function PageHeader() {
  const users = [
    { id: 1, Image: userOne, Name: "Fares ElSawy" },
    { id: 2, Image: userTwo, Name: "Marwan Magdy" },
    { id: 3, Image: null, Name: "Bishoy Adel" },
    { id: 4, Image: null, Name: "Ahmed Magdy" },
  ];

  // Helper function to get initials from name
  const getInitials = (name: string) => {
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Helper function to generate a consistent color based on name
  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-indigo-500",
      "bg-teal-500",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="flex items-center justify-between">
      <h3 className="capitalize font-semibold text-2xl">All Projects</h3>

      <div className="flex items-center justify-evenly space-x-4">
        <div className="flex items-center justify-center -space-x-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="relative w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 overflow-hidden"
              title={user.Name}
            >
              {user.Image ? (
                <Image
                  src={user.Image}
                  alt={user.Name}
                  fill
                  className="object-cover cursor-pointer"
                />
              ) : (
                <div
                  className={`w-full h-full flex cursor-pointer items-center justify-center text-white text-sm font-semibold ${getAvatarColor(
                    user.Name,
                  )}`}
                >
                  {getInitials(user.Name)}
                </div>
              )}
            </div>
          ))}
        </div>
        <button className="rounded-[30px] bg-linear-to-r from-[#DE4646] to-[#B72D2D] px-4 py-3 transition-all ease-in-out duration-700 font-noor-bold text-white hover:bg-linear-to-l hover:from-[#B72D2D] hover:to-[#DE4646]">
          + New Project
        </button>
      </div>
    </div>
  );
}
