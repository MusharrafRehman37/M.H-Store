
const express = require("express");

const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// ==========================================
// GET USER WISHLIST
// ==========================================

router.get(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const userId = req.user.uid;

      let wishlist =
        await Wishlist.findOne({
          userId,
        });

      if (!wishlist) {
        wishlist =
          await Wishlist.create({
            userId,
            items: [],
          });
      }

      res.status(200).json({
        message:
          "Wishlist fetched successfully",
        wishlist: wishlist.items,
        isError: false,
      });
    } catch (error) {
      console.error(
        "Get Wishlist Error:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to fetch wishlist",
        isError: true,
      });
    }
  }
);

// ==========================================
// ADD PRODUCT TO WISHLIST
// ==========================================

router.post(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const userId = req.user.uid;
      const { productId } = req.body;

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

      let wishlist =
        await Wishlist.findOne({
          userId,
        });

      if (!wishlist) {
        wishlist = new Wishlist({
          userId,
          items: [],
        });
      }

      const alreadyExists =
        wishlist.items.some(
          (item) =>
            item.productId.toString() ===
            productId.toString()
        );

      if (alreadyExists) {
        return res.status(200).json({
          message:
            "Product is already in wishlist",
          wishlist: wishlist.items,
          isError: false,
        });
      }

      wishlist.items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      });

      await wishlist.save();

      res.status(200).json({
        message:
          "Product added to wishlist",
        wishlist: wishlist.items,
        isError: false,
      });
    } catch (error) {
      console.error(
        "Add Wishlist Error:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to add product to wishlist",
        isError: true,
      });
    }
  }
);

// ==========================================
// REMOVE PRODUCT FROM WISHLIST
// ==========================================

router.delete(
  "/:productId",
  authMiddleware,
  async (req, res) => {
    try {
      const userId = req.user.uid;

      const wishlist =
        await Wishlist.findOne({
          userId,
        });

      if (!wishlist) {
        return res.status(200).json({
          message:
            "Wishlist is already empty",
          wishlist: [],
          isError: false,
        });
      }

      wishlist.items =
        wishlist.items.filter(
          (item) =>
            item.productId.toString() !==
            req.params.productId
        );

      await wishlist.save();

      res.status(200).json({
        message:
          "Product removed from wishlist",
        wishlist: wishlist.items,
        isError: false,
      });
    } catch (error) {
      console.error(
        "Remove Wishlist Error:",
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
// CLEAR WISHLIST
// ==========================================

router.delete(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const userId = req.user.uid;

      const wishlist =
        await Wishlist.findOne({
          userId,
        });

      if (!wishlist) {
        return res.status(200).json({
          message:
            "Wishlist is already empty",
          wishlist: [],
          isError: false,
        });
      }

      wishlist.items = [];

      await wishlist.save();

      res.status(200).json({
        message:
          "Wishlist cleared successfully",
        wishlist: [],
        isError: false,
      });
    } catch (error) {
      console.error(
        "Clear Wishlist Error:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to clear wishlist",
        isError: true,
      });
    }
  }
);

module.exports = router;
