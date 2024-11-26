import { getDatabase, ref, update } from "firebase/database";
import { app } from "../../firebaseConfig";

export const updateFirebase = async () => {
  try {
    const db = getDatabase(app);
    const dbRef = ref(db, "embedded");

    await update(dbRef, {
      servo: {
        bool: true,
      },
    });
  } catch (error) {
    console.error(error);
  }
};
