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
}

/* Object containing a dictionary of dictionaries */
const sumarys: { [key: string]: { [item: string]: TemperatureSummary } } = {}

/* Function that given the array of TemperatureReadings fills the sumarys object,
  the first dictionaries with cities and the dictionary inside of the cities
  with the dates containing the sumary of that day */
export function processReadings(readings: TemperatureReading[]): void {
  for (let read of readings) {
    let exist = read.city in sumarys ? (read.time.toDateString() in sumarys[read.city]) ? true : false : false
    if (!exist) {
      const cityReadings = readings.filter(
        (item) =>
          item.city === read.city &&
          item.time.toDateString() === read.time.toDateString(),
      )
      let cityFirst = cityReadings[0]
      let cityLast = cityReadings[cityReadings.length - 1]
      let cityHigh = cityReadings.reduce((a, b) =>
        a.temperature > b.temperature ? a : b,
      )
      let cityLow = cityReadings.reduce((a, b) =>
        a.temperature < b.temperature ? a : b,
      )
      let cityDayAvr = 0
      for (let item of cityReadings) {
        cityDayAvr += item.temperature
      }
      cityDayAvr = cityDayAvr / cityReadings.length
      if (read.city in sumarys) {
        sumarys[read.city][read.time.toDateString()] = {
          first: cityFirst.temperature,
          last: cityLast.temperature,
          high: cityHigh.temperature,
          low: cityLow.temperature,
          average: cityDayAvr,
        }
      } else {
        sumarys[read.city] = {
          [read.time.toDateString()]: {
            first: cityFirst.temperature,
            last: cityLast.temperature,
            high: cityHigh.temperature,
            low: cityLow.temperature,
            average: cityDayAvr,
          },
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
  return city in sumarys ? date.toDateString() in sumarys[city] ? sumarys[city][date.toDateString()] : null : null
}
