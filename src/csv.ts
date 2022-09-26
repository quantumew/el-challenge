import { parse } from 'csv-parse';
import { FoodTruckRecord } from './models';
import { getObject } from './s3';

/**
 * Pulls down CSV data and parses it
 */
export const parseData = async (): Promise<any[]> => {
  // Raw CSV data, all right in memory :-S
  const data = await getObject();

  return new Promise((resolve, reject) => {
    const records: FoodTruckRecord[] = [];

    const parser = parse({
      cast: (value, context) => {
        if (['Longitude', 'Latitude'].includes(context.column as string)) {
          return Number(value);
        }

        return value;
      },
      columns: true,
      trim: true,
    });

    // Stream incoming records into memory
    parser.on('readable', function () {
      let record;
      while ((record = parser.read()) !== null) {
        records.push(record);
      }
    });
    parser.on('error', reject);
    parser.on('end', function () {
      resolve(records);
    });

    parser.write(data);

    parser.end();
  });
};
