/**
 * Formats a Canadian address string with optional apartment number
 * @param address - Street address
 * @param city - City name
 * @param apartmentNumber - Optional apartment/unit number
 * @param postalCode - Canadian postal code
 * @returns Formatted address string (e.g., "123-456 Main St, Montreal, QC, H1A 1A1")
 */
export const formatAddress = ({
  address,
  city,
  apartmentNumber,
  postalCode,
}: {
  address: string;
  city: string;
  apartmentNumber: string;
  postalCode: string;
}): string => {
  return `${
    apartmentNumber ? `${apartmentNumber}-` : ""
  }${address}, ${city}, QC, ${postalCode}`;
};

/**
 * Formats a number as Canadian currency (CAD)
 * @param amount - The amount to format
 * @param language - Language code for localization (e.g., "en", "fr")
 * @returns Formatted currency string (e.g., "$1,500")
 * @throws Falls back to English locale if the provided language is invalid
 */
export const formatCurrency = ({
  amount,
  language,
}: {
  amount: number;
  language: string;
}): string => {
  try {
    return new Intl.NumberFormat(`${language}-CA`, {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch (error) {
    // Fallback to English if language code is invalid
    return formatCurrency({ amount, language: "en" });
  }
};

/**
 * Formats a date according to Canadian locale standards
 * @param date - The date to format
 * @param language - Language code for localization (e.g., "en", "fr")
 * @returns Formatted date string (e.g., "Jan 15, 2024")
 * @throws Falls back to English locale if the provided language is invalid
 */
export const formatDate = ({
  date,
  language,
}: {
  date: Date;
  language: string;
}): string => {
  try {
    return new Intl.DateTimeFormat(`${language}-CA`, {
      dateStyle: "medium",
    }).format(date);
  } catch (error) {
    // Fallback to English if language code is invalid
    return formatDate({ date, language: "en" });
  }
};


/**
 * Returns the English ordinal suffix for a day-of-month (1 → "st", 2 → "nd",
 * 3 → "rd", 4-20 → "th", 21 → "st", etc).
 */
const getDayOrdinal = (day: number): string => {
  const v = day % 100;
  if (v >= 11 && v <= 13) return "th";
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
};

/**
 * Same as formatDate but, for English locales, appends an ordinal suffix to the
 * day number (e.g. "Jan 15th, 2024" instead of "Jan 15, 2024"). French falls
 * through to formatDate unchanged since French dates only ordinalise the 1st.
 */
export const formatDateWithOrdinal = ({
  date,
  language,
}: {
  date: Date;
  language: string;
}): string => {
  if (language === "fr") return formatDate({ date, language });
  try {
    const parts = new Intl.DateTimeFormat(`${language}-CA`, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).formatToParts(date);
    return parts
      .map(p => (p.type === "day" ? `${p.value}${getDayOrdinal(parseInt(p.value, 10))}` : p.value))
      .join("");
  } catch {
    return formatDate({ date, language });
  }
};

/**
 * Extracts and formats the month name from a date
 * @param date - The date to extract the month from
 * @param language - Language code for localization (e.g., "en", "fr")
 * @returns Full month name (e.g., "January", "Janvier")
 * @throws Falls back to English locale if the provided language is invalid
 */
export const getMonth = ({
  date,
  language,
}: {
  date: Date;
  language: string;
}): string => {
  try {
    return new Intl.DateTimeFormat(`${language}-CA`, {
      month: "long",
    }).format(date);
  } catch (error) {
    // Fallback to English if language code is invalid
    return getMonth({ date, language: "en" });
  }
};
