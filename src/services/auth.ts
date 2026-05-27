import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { api } from "./api";
import { firebaseAuth } from "./firebase";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  username: string;
  email: string;
  password: string;
};

export async function login(payload: LoginPayload) {
  const credential = await signInWithEmailAndPassword(
    firebaseAuth,
    payload.email,
    payload.password
  );

  const idToken = await credential.user.getIdToken();

  return {
    message: "Login realizado com sucesso.",
    tokenType: "Bearer" as const,
    idToken,
    user: {
      id: credential.user.uid,
      email: credential.user.email,
    },
  };
}

export async function register(payload: RegisterPayload) {
  const response = await api.post("/users/register", payload);
  return response.data;
}

export function saveAuthToken(token: string) {
  localStorage.setItem("@actrya:token", token);
}

export function getAuthToken() {
  return localStorage.getItem("@actrya:token");
}

export function removeAuthToken() {
  localStorage.removeItem("@actrya:token");
}

export async function logout() {
  removeAuthToken();
  await signOut(firebaseAuth);
}