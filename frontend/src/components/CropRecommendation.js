import React, { useState, useEffect } from "react";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import {
  getDatabase,
  onValue,
  ref,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const CropRecommendation = () => {
  const [cropData, setCropData] = useState({
    humidity: "",
    moisture1: "",
    temperature: "",
    nitrogen: "",
    phosphorous: "",
    potassium: "",
    npkNitrogen: "",
    npkPhosphorous: "",
    npkPotassium: "",
  });

  const [recommendedCrop, setRecommendedCrop] = useState("");

  useEffect(() => {
    const dataRef = ref(database, "Data");
    const npkRef = ref(database, "NPK_Sensor_Data");

    // Fetch `Data` node
    onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCropData((prev) => ({
          ...prev,
          humidity: data.humidity || "",
          moisture1: data.moisture1 || "",
          temperature: data.temperature || "",
          nitrogen: data.nitrogen || "",
          phosphorous: data.phosphorous || "",
          potassium: data.potassium || "",
        }));
      }
    });

    // Fetch `NPK_Sensor_Data` node
    onValue(npkRef, (snapshot) => {
      const npkData = snapshot.val();
      if (npkData) {
        setCropData((prev) => ({
          ...prev,
          npkNitrogen: npkData.Nitrogen || "",
          npkPhosphorous: npkData.Phosphorous || "",
          npkPotassium: npkData.Potassium || "",
        }));
      }
    });
  }, []);

  // Function to determine crop recommendation
  const recommendCrop = () => {
    const {
      npkNitrogen,
      npkPhosphorous,
      npkPotassium,
      moisture1,
      temperature,
    } = cropData;

    let crop = "No recommendation";

    if (
      npkNitrogen > 50 &&
      npkPhosphorous > 30 &&
      npkPotassium > 20 &&
      moisture1 > 50
    ) {
      crop = "Rice 🌾";
    } else if (
      npkNitrogen > 40 &&
      npkPhosphorous > 25 &&
      npkPotassium > 30 &&
      moisture1 > 40
    ) {
      crop = "Wheat 🌾";
    } else if (
      npkNitrogen < 20 &&
      npkPhosphorous > 15 &&
      npkPotassium > 10 &&
      moisture1 < 30
    ) {
      crop = "Cotton ☁️";
    } else if (temperature > 30 && moisture1 > 40) {
      crop = "Maize 🌽";
    } else if (npkNitrogen > 60 && npkPhosphorous > 40 && npkPotassium > 35) {
      crop = "Sugarcane 🍬";
    }

    setRecommendedCrop(crop);
  };

  return (
    <div className="bg-white p-4 md:p-8 rounded-md mt-20 md:mt-40 shadow-lg max-w-3xl mx-auto">
      <h2 className="text-green-900 text-xl md:text-2xl text-center font-semibold mb-4">
        Crop Recommendation
      </h2>
      <div className="space-y-6">
        {[
          { label: "Humidity", value: cropData.humidity },
          { label: "Moisture 1", value: cropData.moisture1 },
          { label: "Temperature", value: cropData.temperature },
          { label: "Nitrogen (Data)", value: cropData.nitrogen },
          { label: "Phosphorous (Data)", value: cropData.phosphorous },
          { label: "Potassium (Data)", value: cropData.potassium },
          { label: "Nitrogen (NPK Sensor)", value: cropData.npkNitrogen },
          { label: "Phosphorous (NPK Sensor)", value: cropData.npkPhosphorous },
          { label: "Potassium (NPK Sensor)", value: cropData.npkPotassium },
        ].map(({ label, value }, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row justify-between items-center"
          >
            <label className="text-green-500 w-full md:w-1/2 mb-2 md:mb-0">
              {label}
            </label>
            <input
              type="text"
              value={value || "Loading..."}
              className="border border-gray-300 rounded-md p-2 text-gray-500 w-full md:w-1/3 shadow-md"
              readOnly
            />
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <button
          type="button"
          onClick={recommendCrop}
          className="items-center px-8 md:px-10 py-2.5 mt-5 font-bold text-white bg-gradient-to-r from-green-400 to-green-600 rounded-3xl hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-green-700 shadow-lg"
          style={{ fontFamily: "Raleway, sans-serif" }}
        >
          Recommend Now
        </button>
      </div>
      {recommendedCrop && (
        <div className="mt-6 p-4 bg-green-100 rounded-md text-center shadow-md">
          <h3 className="text-green-700 text-lg font-semibold">
            Recommended Crop:
          </h3>
          <p className="text-green-900 text-xl font-bold">{recommendedCrop}</p>
        </div>
      )}
    </div>
  );
};

export default CropRecommendation;
