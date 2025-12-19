import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { useAuth } from "./AuthProvider";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

export const TaskContext = createContext(null); // 👈 EXPORT CONTEXT

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const ref = collection(db, "users", user.uid, "tasks");
    const q = query(ref, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTasks(arr);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  return (
    <TaskContext.Provider value={{ loading, tasks, setTasks }}>
      {children}
    </TaskContext.Provider>
  );
};
