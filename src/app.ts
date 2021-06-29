/* eslint-disable */
// example interfaces that can be use
// TIP: the types mentioned in the interfaces must be fulfilled in order to solve the problem.
interface TemperatureReading {
  time: Date
  temperature: number
  city: string
}
interface TemperatureSummary {
  first: number
  last: number
  high: number
  low: number
  average: number
  accumAvr?: number
  regCount?: number
}
/* accumAvr and regCount properties only are present in 'historic' key of each city */

/* Object containing a dictionary of dictionaries */
const sumarys: {
  [key: string]: {
    [item: string]: TemperatureSummary
  }
} = {}

/* Checks if given city and day in that city exist in the sumarys object */
function ifExist(city: string, date: string): boolean {
  return city in sumarys && (date in sumarys[city]);
}

/* Function that given the array of TemperatureReadings fills the sumarys object,
  the first dictionaries with cities and the dictionary inside of the cities
  with the dates containing the sumary of that day */
export function processReadings(readings: TemperatureReading[]): void {
  for (let read of readings) {
    let exist = ifExist(read.city, read.time.toDateString());
    if (!exist) {
      const cityDayReadings = readings.filter(
        (item) =>
          item.city === read.city &&
          item.time.toDateString() === read.time.toDateString(),
      )
      let cityDayFirst = cityDayReadings[0]
      let cityDayLast = cityDayReadings[cityDayReadings.length - 1]
      let cityDayHigh = -200;
      let cityDayLow = 300;
      let cityDayAvr = 0;
      for (let item of cityDayReadings) {
        cityDayHigh = Math.max(cityDayHigh, item.temperature);
        cityDayLow = Math.min(cityDayLow, item.temperature);
        cityDayAvr += item.temperature;
      }
      cityDayAvr = cityDayAvr / cityDayReadings.length
      if (read.city in sumarys) {
        sumarys[read.city][read.time.toDateString()] = {
          first: cityDayFirst.temperature,
          last: cityDayLast.temperature,
          high: cityDayHigh,
          low: cityDayLow,
          average: cityDayAvr,
        }
        sumarys[read.city]['historic'].high = Math.max(sumarys[read.city]['historic'].high, cityDayHigh);
        sumarys[read.city]['historic'].low = Math.min(sumarys[read.city]['historic'].low, cityDayLow);
        sumarys[read.city]['historic'].accumAvr! += cityDayAvr;
        sumarys[read.city]['historic'].regCount! += 1;
        sumarys[read.city]['historic'].average = sumarys[read.city]['historic'].accumAvr! / sumarys[read.city]['historic'].regCount!;
      } else {
        sumarys[read.city] = {
          [read.time.toDateString()]: {
            first: cityDayFirst.temperature,
            last: cityDayLast.temperature,
            high: cityDayHigh,
            low: cityDayLow,
            average: cityDayAvr,
          },
        }
        sumarys[read.city]['historic'] = {
          first: 0,
          last: 0,
          high: cityDayHigh,
          low: cityDayLow,
          average: cityDayAvr,
          accumAvr: cityDayAvr,
          regCount: 1
        }
      }
    }
  }
}

/* Function that only reads the sumarys object and returns null if the entry doesnt exist */
export function getTemperatureSummary(
  date: Date,
  city: string,
): TemperatureSummary | null {
  return ifExist(city, date.toDateString()) ? sumarys[city][date.toDateString()] : null
}
