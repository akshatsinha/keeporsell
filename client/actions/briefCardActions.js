import axios from 'axios'

export function briefCardRequest() {
    return dispatch => {
        return axios.get('/api/card-brief')
    }
}
