import { useLayoutEffect, useRef } from "react";

const TRACK_ONE = /^%B(\d{1,19})\^([A-Z\s/]{2,26})\^(\d{2})(\d{2})\d{3}.+\?/;
const TRACK_TWO = /^;(\d{1,19})=(\d{2})(\d{2})\d{3}(.+)\?/;

export type MagStripeData = {
  number: string;
  year: string;
  month: string;
  firstName?: string;
  lastName?: string;
};

// Some readers will emit shift and enter keys that we want to ignore.
const IGNORED_KEYS = ["Shift", "Enter"];

// Custom hook to read card data from a mag stripe card reader.
// The callback will be called with the card data when a card is swiped.
export function useCardReader(callback: (data: MagStripeData) => void) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const data = useRef("");

  useLayoutEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (timer.current) clearTimeout(timer.current);

      if (!IGNORED_KEYS.includes(event.key)) {
        data.current += event.key;
      }

      timer.current = setTimeout(() => {
        const card = parseMagStripe(data.current);
        if (card) callback(card);
        data.current = "";
      }, 100);
    };

    document.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [callback]);
}

function parseMagStripe(data: string): MagStripeData | null {
  if (data.match(TRACK_ONE)) return parseTrackOne(data);
  if (data.match(TRACK_TWO)) return parseTrackTwo(data);
  return null;
}

function parseTrackTwo(data: string) {
  const match = data.match(TRACK_TWO);
  if (!match) return null;

  const [, number, year, month, discretionary] = match;

  return {
    number,
    year,
    month,
    discretionary,
  };
}

function parseTrackOne(data: string) {
  const match = data.match(TRACK_ONE);
  if (!match) return null;

  const [, number, name, year, month] = match;

  const [lastName, firstName] = name.split("/").map((n) => n.trim());

  return {
    number,
    firstName,
    lastName,
    year,
    month,
  };
}
