import Cart from "../models/Cart";
import Product from "../models/Product";
import { Request, Response } from "express";
import { CartItem } from "../../Frontend/src/types/Cart";

// הרחבת Request של Express כדי שיהיה לנו userId
interface AuthRequest extends Request {
  user: {
    userId: string;
    role: string;
    userName: string;
  };
}

// הוספת מוצר חדש לעגלה
export const postItem = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { productId, amount }: { productId: string; amount: number } =
      req.body;
    const userId = req.user.userId;

    if (!productId || !amount) {
      return res.status(400).json({ error: "לא כל השדות כתובים" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "המוצר לא נמצא" });
    }

    let cartItem = await Cart.findOne({ userId, productId });
    const totalRequested = (cartItem ? cartItem.amount : 0) + amount;

    // בדיקה מול הסטוק בפועל
    if (totalRequested > product.stock) {
      return res.status(400).json({
        error: `אין מספיק מלאי. נותר להוסיף עד ${product.stock} יחידות.`,
      });
    }

    if (cartItem) {
      cartItem.amount += amount;
      await cartItem.save();
    } else {
      cartItem = new Cart({ userId, productId, amount });
      await cartItem.save();
    }

    return res.status(200).json({
      message: "המוצר נוסף לעגלה בהצלחה",
      cartItemAmount: cartItem.amount,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר" });
  }
};

// שליפת כל המוצרים מהעגלה
export const getCartItems = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user.userId;
    const cartItems = await Cart.find({ userId })
      .populate({ path: "productId", select: "name price stock imageUrl" })
      .lean();

    const formatted: CartItem[] = cartItems.map((item: any) => ({
      _id: item.productId._id.toString(),
      name: item.productId.name,
      price: item.productId.price,
      stock: item.productId.stock,
      imageUrl: item.productId.imageUrl,
      amount: item.amount,
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר" });
  }
};

// הוספת מוצר אחד קיים בעגלה
export const addOneItemCart = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { productId } = req.body;
    const userId = req.user.userId;

    const product = await Product.findById(productId);
    if (!product) return res.status(400).json({ error: "מוצר לא קיים" });
    if (product.stock <= 0) return res.status(400).json({ error: "המוצר אזל" });

    const cartItem = await Cart.findOne({ userId, productId });

    if (!cartItem) {
      return res.status(400).json({ error: "מוצר לא נמצא בעגלה" });
    }

    if (cartItem.amount >= product.stock) {
      return res.status(400).json({ error: "לא ניתן להוסיף מעבר לכמות המלאי" });
    }

    cartItem.amount += 1;
    await cartItem.save();

    return res.status(200).json({
      message: "המלאי והעגלה עודכנו בהצלחה",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "אירעה שגיאה בשרת" });
  }
};

// הסרת מוצר אחד קיים בעגלה
export const removeOneItemCart = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { productId } = req.body;
    const userId = req.user.userId;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({ error: "מוצר לא קיים" });
    }

    const cartItem = await Cart.findOne({ userId, productId });

    if (!cartItem) {
      return res.status(404).json({ error: "המוצר לא נמצא בעגלה" });
    }

    if (cartItem.amount > 1) {
      cartItem.amount -= 1;
      await cartItem.save();
    } else {
      await cartItem.deleteOne();
    }

    return res.status(200).json({
      message: "המוצר הוסר מהעגלה בהצלחה",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר" });
  }
};

// הסרת מוצר בעגלה
export const removeItemCart = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { productId } = req.body;
    const userId = req.user.userId;

    const product = await Product.findById(productId);

    if (!product) return res.status(400).json({ error: "מוצר לא קיים" });

    const cartItem = await Cart.findOne({ userId, productId });

    if (!cartItem)
      return res.status(404).json({ error: "המוצר לא נמצא בעגלה" });

    await cartItem.deleteOne();

    return res.status(200).json({ message: "המוצר הוסר מהעגלה בהצלחה" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר" });
  }
};

export const syncCart = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user.userId;
    const { items } = req.body;

    for (const { productId, amount } of items) {
      // עדכון או יצירה של הפריט בעגלה
      await Cart.findOneAndUpdate(
        { userId, productId },
        { $inc: { amount } },
        { upsert: true, new: true }
      );
    }

    return res.status(200).json({ message: "העגלות התחברו" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר" });
  }
};
export const clearCart = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user.userId;
    await Cart.deleteMany({ userId });
    return res.status(200).json({ massage: "עגלה נמחקה בהצלחה" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר" });
  }
};
