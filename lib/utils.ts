import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Assignment } from "~/types/wca";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date range into a user-friendly string.
 */
export const formatCompetitionDateRange = (
  startDateStr: string,
  endDateStr: string,
): string => {
  const startDate = new Date(startDateStr + "T00:00:00");
  const endDate = new Date(endDateStr + "T00:00:00");

  const startOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
  const endOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };

  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();
  const startMonth = startDate.getMonth();
  const endMonth = endDate.getMonth();
  const startDay = startDate.getDate();
  const endDay = endDate.getDate();

  if (startYear !== endYear) {
    return `${startDate.toLocaleDateString("en-US", endOptions)} - ${endDate.toLocaleDateString("en-US", endOptions)}`;
  }

  if (startMonth !== endMonth) {
    return `${startDate.toLocaleDateString("en-US", startOptions)} - ${endDate.toLocaleDateString("en-US", endOptions)}`;
  }

  if (startDay !== endDay) {
    const startDayStr = startDate
      .toLocaleDateString("en-US", startOptions)
      .split(" ")[1];
    return `${startDate.toLocaleDateString("en-US", startOptions).split(" ")[0]} ${startDayStr}-${endDay}, ${endYear}`;
  }

  return endDate.toLocaleDateString("en-US", endOptions);
};

/**
 * Groups a list of activities by day.
 */
export const groupActivitiesByDay = (activities: any[]) => {
  const grouped: Record<string, any[]> = {};
  activities.forEach((activity) => {
    const day = new Date(activity.startTime).toDateString();
    if (!grouped[day]) {
      grouped[day] = [];
    }
    grouped[day].push(activity);
  });
  return grouped;
};

export const mapAssignment = (assignment: Assignment["assignmentCode"]) => {
  switch (assignment) {
    case "competitor":
      return "Competitor";
    case "staff-judge":
      return "Judge";
    case "staff-scrambler":
      return "Scrambler";
    case "staff-runner":
      return "Runner";
    default:
      return assignment;
  }
};
