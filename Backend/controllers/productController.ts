import Product from "../models/Product";
import { Request, Response } from "express";

// שליפת כל המוצרים ממסד הנתונים
export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("שגיאה בשליפת מוצרים:", error);
    res.status(500).json({ error: "שגיאה בשרת" });
  }
};

// הוספת מוצר
export const addProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name, price, stock, description, imageUrl } = req.body;

    if (!name || !price || !imageUrl || !description || !stock) {
      return res.status(400).json({ error: "חסרים נתונים" });
    }

    const existingName = await Product.findOne({ name });

    if (existingName) {
      return res.status(400).json({ error: "שם מוצר כבר קיים" });
    }

    if (price <= 0 || stock < 0) {
      return res.status(400).json({ error: "מחיר או מלאי לא תקינים" });
    }

    const newProduct = new Product({
      name,
      stock,
      price,
      description,
      imageUrl,
    });

    await newProduct.save();

    return res.status(201).json({ message: "המוצר נוסף בהצלחה" });
  } catch (error) {
    console.error("שגיאה בהוספת מוצר:", error);
    return res
      .status(500)
      .json({ error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר" });
  }
};

// אדמין - שליפת מוצר לפי ID
export const getProductById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "לא נמצא מוצר" });
    }
    return res.json(product);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר" });
  }
};

// אדמין - עדכון מוצר לפי ID
export const updateProductById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const { name, price, stock, description, imageUrl } = req.body;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: "מוצר לא קיים" });
    }

    if (!name || !price || !stock || !description) {
      return res.status(400).json({ error: "מלא את כל השדות" });
    }

    const existingName = await Product.findOne({ name });

    if (
      existingName &&
      existingName._id &&
      existingName._id.toString() !== id
    ) {
      return res.status(400).json({ error: "שם מוצר כבר קיים" });
    }

    if (price <= 0 || stock < 0) {
      return res.status(400).json({ error: "מחיר או מלאי לא תקינים" });
    }
    product.name = name;
    product.price = price;
    product.stock = stock;
    product.description = description;
    product.imageUrl = imageUrl;
    await product.save();
    return res.status(200).json({ message: "המוצר עודכן בהצלחה" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר" });
  }
};

// אדמין - מחיקת מוצר לפי ID
export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    return res.status(200).json({ message: "מוצר נמחק בהצלחה" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר" });
  }
};