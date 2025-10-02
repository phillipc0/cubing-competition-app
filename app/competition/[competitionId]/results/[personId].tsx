import { ScrollView, View } from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import PersonResults from "components/competition/PersonResults";
import { Spinner } from "components/ui/spinner";
import { Text } from "components/ui/text";
import { title } from "components/primitives";
import { liveRequestBody } from "~/types/wca";

async function getPersonResults(competitionId: string, personId: string) {
  const res = await fetch(`https://live.worldcubeassociation.org/api`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(liveRequestBody(personId)),
  });
  if (!res.ok) throw new Error("Failed to fetch results");
  let json = await res.json();
  console.log(JSON.stringify(json));
  return json.data as any;
}

export default function CompetitionPersonResultsPage() {
  const navigation = useNavigation();
  const { competitionId, personId } = useLocalSearchParams<{
    competitionId: string;
    personId: string;
  }>();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["personResults", competitionId, personId],
    queryFn: () => getPersonResults(competitionId!, personId!),
    enabled: !!competitionId && !!personId,
  });

  useFocusEffect(() => {
    navigation.setOptions({ title: "Results" });
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Spinner label="Loading results..." />
      </View>
    );
  }

  if (isError || !data?.person) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text className={title({ color: "pink" })}>Couldn’t load results</Text>
        <Text className="text-muted-foreground mt-2 text-center">
          {error instanceof Error ? error.message : "Unknown error"}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerClassName="p-6">
      <PersonResults payload={data} />
    </ScrollView>
  );
}
