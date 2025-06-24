const express = require("express")
const Product = require("../models/Product")
const { protect, admin } = require("../middlewares/authMiddleware")

const router = express.Router();

//@route POST / /api / products
//@desc Create a new Product
//@access private / Admin

router.post("/", protect, admin, async(req, res) => {
    try {
        const {name, description, price, discountPrice, countInStock, category, colors, sizes, images, brand, collections, material, gender, isFeatured, isPublished, tags, dimensions, weight, sku } = req.body;

        const product = new Product({
            name, description, price, discountPrice, countInStock, category, colors, sizes, images, brand, collections, material, gender, isFeatured, isPublished, tags, dimensions, weight, sku, user: req.user._id,
        })

        const createdProduct = await product.save()
        res.status(201).json(createdProduct)

    } catch (error) {
        console.error(error)
        res.status(500).send("Server Error")
    }
})

// @route Put / api / products / :id
// @desc Update an existing product Id
// @access Private  / Admin

router.put("/:id", protect, admin, async (req, res) => {
    try {
         const {name, description, price, discountPrice, countInStock, category, colors, sizes, images, brand, collections, material, gender, isFeatured, isPublished, tags, dimensions, weight, sku } = req.body;

         // Find product by Id
         const product = await Product.findById(req.params.id)

         if(product) {
            // Update product fields
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.discountPrice = discountPrice || product.discountPrice;
            product.countInStock = countInStock || product.countInStock;
            product.category = category || product.category;
            product.colors = colors || product.colors;
            product.sizes = sizes || product.sizes;
            product.images = images || product.images;
            product.brand = brand || product.brand;
            product.collections = collections || product.collections;
            product.material = material || product.material;
            product.gender = gender || product.gender;
            product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
            product.isPublished = isPublished !== undefined ? isPublished : product.isPublished;
            product.tags = tags || product.tags;
            product.dimensions = dimensions || product.dimensions;
            product.weight = weight || product.weight;
            product.sku = sku || product.sku;


            // Save the Updated products to database
            const updatedProduct = await product.save();
            res.json(updatedProduct);
         } else {
            res.status(404).json({ message: "Product not found" });
         }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error")
    }
})

//@route Delete / api / products / :id
//@desc Delete an existing product Id
//@access Private  / Admin
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        // Find the product by ID
        const product = await Product.findById(req.params.id);

        if (product) {
            // Remove the product from DB
            await product.deleteOne();
            res.json({ message: "Product removed" });
        } else{
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error")
    }
})

//@route GET / api / products
//@desc get all products with optional query filters
//@access Public

router.get("/", async (req, res) =>
    {
        try {
            const { collection, size, color, gender, minPrice, maxPrice, sortBy, search, category, material, brand, limit } = req.query;

            let query = {};

            //filter logic

            if(collection && collection.toLocaleLowerCase() !== "all") {
                query.collection = collection;
            }

             if(category && category.toLocaleLowerCase() !== "all") {
                query.category = category;
            }

            if(material){
                query.material = { $in: material.split(",") }
            }

             if(brand){
                query.brand = { $in: brand.split(",") }
            }

             if(size){
                query.sizes = { $in: size.split(",") }
            }

             if(color){
                query.colors = { $in: [color] }
            }

            if(gender){
                query.gender = gender;
            }

            if(minPrice || maxPrice){
                query.price = {};
                if(minPrice) query.price.$gte = Number(minPrice);
                if(maxPrice) query.price.$lte = Number(maxPrice);
            }

            if(search){
                query.$or = [
                    { name: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } },
                ];
            }

            //Sort Logic
            let sort = {};
            if(sortBy){
                switch(sortBy){
                    case "priceAsc":
                        sort = { price: 1 };
                        break;
                        case "priceDesc":
                            sort = { price: -1 };
                            break;
                            case "popularity":
                                sort = { rating: -1 };
                                break;
                                default:
                                   break;
                }
            }


            //Fetch products and apply sorting and limit
            let products = await Product.find(query).sort(sort)
            .limit(Number(limit) || 0);
            res.json(products);
        } catch{
            console.error(error);
            res.status(500).send("Server Error");
        }
    }
)

// @route GET /api/products/best-seller
// @desc Retrieve the product with highest rating
// @access public
router.get("/best-seller", async (req, res) =>
    {
        try{
            const bestSeller = await Product.findOne().sort({ rating: -1 });
            if(bestSeller){
                res.json(bestSeller);
            }
            else{
                res.status(404).send("No best seller found");
                }
        } catch (error) {
            console.error(error);
            res.status(500).send("Server Error");
        }
    })

 // @route GET /api/products/new-arrivals
 // @desc Retrieve latest 8 products - Creation date
 // @access Public
 router.get("/new-arrivals", async (req, res) =>
    {
        try{
            //fetch latest 8 products
            const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8);
            res.json(newArrivals);
            } catch (error) {
                console.error(error);
                res.status(500).send("Server Error");
                }
                })
                


// @route GET /api/products/:id
// @desc Get a single product by ID
// @access Public

router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if(product) {
            res.json(product);
        } else {
            res.status(404).send("Product not found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error")
    }
})

// @route GET /api/products/similar/:id
// @desc Fetrieve similar products based on the current product's gender and category
// @access public

router.get("/similar/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);

        if(!product) {
            return res.status(404).send("Product not found");
        }
        // Fetch similar products based on gender and category
        const similarProducts = await Product.find({
            _id: { $ne: id },
            gender: product.gender,
            category: product.category,
        }).limit(4);

        res.json(similarProducts)

    } catch (error) {
        console.error(error);
        res.status(500).send("server Error");
    }
});





module.exports = router