const apiKey = `VF.DM.65b48a8ec077b1000606487c.Jh6WTPaXryRjiBTa`; // Voiceflow API key
const userID = `12`; // Unique ID of the user interacting with the Voiceflow project
const versionID = `6597aa6e637dea476a183270`; // Unique ID of the Voiceflow project version to interact with

// POST: Init
const botInit = async () =>{
  try {
    // clear userID to start
    await fetch(`https://general-runtime.voiceflow.com/state/${versionID}/user/${userID}`,
    {
      method: `DELETE`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'Access-Control-Allow-Origin': '*',
    }});
    const response = await fetch(`https://general-runtime.voiceflow.com/state/${versionID}/user/${userID}/interact`,
      {
        method: `POST`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'Access-Control-Allow-Origin': '*',
        }
      });
    const responseData = await response.json();
    
    let list = [];
    for (let i = 0; i < responseData.length; i++) {
      if ( responseData[i].payload && responseData[i].payload.message) {
        list.push(responseData[i].payload.message)
      }
    }
    
    return list[0];
  } catch (error) {
    console.log(error)
  }
}

// PUT: Update 
const botUpdate = async (userInput) => {
  const requestBody = {
    action: {
      type: 'text',
      payload: userInput,
    },
  };
  try {
    const response = await fetch(`https://general-runtime.voiceflow.com/state/${versionID}/user/${userID}/interact`,
      {
        method: `POST`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(requestBody),
      });

    const responseData = await response.json();
    let list = [];
    for (let i = 0; i < responseData.length; i++) {
      if ( responseData[i].payload && responseData[i].payload.message) {
        list.push(responseData[i].payload.message)
      }
    }
    return list;
  } catch (error) {
    console.error('Error updating:', error.message || error);
  }
};


module.exports = {
  botInit, 
  botUpdate
};
