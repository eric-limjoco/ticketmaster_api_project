const eventDetails = document.querySelector('div.event-details')

const loadEvent = async () => {
  let currentEventId = window.localStorage.getItem('currentEvent')
  let url =  `https://app.ticketmaster.com/discovery/v2/events/${currentEventId}.json?apikey=Z1cG4yVwExfaCPlK8UVUreeoVcZTNaSg`
  let res = await axios.get(url)
  console.log(res)

  let eventImage = document.createElement('img')
  eventImage.src = res.data.images[0].url
  let eventTitle = document.createElement('h3')
  eventTitle.innerText = res.data.name
  let eventDate = document.createElement('div')
  let d = new Date(res.data.dates.start.localDate)
  eventDate.innerText = d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  let link = document.createElement('a')
  link.innerText = 'Buy tickets'
  link.href = res.data.url
  link.setAttribute('target', '_blank')

  eventDetails.appendChild(eventImage)
  eventDetails.appendChild(eventTitle)
  eventDetails.appendChild(eventDate)
  eventDetails.appendChild(link)
}

loadEvent()