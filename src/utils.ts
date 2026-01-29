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
