const Product = require("../models/Products.model");

const getAllProductsStatic = async (req, res) => {
  //   const search = "ac";
  //   const products = await Product.find({
  //     name: { $regex: search, $options: "i" },
  //   });

  const products = await Product.find({ price: { $gt: 30 } })
    .sort("price")
    .select("name price");
  // .limit(10)
  // .skip(1);
  res.status(200).json({ nbHits: products.length, products });
};

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numbericFilters } = req.query;
  const queryObject = {};
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }
  if (numbericFilters) {
    //TODO
    console.log(numbericFilters);
  }
  //   console.log(queryObject);
  let result = Product.find(queryObject);
  /** Sort */
  if (sort) {
    sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createAt");
  }

  /** Select */
  if (fields) {
    fieldList = fields.split(",").join(" ");
    result = result.select(fieldList);
  }

  /** Pagination */
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = Number(page - 1) * limit;

  result = result.skip(skip).limit(limit);
  /**
   * 23
   * 4 7 7 7 2
   */

  const products = await result;
  res.status(200).json({ nbHits: products.length, products });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
