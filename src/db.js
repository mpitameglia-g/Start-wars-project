/** @format */

import { openDB } from "idb";

const DATABASE_NAME = "StarWarsDB";
const DATABASE_VERSION = 1;
const STORE_NAME = "heroes";

export const initDB = async () => {
  try {
    return await openDB(DATABASE_NAME, DATABASE_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, {
            keyPath: "id",
            autoIncrement: true,
          });
        }
      },
    });
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error);
  }
};

export const saveHeroesToDB = async (heroes) => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    heroes.forEach((hero) => {
      store.put(hero);
    });
    await tx.done;
    console.log("Héroes guardados en IndexedDB");
  } catch (error) {
    console.error("Error al guardar héroes en IndexedDB:", error);
  }
};

export const getHeroesFromDB = async () => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const allHeroes = await store.getAll();
    console.log("Héroes recuperados de IndexedDB:", allHeroes);
    return allHeroes;
  } catch (error) {
    console.error("Error al recuperar héroes de IndexedDB:", error);
    return [];
  }
};
