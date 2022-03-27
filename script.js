const baseUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?apikey=Z1cG4yVwExfaCPlK8UVUreeoVcZTNaSg'
const apiKey = 'Z1cG4yVwExfaCPlK8UVUreeoVcZTNaSg'
const button = document.querySelector('button#search')
const zipCodeInput = document.querySelector('input#zip-code')
const startDatePicker = document.querySelector('input#date-start')
const endDatePicker = document.querySelector('input#date-end')
const resultsSection = document.querySelector('.results')
const resultsList = document.querySelector('.results-list')
const loadMoreButton = document.querySelector('button#load-more')
let nextLink = ''

const clearEvents = () => {
  resultsList.innerHTML = ''
  window.localStorage.removeItem('events')
}

const storeEvents = (events) => {
  let existingEvents = JSON.parse(window.localStorage.getItem('events'))
  if (!existingEvents) {
    window.localStorage.setItem('events', JSON.stringify(events))
  } else {
    existingEvents.push(...events)
    window.localStorage.setItem('events', JSON.stringify(existingEvents))
  }
}

const populateEvents = (events) => {
  events.forEach(e => {
    const eventItem = document.createElement('li')
    const eventTitle = document.createElement('h3')
    eventTitle.innerText = e.name
    const eventLocation = document.createElement('div')
    eventLocation.innerText = `${e._embedded.venues[0].city.name}, ${e._embedded.venues[0].state.stateCode}`
    const eventDate = document.createElement('div')
    const d = new Date(e.dates.start.dateTime)
    eventDate.innerText = d.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })
    const detailLink = document.createElement('a')
    detailLink.innerText = 'More information'
    detailLink.href = './details.html'
    detailLink.addEventListener('click', () => {
      window.localStorage.setItem('currentEvent', e.id)
    })

    eventItem.appendChild(eventTitle)
    eventItem.appendChild(eventLocation)
    eventItem.appendChild(eventDate)
    eventItem.appendChild(detailLink)

    resultsList.appendChild(eventItem)
  })
}

const getLocation = async (zipCode) => {
  const url = `https://api.zippopotam.us/us/${zipCode}`
  const res = await axios.get(url)
  const lat = res.data.places[0].latitude
  const long = res.data.places[0].longitude
  return { lat, long }
}


button.addEventListener('click', async () => {
  const zipCode = zipCodeInput.value
  const location = await getLocation(zipCode);
  const startDate = startDatePicker.value
  const endDate = endDatePicker.value
  const url = `${baseUrl}&localStartEndDateTime=${startDate}T00:00:00,${endDate}T23:59:59&sort=date,asc&radius=50&unit=miles&latlong=${location.lat},${location.long}&source=ticketmaster`
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

const loadEvents = () => {
  let existingEvents = JSON.parse(window.localStorage.getItem('events') || "[]")
  if (existingEvents) populateEvents(existingEvents)
}

loadEvents()

// TO DO
// Show number of results / 0 results case
// Optional filters
// Filter validation (future date, end date after start date)
// Add styles