import { User } from "../types/User";
import { api } from "./api";

// הנתונים הדרושים לעדכון המשתמש והסוג שלהם
interface UpdateProfileData {
  userName: string;
  email: string;
  newPassword: string;
  confirmNewPassword: string;
}

// שליפת נתוני המשתמש המחובר מהשרת
export const getUser = async (): Promise<User> => {
  const res = await api.get<User>("/user");
  return res.data;
};

// מחיקת המשתמש מהDB
export const deleteUserApi = async () => {
  return await api.delete("/user/delete");
};

// עדכון פרטי המשתמש
export const updateUserApi = async (data: UpdateProfileData) => {
  return await api.put("http://localhost:5000/api/user/profile", data);
};
