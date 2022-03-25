const baseUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?apikey=Z1cG4yVwExfaCPlK8UVUreeoVcZTNaSg'
const button = document.querySelector('button')
const zipCodeInput = document.querySelector('input#zip-code')
const startDatePicker = document.querySelector('input#date-start')
const endDatePicker = document.querySelector('input#date-end')
const resultsSection = document.querySelector('.results')
const resultsList = document.querySelector('.results-list')

const populateEvents = (events) => {
  resultsList.innerHTML = ''
  events.forEach(e => {
    let eventItem = document.createElement('li')
    eventItem.innerText = `${e.name} - ${e.dates.start.localDate} - ${e.url}`
    resultsList.appendChild(eventItem)
  })
}

const getLocation = async (zipCode) => {
  let url = `https://api.zippopotam.us/us/${zipCode}`
  let res = await axios.get(url)
  let lat = res.data.places[0].latitude
  let long = res.data.places[0].longitude
  return { lat, long }
}


button.addEventListener('click', async () => {
  let zipCode = zipCodeInput.value
  let location = await getLocation(zipCode);
  let startDate = startDatePicker.value
  let endDate = endDatePicker.value
  let url = `${baseUrl}&localStartEndDateTime=${startDate}T00:00:00,${endDate}T23:59:59&sort=date,asc&radius=50&unit=miles&latlong=${location.lat},${location.long}&source=ticketmaster`
  let response = await axios.get(url)
  console.log(response)
  let events = response.data['_embedded'].events
  populateEvents(events)
})


// TO DO
// Add ability to load more events
// Show number of results
// Handle 0 results case
// Add event type filter
// Optional filters
// Filter validation (future date, end date after start date)
// Add city dropdown (?)
// Event detail page
// Add styles