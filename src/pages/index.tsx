import { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Spinner } from "@heroui/spinner"; // Importiere Spinner, falls nicht vorhanden

import { getCompetitions } from "@/api/wca";
import { subtitle, title } from "@/components/primitives";
import { SearchIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: competitions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["competitions"],
    queryFn: getCompetitions,
  });

  const filteredCompetitions = useMemo(() => {
    if (!competitions) return [];

    return competitions.filter((comp) =>
      comp.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [competitions, searchTerm]);

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
          className="w-full sm:max-w-[44%] my-4"
          placeholder="Search for a competition..."
          startContent={<SearchIcon />}
          value={searchTerm}
          onValueChange={setSearchTerm}
        />

        {isLoading && <Spinner label="Loading competitions..." />}
        {isError && <p className="text-danger">Failed to load competitions.</p>}

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompetitions.map((comp) => (
            <RouterLink key={comp.id} to={`/competition/${comp.id}`}>
              <Card isHoverable isPressable className="h-full">
                <CardHeader>
                  <h4 className="font-bold text-large">{comp.name}</h4>
                </CardHeader>
                <CardBody>
                  <p>{`${comp.city}, ${comp.country_iso2}`}</p>
                  <p className="text-default-500 text-sm">
                    {comp.start_date} to {comp.end_date}
                  </p>
                </CardBody>
              </Card>
            </RouterLink>
          ))}
        </div>
      </section>
    </DefaultLayout>
  );
}
