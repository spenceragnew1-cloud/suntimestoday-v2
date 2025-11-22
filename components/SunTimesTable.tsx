import { format } from "date-fns";
import type { SunTimes } from "@/lib/sun";

interface SunTimesTableProps {
  sunTimes: SunTimes;
}

export function SunTimesTable({ sunTimes }: SunTimesTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">Event</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Time</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">Sunrise</td>
            <td className="border border-gray-300 px-4 py-2">
              {format(sunTimes.sunrise, "h:mm a")}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">Solar Noon</td>
            <td className="border border-gray-300 px-4 py-2">
              {format(sunTimes.solarNoon, "h:mm a")}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">Sunset</td>
            <td className="border border-gray-300 px-4 py-2">
              {format(sunTimes.sunset, "h:mm a")}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">Golden Hour Start</td>
            <td className="border border-gray-300 px-4 py-2">
              {format(sunTimes.goldenHourStart, "h:mm a")}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">Golden Hour End</td>
            <td className="border border-gray-300 px-4 py-2">
              {format(sunTimes.goldenHourEnd, "h:mm a")}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">Civil Dawn</td>
            <td className="border border-gray-300 px-4 py-2">
              {format(sunTimes.civilDawn, "h:mm a")}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">Civil Dusk</td>
            <td className="border border-gray-300 px-4 py-2">
              {format(sunTimes.civilDusk, "h:mm a")}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">Nautical Dawn</td>
            <td className="border border-gray-300 px-4 py-2">
              {format(sunTimes.nauticalDawn, "h:mm a")}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">Nautical Dusk</td>
            <td className="border border-gray-300 px-4 py-2">
              {format(sunTimes.nauticalDusk, "h:mm a")}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">Astronomical Dawn</td>
            <td className="border border-gray-300 px-4 py-2">
              {format(sunTimes.astronomicalDawn, "h:mm a")}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">Astronomical Dusk</td>
            <td className="border border-gray-300 px-4 py-2">
              {format(sunTimes.astronomicalDusk, "h:mm a")}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-medium">Day Length</td>
            <td className="border border-gray-300 px-4 py-2">
              {Math.floor(sunTimes.daylightDuration / 60)}h {sunTimes.daylightDuration % 60}m
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

