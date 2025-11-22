import { formatInTimeZone } from "date-fns-tz";
import type { SunTimes } from "@/lib/sun";

interface SunTimesTableProps {
  sunTimes: SunTimes;
  timezone: string;
}

export function SunTimesTable({ sunTimes, timezone }: SunTimesTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse rounded-lg overflow-hidden border border-gray-300" style={{ minWidth: '100%', tableLayout: 'fixed' }}>
        <colgroup>
          <col style={{ width: '60%' }} />
          <col style={{ width: '40%' }} />
        </colgroup>
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-6 py-3 text-left font-semibold text-gray-800">Event</th>
            <th className="border border-gray-300 px-6 py-3 text-left font-semibold text-gray-800">Time</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white">
            <td className="border border-gray-300 px-6 py-3 font-medium text-gray-900">Sunrise</td>
            <td className="border border-gray-300 px-6 py-3 text-gray-700">
              {formatInTimeZone(sunTimes.sunrise, timezone, "h:mm a")}
            </td>
          </tr>
          <tr className="bg-gray-50">
            <td className="border border-gray-300 px-6 py-3 font-medium text-gray-900">Solar Noon</td>
            <td className="border border-gray-300 px-6 py-3 text-gray-700">
              {formatInTimeZone(sunTimes.solarNoon, timezone, "h:mm a")}
            </td>
          </tr>
          <tr className="bg-white">
            <td className="border border-gray-300 px-6 py-3 font-medium text-gray-900">Sunset</td>
            <td className="border border-gray-300 px-6 py-3 text-gray-700">
              {formatInTimeZone(sunTimes.sunset, timezone, "h:mm a")}
            </td>
          </tr>
          <tr className="bg-gray-50">
            <td className="border border-gray-300 px-6 py-3 font-medium text-gray-900">Golden Hour Start</td>
            <td className="border border-gray-300 px-6 py-3 text-gray-700">
              {formatInTimeZone(sunTimes.goldenHourStart, timezone, "h:mm a")}
            </td>
          </tr>
          <tr className="bg-white">
            <td className="border border-gray-300 px-6 py-3 font-medium text-gray-900">Golden Hour End</td>
            <td className="border border-gray-300 px-6 py-3 text-gray-700">
              {formatInTimeZone(sunTimes.goldenHourEnd, timezone, "h:mm a")}
            </td>
          </tr>
          <tr className="bg-gray-50">
            <td className="border border-gray-300 px-6 py-3 font-medium text-gray-900">Civil Dawn</td>
            <td className="border border-gray-300 px-6 py-3 text-gray-700">
              {formatInTimeZone(sunTimes.civilDawn, timezone, "h:mm a")}
            </td>
          </tr>
          <tr className="bg-white">
            <td className="border border-gray-300 px-6 py-3 font-medium text-gray-900">Civil Dusk</td>
            <td className="border border-gray-300 px-6 py-3 text-gray-700">
              {formatInTimeZone(sunTimes.civilDusk, timezone, "h:mm a")}
            </td>
          </tr>
          <tr className="bg-gray-50">
            <td className="border border-gray-300 px-6 py-3 font-medium text-gray-900">Nautical Dawn</td>
            <td className="border border-gray-300 px-6 py-3 text-gray-700">
              {formatInTimeZone(sunTimes.nauticalDawn, timezone, "h:mm a")}
            </td>
          </tr>
          <tr className="bg-white">
            <td className="border border-gray-300 px-6 py-3 font-medium text-gray-900">Nautical Dusk</td>
            <td className="border border-gray-300 px-6 py-3 text-gray-700">
              {formatInTimeZone(sunTimes.nauticalDusk, timezone, "h:mm a")}
            </td>
          </tr>
          <tr className="bg-gray-50">
            <td className="border border-gray-300 px-6 py-3 font-medium text-gray-900">Astronomical Dawn</td>
            <td className="border border-gray-300 px-6 py-3 text-gray-700">
              {formatInTimeZone(sunTimes.astronomicalDawn, timezone, "h:mm a")}
            </td>
          </tr>
          <tr className="bg-white">
            <td className="border border-gray-300 px-6 py-3 font-medium text-gray-900">Astronomical Dusk</td>
            <td className="border border-gray-300 px-6 py-3 text-gray-700">
              {formatInTimeZone(sunTimes.astronomicalDusk, timezone, "h:mm a")}
            </td>
          </tr>
          <tr className="bg-gray-50">
            <td className="border border-gray-300 px-6 py-3 font-medium text-gray-900">Day Length</td>
            <td className="border border-gray-300 px-6 py-3 text-gray-700">
              {Math.floor(sunTimes.daylightDuration / 60)}h {sunTimes.daylightDuration % 60}m
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

