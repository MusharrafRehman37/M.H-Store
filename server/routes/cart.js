
const express = require("express");

const Cart = require("../models/Cart");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// ==========================================
// GET USER CART
// ==========================================

router.get(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const userId = req.user.uid;

      let cart = await Cart.findOne({
        userId,
      });

      if (!cart) {
        cart = await Cart.create({
          userId,
          items: [],
        });
      }

      res.status(200).json({
        message: "Cart fetched successfully",
        cart: cart.items,
        isError: false,
      });
    } catch (error) {
      console.error(
        "Get Cart Error:",
        error.message
      );

      res.status(500).json({
        message: "Failed to fetch cart",
        isError: true,
      });
    }
  }
);

// ==========================================
// ADD PRODUCT TO CART
// ==========================================

router.post(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const userId = req.user.uid;

      const {
        productId,
        quantity = 1,
      } = req.body;

      if (!productId) {
        return res.status(400).json({
          message: "Product ID is required",
          isError: true,
        });
      }

      const product =
        await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
          isError: true,
        });
      }

      if (
        Number(product.stock || 0) <= 0
      ) {
        return res.status(400).json({
          message: "Product is out of stock",
          isError: true,
        });
      }

      let cart = await Cart.findOne({
        userId,
      });

      if (!cart) {
        cart = new Cart({
          userId,
          items: [],
        });
      }

      const existingItem =
        cart.items.find(
          (item) =>
            item.productId.toString() ===
            productId.toString()
        );

      if (existingItem) {
        const newQuantity =
          existingItem.quantity +
          Number(quantity);

        if (
          newQuantity >
          Number(product.stock)
        ) {
          return res.status(400).json({
            message:
              "Requested quantity exceeds available stock",
            isError: true,
          });
        }

        existingItem.quantity =
          newQuantity;
      } else {
        const requestedQuantity =
          Number(quantity);

        if (
          requestedQuantity >
          Number(product.stock)
        ) {
          return res.status(400).json({
            message:
              "Requested quantity exceeds available stock",
            isError: true,
          });
        }

        cart.items.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          quantity: requestedQuantity,
        });
      }

      await cart.save();

      res.status(200).json({
        message:
          "Product added to cart successfully",
        cart: cart.items,
        isError: false,
      });
    } catch (error) {
      console.error(
        "Add Cart Error:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to add product to cart",
        isError: true,
      });
    }
  }
);

// ==========================================
// UPDATE CART ITEM QUANTITY
// ==========================================

router.put(
  "/:productId",
  authMiddleware,
  async (req, res) => {
    try {
      const userId = req.user.uid;

      const quantity =
        Number(req.body.quantity);

      if (
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return res.status(400).json({
          message:
            "Quantity must be at least 1",
          isError: true,
        });
      }

      const cart =
        await Cart.findOne({ userId });

      if (!cart) {
        return res.status(404).json({
          message: "Cart not found",
          isError: true,
        });
      }

      const item = cart.items.find(
        (cartItem) =>
          cartItem.productId.toString() ===
          req.params.productId
      );

      if (!item) {
        return res.status(404).json({
          message:
            "Product not found in cart",
          isError: true,
        });
      }

      const product =
        await Product.findById(
          req.params.productId
        );

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
          isError: true,
        });
      }

      if (
        quantity >
        Number(product.stock)
      ) {
        return res.status(400).json({
          message:
            "Requested quantity exceeds available stock",
          isError: true,
        });
      }

      item.quantity = quantity;

      await cart.save();

      res.status(200).json({
        message:
          "Cart quantity updated successfully",
        cart: cart.items,
        isError: false,
      });
    } catch (error) {
      console.error(
        "Update Cart Error:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to update cart",
        isError: true,
      });
    }
  }
);

// ==========================================
// REMOVE PRODUCT FROM CART
// ==========================================

router.delete(
  "/:productId",
  authMiddleware,
  async (req, res) => {
    try {
      const userId = req.user.uid;

      const cart =
        await Cart.findOne({ userId });

      if (!cart) {
        return res.status(404).json({
          message: "Cart not found",
          isError: true,
        });
      }

      cart.items =
        cart.items.filter(
          (item) =>
            item.productId.toString() !==
            req.params.productId
        );

      await cart.save();

      res.status(200).json({
        message:
          "Product removed from cart",
        cart: cart.items,
        isError: false,
      });
    } catch (error) {
      console.error(
        "Remove Cart Error:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to remove product",
        isError: true,
      });
    }
  }
);

// ==========================================
// CLEAR CART
// ==========================================

router.delete(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const userId = req.user.uid;

      const cart =
        await Cart.findOne({ userId });

      if (!cart) {
        return res.status(200).json({
          message: "Cart is already empty",
          cart: [],
          isError: false,
        });
      }

      cart.items = [];

      await cart.save();

      res.status(200).json({
        message: "Cart cleared successfully",
        cart: [],
        isError: false,
      });
    } catch (error) {
      console.error(
        "Clear Cart Error:",
        error.message
      );

      res.status(500).json({
        message: "Failed to clear cart",
        isError: true,
      });
    }
  }
);

module.exports = router;
