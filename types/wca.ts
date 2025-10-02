// Typ für die Liste von /v0/competitions
export interface WcaCompetition {
  id: string;
  name: string;
  city: string;
  country_iso2: string;
  start_date: string;
  end_date: string;
  url: string;
}

// Typen für die WCIF-Datei
export interface Wcif {
  id: string;
  name: string;
  persons: Person[];
  events: Event[];
  schedule: Schedule;
}

export interface Person {
  name: string;
  wcaId: string | null;
  wcaUserId: number;
  registrantId: number;
  countryIso2: string;
  gender: string;
  registration: {
    eventIds: string[];
    status: string;
  } | null;
  assignments: Assignment[];
  personalBests: any[]; // Vereinfacht
}

export interface Assignment {
  activityId: number;
  assignmentCode:
    | "competitor"
    | "staff-judge"
    | "staff-scrambler"
    | "staff-runner";
  stationNumber?: number;
}

export interface Event {
  id: string;
  rounds: Round[];
}

export interface Round {
  id: string;
  format: string;
  timeLimit: any;
  cutoff: any;
  advancementCondition: any;
  scrambleSetCount: number;
}

export interface Schedule {
  startDate: string;
  numberOfDays: number;
  venues: Venue[];
}

export interface Venue {
  id: number;
  name: string;
  rooms: Room[];
}

export interface Room {
  id: number;
  name: string;
  activities: Activity[];
}

// Event
export interface Activity {
  id: number;
  name: string;
  activityCode: string;
  startTime: string;
  endTime: string;
  childActivities: ChildActivity[];
  scrambleSetId: number | null;
}

// Rounds
export interface ChildActivity {
  id: number;
  name: string;
  activityCode: string;
  startTime: string;
  endTime: string;
  assignments: Assignment[];
}

export const liveRequestBody = (id: any) => {
  return {
    operationName: "Competitor",
    query:
      "query Competitor($id: ID!) {\n  person(id: $id) {\n    id\n    name\n    wcaId\n    country {\n      iso2\n      __typename\n    }\n    results {\n      id\n      ranking\n      advancing\n      advancingQuestionable\n      attempts {\n        result\n        __typename\n      }\n      best\n      average\n      singleRecordTag\n      averageRecordTag\n      round {\n        id\n        name\n        number\n        competitionEvent {\n          id\n          event {\n            id\n            name\n            rank\n            __typename\n          }\n          __typename\n        }\n        format {\n          id\n          numberOfAttempts\n          sortBy\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}",
    variables: {
      id: "794685",
    },
  };
};
