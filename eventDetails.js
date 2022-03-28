const currentEventId = window.localStorage.getItem('currentEvent')
const url =  `https://app.ticketmaster.com/discovery/v2/events/${currentEventId}.json?apikey=Z1cG4yVwExfaCPlK8UVUreeoVcZTNaSg`
const eventDetails = document.querySelector('.event-details')

const loadEvent = async () => {
  const res = await axios.get(url)

  const eventImage = document.createElement('img')
  const eventTitle = document.createElement('h3')
  const eventLocation = document.createElement('div')
  const eventDate = document.createElement('div')
  const eventLink = document.createElement('a')

  eventImage.src = res.data.images[0].url
  eventTitle.innerText = res.data.name
  eventLocation.innerText = `${res.data._embedded.venues[0].city.name}, ${res.data._embedded.venues[0].state.stateCode}`
  eventDate.innerText = (new Date(res.data.dates.start.dateTime)).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })
  eventLink.innerText = 'Buy tickets'
  eventLink.href = res.data.url
  eventLink.setAttribute('target', '_blank')

  eventDetails.appendChild(eventImage)
  eventDetails.appendChild(eventTitle)
  eventDetails.appendChild(eventLocation)
  eventDetails.appendChild(eventDate)
  eventDetails.appendChild(eventLink)
}

loadEvent()