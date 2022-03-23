const button = document.querySelector('button')
const userInput = document.querySelector('input')
const resultsSection = document.querySelector('resultsSection')


button.addEventListener('click', async () => {
  let url = 'https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&apikey=Z1cG4yVwExfaCPlK8UVUreeoVcZTNaSg'
  let response = await axios.get(url)
  console.log(response)
  let events = response.data['_embedded'].events
  // let name = response.data['_embedded'].events[0].name
  div.innerText = name
})