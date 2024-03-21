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

// login function
function login(event){
   event.preventDefault();
   const email = event.target.email.value;
   const password = event.target.password.value;

   const userLogin = {
       email,
       password
   };

   const mutation = `
       mutation Login($email: String!, $password: String!) {
           login(email: $email, password: $password) {
               id
               name
               token
           }
       }
   `;

   const variables = {
       email: userLogin.email,
       password: userLogin.password
   };

   request('http://localhost:7000/graphql', mutation, variables)
       .then(data => {
           console.log('Login successful:', data);
           // Handle success, maybe redirect to a dashboard page
           const { login } = data;
           if (login.token) {
               localStorage.setItem('token', login.token);
               window.location.href = "../socialMediaApp/socialMediaApp.html";
           }
       })
       .catch(error => {
           console.error('Error logging in:', error);
           // Display error message to the user
           document.body.innerHTML += `<div style="color:red;">${error.message}</div>`;
       });
}

