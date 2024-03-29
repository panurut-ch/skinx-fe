import axios from 'axios';

// Define your login function
export async function login(email: string, password: string) {
  try {
    // Make a POST request to your backend API's login endpoint
    const response = await axios.post('http://localhost:3000/auth/login', {
      email: email,
      password: password
    });

    // Extract the data from the response
    const data = response.data;
    console.log('data', data)

    // Return the data received from the server
    return data;
  } catch (error) {
    // Handle any errors that occur during the login process
    console.error('Login error:', error);
    throw error;
  }
}
