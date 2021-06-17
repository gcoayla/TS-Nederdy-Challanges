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
    let exist = true
    if (read.city in sumarys) {
      if (!(read.time.toDateString() in sumarys[read.city])) {
        exist = false
      }
    } else {
      exist = false
    }
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
      let cityAvr = 0
      for (let item of cityReadings) {
        cityAvr += item.temperature
      }
      cityAvr = cityAvr / cityReadings.length
      if (read.city in sumarys) {
        sumarys[read.city][read.time.toDateString()] = {
          first: cityFirst.temperature,
          last: cityLast.temperature,
          high: cityHigh.temperature,
          low: cityLow.temperature,
          average: cityAvr,
        }
      } else {
        sumarys[read.city] = {
          [read.time.toDateString()]: {
            first: cityFirst.temperature,
            last: cityLast.temperature,
            high: cityHigh.temperature,
            low: cityLow.temperature,
            average: cityAvr,
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
  if (city in sumarys) {
    if (date.toDateString() in sumarys[city]) {
      return sumarys[city][date.toDateString()]
    }
  }
  return null
}
