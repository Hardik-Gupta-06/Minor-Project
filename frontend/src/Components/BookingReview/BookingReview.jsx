import React from "react";
import CityInfo from "./CityInfo";

import "../../CSS/CityInfo.css";

const BookingReview = ({ city, checkinDate, checkoutDate }) => {
	return (
		<div className="booking-review">
			<h1>Booking Review</h1>
			<CityInfo
				city={city}
				checkinDate={checkinDate}
				checkoutDate={checkoutDate}
			/>
		</div>
	);
};

export default BookingReview;
