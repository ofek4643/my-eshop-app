import { createSlice } from "@reduxjs/toolkit";
import { AddressFormData } from "../../types/Address";

// מייצג את ה state של הכתובת למשלוח
const initialState: AddressFormData = {
  city: "",
  street: "",
  houseNumber: "",
  zip: "",
};
// הגדרת הslice
const addressSlice = createSlice({
  name: "address",
  initialState,
  // פעולה להוספת/עדכון כתובת ב-state
  reducers: {
    addAddress: (state, action) => {
      state.city = action.payload.city;
      state.street = action.payload.street;
      state.houseNumber = action.payload.houseNumber;
      state.zip = action.payload.zip;
    },
  },
});

export const { addAddress } = addressSlice.actions;
export default addressSlice.reducer;
