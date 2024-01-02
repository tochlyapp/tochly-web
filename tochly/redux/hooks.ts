import { useSelector, useDispatch } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";

import type { Appstate, AppDispatch } from "@/redux/store";


export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<Appstate> = useSelector;
