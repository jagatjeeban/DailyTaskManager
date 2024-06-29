import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { DispatchType, RootStateType } from "./store";

export const useAppDispatch = () => useDispatch<DispatchType>();
export const useAppSelector: TypedUseSelectorHook<RootStateType> = useSelector;