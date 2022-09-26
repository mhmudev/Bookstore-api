class APIFeatures {
  constructor(queryObject, mongooseQuery) {
    this.queryObject = queryObject;
    this.mongooseQuery = mongooseQuery;
  }

  getAuthorBooks(id) {
    if (id) {
      this.mongooseQuery = this.mongooseQuery.find({ author: id });
    }
    return this;
  }
  filter() {
    const queryObj = { ...this.queryObject };

    const excludeFilters = ["sort", "limit", "page", "fields", "keyword"];

    excludeFilters.forEach((filter) => delete queryObj[filter]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(queryObj);
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
    return this;
  }

  search() {
    console.log(this.queryObject);
    if (this.queryObject.keyword) {
      let query = {};
      query.$or = [
        { title: { $regex: this.queryObject.keyword, $options: "i" } },
        { description: { $regex: this.queryObject.keyword, $options: "i" } },
      ];
      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }

  sort() {
    if (this.queryObject.sort) {
      const query = this.queryObject.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(query);
    }
    return this;
  }

  fields() {
    if (this.queryObject.fields) {
      const query = this.queryObject.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(query);
    }
    return this;
  }

  paginate(numOfDocs) {
    const page = this.queryObject.page || 1;
    const limit = this.queryObject.limit || 0;
    const skip = (page - 1) * limit;
    const pagination = {};
    pagination.limit = +limit;
    pagination.page = +page;
    pagination.numberOfPages = Math.ceil(numOfDocs / limit);

    if (numOfDocs > limit * page) {
      pagination.next = +page + 1;
    }
    if (skip > 0) {
      pagination.prev = page - 1;
    }
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginationResult = pagination;
  }
}

module.exports = APIFeatures;
