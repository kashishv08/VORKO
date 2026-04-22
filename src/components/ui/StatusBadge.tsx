interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

const statusConfig: Record<string, { label: string; className: string }> = {
  OPEN: { label: "Open", className: "bg-green-100 text-green-800 border-green-200" },
  HIRED: { label: "Hired", className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  IN_PROGRESS: { label: "In Progress", className: "bg-blue-100 text-blue-800 border-blue-200" },
  COMPLETED: { label: "Completed", className: "bg-gray-100 text-gray-700 border-gray-200" },
  CANCELLED: { label: "Cancelled", className: "bg-red-100 text-red-700 border-red-200" },
  PENDING: { label: "Pending", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  SUBMITTED: { label: "Submitted", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  ACCEPTED: { label: "Accepted", className: "bg-green-100 text-green-800 border-green-200" },
  REJECTED: { label: "Rejected", className: "bg-red-100 text-red-700 border-red-200" },
  REVIEW_PENDING: { label: "Review Pending", className: "bg-orange-100 text-orange-800 border-orange-200" },
  REVISION_REQUESTED: { label: "Revision Requested", className: "bg-amber-100 text-amber-800 border-amber-200" },
  PAYMENT_PENDING: { label: "Payment Pending", className: "bg-purple-100 text-purple-800 border-purple-200" },
  PAID: { label: "Paid", className: "bg-green-100 text-green-800 border-green-200" },
  ACTIVE: { label: "Active", className: "bg-blue-100 text-blue-800 border-blue-200" },
  CLOSED: { label: "Completed", className: "bg-gray-100 text-gray-700 border-gray-200" },
};

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, className: "bg-gray-100 text-gray-700 border-gray-200" };
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-2.5 py-1";
  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${sizeClass} ${config.className}`}
    >
      {config.label}
    </span>
  );
}
