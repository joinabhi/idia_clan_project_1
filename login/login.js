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
   const email = document.getElementById('email').value; // Assuming this is the id of your email input field
   const password = document.getElementById('password').value; 

   const userLogin = {
       email,
       password
   };

//    const mutation = `
//    mutation Login($email: String!, $password: String!) {
//            login(email: $email, password: $password) {
//                id
//                email
//                token
//            }
//        }
//    `;

const mutation = `
   mutation login($email: String!, $password: String!) {
       login(email: $email, password: $password) {
           id
           email
           token
       }
   }
`;

console.log("mutation", mutation)



   const variables = {
       email: userLogin.email,
       password: userLogin.password
   };

   console.log("variables", variables)

   request('http://localhost:7000/graphql', mutation, variables)
       .then(data => {
           console.log('Login successful:', data);
           // Handle success, maybe redirect to a dashboard page
           localStorage.setItem('token', data.data.login.token)
               window.location.href = "../socialMediaApp/socialMediaApp.html";
           
       })
       .catch(error => {
           console.error('Error logging in:', error);
           // Display error message to the user
           document.body.innerHTML += `<div style="color:red;">${error.message}</div>`;
       });
}

