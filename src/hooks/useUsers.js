import { useCallback, useEffect, useState } from "react";
import { createUser, deleteUser, fetchUsers, updateUser } from "../api/userApi";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      setError("Couldn't load users. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);


  const addUser = useCallback(async (values) => {
    const created = await createUser(values);
    const nextId = Math.max(0, ...users.map((u) => u.id)) + 1;
    const localUser = { ...created, id: nextId };
    setUsers((prev) => [localUser, ...prev]);
    return localUser;
  }, [users]);

  const editUser = useCallback(async (id, values) => {
    const updated = await updateUser(id, values);
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...updated, id } : u)));
    return updated;
  }, []);

  const removeUser = useCallback(async (id) => {
    await deleteUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }, []);

  return { users, loading, error, reload: load, addUser, editUser, removeUser };
}
