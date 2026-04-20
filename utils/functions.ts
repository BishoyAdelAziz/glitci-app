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
export const getStatusFlagColor = (status: boolean): string => {
  switch (status) {
    case true:
      return "bg-[#E6FAF3] text-[#85C6B0] dark:bg-green-900 dark:text-green-200";
    case false:
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    default:
      // Fallback in case of unexpected types at runtime
      return "bg-gray-100 text-gray-800";
  }
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
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
export const toDateInput = (iso?: string) => (iso ? iso.split("T")[0] : "");
export const formatPhoneNumber = (phone: string | undefined | null): string => {
  if (!phone) return "";

  // 1. Handle the prefix adjustment (+20 -> +02)
  let prefix = phone.slice(0, 3);
  if (prefix === "+20") {
    prefix = "+02";
  }

  // 2. Extract the digits after the prefix
  const remainingDigits = phone.slice(3);
  const stacks: string[] = [];

  let i = 0;
  while (i < remainingDigits.length) {
    const charsLeft = remainingDigits.length - i;

    // Rule: if 4 digits are left, make the last stack 4 digits
    if (charsLeft === 4) {
      stacks.push(remainingDigits.substring(i, i + 4));
      break;
    }

    // Otherwise, continue with standard 3-digit stacks
    stacks.push(remainingDigits.substring(i, i + 3));
    i += 3;
  }

  return `${prefix} ${stacks.join(" ")}`;
};
// utils/normalizeFinance.ts

export function normalizeFinance(data: any) {
  const project = data?.project;

  const currency =
    project?.currency ||
    data?.summary?.balanceDue?.[0]?.currency ||
    data?.summary?.totalCollected?.[0]?.currency ||
    "EGP";

  return {
    project: {
      id: project?._id,
      name: project?.name,
      budget: project?.budget ?? 0,
      currency,
      client: {
        id: project?.client?._id,
        name: project?.client?.name,
        companyName: project?.client?.companyName,
      },
    },

    payments: data?.payments ?? [],

    summary: {
      totalPayments: data?.summary?.totalPayments ?? 0,

      totalCollected:
        data?.summary?.totalCollected?.reduce(
          (sum: number, item: any) => sum + (item?.amount ?? 0),
          0,
        ) ?? 0,

      balanceDue:
        data?.summary?.balanceDue?.reduce(
          (sum: number, item: any) => sum + (item?.amount ?? 0),
          0,
        ) ?? 0,

      percentagePaid: data?.summary?.percentagePaid ?? 0,

      currency,
    },
  };
}
export function normalizeTransactions(transactions: any[] = []) {
  const result: Record<string, any> = {};

  for (const tx of transactions) {
    const projectId = tx.project?._id || "no-project";

    if (!result[projectId]) {
      result[projectId] = {
        projectId,
        projectName: tx.project?.name || "Unassigned",

        income: 0,
        expenses: 0,
        balance: 0,

        transactions: [],
      };
    }

    const amount = tx.amountConverted?.EGP ?? tx.amount;

    if (tx.type === "income") {
      result[projectId].income += amount;
    } else {
      result[projectId].expenses += amount;
    }

    result[projectId].balance =
      result[projectId].income - result[projectId].expenses;

    result[projectId].transactions.push(tx);
  }

  return result;
}
export function sanitizeCookie(raw: string): string {
  const isProduction = process.env.NODE_ENV === "production";
  return raw
    .split(";")
    .filter((part) => {
      const key = part.trim().toLowerCase();
      if (key.startsWith("domain=")) return false;
      if (key.startsWith("path=")) return false;
      if (!isProduction && key === "secure") return false;
      return true;
    })
    .concat(" Path=/")
    .join(";");
}
