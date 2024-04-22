import axios from 'axios'
import { accommodationActions } from './Accommodation-slice'

export const createAccommodation = (accommodationData) => async (dispatch) => {
    try {
        dispatch(accommodationActions.getAccommodationRequest())
        const response = await axios.post('/api/v1/rent/user/newAccommodation' , accommodationData)
        if (!response) {
            throw Error('Could not get any Accommodation');
        }
    }
    catch(error) {
        dispatch(accommodationActions.getErrors(error.response.data.message))
    }
} 

export const getAllAccommodation = () => async (dispatch) => {
    try {
        dispatch(accommodationActions.getAccommodationRequest())
        const { data } = await axios.get('/api/v1/rent/user/myAccommodation')
        const accom = data.data
        dispatch(accommodationActions.getAccommodation(accom))
    }
    catch(error) {
        dispatch(accommodationActions.getErrors(error.response.data.message))
    }
}

