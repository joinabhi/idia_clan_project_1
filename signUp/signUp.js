// Define the request function
async function request(url, query, variables) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
    });
    return await response.json();
}

// signUp function
async function signUp(event) {
    event.preventDefault();
  
    const username = document.getElementById('usernameIdd').value;
    const email = document.getElementById('emailIdd').value;
    const password = document.getElementById('passwordIdd').value;
  
    try {
        const mutation = `
            mutation {
                register(registerInput: { username: "${username}", email: "${email}", password: "${password}" }) {
                    id
                    username
                    email
                    token
                }
            }
        `;
         
        document.forms[0].reset(); 
        const response = await request('http://localhost:7000/graphql', mutation);
        console.log("34qwertyuiop", response)
        console.log('User signed up successfully:', response);
        // Handle success, maybe redirect to a login page
    } catch (error) {
        console.error('Error signing up:', error);
        // Display error message to the user
        document.getElementById('error-message').innerText = error.message;
    }
  }
  

