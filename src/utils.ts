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
}) => {
  return `${
    apartmentNumber ? `${apartmentNumber}-` : ""
  }${address}, ${city}, QC, ${postalCode}`;
};

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
    return formatCurrency({ amount, language: "en" });
  }
};

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
    return formatDate({ date, language: "en" });
  }
};


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
    return getMonth({ date, language: "en" });
  }
};
