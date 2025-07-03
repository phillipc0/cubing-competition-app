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
  assignmentCode: 'competitor' | 'staff-judge' | 'staff-scrambler' | 'staff-runner';
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

export interface Activity {
  id: number;
  name: string;
  activityCode: string;
  startTime: string;
  endTime: string;
  childActivities: ChildActivity[];
  scrambleSetId: number | null;
}

export interface ChildActivity {
  id: number;
  name: string;
  activityCode: string;
  startTime: string;
  endTime: string;
  assignments: Assignment[];
}