import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { useAuth } from "./AuthProvider";
import {
  collection,
  query,
  orderBy,
  onSnapshot
} from "firebase/firestore";

const TaskContext = createContext();
export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      console.log("❌ No user logged in — clearing tasks");
      setTasks([]);
      setLoading(false);
      return;
    }

    console.log("👤 User logged in:", user.uid);

    const ref = collection(db, "users", user.uid, "tasks");

    // 👉 Fetch ALL tasks (deleted or not)
    const q = query(ref, orderBy("updatedAt", "desc"));

    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      console.log("🔥 Firestore returned tasks:", arr.length);
      arr.forEach((task, i) => {
        console.log(
          `#${i + 1}`,
          {
            id: task.id,
            title: task.title,
            status: task.status,
            deleted: task.deleted,
            createdAt: task.createdAt?.toDate?.(),
            updatedAt: task.updatedAt?.toDate?.(),
          }
        );
      });

      setTasks(arr);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  return (
    <TaskContext.Provider value={{ loading, tasks }}>
      {children}
    </TaskContext.Provider>
  );
};
