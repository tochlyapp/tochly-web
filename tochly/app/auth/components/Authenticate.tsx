"use client";
import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setAuth, finishLoading } from "@/redux/slices/authSlice";
import { useVerifyMutation } from "@/redux/services/authAPI";

const Authenticate: React.FC = () => {
  const dispatch = useAppDispatch();
  const [verify] = useVerifyMutation();

  useEffect(() => {
    verify(undefined)
    .unwrap()
    .then(() => {
      dispatch(setAuth())
    })
    .finally(() => {
      dispatch(finishLoading())
    });
  }, [])
  return (
    <></>
  )
}

export default Authenticate;
