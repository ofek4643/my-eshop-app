import Product from "../models/Product";
import { Request, Response } from "express"; // טיפוסים של Express

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
    const { name, price, imageUrl } = req.body;

    if (!name || !price || !imageUrl) {
      return res.status(400).json({ error: "חסרים נתונים" });
    }

    const newProduct = new Product({
      name,
      price,
      imageUrl,
    });

    await newProduct.save();

    return res
      .status(201)
      .json({ message: "המוצר נוסף בהצלחה", product: newProduct });
  } catch (error) {
    console.error("שגיאה בהוספת מוצר:", error);
    return res
      .status(500)
      .json({ error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר" });
  }
};

// משיכה מוצר על פי ID
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
