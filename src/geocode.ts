import mapboxgl from "mapbox-gl";
import { useEffect, useState } from "react";

export type Coords = { lat: number; lon: number };

// Session-wide caches. The result cache stores both successes and null results
// so a failing address isn't retried on every render. The in-flight map
// deduplicates concurrent requests for the same address.
const resultCache = new Map<string, Coords | null>();
const inFlight = new Map<string, Promise<Coords | null>>();

const cacheKey = (address: string) => address.trim().toLowerCase();

/**
 * Resolves a free-form address to { lat, lon } via Mapbox's Geocoding API.
 * Cached for the session; concurrent calls for the same address share a fetch.
 */
export const geocodeAddress = async (address: string): Promise<Coords | null> => {
  const key = cacheKey(address);
  if (!key) return null;
  if (resultCache.has(key)) return resultCache.get(key) ?? null;
  if (inFlight.has(key)) return inFlight.get(key)!;

  const url =
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json` +
    `?access_token=${mapboxgl.accessToken}&limit=1`;

  const promise = fetch(url)
    .then(res => (res.ok ? res.json() : null))
    .then(data => {
      const center = data?.features?.[0]?.center;
      const coords = Array.isArray(center) && center.length === 2
        ? { lat: center[1], lon: center[0] }
        : null;
      resultCache.set(key, coords);
      return coords;
    })
    .catch(() => {
      resultCache.set(key, null);
      return null;
    })
    .finally(() => {
      inFlight.delete(key);
    });

  inFlight.set(key, promise);
  return promise;
};

/**
 * Returns `existing` if set, otherwise the geocoded coords for `address`.
 * While geocoding, returns null.
 */
export const useGeocodedLocation = (
  existing: Coords | null | undefined,
  address: string | null | undefined,
): Coords | null => {
  const [coords, setCoords] = useState<Coords | null>(existing ?? null);

  useEffect(() => {
    if (existing) {
      setCoords(existing);
      return;
    }
    if (!address) {
      setCoords(null);
      return;
    }

    // Synchronously use the cached value if we have one to avoid a flash.
    const cached = resultCache.get(cacheKey(address));
    if (cached !== undefined) {
      setCoords(cached);
      return;
    }

    let cancelled = false;
    geocodeAddress(address).then(result => {
      if (!cancelled) setCoords(result);
    });
    return () => {
      cancelled = true;
    };
  }, [existing, address]);

  return coords;
};

// ── Reverse geocoding (coords → human-readable address) ──

export type ReverseResult = {
  /** First comma segment of the full address, e.g. "31 Rue Garneau" */
  shortAddress: string;
  /** Full formatted address, e.g. "31 Rue Garneau, Gatineau, QC J8X 1R7, Canada" */
  fullAddress: string;
};

const reverseCache = new Map<string, ReverseResult | null>();
const reverseInFlight = new Map<string, Promise<ReverseResult | null>>();

// Round coords to ~1m precision so tiny float noise doesn't bust the cache.
const coordKey = (lat: number, lon: number) => `${lat.toFixed(5)},${lon.toFixed(5)}`;

/**
 * Resolves { lat, lon } to a human-readable address via Mapbox.
 * Cached for the session; concurrent calls for the same coords share a fetch.
 */
export const reverseGeocode = async (
  lat: number,
  lon: number,
): Promise<ReverseResult | null> => {
  const key = coordKey(lat, lon);
  if (reverseCache.has(key)) return reverseCache.get(key) ?? null;
  if (reverseInFlight.has(key)) return reverseInFlight.get(key)!;

  const url =
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json` +
    `?access_token=${mapboxgl.accessToken}&limit=1&types=address`;

  const promise = fetch(url)
    .then(res => (res.ok ? res.json() : null))
    .then(data => {
      const feature = data?.features?.[0];
      if (!feature?.place_name) {
        reverseCache.set(key, null);
        return null;
      }
      const fullAddress = feature.place_name as string;
      const shortAddress = fullAddress.split(",")[0].trim();
      const result: ReverseResult = { shortAddress, fullAddress };
      reverseCache.set(key, result);
      return result;
    })
    .catch(() => {
      reverseCache.set(key, null);
      return null;
    })
    .finally(() => {
      reverseInFlight.delete(key);
    });

  reverseInFlight.set(key, promise);
  return promise;
};

/**
 * Returns the reverse-geocoded address for `location`, or null while pending.
 * Uses the session cache synchronously on mount to avoid a flash on revisits.
 */
export const useReverseGeocodedAddress = (
  location: Coords | null | undefined,
): ReverseResult | null => {
  const [result, setResult] = useState<ReverseResult | null>(() => {
    if (!location) return null;
    return reverseCache.get(coordKey(location.lat, location.lon)) ?? null;
  });

  useEffect(() => {
    if (!location) {
      setResult(null);
      return;
    }
    const { lat, lon } = location;
    const cached = reverseCache.get(coordKey(lat, lon));
    if (cached !== undefined) {
      setResult(cached);
      return;
    }
    let cancelled = false;
    reverseGeocode(lat, lon).then(r => {
      if (!cancelled) setResult(r);
    });
    return () => {
      cancelled = true;
    };
  }, [location?.lat, location?.lon]);

  return result;
};

type ListingLike = {
  sys: { id: string };
  location?: Coords | null;
  address?: string | null;
};

/**
 * Given a list of listings, returns a map of id → coords. Listings with an
 * existing `location` are passed through; those with only an `address` are
 * geocoded in the background and filled in as results arrive.
 */
export const useGeocodedLocations = <T extends ListingLike>(
  listings: T[],
): Record<string, Coords | null> => {
  const [resolved, setResolved] = useState<Record<string, Coords | null>>(() => {
    const initial: Record<string, Coords | null> = {};
    listings.forEach(l => {
      if (l.location) initial[l.sys.id] = l.location;
      else if (l.address) {
        const cached = resultCache.get(cacheKey(l.address));
        if (cached !== undefined) initial[l.sys.id] = cached;
      }
    });
    return initial;
  });

  useEffect(() => {
    let cancelled = false;

    listings.forEach(l => {
      if (l.location) {
        setResolved(prev =>
          prev[l.sys.id] === l.location ? prev : { ...prev, [l.sys.id]: l.location! },
        );
        return;
      }
      if (!l.address) return;
      const cached = resultCache.get(cacheKey(l.address));
      if (cached !== undefined) {
        setResolved(prev =>
          l.sys.id in prev ? prev : { ...prev, [l.sys.id]: cached },
        );
        return;
      }
      geocodeAddress(l.address).then(result => {
        if (!cancelled) {
          setResolved(prev => ({ ...prev, [l.sys.id]: result }));
        }
      });
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listings]);

  return resolved;
};
