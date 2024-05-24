class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    let filterCriteria = {};
    let queryStringCopy = { ...this.queryString };

    if (queryStringCopy.minPrice && queryStringCopy.maxPrice) {
      if (queryStringCopy.maxPrice.includes(">")) {
        filterCriteria.price = {
          $gte: queryStringCopy.minPrice
        };
      } else {
        filterCriteria.price = {
          $gte: queryStringCopy.minPrice,
          $lte: queryStringCopy.maxPrice
        };
      }
    }

    if (queryStringCopy.propertyType) {
      let propertyTypes = queryStringCopy.propertyType.split(",").map(type => type.trim());
      filterCriteria.propertyType = {
        $in: propertyTypes
      };
    }

    if (queryStringCopy.roomType) {
      filterCriteria.roomType = queryStringCopy.roomType;
    }

    if (queryStringCopy.amenities) {
      filterCriteria["amenities.name"] = {
        $all: queryStringCopy.amenities
      };
    }

    this.query = this.query.find(filterCriteria);
    return this;
  }

  search() {
    let searchCriteria = {};
    let queryStringCopy = { ...this.queryString };

    if (queryStringCopy.city) {
      let cityRegex = queryStringCopy.city.toLowerCase().replaceAll(" ", "");
      searchCriteria = {
        $or: [
          { "address.city": cityRegex },
          { "address.state": cityRegex },
          { "address.area": cityRegex }
        ]
      };
    }

    if (queryStringCopy.guests) {
      searchCriteria.maximumGuest = {
        $gte: queryStringCopy.guests
      };
    }

    if (queryStringCopy.dateIn && queryStringCopy.dateOut) {
      searchCriteria.$and = [{
        currentBookings: {
          $not: {
            $elemMatch: {
              $or: [
                {
                  fromDate: {
                    $lt: queryStringCopy.dateOut
                  },
                  toDate: {
                    $gt: queryStringCopy.dateIn
                  }
                },
                {
                  fromDate: {
                    $lt: queryStringCopy.dateIn
                  },
                  toDate: {
                    $gt: queryStringCopy.dateIn
                  }
                }
              ]
            }
          }
        }
      }];
    }

    this.query = this.query.find(searchCriteria);
    return this;
  }

  paginate() {
    let page = this.queryString.page * 1 || 1;
    let limit = this.queryString.limit * 1 || 12;
    let skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;

  