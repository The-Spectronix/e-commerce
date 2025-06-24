const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middlewares/authMiddleware")

const router = express.Router();

// Helper function to get a cart by userId or guestId
const getCart = async (userId, guestId) => {
    if(userId) {
        return await Cart.findOne({ user: userId });
    } else if (guestId) {
        return await Cart.findOne({ guestId });
    }
    return null;
};

// POST /api/cart - Add product to cart (guest or user)
router.post("/", async (req, res) => {
    let { productId, quantity, size, color, guestId, userId } = req.body;

    quantity = Number(quantity);
    if (!productId || !quantity || quantity < 1) {
        return res.status(400).json({ Message: "Invalid productId or quantity" });
    }

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ Message: "Product not found" });

        // If no guestId and no userId, generate guestId
        if (!userId && !guestId) {
            guestId = "guest" + Date.now();
        }

        let cart = await getCart(userId, guestId);

        if (cart) {
            const productIndex = cart.products.findIndex((p) => 
                p.productId.toString() === productId && 
                p.size === size && 
                p.color === color
            );

            if(productIndex > -1){
                // Update quantity
                cart.products[productIndex].quantity += quantity;
            } else {
                // Add new product
                cart.products.push({
                    productId,
                    quantity,
                    color,
                    size,
                    name: product.name,
                    price: product.price,
                    image: (product.images && product.images.length > 0) ? product.images[0].url : "",
                });
            }

            // Recalculate total price
            cart.totalPrice = cart.products.reduce(
                (acc, item) => acc + item.price * item.quantity, 0
            );

            await cart.save();
            return res.status(200).json(cart);
        } else {
            // Create new cart
            const newCart = await Cart.create({
                user: userId ? userId : undefined,
                guestId: guestId ? guestId : undefined,
                products: [{
                    productId,
                    name: product.name,
                    price: product.price,
                    image: (product.images && product.images.length > 0) ? product.images[0].url : "",
                    quantity,
                    color,
                    size,
                }],
                totalPrice: product.price * quantity,
            });

            return res.status(201).json(newCart);
        }
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ Message: "Internal Server Error" });
    }
});

// @route PUT /api/cart
// @desc Update product quantity in the cart for a guest or logged-in user
// @access public

router.put("/", async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;

    try {
        let cart = await getCart(userId, guestId);
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const productIndex = cart.products.findIndex((p) => p.productId.toString() === productId &&
    p.color === color &&
    p.size === size
    )
    if (productIndex > -1) {
        //Update quantity
        if(quantity > 0) 
        {
            cart.products[productIndex].quantity = quantity;
        } else {
            cart.products.splice(productIndex, 1); // Remove product if quantity is 0
        }
       cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0)
       await cart.save()
       return res.status(200).json(cart);
    } else {
        return res.status(404).json({ message: "Product not found in cart" })
    }
    } catch (error) {
        console.error(error);
           return res.status(500).send("Server Error");
    }
})

// @route DELETE /api/cart
// @desc Remove product from the cart for a guest or logged-in user
// @access public
router.delete("/", async (req, res) =>
    {
         const { productId, quantity, size, color, guestId, userId } = req.body;

         try {
                let cart = await getCart(userId, guestId)
                if (!cart) return res.status(404).json({ message: "Cart not found" })
                    const productIndex = cart.products.findIndex((p) =>
                p.productId.toString() === productId &&
                p.color === color &&
                p.size === size
                )

                if (productIndex > -1) {
                    cart.products.splice(productIndex, 1); // Remove product from cart
                    cart.totalPrice = cart.products.reduce((acc, item) =>
                        acc + item.price * item.quantity, 0)
                    await cart.save()
                    return res.status(200).json(cart);
                } else {
                    return res.status(404).json({ message: "Product not found in cart" })
                }

         } catch (error) {
            console.error(error);
            return res.status(500).send("Server Error")
         }
    })

    // @route GET /api/cart
    // @desc Get logged-in user's or guest user's cart
    // @access public
    router.get("/", async (req, res) =>
    {
        const { userId, guestId } = req.query;
        try {
            const cart = await getCart(userId, guestId);
            if(cart){
                res.json(cart)
            } else {
                res.status(404).json({ message: "Cart not found" })
            }
        } catch (error) {
            console.error(error);
           return res.status(500).send("Server Error")
        }
    });

    // @route POST /api/cart/merge
    // @desc Merge guest cart into user cart on login
    // @access private

    router.post("/merge", protect, async (req, res) => {
        const { guestId } = req.body;
        try {
            //Find the guest cart and user cart
            const guestCart = await Cart.findOne({ guestId });
            const userCart = await Cart.findOne({ user: req.user._id });

            if(guestCart) {
                if(guestCart.products.length === 0) {
                    return res.status(400).json({ message: "Guest cart is empty" })
                }

                if (userCart) {
                    //Merge guest cart into user cart
                    guestCart.products.forEach((guestItem) => {
                        const productIndex = userCart.products.findIndex((item) =>
                            item.productId.toString() === guestItem.productId.toString() && 
                        item.size === guestItem.size && 
                        item.color === guestItem.color
                    );

                    if (productIndex > -1) {
                        userCart.products[productIndex].quantity += guestItem.quantity;
                    } else {
                        // Otherwise, add the guest item to the cart
                        userCart.products.push(guestItem);
                    }
                    })

                    userCart.totalPrice = userCart.products.reduce((acc, item) => acc + item.price * item.quantity, 0)
                    await userCart.save();

                    // Remove the guest cart after merging
                    try {
                        await Cart.findOneAndDelete({ guestId });
                    } catch (error) {
                        console.error("Error deleting guest cart", error);
                    }
                    res.status(200).json(userCart);
                } else {
                    // If user has no existing cart, assign the guest cart to the user
                    guestCart.user = req.user._id;
                    guestCart.guestId = undefined;
                    await guestCart.save();

                    res.status(200).json(guestCart);
                }
            } else {
                if (userCart) {
                    //Guest cart has already been merged, return user cart
                    return res.status(200).json(userCart);
                }
                res.status(404).json({ message: "Guest cart not found" });
            }

        } catch (error) {
            console.error(error);
            return res.status(500).send("Server Error")
        }
    })


module.exports = router;
