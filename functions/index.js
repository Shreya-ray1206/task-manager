const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.sendHighPriorityTaskReminder = functions.pubsub
    .schedule("* * * * *") // every morning at 9:45 AM
    .timeZone("Asia/Kolkata")
    .onRun(async () => {
      const db = admin.firestore();

      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);

      const start = new Date(yesterday.setHours(0, 0, 0, 0));
      const end = new Date(yesterday.setHours(23, 59, 59, 999));

      const snapshot = await db
          .collectionGroup("tasks")
          .where("priority", "==", "high")
          .where("createdAt", ">=", start)
          .where("createdAt", "<=", end)
          .get();

      if (snapshot.empty) {
        console.log("No high priority tasks created yesterday.");
        return null;
      }

      const messages = [];

      snapshot.forEach((doc) => {
        const task = doc.data();
        const uid = doc.ref.parent.parent.id;
        messages.push({uid, task});
      });

      for (const msg of messages) {
        const tokenSnap = await db
            .collection("users")
            .doc(msg.uid)
            .collection("fcmTokens")
            .get();

        const userDoc = await db.collection("users").doc(msg.uid).get();
        const user = userDoc.data();
        const userName = (user && user.name) ? user.name : "User";

        const tokens = tokenSnap.docs.map((d) => d.id);

        if (!tokens.length) continue;

        // Style A Icons
        const statusIcon =
                msg.task.status === "todo" ? "📄" :
                msg.task.status === "inprogress" ? "🔄" :
                "⏳"; // done or other

        await admin.messaging().sendMulticast({
          tokens,
          notification: {
            title: `🛎️ Reminder for ${userName}`,
            body: `${statusIcon} "${msg.task.title}" 
                      is still ${msg.task.status}.`,
          },
          data: {
            taskId: msg.task.id,
            status: msg.task.status,
          },
        });
      }

      return null;
    });
