import { StatusCodes } from "http-status-codes";

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT ?? "http://localhost:3000";

export async function getCategories() {
  return fetch(`${API_ENDPOINT}/categories`)
    .then((response) => response.json())
    .then((data) => data);
}

export async function createHole() {
  return fetch(`${API_ENDPOINT}/holes`, {
    method: "POST",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => data);
}

export async function getHole(holeID) {
  const response = await fetch(`${API_ENDPOINT}/holes/${holeID}`, {
    method: "GET",
    credentials: "include",
  });

  switch (response.status) {
    case StatusCodes.OK:
      return await response.json();
    case StatusCodes.NOT_FOUND:
      return null;
    default:
      throw new Error("Error en la respuesta del servidor");
  }
}

export async function sendMessage(holeID, input) {
  const response = await fetch(`${API_ENDPOINT}/holes/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ holeID, input }),
  });

  if (!response.ok) {
    throw new Error("Error en la respuesta del servidor");
  }

  const data = await response.json();
  return data;
}
