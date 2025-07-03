/**
 * Formats a date range into a user-friendly string.
 * e.g., "Dec 20, 2023" or "Dec 20-22, 2023" or "Dec 30, 2023 - Jan 1, 2024"
 * @param startDateStr - The start date in 'YYYY-MM-DD' format.
 * @param endDateStr - The end date in 'YYYY-MM-DD' format.
 * @returns A formatted string.
 */
export const formatCompetitionDateRange = (
  startDateStr: string,
  endDateStr: string,
): string => {
  const startDate = new Date(startDateStr + "T00:00:00"); // Add time to avoid timezone issues
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
    // Different years: "Dec 30, 2023 - Jan 1, 2024"
    return `${startDate.toLocaleDateString("en-US", endOptions)} - ${endDate.toLocaleDateString("en-US", endOptions)}`;
  }

  if (startMonth !== endMonth) {
    // Same year, different months: "Jan 30 - Feb 2, 2024"
    return `${startDate.toLocaleDateString("en-US", startOptions)} - ${endDate.toLocaleDateString("en-US", endOptions)}`;
  }

  if (startDay !== endDay) {
    // Same year, same month, different days: "Jan 20-22, 2024"
    const startDayStr = startDate
      .toLocaleDateString("en-US", startOptions)
      .split(" ")[1];

    return `${startDate.toLocaleDateString("en-US", startOptions).split(" ")[0]} ${startDayStr}-${endDay}, ${endYear}`;
  }

  // Single day event: "Jan 20, 2024"
  return endDate.toLocaleDateString("en-US", endOptions);
};

/**
 * Groups a list of activities by day.
 * @param activities - Array of WCIF activities.
 * @returns An object where keys are formatted day strings and values are arrays of activities for that day.
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
