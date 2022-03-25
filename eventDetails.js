const eventDetails = document.querySelector('div.event-details')

const loadEvent = async () => {
  const currentEventId = window.localStorage.getItem('currentEvent')
  const url =  `https://app.ticketmaster.com/discovery/v2/events/${currentEventId}.json?apikey=Z1cG4yVwExfaCPlK8UVUreeoVcZTNaSg`
  const res = await axios.get(url)
  console.log(res)

  const eventImage = document.createElement('img')
  eventImage.src = res.data.images[0].url
  const eventTitle = document.createElement('h3')
  eventTitle.innerText = res.data.name
  const eventDate = document.createElement('div')
  const d = new Date(res.data.dates.start.localDate)
  eventDate.innerText = d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const link = document.createElement('a')
  link.innerText = 'Buy tickets'
  link.href = res.data.url
  link.setAttribute('target', '_blank')

  eventDetails.appendChild(eventImage)
  eventDetails.appendChild(eventTitle)
  eventDetails.appendChild(eventDate)
  eventDetails.appendChild(link)
}

loadEvent()