const stripe = require("stripe")(process.env.STRIPE_SECRECT_KEY);
const Property = require("../Models/propertyModel");
const Booking = require("../Models/bookingModel");
const moment = require("moment");

exports.getcheckOutSession = async (req, res, next) => {
  const {
    amount,
    currency,
    paymentMethodTypes,
    propertyName
  } = req.body;
  
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: currency || "inr",
      payment_method_types: paymentMethodTypes,
      description: "Payment for testing",
      metadata: {
        propertyName: JSON.stringify(propertyName)
      }
    });
    
    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
    console.log(error);
  }
};

exports.createBookings = async (req, res) => {
  try {
    if (!req.user) {
      throw new Error("Please login First");
    }

    const {
      property,
      price,
      guests,
      fromDate,
      toDate
    } = req.body;

    const fromDateMoment = moment(fromDate);
    const toDateMoment = moment(toDate);
    const numberOfNights = toDateMoment.diff(fromDateMoment, "days");

    const propertyData = await Property.findById(property);
    const isAlreadyBooked = propertyData.currentBookings.some(booking => {
      return (booking.fromDate <= new Date(fromDate) && new Date(fromDate) <= booking.toDate) || 
             (booking.fromDate <= new Date(toDate) && new Date(toDate) <= booking.toDate);
    });

    if (isAlreadyBooked) {
      return res.status(400).json({
        status: "fail",
        message: "The property is already booked for the requested dates."
      });
    }

    const newBooking = await Booking.create({
      property,
      price,
      guests,
      fromDate,
      toDate,
      numberOfnights: numberOfNights,
      user: req.user._id
    });

    const updatedProperty = await Property.findByIdAndUpdate(property, {
      $push: {
        currentBookings: {
          bookingId: newBooking.id,
          fromDate,
          toDate,
          userId: newBooking.user
        }
      }
    }, {
      new: true
    });

    res.status(200).json({
      status: "success",
      data: {
        booking: newBooking,
        updatedProperty
      }
    });
  } catch (error) {
    res.status(401).json({
      status: "fail",
      message: error.message
    });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id
    });
    res.status(200).json({
      status: "success",
      data: {
        bookings
      }
    });
  } catch (error) {
    res.status(401).json({
      status: "fail",
      message: error.message
    });
  }
};

exports.getBookingDetails = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    res.status(200).json({
      status: "success",
      data: {
        bookings: booking
      }
    });
  } catch (error) {
    res.status(401).json({
      status: "fail",
      message: error.message
    });
  }
};