// import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getDatabase, ref, get } from "firebase/database";
import { app } from "../../firebaseConfig";
export async function getServerData() {
  try {
    const database = getDatabase(app);
    const dbRef = ref(database, "embedded");
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      return data;
    } else {
      console.log("No data available");
    }
  } catch (err) {
    console.error(err);
  }
}
