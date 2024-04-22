import { configureStore } from '@reduxjs/toolkit';
import propertySlice from './Property/property-slice';
import propertyDetailsSlice from './PropertyDetails/propertyDetails-slice';
import userSlice from './User/user-slice';
import paymentSlice from './Payment/payment-slice';
import bookingSlice from './Booking/booking-slice';
import accommodationSlice from './Accommodation/Accommodation-slice';

const store = configureStore({
    reducer : {
        properties: propertySlice.reducer,
        propertydetails: propertyDetailsSlice.reducer,
        user: userSlice.reducer,
        payment: paymentSlice.reducer,
        booking: bookingSlice.reducer,
        accommodation: accommodationSlice.reducer
    }
})

export default store;