const button = document.querySelector('button')
const startDatePicker = document.querySelector('input#date-start')
const endDatePicker = document.querySelector('input#date-end')
const resultsSection = document.querySelector('.results')
const resultsList = document.querySelector('.results-list')

const populateEvents = (events) => {
  events.forEach(e => {
    let eventItem = document.createElement('li')
    eventItem.innerText = `${e.name} - ${e.dates.start.localDate}`
    resultsList.appendChild(eventItem)
  })
}


button.addEventListener('click', async () => {
  console.log(startDatePicker.value)
  console.log(endDatePicker.value)
  let url = 'https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&apikey=Z1cG4yVwExfaCPlK8UVUreeoVcZTNaSg'
  let response = await axios.get(url)
  console.log(response)
  let events = response.data['_embedded'].events
  populateEvents(events)
})