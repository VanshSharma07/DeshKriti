const formidable = require("formidable");
const { responseReturn } = require("../../utiles/response");
const cloudinary = require("cloudinary").v2;
const productModel = require("../../models/productModel");

class productController {
  add_product = async (req, res) => {
    const { id } = req;
    const form = formidable({ multiples: true });

    form.parse(req, async (err, field, files) => {
      if (err) {
        return responseReturn(res, 500, { error: "Form parsing failed" });
      }
      let {
        name,
        categories,
        description,
        stock,
        price,
        discount,
        shopName,
        brand,
        region,
        state,
      } = field;
      let { images } = files;

      if (!Array.isArray(images)) {
        images = [images]; // Assurez-vous que images est un tableau
      }

      name = name.trim();
      const slug = name.split(" ").join("-");

      cloudinary.config({
        cloud_name: process.env.cloud_name,
        api_key: process.env.api_key,
        api_secret: process.env.api_secret,
        secure: true,
      });

      try {
        let allImageUrl = [];

        for (let i = 0; i < images.length; i++) {
          try {
            const result = await cloudinary.uploader.upload(
              images[i].filepath,
              { folder: "products" }
            );
            allImageUrl.push(result.url);
          } catch (uploadError) {
            console.error("Cloudinary upload error:", uploadError);
            return responseReturn(res, 500, { error: "Image upload failed" });
          }
        }
        await productModel.create({
          sellerId: id,
          name,
          slug,
          shopName,
          description: description.trim(),
          stock: parseInt(stock),
          price: parseInt(price),
          discount: parseInt(discount),
          images: allImageUrl,
          brand: brand.trim(),
          categories: JSON.parse(categories),
          region: region ? region.trim() : '',
          state: state ? state.trim() : ''
        });

        responseReturn(res, 201, { message: "Product Added Successfully" });
      } catch (error) {
        console.error("Product creation error:", error);
        responseReturn(res, 500, { error: error.message });
      }
    });
  };

  /// end method

  products_get = async (req, res) => {
    const { page, searchValue, parPage } = req.query;
    const { id } = req;

    const skipPage = parseInt(parPage) * (parseInt(page) - 1);

    try {
      if (searchValue) {
        const products = await productModel
          .find({
            $text: { $search: searchValue },
            sellerId: id,
          })
          .skip(skipPage)
          .limit(parPage)
          .sort({ createdAt: -1 });
        const totalProduct = await productModel
          .find({
            $text: { $search: searchValue },
            sellerId: id,
          })
          .countDocuments();
        responseReturn(res, 200, { products, totalProduct });
      } else {
        const products = await productModel
          .find({ sellerId: id })
          .skip(skipPage)
          .limit(parPage)
          .sort({ createdAt: -1 });
        const totalProduct = await productModel
          .find({ sellerId: id })
          .countDocuments();
        responseReturn(res, 200, { products, totalProduct });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  /// end method

  product_get = async (req, res) => {
    const { productId } = req.params;
    try {
      const product = await productModel.findById(productId);
      responseReturn(res, 200, { product });
    } catch (error) {
      console.log(error.message);
    }
  };

  /// end method

  product_update = async (req, res) => {
    let {
        name,
        category,
        description,
        stock,
        price,
        discount,
        brand,
        productId,
        region,
        state
    } = req.body;
    
    name = name.trim();
    const slug = name.split(" ").join("-");

    try {
        const updatedProduct = await productModel.findByIdAndUpdate(
            productId, 
            {
                name,
                categories: [category],
                description,
                stock,
                price,
                discount,
                brand,
                slug,
                region,
                state
            }, 
            { new: true }
        );

        responseReturn(res, 200, {
            product: updatedProduct,
            message: "Product Updated Successfully",
        });
    } catch (error) {
        responseReturn(res, 500, { error: error.message });
    }
  };
  /// end method
  product_image_update = async (req, res) => {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, field, files) => {
      const { oldImage, productId } = field;
      const { newImage } = files;

      if (err) {
        responseReturn(res, 400, { error: err.message });
      } else {
        try {
          cloudinary.config({
            cloud_name: process.env.cloud_name,
            api_key: process.env.api_key,
            api_secret: process.env.api_secret,
            secure: true,
          });

          const result = await cloudinary.uploader.upload(newImage.filepath, {
            folder: "products",
          });

          if (result) {
            let { images } = await productModel.findById(productId);
            const index = images.findIndex((img) => img === oldImage);
            images[index] = result.url;
            await productModel.findByIdAndUpdate(productId, { images });

            const product = await productModel.findById(productId);
            responseReturn(res, 200, {
              product,
              message: "Product Image Updated Successfully",
            });
          } else {
            responseReturn(res, 404, { error: "Image Upload Failed" });
          }
        } catch (error) {
          responseReturn(res, 404, { error: error.message });
        }
      }
    });
  };
  // End Method

  deleteProduct = async (req, res) => {
    try {
      const productId = req.params.id;
      const deleteProduct = await productModel.findByIdAndDelete(productId);
      if (!deleteProduct) {
        console.log(`Product with id ${productId} not found`);
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.log(`Error delete product with id ${productId}:`, error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  // end method

  get_products = async (req, res) => {
    try {
      // Use lean() for better performance when you don't need Mongoose documents
      const products = await productModel
        .find({})
        .select('name price stock images') // Select only needed fields
        .lean()
        .limit(20);

      responseReturn(res, 200, { products });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
}

module.exports = new productController();
