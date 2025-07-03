import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Spinner } from "@heroui/spinner";

import { getCompetitions, searchCompetitions } from "@/api/wca"; // Updated imports
import { subtitle, title } from "@/components/primitives";
import { SearchIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default";
import { WcaCompetition } from "@/types/wca";
import { useDocumentMetadata } from "@/utils/metadata.ts";
import { formatCompetitionDateRange } from "@/utils/date.ts";

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
  useDocumentMetadata(
    "Cubing Groups & Live",
    "WCA Competition Groups and Live Results combined.",
  );

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms debounce delay

  const {
    data: defaultCompetitions,
    isLoading: isLoadingDefault,
    isError: isErrorDefault,
  } = useQuery<WcaCompetition[]>({
    queryKey: ["competitions", "default"],
    queryFn: getCompetitions,
    // Only enable this query if the debounced search term is empty
    enabled: !debouncedSearchTerm,
  });

  const {
    data: searchedCompetitions,
    isLoading: isLoadingSearch,
    isError: isErrorSearch,
  } = useQuery<WcaCompetition[]>({
    queryKey: ["competitions", debouncedSearchTerm],
    queryFn: () => searchCompetitions(debouncedSearchTerm),
    // Only enable this query if the debounced search term is NOT empty
    enabled: !!debouncedSearchTerm,
  });

  const isLoading = isLoadingDefault || isLoadingSearch;
  const isError = isErrorDefault || isErrorSearch;

  // Determine which list of competitions to display
  const competitions = debouncedSearchTerm
    ? searchedCompetitions
    : defaultCompetitions;

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>WCA Competitions</h1>
          <h2 className={subtitle({ class: "mt-4" })}>
            Select a competition to see live results and group assignments.
          </h2>
        </div>

        <Input
          isClearable
          aria-label="Search"
          className="w-full sm:max-w-[44%]"
          placeholder="Search for a competition..."
          startContent={<SearchIcon />}
          value={searchTerm}
          onValueChange={setSearchTerm}
        />

        <div className="w-full min-h-[300px]">
          {isLoading && (
            <div className="flex justify-center pt-8">
              <Spinner label="Loading..." />
            </div>
          )}
          {isError && (
            <p className="text-center text-danger">
              Failed to load competitions.
            </p>
          )}
          {!isLoading && !isError && (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {competitions && competitions.length > 0 ? (
                competitions.map((comp) => (
                  <RouterLink key={comp.id} to={`/competition/${comp.id}`}>
                    <Card isHoverable isPressable className="h-full">
                      <CardHeader>
                        <h4 className="font-bold text-large">{comp.name}</h4>
                      </CardHeader>
                      <CardBody>
                        <p>{`${comp.city}, ${comp.country_iso2}`}</p>
                        <p className="text-default-500 text-sm">
                          {formatCompetitionDateRange(
                            comp.start_date,
                            comp.end_date,
                          )}
                        </p>
                      </CardBody>
                    </Card>
                  </RouterLink>
                ))
              ) : (
                <p className="col-span-full text-center text-default-500">
                  No competitions found.
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </DefaultLayout>
  );
}
