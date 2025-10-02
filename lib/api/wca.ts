import axios from "axios";
import { WcaCompetition, Wcif } from "types/wca";

const WCA_API_BASE_URL = "https://api.worldcubeassociation.org/";
const WCA_ORIGIN_URL = "https://www.worldcubeassociation.org/api/v0";

export const getCompetitions = async (): Promise<WcaCompetition[]> => {
  const currentDate = new Date().toISOString().split("T")[0];

  const response = await axios.get(`${WCA_API_BASE_URL}/competitions`, {
    params: {
      ongoing_and_future: currentDate,
      sort: "start_date,end_date,name", // sort by newest, then name
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

  // The API returns the result in a 'result' array
  return response.data.result;
};
