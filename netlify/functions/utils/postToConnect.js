const fetch = require('node-fetch')

exports.postToConnect = async ({ query, variables }) => {
  try {
    const result = await fetch(process.env.CONNECT_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ` + process.env.CONNECT_API_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    }).then((res) => res.json())

    if (result.errors) {
      console.log({ errors: result.errors })
    } else if (!result || !result.data) {
      console.log({ result })
      return 'No results found.'
    }

    return result.data
  } catch (error) {
    console.log(error)
  }
}
