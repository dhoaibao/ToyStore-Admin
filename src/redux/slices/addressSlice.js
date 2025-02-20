import { createSlice } from '@reduxjs/toolkit';

const addressSlice = createSlice({
    name: "address",
    initialState: {
        addresses: [],
        loading: false,
        error: null,
    },
    reducers: {
        setAddresses: (state, action) => {
            state.addresses = action.payload;
        },
        add: (state, action) => {
            state.addresses.push(action.payload);

            if (action.payload.isDefault) {
                state.addresses = state.addresses.map((item) =>
                    item.addressId === action.payload.addressId
                        ? { ...item, isDefault: true }
                        : { ...item, isDefault: false }
                );
            }
        },
        update: (state, action) => {
            state.addresses = state.addresses.map((item) => 
                item.addressId === action.payload.addressId
                    ? { ...item, ...action.payload }
                    : item
            );

            if (action.payload.isDefault) {
                state.addresses = state.addresses.map((item) =>
                    item.addressId === action.payload.addressId
                        ? { ...item, isDefault: true }
                        : { ...item, isDefault: false }
                );
            }
        },
        remove: (state, action) => {
            state.addresses = state.addresses.filter((item) => item.addressId !== action.payload);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setAddresses, add, update, remove, setLoading, setError } = addressSlice.actions;

export default addressSlice.reducer;