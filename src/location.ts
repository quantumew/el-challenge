import { Position, FoodTruckRecord } from './models';

/**
 * Finds distance in KM between two points.
 */
export const distance = (position1: Position, position2: Position): number => {
  const radlat1 = (Math.PI * position1.latitude) / 180;
  const radlat2 = (Math.PI * position2.latitude) / 180;
  const theta = position1.longitude - position2.longitude;
  const radtheta = (Math.PI * theta) / 180;
  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

  dist > 1 ? 1 : dist;
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;

  // KM
  return dist * 1.609344;
};

export const findClosest = (
  location: Position,
  records: FoodTruckRecord[],
): FoodTruckRecord => {
  const nearest = records
    .map((record) => ({
      ...record,
      distance: distance(location, {
        longitude: record.Longitude,
        latitude: record.Latitude,
      }),
    }))
    .sort((a, b) => a.distance - b.distance)[0];

  // Round it and make it human readable
  nearest.humanReadableDistance = `${
    Math.round((nearest.distance + Number.EPSILON) * 100) / 100
  }km`;

  return nearest;
};
