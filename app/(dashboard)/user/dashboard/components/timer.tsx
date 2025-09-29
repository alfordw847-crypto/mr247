"use client";

import { useEffect, useState } from "react";

export default function DigitalTimer() {
  // --- Initial time setup ---
  const initialYears = 2;
  const initialMonths = 10;
  const initialDays = 25;
  const initialHours = 12;
  const initialMinutes = 10;

  // --- Total seconds constants ---
  const SECONDS_IN_MINUTE = 60;
  const SECONDS_IN_HOUR = 60 * SECONDS_IN_MINUTE;
  const SECONDS_IN_DAY = 24 * SECONDS_IN_HOUR;
  const SECONDS_IN_MONTH = 30 * SECONDS_IN_DAY; // approximate
  const SECONDS_IN_YEAR = 365 * SECONDS_IN_DAY; // approximate

  // --- Initial total seconds ---
  const initialSeconds =
    initialYears * SECONDS_IN_YEAR +
    initialMonths * SECONDS_IN_MONTH +
    initialDays * SECONDS_IN_DAY +
    initialHours * SECONDS_IN_HOUR +
    initialMinutes * SECONDS_IN_MINUTE;

  const [secondsElapsed, setSecondsElapsed] = useState(initialSeconds);
  const [totalEarnings, setTotalEarnings] = useState(10000); // starting earnings

  // --- Timer effect ---
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);

      // Add a random amount to earnings every second (0-10000)
      const randomEarn = Math.floor(Math.random() * 10001);
      setTotalEarnings((prev) => prev + randomEarn);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // --- Calculate time units ---
  const years = Math.floor(secondsElapsed / SECONDS_IN_YEAR);
  const months = Math.floor(
    (secondsElapsed % SECONDS_IN_YEAR) / SECONDS_IN_MONTH
  );
  const days = Math.floor((secondsElapsed % SECONDS_IN_MONTH) / SECONDS_IN_DAY);
  const hours = Math.floor((secondsElapsed % SECONDS_IN_DAY) / SECONDS_IN_HOUR);
  const minutes = Math.floor(
    (secondsElapsed % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE
  );
  const seconds = secondsElapsed % SECONDS_IN_MINUTE;

  const timeUnits = [
    { label: "Years", value: years },
    { label: "Months", value: months },
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-r mb-4 from-indigo-500 via-purple-500 to-blue-400 rounded-2xl shadow-xl text-white space-y-6">
      <h2 className="text-xl font-bold">Website Runtime</h2>

      {/* Timer display */}
      <div className="flex gap-2">
        {timeUnits.map((unit, idx) => (
          <div
            key={idx}
            className="bg-black/70 px-4 py-2 rounded-lg shadow-lg text-center min-w-[60px]"
          >
            <p className="text-xl font-mono font-bold">
              {String(unit.value).padStart(2, "0")}
            </p>
            <p className="text-xs mt-1">{unit.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
