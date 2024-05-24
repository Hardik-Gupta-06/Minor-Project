const Property = require("../Models/propertyModel");
const APIFeatures = require("../utils/APIFeatures");

exports.getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: property
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message
    });
  }
};

exports.createProperty = async (req, res) => {
  try {
    const propertyData = {
      ...req.body,
      userId: req.user.id
    };
    const newProperty = await Property.create(propertyData);
    res.status(200).json({
      status: "success",
      data: {
        property: newProperty
      }
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message
    });
  }
};

exports.getProperties = async (req, res) => {
  try {
    const apiFeatures = new APIFeatures(Property.find(), req.query).filter().search().paginate();
    const allProperties = await Property.find();
    const properties = await apiFeatures.query;
    res.status(200).json({
      status: "success",
      no_of_responses: properties.length,
      all_Properties: allProperties.length,
      data: properties
    });
  } catch (error) {
    console.error("Error searching properties:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
};

exports.getUsersProperties = async (req, res) => {
  try {
    const userId = req.user._id;
    const userProperties = await Property.find({ userId });
    res.status(200).json({
      status: "success",
      data_length: userProperties.length,
      data: userProperties
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message
    });
  }
};


