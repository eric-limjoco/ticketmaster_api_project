const baseUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?apikey=Z1cG4yVwExfaCPlK8UVUreeoVcZTNaSg'
const button = document.querySelector('button')
const startDatePicker = document.querySelector('input#date-start')
const endDatePicker = document.querySelector('input#date-end')
const resultsSection = document.querySelector('.results')
const resultsList = document.querySelector('.results-list')

const populateEvents = (events) => {
  resultsList.innerHTML = ''
  events.forEach(e => {
    let eventItem = document.createElement('li')
    eventItem.innerText = `${e.name} - ${e.dates.start.localDate}`
    resultsList.appendChild(eventItem)
  })
}


button.addEventListener('click', async () => {
  let startDate = startDatePicker.value
  let endDate = endDatePicker.value
  let url = `${baseUrl}&countryCode=US&startDateTime=${startDate}T19:02:00Z&endDateTime=${endDate}T19:02:00Z`
  let response = await axios.get(url)
  console.log(response)
  let events = response.data['_embedded'].events
  populateEvents(events)
})