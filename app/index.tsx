import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { Link, useFocusEffect } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";

import { getCompetitions, searchCompetitions } from "lib/api/wca";
import { subtitle, title } from "components/primitives";
import { Text } from "components/ui/text";
import { Card, CardBody, CardHeader } from "components/ui/card";
import { Input } from "components/ui/input";
import { Spinner } from "components/ui/spinner";
import { SearchIcon } from "lib/icons/Search";
import { WcaCompetition } from "types/wca";
import { formatCompetitionDateRange } from "lib/utils";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function IndexPage() {
  const navigation = useNavigation();

  useFocusEffect(() => {
    navigation.setOptions({ title: "Cubing Groups & Live" });
  });

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    data: defaultCompetitions,
    isLoading: isLoadingDefault,
    isError: isErrorDefault,
  } = useQuery<WcaCompetition[]>({
    queryKey: ["competitions", "default"],
    queryFn: getCompetitions,
    enabled: !debouncedSearchTerm,
  });

  const {
    data: searchedCompetitions,
    isLoading: isLoadingSearch,
    isError: isErrorSearch,
  } = useQuery<WcaCompetition[]>({
    queryKey: ["competitions", debouncedSearchTerm],
    queryFn: () => searchCompetitions(debouncedSearchTerm),
    enabled: !!debouncedSearchTerm,
  });

  const isLoading = isLoadingDefault || isLoadingSearch;
  const isError = isErrorDefault || isErrorSearch;
  const competitions = debouncedSearchTerm
    ? searchedCompetitions
    : defaultCompetitions;

  return (
    <View className="flex-1 items-center justify-center p-6 pt-12">
      <View className="w-full max-w-lg items-center justify-center">
        <Text className={title()}>WCA Competitions</Text>
        <Text className={subtitle({ class: "mt-4 text-center" })}>
          Select a competition to see live results and group assignments.
        </Text>
      </View>

      <Input
        placeholder="Search for a competition..."
        value={searchTerm}
        onChangeText={setSearchTerm}
        className="my-6 w-full max-w-md"
        icon={<SearchIcon className="text-foreground" size={18} />}
      />

      <View className="w-full flex-1 min-h-[300px]">
        {isLoading && <Spinner label="Loading..." />}
        {isError && (
          <Text className="text-center text-destructive">
            Failed to load competitions.
          </Text>
        )}
        {!isLoading && !isError && (
          <FlatList
            data={competitions}
            keyExtractor={(item) => item.id}
            numColumns={1}
            contentContainerClassName="gap-4"
            ListEmptyComponent={
              <Text className="col-span-full text-center text-muted-foreground">
                No competitions found.
              </Text>
            }
            renderItem={({ item: comp }) => (
              <Link href={`/competition/${comp.id}`} asChild>
                {/* FIX: Removed className="h-full" from Card */}
                <Card>
                  <CardHeader>
                    <Text className="font-bold text-lg">{comp.name}</Text>
                  </CardHeader>
                  <CardBody>
                    <Text>{`${comp.city}, ${comp.country_iso2}`}</Text>
                    <Text className="text-muted-foreground text-sm">
                      {formatCompetitionDateRange(
                        comp.start_date,
                        comp.end_date,
                      )}
                    </Text>
                  </CardBody>
                </Card>
              </Link>
            )}
          />
        )}
      </View>
    </View>
  );
}
