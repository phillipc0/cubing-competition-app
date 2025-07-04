import { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";

import { getWcif } from "lib/api/wca";
import { Activity, Assignment, ChildActivity, Person } from "types/wca";
import { subtitle, title } from "components/primitives";
import { Text } from "components/ui/text";
import { Card, CardBody, CardHeader } from "components/ui/card";
import { Spinner } from "components/ui/spinner";
import { Select, SelectItem } from "components/ui/select";
import { groupActivitiesByDay } from "lib/utils";

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
          if (
            assignment &&
            !userGroups.find((ug) => ug.group.id === group.id)
          ) {
            userGroups.push({ group: group, assignment: assignment });
          }
        });
      });
    });
  });
  return userGroups;
};

export default function CompetitionPage() {
  const navigation = useNavigation();
  const { competitionId } = useLocalSearchParams<{ competitionId: string }>();
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);

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

  useFocusEffect(() => {
    if (wcif) {
      navigation.setOptions({ title: wcif.name });
    }
  });

  const competitors = useMemo(() => {
    if (!wcif) return [];
    return wcif.persons
      .filter((p: Person) => p.registration?.status === "accepted")
      .sort((a: Person, b: Person) => a.name.localeCompare(b.name));
  }, [wcif]);

  const userGroups = useMemo(() => {
    return findUserGroups(wcif, Number(selectedPersonId));
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
      <View className="flex-1 justify-center items-center">
        <Spinner label="Loading Competition Data..." />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className={title({ color: "pink" })}>Error</Text>
        <Text className="mt-4 text-center">
          Could not load competition data for {competitionId}.
        </Text>
        <Text className="text-muted-foreground mt-2 text-center">
          This might be due to a network issue or invalid competition ID.
        </Text>
        <Text className="bg-muted p-4 rounded-lg mt-4 text-xs">
          {error?.message}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerClassName="p-6">
      <View className="gap-4">
        <Text className={title()}>{wcif?.name}</Text>

        <View className="w-full my-4">
          <Select
            label="Select a Competitor"
            placeholder="Search for a name"
            selectedValue={selectedPersonId}
            onValueChange={setSelectedPersonId}
          >
            {competitors.map((person: Person) => (
              <SelectItem
                key={person.registrantId}
                label={`${person.name} (${person.wcaId || "Newcomer"})`}
                value={String(person.registrantId)}
              />
            ))}
          </Select>
        </View>

        <View className="w-full gap-10">
          <View>
            <Text className={subtitle()}>My Groups</Text>
            {selectedPersonId ? (
              userGroups.length > 0 ? (
                <View className="gap-4">
                  {userGroups.map(({ group, assignment }) => (
                    <Card key={group.id}>
                      <CardHeader>
                        <Text className="text-md font-semibold">
                          {group.name}
                        </Text>
                      </CardHeader>
                      <CardBody>
                        <Text>
                          Assignment:{" "}
                          <Text className="font-bold text-primary">
                            {assignment.assignmentCode}
                          </Text>
                        </Text>
                        <Text className="text-sm text-muted-foreground">
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
                        </Text>
                      </CardBody>
                    </Card>
                  ))}
                </View>
              ) : (
                <Text>No group assignments found for this competitor.</Text>
              )
            ) : (
              <Text>Please select a competitor to see their groups.</Text>
            )}
          </View>

          <View>
            <Text className={subtitle()}>Schedule</Text>
            <View className="gap-6">
              {Object.entries(scheduleByDay).map(([day, activities]) => (
                <View key={day}>
                  <Text className="text-lg font-bold mb-2">
                    {new Date(day).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                  <View className="gap-4">
                    {(activities as Activity[]).map((activity) => (
                      <Card key={activity.id}>
                        <CardBody>
                          <Text className="font-semibold">{activity.name}</Text>
                          <Text className="text-sm text-muted-foreground">
                            {new Date(activity.startTime).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" },
                            )}{" "}
                            -{" "}
                            {new Date(activity.endTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Text>
                        </CardBody>
                      </Card>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
