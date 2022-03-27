const baseUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?apikey=Z1cG4yVwExfaCPlK8UVUreeoVcZTNaSg'
const apiKey = 'Z1cG4yVwExfaCPlK8UVUreeoVcZTNaSg'

const zipCodeInput = document.querySelector('input#zip-code')
const startDatePicker = document.querySelector('input#date-start')
const endDatePicker = document.querySelector('input#date-end')

const searchButton = document.querySelector('button#search')
const clearButton = document.querySelector('button#clear')
const loadMoreButton = document.querySelector('button#load-more')

const resultsList = document.querySelector('.results-list')

let nextLink = ''

// Use Zippopotam API to convert zip -> lat/long for Ticketmaster API
const getLocationFromZip = async (zipCode) => {
  const url = `https://api.zippopotam.us/us/${zipCode}`
  const res = await axios.get(url)
  const lat = res.data.places[0].latitude
  const long = res.data.places[0].longitude
  return { lat, long }
}

// Add Events to the DOM
const populateEvents = (events) => {
  events.forEach(e => {
    const eventItem = document.createElement('li')
    const eventTitle = document.createElement('h3')
    const eventLocation = document.createElement('div')
    const eventDate = document.createElement('div')
    const eventLink = document.createElement('a')

    eventTitle.innerText = e.name
    eventLocation.innerText = `${e._embedded.venues[0].city.name}, ${e._embedded.venues[0].state.stateCode}`
    eventDate.innerText = (new Date(e.dates.start.dateTime)).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })
    eventLink.innerText = 'More information'
    eventLink.href = './details.html'
    eventLink.addEventListener('click', () => { window.localStorage.setItem('currentEvent', e.id) })

    eventItem.appendChild(eventTitle)
    eventItem.appendChild(eventLocation)
    eventItem.appendChild(eventDate)
    eventItem.appendChild(eventLink)
    resultsList.appendChild(eventItem)
  })
}

// Load existing Events into the DOM
const loadEvents = () => {
  const existingEvents = JSON.parse(window.localStorage.getItem('events') || "[]")
  if (existingEvents) populateEvents(existingEvents)
}

// Store Events on window.localStorage
const storeEvents = (events) => {
  let existingEvents = JSON.parse(window.localStorage.getItem('events'))
  if (!existingEvents) {
    window.localStorage.setItem('events', JSON.stringify(events))
  } else {
    existingEvents.push(...events)
    window.localStorage.setItem('events', JSON.stringify(existingEvents))
  }
}

// Remove Events from DOM and window.localStorage
const clearEvents = () => {
  resultsList.innerHTML = ''
  window.localStorage.removeItem('events')
}

// New search event
searchButton.addEventListener('click', async () => {
  let url = `${baseUrl}&source=ticketmaster&countryCode=US&sort=date,asc&radius=50&unit=miles`

  const zipCode = zipCodeInput.value
  if (zipCode.length > 0) {
    const location = await getLocationFromZip(zipCode);
    url += `&latlong=${location.lat},${location.long}`
  }
  
  const startDate = startDatePicker.value
  const endDate = endDatePicker.value
  if (startDate.length > 0 && endDate.length > 0) {
    url += `&localStartEndDateTime=${startDate}T00:00:00,${endDate}T23:59:59`
  }

  const response = await axios.get(url)
  const events = response.data._embedded.events

  clearEvents()
  storeEvents(events)
  populateEvents(events)

  try {
    nextLink = response.data._links.next.href
    loadMoreButton.classList.remove('hidden')
  } catch {
    loadMoreButton.classList.add('hidden')
  }
})

// Load more search result event
loadMoreButton.addEventListener('click', async () => {
  const url = `https://app.ticketmaster.com${nextLink}&apikey=${apiKey}`
  const response = await axios.get(url)
  const events = response.data._embedded.events
  try {
    nextLink = response.data._links.next.href
    loadMoreButton.classList.remove('hidden')
  } catch {
    loadMoreButton.classList.add('hidden')
  }
  storeEvents(events)
  populateEvents(events)
})

// Clear current search results
clearButton.addEventListener('click', () => {
  clearEvents()
})

loadEvents()

// TO DO
// Show number of results / 0 results case
// Filter validation (future date, end date after start date)
// Add styles