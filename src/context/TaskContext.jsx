import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { useAuth } from "./AuthProvider";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot
} from "firebase/firestore";

const TaskContext = createContext();
export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setRecentTasks([]);
      setLoading(false);
      return;
    }

    const ref = collection(db, "users", user.uid, "tasks");

    // 👉 Listen to ALL tasks (real-time)
    const q = query(ref, where("deleted", "==", false));
    const unsubscribeAll = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTasks(data);
    });

    // 👉 Listen to the 3 most recent tasks
    const recentQ = query(
      ref,
      where("deleted", "==", false),
      orderBy("updatedAt", "desc"),
      limit(3)
    );
    const unsubscribeRecent = onSnapshot(recentQ, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setRecentTasks(data);
      setLoading(false);
    });

    return () => {
      unsubscribeAll();
      unsubscribeRecent();
    };
  }, [user]);

  // Derived (computed) data
  const tasksByStatus = {
    todo: tasks.filter((t) => t.status === "todo"),
    inProgress: tasks.filter((t) => t.status === "inProgress"),
    done: tasks.filter((t) => t.status === "done"),
  };

  return (
    <TaskContext.Provider
      value={{
        loading,
        tasks,
        recentTasks,
        tasksByStatus,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
