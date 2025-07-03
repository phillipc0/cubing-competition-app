import axios from "axios";

import { WcaCompetition, Wcif } from "@/types/wca";

const WCA_API_BASE_URL = "https://api.worldcubeassociation.org/";
const WCA_ORIGIN_URL = "https://www.worldcubeassociation.org/api/v0";

export const getCompetitions = async (): Promise<WcaCompetition[]> => {
  const startDate = new Date().toISOString().split("T")[0];

  const response = await axios.get(`${WCA_API_BASE_URL}/competitions`, {
    params: {
      start: startDate,
      sort: "start_date", // sort by newest first
      per_page: 20,
    },
  });

  return response.data;
};

export const getWcif = async (competitionId: string): Promise<Wcif> => {
  const response = await axios.get(
    `${WCA_ORIGIN_URL}/competitions/${competitionId}/wcif/public`,
  );

  return response.data;
};

export const searchCompetitions = async (
  query: string,
): Promise<WcaCompetition[]> => {
  if (!query) {
    return [];
  }
  const response = await axios.get(`${WCA_API_BASE_URL}/search/competitions`, {
    params: { q: query },
  });

  // Die API gibt das Ergebnis in einem 'result'-Array zurück
  return response.data.result;
};
