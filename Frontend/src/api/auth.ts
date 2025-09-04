import { api } from "./api";

// הנתונים להתחברות
interface LoginData {
  email: string;
  password: string;
}
// הנתונים להרשמה
interface RegisterData {
  userName: string;
  email: string;
  password: string;
}
// הנתונים לשכחתי את הסיסמא
interface ForgotPasswordData {
  email: string;
}
// הנתונים לשנות את הסיסמא
interface ResetPasswordData {
  token: string;
  newPassword: string;
}

// התחברות משתמש
export const loginUser = (data: LoginData) => api.post("/auth/login", data);

// הרשמה משתמש
export const registerUser = (data: RegisterData) =>
  api.post("/auth/register", data);

// אימות משתמש
export const verifyUserApi = (userId: string, token: string) =>
  api.get(`/auth/verify/${userId}/${token}`);

// התנתקות משתמש
export const logoutUser = () => api.post("/auth/logout");

// שכחתי את הסיסמא
export const forgotPasswordApi = (data: ForgotPasswordData) =>
  api.post("/auth/forgotPassword", data);

// שינוי סיסמא
export const resetPasswordApi = (data: ResetPasswordData) =>
  api.put("/auth/resetPassword", data);
