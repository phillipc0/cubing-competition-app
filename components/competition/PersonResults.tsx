import { View } from "react-native";
import { Card, CardBody, CardHeader } from "components/ui/card";
import { Text } from "components/ui/text";

type ApiData = {
  data: {
    person: {
      id: string;
      wcaId?: string | null;
      name: string;
      country: { iso2: string };
      results: Array<{
        id: string;
        ranking: number;
        best: number; // centiseconds (WCA-style)
        average: number; // centiseconds (0 if N/A)
        singleRecordTag?: string | null; // "PR" | "NR" | "WR" | null
        averageRecordTag?: string | null; // "PR" | "NR" | "WR" | null
        attempts: Array<{ result: number }>;
        round: {
          id: string;
          name: string; // "First Round", "Second Round", ...
          number: number;
          format: {
            id: string;
            numberOfAttempts: number;
            sortBy: "average" | "single";
          };
          competitionEvent: {
            event: { id: string; name: string; rank: number };
          };
        };
      }>;
    };
  };
};

type Props = { payload: ApiData["data"] };

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

const formatCentiseconds = (cs?: number) => {
  if (!cs || cs <= 0) return "—";
  // handle >= 60s gracefully (e.g., 1:14.81 as in your screenshot)
  const total = Math.floor(cs);
  const sec = Math.floor(total / 100);
  const c = total % 100;
  if (sec >= 60) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${pad(s)}.${pad(c)}`;
  }
  return `${sec}.${pad(c)}`;
};

const toFlagEmoji = (iso2: string) =>
  String.fromCodePoint(
    ...iso2
      .toUpperCase()
      .split("")
      .map((c) => 0x1f1e6 - 65 + c.charCodeAt(0)),
  );

export default function PersonResults({ payload }: Props) {
  const person = payload.person;

  type RoundResult = ApiData["data"]["person"]["results"][number];
  type EventInfo = RoundResult["round"]["competitionEvent"]["event"];

  type GroupItem = {
    event: EventInfo;
    rounds: RoundResult[];
  };

  type GroupMap = Record<string, GroupItem>;

  // Build a strongly-typed map, then take its values
  const groupedMap: GroupMap = person.results.reduce<GroupMap>((acc, r) => {
    const ev = r.round.competitionEvent.event;
    if (!acc[ev.id]) {
      acc[ev.id] = { event: ev, rounds: [] };
    }
    acc[ev.id].rounds.push(r);
    return acc;
  }, {});

  // Now values are GroupItem[], so a/b are typed
  const grouped: GroupItem[] = Object.values(groupedMap).sort(
    (a, b) => a.event.rank - b.event.rank,
  );

  return (
    <View className="gap-6">
      {/* Header */}
      <Card>
        <CardBody>
          <View className="flex-row items-center gap-2">
            <Text className="text-xl font-semibold">{person.name}</Text>
            <Text className="text-xl">{toFlagEmoji(person.country.iso2)}</Text>
          </View>
          {person.wcaId ? (
            <Text className="text-muted-foreground mt-1">
              WCA ID: {person.wcaId}
            </Text>
          ) : (
            <Text className="text-muted-foreground mt-1">Newcomer</Text>
          )}
        </CardBody>
      </Card>

      {/* Per-event cards */}
      {grouped.map(({ event, rounds }: any) => {
        const sortedRounds = rounds.sort(
          (a: any, b: any) => a.round.number - b.round.number,
        );
        const maxCols = Math.max(
          ...sortedRounds.map(
            (r: any) => r.round.format.numberOfAttempts ?? r.attempts.length,
          ),
          5,
        ); // render up to 5 columns like the site
        const attemptHeaders = Array.from({ length: maxCols }, (_, i) => i + 1);

        return (
          <Card key={event.id}>
            <CardHeader>
              <Text className="text-lg font-semibold">{event.name}</Text>
            </CardHeader>
            <CardBody>
              {/* Table header */}
              <View className="flex-row px-1 py-1">
                <Text className="w-10 text-xs text-muted-foreground">#</Text>
                <Text
                  className="text-xs text-muted-foreground"
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                >
                  Round
                </Text>
                {attemptHeaders.map((i) => (
                  <Text
                    key={i}
                    className="w-10 text-xs text-muted-foreground text-center"
                  >
                    {i}
                  </Text>
                ))}
                <Text className="w-16 text-xs text-muted-foreground text-center">
                  Average
                </Text>
                <Text className="w-14 text-xs text-muted-foreground text-center">
                  Best
                </Text>
              </View>

              {/* Rows */}
              {sortedRounds.map((r: any) => {
                const attempts = r.attempts.map((a: any) => a.result);
                const padded = Array.from(
                  { length: maxCols },
                  (_, i) => attempts[i] ?? 0,
                );

                return (
                  <View
                    key={r.id}
                    className="flex-row items-center px-1 py-0.5 border-b border-muted"
                  >
                    <Text className="w-10 text-xs font-medium">
                      {r.ranking ?? "—"}
                    </Text>

                    {/* Round name */}
                    <Text
                      className="text-xs"
                      numberOfLines={1}
                      ellipsizeMode={"tail"}
                      style={{ maxWidth: 30 }}
                    >
                      {r.round.name}
                    </Text>

                    {/* Attempts */}
                    {padded.map((val, idx) => (
                      <Text
                        key={idx}
                        className="w-10 text-xs text-center whitespace-nowrap"
                      >
                        {formatCentiseconds(val)}
                      </Text>
                    ))}

                    {/* Average */}
                    <View className="w-16 flex-row justify-center items-center">
                      <Text className="text-xs font-semibold whitespace-nowrap">
                        {formatCentiseconds(r.average)}
                      </Text>
                      {r.averageRecordTag && (
                        <View className="ml-1 bg-primary rounded px-1">
                          <Text className="text-[9px] font-bold text-primary-foreground">
                            {r.averageRecordTag}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Best */}
                    <View className="w-14 flex-row justify-center items-center">
                      <Text className="text-xs font-semibold whitespace-nowrap">
                        {formatCentiseconds(r.best)}
                      </Text>
                      {!r.averageRecordTag && r.singleRecordTag && (
                        <View className="ml-1 bg-primary rounded px-1">
                          <Text className="text-[9px] font-bold text-primary-foreground">
                            {r.singleRecordTag}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </CardBody>
          </Card>
        );
      })}
    </View>
  );
}
