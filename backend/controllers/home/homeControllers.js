const category = require("../../models/categoryModel");
const { responseReturn } = require("../../utiles/response");
const productModel = require("../../models/productModel");
const queryProducts = require("../../utiles/queryProducts");
const customerModel = require("../../models/customerModel");
const moment = require("moment");
const reviewModel = require("../../models/reviewModel");
const {
  mongo: { ObjectId },
} = require("mongoose");
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes cache

class homeControllers {
  formateProduct = (products) => {
    const productArray = [];
    let i = 0;
    while (i < products.length) {
      let temp = [];
      let j = i;
      while (j < i + 3) {
        if (products[j]) {
          temp.push(products[j]);
        }
        j++;
      }
      productArray.push([...temp]);
      i = j;
    }
    return productArray;
  };

  get_categorys = async (req, res) => {
    try {
      // Check cache first
      const cachedCategories = cache.get('categories');
      if (cachedCategories) {
        return responseReturn(res, 200, { categorys: cachedCategories });
      }

      // If not in cache, fetch from DB
      const categorys = await category.find({});
      
      // Store in cache
      cache.set('categories', categorys);
      
      responseReturn(res, 200, { categorys });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
  // end method
  get_products = async (req, res) => {
    try {
      const products = await productModel.find({}).limit(12).sort({
        createdAt: -1,
      });
      const allProduct1 = await productModel.find({}).limit(9).sort({
        createdAt: -1,
      });
      const latest_product = this.formateProduct(allProduct1);

      const allProduct2 = await productModel.find({}).limit(9).sort({
        rating: -1,
      });
      const topRated_product = this.formateProduct(allProduct2);

      const allProduct3 = await productModel.find({}).limit(9).sort({
        discount: -1,
      });
      const discount_product = this.formateProduct(allProduct3);
      responseReturn(res, 200, {
        products,
        latest_product,
        topRated_product,
        discount_product,
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  // end method

  price_range_product = async (req, res) => {
    try {
      const priceRange = {
        low: 0,
        high: 0,
      };

      const products = await productModel.find({}).limit(9).sort({
        createdAt: -1, // 1 for asc -1 is fpr Desc
      });

      const latest_product = this.formateProduct(products);
      const getForPrice = await productModel.find({}).sort({
        price: 1,
      });
      if (getForPrice.length > 0) {
        priceRange.high = getForPrice[getForPrice.length - 1].price;
        priceRange.low = getForPrice[0].price;
      }
      responseReturn(res, 200, {
        latest_product,
        priceRange,
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  // end method

  query_products = async (req, res) => {
    const parPage = 12;
    req.query.parPage = parPage;
    try {
        let searchQuery = {};
        
        if (req.query.searchValue) {
            searchQuery = {
                $or: [
                    { name: { $regex: req.query.searchValue, $options: 'i' } },
                    { description: { $regex: req.query.searchValue, $options: 'i' } }
                ]
            };
        }

        if (req.query.categories && req.query.categories.length > 0) {
            searchQuery.categories = { $in: req.query.categories };
        }

        const products = await productModel.find(searchQuery).sort({
            createdAt: -1,
        });

        const queryInstance = new queryProducts(products, req.query);
        
        const result = queryInstance
            .categoryQuery()
            .regionQuery()
            .stateQuery()
            .ratingQuery()
            .priceQuery()
            .sortByPrice()
            .skip()
            .limit()
            .getProducts();

        responseReturn(res, 200, {
            products: result,
            totalProduct: queryInstance.countProducts(),
            parPage,
        });
    } catch (error) {
        console.log(error.message);
        responseReturn(res, 500, { error: 'Internal server error' });
    }
  };

  // END METHOD

  product_details = async (req, res) => {
    const { slug } = req.params;
    try {
      const product = await productModel.findOne({ slug });

      const relatedProducts = await productModel
        .find({
          $and: [
            {
              _id: {
                $ne: product.id,
              },
            },
            {
              category: {
                $eq: product.category,
              },
            },
          ],
        })
        .limit(12);
      const moreProducts = await productModel
        .find({
          $and: [
            {
              _id: {
                $ne: product.id,
              },
            },
            {
              sellerId: {
                $eq: product.sellerId,
              },
            },
          ],
        })
        .limit(3);
      responseReturn(res, 200, {
        product,
        relatedProducts,
        moreProducts,
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  // end method

  submit_review = async (req, res) => {
    const { productId, rating, review } = req.body;
    const { id } = req;
    
    try {
        // Get user info
        const user = await customerModel.findById(id);
        if (!user) {
            return responseReturn(res, 404, { error: "User not found" });
        }

        // Validate productId
        const product = await productModel.findById(productId);
        if (!product) {
            return responseReturn(res, 404, { error: "Product not found" });
        }

        const newReview = await reviewModel.create({
            productId,
            userId: id,
            firstName: user.firstName,
            lastName: user.lastName || '',
            rating,
            review,
            date: moment(Date.now()).format("LL"),
        });

        // Calculate average rating
        const reviews = await reviewModel.find({ productId });
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        const productRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

        await productModel.findByIdAndUpdate(productId, {
            rating: productRating,
        });

        responseReturn(res, 201, {
            message: "Review Added Successfully",
            review: newReview
        });
    } catch (error) {
        console.log(error.message);
        responseReturn(res, 500, { error: error.message });
    }
  };
  // end method

  get_reviews = async (req, res) => {
    const { productId } = req.params;
    let { pageNo } = req.query;
    pageNo = parseInt(pageNo);
    const limit = 5;
    const skipPage = limit * (pageNo - 1);
    
    try {
        let getRating = await reviewModel.aggregate([
            {
                $match: {
                    productId: {
                        $eq: new ObjectId(productId),
                    },
                    rating: {
                        $not: {
                            $size: 0,
                        },
                    },
                },
            },
            {
                $unwind: "$rating",
            },
            {
                $group: {
                    _id: "$rating",
                    count: {
                        $sum: 1,
                    },
                },
            },
        ]);

        let rating_review = [
            { rating: 5, sum: 0 },
            { rating: 4, sum: 0 },
            { rating: 3, sum: 0 },
            { rating: 2, sum: 0 },
            { rating: 1, sum: 0 },
        ];

        for (let i = 0; i < rating_review.length; i++) {
            for (let j = 0; j < getRating.length; j++) {
                if (rating_review[i].rating === getRating[j]._id) {
                    rating_review[i].sum = getRating[j].count;
                    break;
                }
            }
        }

        const getAll = await reviewModel.find({ productId });
        const reviews = await reviewModel
            .find({ productId })
            .populate('userId', 'firstName lastName image')
            .skip(skipPage)
            .limit(limit)
            .sort({ createdAt: -1 });

        responseReturn(res, 200, {
            reviews,
            totalReview: getAll.length,
            rating_review,
        });
    } catch (error) {
        console.log(error.message);
        responseReturn(res, 500, { error: error.message });
    }
  };
  // end method
}

module.exports = new homeControllers();

