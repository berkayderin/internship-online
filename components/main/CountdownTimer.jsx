'use client';

import { useEffect, useState } from 'react';

export function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = new Date(targetDate) - new Date();

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate]);

  return (
    <div className="flex flex-col items-center">
      <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">Başvuruların başlamasına kalan süre</p>
      <div className="flex items-center space-x-2 text-gray-800 dark:text-gray-200">
        <TimeBlock value={timeLeft.days} label="g" />
        <span>:</span>
        <TimeBlock value={timeLeft.hours} label="s" />
        <span>:</span>
        <TimeBlock value={timeLeft.minutes} label="d" />
        <span>:</span>
        <TimeBlock value={timeLeft.seconds} label="s" />
      </div>
    </div>
  );
}

function TimeBlock({ value, label }) {
  return (
    <div className="flex items-baseline">
      <span className="text-xl font-medium">{value.toString().padStart(2, '0')}</span>
      <span className="ml-0.5 text-base">{label}</span>
    </div>
  );
}
