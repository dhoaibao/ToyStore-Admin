import { setUser, setLoading, setError } from "../slices/userSlice";
import { userService } from "../../services";

export const getLoggedInUser = () => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const user = await userService.getLoggedInUser();
      dispatch(setUser(user.data));
      dispatch(setError(null));
    } catch (error) {
      console.error("Error fetching logged-in user:", error?.data || error.message);
      dispatch(setError(error.message || "Failed to fetch user data."));
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const updateProfile = (userId, data) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await userService.updateProfile(userId, data);
      dispatch(setUser(response.data));
    }
    catch (error) {
      console.error("Update profile error:", error?.data);
      dispatch(setError(error?.data?.message || "Failed to update profile."));
    }
    finally {
      dispatch(setLoading(false));
    }
  }
}