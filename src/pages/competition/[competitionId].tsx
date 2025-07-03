import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectItem } from "@heroui/select";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Spinner } from "@heroui/spinner";

import { getWcif } from "@/api/wca";
import { Activity, Assignment, ChildActivity, Person } from "@/types/wca"; // Simplified imports
import { subtitle, title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { useDocumentMetadata } from "@/utils/metadata";
import { groupActivitiesByDay } from "@/utils/date";

const findUserGroups = (wcif: any, selectedPersonId: number | null) => {
  if (!selectedPersonId || !wcif) return [];

  const person = wcif.persons.find(
    (p: Person) => p.registrantId === selectedPersonId,
  );

  if (!person || !person.assignments) return [];

  const userGroups: { group: ChildActivity; assignment: Assignment }[] = [];

  wcif.schedule.venues.forEach((venue: any) => {
    venue.rooms.forEach((room: any) => {
      room.activities.forEach((round: Activity) => {
        round.childActivities?.forEach((group: ChildActivity) => {
          const assignment: Assignment | undefined = person.assignments.find(
            (a: any) => a.activityId === group.id,
          );

          if (assignment) {
            // Check if we haven't already added this group
            if (!userGroups.find((ug) => ug.group.id === group.id)) {
              userGroups.push({
                group: group,
                assignment: assignment,
              });
            }
          }
        });
      });
    });
  });

  return userGroups;
};

export default function CompetitionPage() {
  const { competitionId } = useParams<{ competitionId: string }>();
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);

  const {
    data: wcif,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["wcif", competitionId],
    queryFn: () => getWcif(competitionId!),
    enabled: !!competitionId,
  });

  // Set metadata dynamically
  useDocumentMetadata(
    wcif ? `${wcif.name}` : "Loading Competition...",
    wcif ? `Live results and groups for ${wcif.name}` : "WCA competition data",
  );

  const competitors = useMemo(() => {
    if (!wcif) return [];

    return wcif.persons
      .filter((p) => p.registration?.status === "accepted")
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [wcif]);

  const userGroups = useMemo(() => {
    return findUserGroups(wcif, selectedPersonId);
  }, [wcif, selectedPersonId]);

  const scheduleByDay = useMemo(() => {
    if (!wcif) return {};
    const allActivities = wcif.schedule.venues.flatMap((v: any) =>
      v.rooms.flatMap((r: any) => r.activities),
    );

    return groupActivitiesByDay(allActivities);
  }, [wcif]);

  if (isLoading) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center h-full">
          <Spinner label="Loading Competition Data..." />
        </div>
      </DefaultLayout>
    );
  }

  if (isError) {
    return (
      <DefaultLayout>
        <div className="text-center">
          <h1 className={title({ color: "pink" })}>Error</h1>
          <p className="mt-4">
            Could not load competition data for {competitionId}.
          </p>
          <p className="text-default-500 mt-2">
            This might be due to a CORS issue. Try enabling a CORS proxy or
            check the console.
          </p>
          <pre className="text-left bg-default-100 p-4 rounded-lg mt-4 text-xs overflow-auto">
            {error?.message}
          </pre>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <section className="flex flex-col items-start justify-center gap-4 py-8 md:py-10">
        <h1 className={title()}>{wcif?.name}</h1>

        <div className="w-full md:w-1/2 lg:w-1/3 my-4">
          <Select
            label="Select a Competitor"
            placeholder="Search for a name"
            onChange={(e) => setSelectedPersonId(Number(e.target.value))}
          >
            {competitors.map((person) => (
              <SelectItem key={person.registrantId}>
                {`${person.name} (${person.wcaId || "Newcomer"})`}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className={subtitle()}>My Groups</h2>
            {selectedPersonId ? (
              userGroups.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {userGroups.map(({ group, assignment }) => (
                    <Card key={group.id}>
                      <CardHeader>
                        <p className="text-md font-semibold">{group.name}</p>
                      </CardHeader>
                      <CardBody>
                        <p>
                          Assignment:{" "}
                          <span className="font-bold text-primary">
                            {assignment.assignmentCode}
                          </span>
                        </p>
                        <p className="text-sm text-default-500">
                          Time:{" "}
                          {new Date(group.startTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          -{" "}
                          {new Date(group.endTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              ) : (
                <p>No group assignments found for this competitor.</p>
              )
            ) : (
              <p>Please select a competitor to see their groups.</p>
            )}
          </div>

          <div>
            <h2 className={subtitle()}>Schedule</h2>
            <div className="flex flex-col gap-6">
              {Object.entries(scheduleByDay).map(([day, activities]) => (
                <div key={day}>
                  <h3 className="text-lg font-bold mb-2">
                    {new Date(day).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </h3>
                  <div className="flex flex-col gap-4">
                    {activities.map((activity) => (
                      <Card key={activity.id}>
                        <CardBody>
                          <p className="font-semibold">{activity.name}</p>
                          <p className="text-sm text-default-500">
                            {new Date(activity.startTime).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" },
                            )}{" "}
                            -{" "}
                            {new Date(activity.endTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
