export async function createHole() {
  return fetch("http://localhost:3000/holes", {
    method: "POST",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => data);
}

export async function getHole(holeId) {
  const response = await fetch(`http://localhost:3000/holes/${holeId}`, {
    method: "GET",
    credentials: "include",
  });
  
  switch (response.status) {
    case 200:
      return await response.json();
    case 404:
      return null;
    default:
      throw new Error("Error en la respuesta del servidor");
  }
}

export function getCategories() {
  return fetch("http://localhost:3000/categories")
    .then((response) => response.json())
    .then((data) => data);
}