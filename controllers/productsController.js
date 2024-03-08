import express from "express";
const router = express.Router();
import isAuth from '../services/isAuth.js';
import Product from "../models/productModel.js";
import geodist from 'geodist';

router.post('/getAllScooters', isAuth, (req,res) => {

    const {lat, long} = req.body;

    Product.findAll()
    .then((results) => {
    
      let allProducts = [];

      results.forEach(element => {
        const dist = geodist(
            {
                lat: lat,
                lon: long
            }, 
            {
                lat: element.currentLocationLat,
                lon: element.currentLocationLong
            });

        const product = {
            id: element.id,
            model: element.productModel,
            battery: element.battery,
            dist: dist
        }
        allProducts.push(product)
      });


      return res.status(200).json({
        message: allProducts,
      });
    })
    .catch((error) => {
      return res.status(500).json({
        message: error,
      });
    });


})


router.post('/addProduct', (req,res) => {
    const {
        productType,
        currentLocationLat,
        currentLocationLong,
        productModel
    } = req.body;

    Product.create({
        productType: productType,
        currentLocationLat: currentLocationLat,
        currentLocationLong: currentLocationLong,
        isAvailable: true,
        battery: 100,
        productModel: productModel
      })
      .then(product_added => {
        return res.status(200).json({
            message: product_added
        })
      })
      .catch(error => {
        return res.status(500).json({
            message: error
        })
      })
})


export default router;