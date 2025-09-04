import axios from "axios";
import { toast } from "react-toastify";

// פונקציית עזר לניתוח שגיאות שרת
export function handleAxiosError(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      if (error.response.status === 429) {
        toast.error("נשלחו יותר מדי בקשות. אנא המתן לפני שניסי שוב.");
      } else {
        toast.error(error.response.data?.error || "שגיאה בשרת");
      }
    } else {
      toast.error("השרת לא זמין כרגע");
    }
  } else {
    toast.error("שגיאה לא ידועה");
  }
}
