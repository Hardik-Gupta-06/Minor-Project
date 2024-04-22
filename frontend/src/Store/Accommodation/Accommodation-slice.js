import { createSlice } from '@reduxjs/toolkit';

const accommodationSlice = createSlice({
    name: 'accommodation',
    initialState: {
        accommodation: [],
        loading: false,
        errors: null
    },
    reducers: {
        getAccommodationRequest(state) {
            state.loading = true
        },
        getAccommodation(state , action) {
            state.accommodation = action.payload
            state.loading = false
        },
        getErrors(state , action) {
            state.errors = action.payload
        }
    }
})

export const accommodationActions = accommodationSlice.actions

export default accommodationSlice