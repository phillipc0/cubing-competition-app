import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectItem } from "@heroui/select";
import { Spinner } from "@heroui/spinner";
import { Card, CardBody, CardHeader } from "@heroui/card";

import { getWcif } from "@/api/wca";
import { Activity, ChildActivity, Person } from "@/types/wca";
import { subtitle, title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

const findUserGroups = (
  wcif: any,
  selectedPersonId: number | null,
): { activity: Activity; group: ChildActivity }[] => {
  if (!selectedPersonId || !wcif?.schedule?.venues) {
    return [];
  }

  const userAssignments: { activity: Activity; group: ChildActivity }[] = [];
  const person = wcif.persons.find(
    (p: Person) => p.registrantId === selectedPersonId,
  );

  if (!person) return [];

  wcif.schedule.venues.forEach((venue: any) => {
    venue.rooms.forEach((room: any) => {
      room.activities.forEach((activity: Activity) => {
        activity.childActivities?.forEach((childActivity: ChildActivity) => {
          childActivity.assignments?.forEach((assignment) => {
            if (
              assignment.assignmentCode === "competitor" &&
              person.assignments.some(
                (pa: any) => pa.activityId === childActivity.id,
              )
            ) {
              if (
                !userAssignments.find((ua) => ua.group.id === childActivity.id)
              ) {
                userAssignments.push({ activity, group: childActivity });
              }
            }
          });
        });
      });
    });
  });

  return userAssignments;
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

  const competitors = useMemo(() => {
    if (!wcif) return [];

    return wcif.persons
      .filter((p) => p.registration?.status === "accepted")
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [wcif]);

  const userGroups = useMemo(() => {
    return findUserGroups(wcif, selectedPersonId);
  }, [wcif, selectedPersonId]);

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
          {/* Spalte für Gruppenzuordnungen */}
          <div>
            <h2 className={subtitle()}>Group Assignments</h2>
            {selectedPersonId ? (
              userGroups.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {userGroups.map(({ activity, group }) => (
                    <Card key={group.id}>
                      <CardHeader>
                        <p className="text-md font-semibold">{activity.name}</p>
                      </CardHeader>
                      <CardBody>
                        <p>
                          Your Group:{" "}
                          <span className="font-bold text-primary">
                            {group.name}
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

          {/* Spalte für den Live-Zeitplan */}
          <div>
            <h2 className={subtitle()}>Live Schedule</h2>
            <div className="flex flex-col gap-4">
              {wcif?.schedule.venues[0].rooms[0].activities.map((activity) => (
                <Card key={activity.id}>
                  <CardBody>
                    <p className="font-semibold">{activity.name}</p>
                    <p className="text-sm text-default-500">
                      {new Date(activity.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
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
        </div>
      </section>
    </DefaultLayout>
  );
}
