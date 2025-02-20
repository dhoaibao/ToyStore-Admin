import { setAddresses, add, update, remove, setLoading, setError } from "../slices/addressSlice";
import { addressService } from "../../services";

export const getAddressByUser = () => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const { data } = await addressService.getAddressByUser();
            dispatch(setAddresses(data));
            dispatch(setError(null));
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    };
};

export const addAddress = (address) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const { data } = await addressService.addAddress(address);
            dispatch(add(data));
            dispatch(setError(null));
        } catch (error) {
            dispatch(setError(error.message))
        } finally {
            dispatch(setLoading(false));
        }
    }
}

export const updateAddress = (address) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const { data } = await addressService.updateAddress(address.addressId, address);
            dispatch(update(data));
            dispatch(setError(null));
        } catch (error) {
            dispatch(setError(error.message))
        } finally {
            dispatch(setLoading(false));
        }
    }
}

export const deleteAddress = (addressId) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            await addressService.deleteAddress(addressId);
            dispatch(remove(addressId));
            dispatch(setError(null));
        } catch (error) {
            dispatch(setError(error.message || "Failed add address."))
        } finally {
            dispatch(setLoading(false));
        }
    }
}