import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { showLoader, hideLoader } from "@/store/slices/loaderSlice";

export const useLoader = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const isLoading = useSelector((state: RootState) => state.loader.isLoading);

  return {
    isLoading,
    startLoading: () => dispatch(showLoader()),
    stopLoading: () => dispatch(hideLoader()),
  };
};