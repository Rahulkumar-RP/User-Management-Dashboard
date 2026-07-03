import axios from "axios";

const BASE_URL = "https://jsonplaceholder.typicode.com";

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

function toUserRecord(raw) {
  const [firstName = "", ...rest] = (raw.name || "").split(" ");
  return {
    id: raw.id,
    firstName,
    lastName: rest.join(" "),
    email: raw.email || "",
    department: raw.company?.name || "",
  };
}

function toApiPayload(user) {
  return {
    name: `${user.firstName} ${user.lastName}`.trim(),
    email: user.email,
    company: { name: user.department },
  };
}

export async function fetchUsers() {
  const { data } = await client.get("/users");
  return data.map(toUserRecord);
}

export async function createUser(user) {
  const { data } = await client.post("/users", toApiPayload(user));
  return toUserRecord({ ...data, id: data.id });
}

export async function updateUser(id, user) {
  const { data } = await client.put(`/users/${id}`, toApiPayload(user));
  return toUserRecord({ ...data, id });
}

export async function deleteUser(id) {
  await client.delete(`/users/${id}`);
  return id;
}
