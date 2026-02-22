
// api/auth.api.ts
import { api } from "@/lib/api";

export const signupApi = async (payload: {
authType: "manual" | "google";
  fullName: string;
  email: string;
  password: string;
  password2: string;
    role: 'patient' | 'physio';
}) => {
  const res = await api.post("/users/register", payload);
  return res;

};


export const loginApi = async (payload: {
  email: string;
  password: string;
  authType: "manual" | "google";
  idToken?: string;
}) => {
  const res = await api.post("/users/login", payload);
  return res.data; // returns access + refresh token
};
