import React, { useState, useEffect } from "react";
import { Bar, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import {
  getDatabase,
  onValue,
  ref,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

// Firebase configuration
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

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analysis = () => {
  const [nutrientData, setNutrientData] = useState({
    nitrogen: 0,
    phosphorous: 0,
    potassium: 0,
  });
  const [sensorData, setSensorData] = useState({
    temperature: 0,
    humidity: 0,
    soilMoisture: 0,
  });

  // Fetch data from Firebase
  useEffect(() => {
    const dataRef = ref(database, "Data");
    const sensorRef = ref(database, "NPK_Sensor_Data");

    onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setSensorData({
          temperature: parseFloat(data.temperature) || 0,
          humidity: parseFloat(data.humidity) || 0,
          soilMoisture: parseInt(data.moisture1) || 0,
        });
      }
    });

    onValue(sensorRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setNutrientData({
          nitrogen: data.Nitrogen || 0,
          phosphorous: data.Phosphorous || 0,
          potassium: data.Potassium || 0,
        });
      }
    });
  }, []);

  // Bar Chart Data
  const barData = {
    labels: ["Nitrogen", "Phosphorous", "Potassium"],
    datasets: [
      {
        label: "Nutrient Levels",
        data: [
          nutrientData.nitrogen,
          nutrientData.phosphorous,
          nutrientData.potassium,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 205, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
      title: { display: true, text: "Nutrient Distribution" },
    },
    scales: { y: { beginAtZero: true } },
  };

  // Radar Chart Data
  const radarData = {
    labels: [
      "Nitrogen",
      "Phosphorous",
      "Potassium",
      "Temperature",
      "Humidity",
      "Soil Moisture",
    ],
    datasets: [
      {
        label: "Crop Factors",
        data: [
          nutrientData.nitrogen,
          nutrientData.phosphorous,
          nutrientData.potassium,
          sensorData.temperature,
          sensorData.humidity,
          sensorData.soilMoisture,
        ],
        backgroundColor: "rgba(34, 202, 236, 0.2)",
        borderColor: "rgba(34, 202, 236, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(34, 202, 236, 1)",
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: { color: "#333", font: { size: 14 } },
      },
    },
    scales: {
      r: {
        ticks: { color: "#555", backdropColor: "rgba(255,255,255,0.8)" },
        grid: { color: "rgba(200, 200, 200, 0.4)" },
        pointLabels: { color: "#333", font: { size: 14 } },
      },
    },
  };

  // Gauge Component
  const renderGauge = (value, color, label) => (
    <div className="flex flex-col items-center">
      <div
        className="relative"
        style={{
          width: 150,
          height: 150,
          borderRadius: "50%",
          background: `conic-gradient(${color} ${value}%, #ddd ${value}%)`,
        }}
      >
        <div
          className="absolute"
          style={{
            top: "25%",
            left: "25%",
            width: "50%",
            height: "50%",
            background: "#fff",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "1.5em", fontWeight: "bold" }}>
            {value}%
          </span>
        </div>
      </div>
      <h3 className="mt-2 font-semibold text-gray-800">{label}</h3>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-12">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Analysis Results
      </h1>

      <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 md:space-x-8">
        <div className="flex-1 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold text-center text-gray-800 mb-4">
            Nutrient Distribution
          </h2>
          <div
            className="flex justify-center items-center w-full"
            style={{ height: "400px" }}
          >
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        <div className="flex-1 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold text-center text-gray-800 mb-4">
            Crop Factor Analysis
          </h2>
          <div
            className="flex justify-center items-center w-full"
            style={{ height: "400px" }}
          >
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold text-center text-gray-800 mb-4">
          Temperature, Humidity, and Soil Moisture
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderGauge(sensorData.temperature, "#4caf50", "Temperature")}
          {renderGauge(sensorData.humidity, "#2196f3", "Humidity")}
          {renderGauge(sensorData.soilMoisture, "#ff9800", "Soil Moisture")}
        </div>
      </div>
    </div>
  );
};

export default Analysis;
