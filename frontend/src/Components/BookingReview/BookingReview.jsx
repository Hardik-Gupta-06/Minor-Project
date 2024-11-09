import React from "react";
import CityInfo from "./CityInfo";

import "../../CSS/CityInfo.css";

const BookingReview = ({ city }) => {
	return (
		<div className="booking-review">
			<h1>Booking Review</h1>
			<CityInfo city={city} />
		</div>
	);
};

export default BookingReview;
