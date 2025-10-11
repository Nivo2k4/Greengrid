import axios from 'axios';

const apiUrl = import.meta.env.VITE_BASE_URL
export const registerUser = async (userDetails:any) => {
    const response = await axios.post(`${apiUrl}/auth/register`, userDetails);
    return response.data;
}