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

const populateEvents = (events) => {
  events.forEach(e => {
    let eventItem = document.createElement('li')

    let eventTitle = document.createElement('h3')
    eventTitle.innerText = e.name
    let eventDate = document.createElement('div')
    let d = new Date(e.dates.start.localDate)
    eventDate.innerText = d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    let detailLink = document.createElement('a')
    detailLink.innerText = 'More information'
    detailLink.href = './details.html'
    detailLink.addEventListener('click', () => {
      window.localStorage.clear()
      window.localStorage.setItem('currentEvent', e.id)
    })

    eventItem.appendChild(eventTitle)
    eventItem.appendChild(eventDate)
    eventItem.appendChild(detailLink)

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
  resultsList.innerHTML = ''
  populateEvents(events)

  try {
    nextLink = response.data['_links'].next.href
    loadMoreButton.classList.remove('hidden')
  } catch {
    loadMoreButton.classList.add('hidden')
  }
})

loadMoreButton.addEventListener('click', async () => {
  let url = `https://app.ticketmaster.com${nextLink}&apikey=${apiKey}`
  let response = await axios.get(url)
  console.log(response)
  let events = response.data['_embedded'].events
  try {
    nextLink = response.data['_links'].next.href
    loadMoreButton.classList.remove('hidden')
  } catch {
    loadMoreButton.classList.add('hidden')
  }
  populateEvents(events)
})

window.localStorage.clear()

// TO DO
// Show number of results
// Handle 0 results case (?)
// Add event type filter
// Optional filters
// Filter validation (future date, end date after start date)
// Event detail page
// Add styles