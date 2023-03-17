const API_URL = "http://127.0.0.1:8000/api/v1/foods/";

export function getFoods() {
  return fetch(API_URL).then((response) => response.json());
}

export function createFood(name) {
  return fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  }).then((response) => response.json());
}

export function updateFood(id, name) {
  return fetch(`${API_URL}${id}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  }).then((response) => response.json());
}

export function deleteFood(id) {
  return fetch(`${API_URL}${id}/`, { method: "DELETE" });
}
