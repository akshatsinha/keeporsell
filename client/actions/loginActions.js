import axios from 'axios'

export function loginRequest(userData) {
    return dispatch => {
        return axios.post('/api/login', userData)
    }
}
