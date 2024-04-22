import React, { useEffect } from "react";
import "../../CSS/Accomodation.css";
import ProgressSteps from "../ProgressSteps";

import AccomodationForm from "./AccomodationForm";
import MyAccomodation from "./MyAccomdation";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { accommodationActions } from "../../Store/Accommodation/Accommodation-slice";
import { getAllAccommodation } from "../../Store/Accommodation/Accommodation-action";
import LoadingSpinner from "../LoadingSpinner";

const Accomodation = () => {
  const dispatch = useDispatch();
  const { accommodation, loading } = useSelector((state) => state.accommodation);
  console.log(accommodation);

  useEffect(() => {
    dispatch(getAllAccommodation());
  }, [dispatch]);

  return (
    <>
      <ProgressSteps accomodation />
      <div className="accom-container">
        <Link to="/accommodationform">
          <button className="add-new-place">+ Add new place</button>
        </Link>
        {loading && <LoadingSpinner />}
        {accommodation.length === 0 && !loading && (
          <p>Accommodation not available</p>
        )}
        {accommodation.length > 0 && !loading && (
          <MyAccomodation accomodation={accommodation} loading={loading} />
        )}
      </div>
    </>
  );
};

export default Accomodation;
