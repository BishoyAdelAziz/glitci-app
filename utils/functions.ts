export const getInitials = (name: string) => {
  const words = name.trim().split(" ");
  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export const getAvatarColor = (name: string) => {
  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-red-500",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

export const getStatusColor = (status: string) => {
  const colors = {
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    planning: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    completed: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    on_hold:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };
  return colors[status as keyof typeof colors] || colors.planning;
};

export const getPriorityColor = (priority: string) => {
  const colors = {
    high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    medium:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  };
  return colors[priority as keyof typeof colors] || colors.medium;
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
