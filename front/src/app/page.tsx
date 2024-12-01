"use client";
import { Button, Card, Image } from "@nextui-org/react";
import { checkCluster } from "@/libs/checkCluster";
import { create } from "zustand";
import { useEffect, useState } from "react";
import { getServerData } from "@/libs/getFirebase";
import { AnimatePresence, motion } from "framer-motion";
import { updateFirebase } from "@/libs/updateFirebase";
import DownloadTextFile from "@/components/DownloadText";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getImages } from "@/libs/getImage";
import { Cluster } from "cluster";

interface GraphProps {
  labels: string[];
  datasets: [
    {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }
  ];
}

const useWater = create<WaterProps>((set) => ({
  water: 0.0,
  setWater: (value) => set({ water: value }),
}));

const useTemperature = create<TempProps>((set) => ({
  temperature: 0.0,
  setTemperature: (temp) => set({ temperature: temp }),
}));

const useImage = create<ImageProps>((set) => ({
  src: "/",
  sources: [],
  setSrc: (src) => set({ src: src }),
}));

const useFed = create<FedTimeProps>((set) => ({
  fedTime: "",
  setFedTime: (date) => set({ fedTime: date }),
}));

const useCluster = create<ClusterProps>((set) => ({
  clusterNum: 0,
  setCluster: (cluster) => set({ clusterNum: cluster }),
}));

const useStatus = create<StatusProps>((set) => ({
  status: "unknown",
  setStatus: (value) => set({ status: value})
}))

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Home() {
  const { clusterNum, setCluster } = useCluster();
  const { status, setStatus } = useStatus();
  const { water, setWater } = useWater();
  const { temperature, setTemperature } = useTemperature();
  const { src, sources, setSrc } = useImage();
  const { fedTime, setFedTime } = useFed();
  const [isLoading, setIsLoading] = useState(true);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [data, setData] = useState<GraphProps>({
    labels: [],
    datasets: [
      {
        label: "Water Level",
        data: [],
        borderColor: "#ffffff",
        backgroundColor: "yellow",
      },
    ],
  });

  const [temperatureData, setTemperatureData] = useState<GraphProps>({
    labels: [],
    datasets: [
      {
        label: "Temperature",
        data: [],
        borderColor: "#ffffff",
        backgroundColor: "green",
      },
    ],
  });

  const options = {
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 10,
        },
      },
    },
  };

  function formatTimestamp(timestamp: number | string | Date): string {
    const date = new Date(timestamp);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${month}/${day}/${year}:${hours}:${minutes}`;
  }

  const fetchData = async () => {
    try {
        const res = await getServerData();

        setIsLoading(true);

        if (res.waterLevel?.float) {
            setWater(res.waterLevel.float);
        }
        if (res.waterTemperature?.float) {
            setTemperature(res.waterTemperature.float);
        }
        if (res.servo?.timestamp) {
            setFedTime(formatTimestamp(res.servo.timestamp));
        }

        const currentTime = new Date().toLocaleTimeString();

        setData((prevData) => {
            const newLabels = prevData.labels ? [...prevData.labels, currentTime] : [currentTime];
            const newData = prevData.datasets?.[0]?.data
                ? [...prevData.datasets[0].data, res.waterLevel.float]
                : [res.waterLevel.float];

            return {
                labels: newLabels,
                datasets: [
                    {
                        ...prevData.datasets[0],
                        data: newData,
                    },
                ],
            };
        });

        setTemperatureData((prevData) => {
            const newLabels = prevData.labels ? [...prevData.labels, currentTime] : [currentTime];
            const newData = prevData.datasets?.[0]?.data
                ? [...prevData.datasets[0].data, res.waterTemperature.float]
                : [res.waterTemperature.float];

            return {
                labels: newLabels,
                datasets: [
                    {
                        ...prevData.datasets[0],
                        data: newData,
                    },
                ],
            };
        });

        setIsLoading(false);

        const imageUrls = await getImages();
        if (Array.isArray(imageUrls) && imageUrls.length > 0) {
            console.log('Fetched images:', imageUrls);
            setSrc(imageUrls[0]);

            try {
                const cluster = await checkCluster(imageUrls[0]);
                console.log(cluster);
                setCluster(cluster.cluster);

            } catch (error) {
                console.error('Error processing cluster:', error);
            }
        }
    } catch (error) {
        console.error('Error in fetchData:', error);
        setIsLoading(false);
    }
};

  const updateFeed = async () => {
    setIsButtonLoading(true);
    await updateFirebase().then(() => {
      setTimeout(() => {
        setIsButtonLoading(false);
      }, 5000);
    });
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const numberVariants = {
    enter: (direction: number) => ({
      y: direction > 0 ? 10 : -10,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      y: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      y: direction > 0 ? -10 : 10,
      opacity: 0,
    }),
  };

  return (
    <main className="min-h-screen w-screen flex p-4  items-center bg-gradient-to-tr from-blue-500 to-blue-50">
      <section className="max-w-screen-lg mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="w-full flex justify-center h-64">
          <Image
            src={src}
            width={342}
            isLoading={isLoading}
            className="object-contain rounded-lg"
          />
        </div>

        <Card shadow="none" className=" p-8 shadow-md">
          <div className=" flex flex-col gap-4">
          <h1 className="flex">
              Cluster:{" "}
              <AnimatePresence mode="wait">
                <motion.div
                  key={clusterNum}
                  custom={1}
                  variants={numberVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    y: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="mx-3 w-20 flex justify-center"
                >
                  {clusterNum}
                </motion.div>
              </AnimatePresence>
            </h1>
            <h1 className="flex">
              Temperature:{" "}
              <AnimatePresence mode="wait">
                <motion.div
                  key={temperature}
                  custom={1}
                  variants={numberVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    y: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="mx-3 w-20 flex justify-center"
                >
                  {temperature}
                </motion.div>
              </AnimatePresence>
              °C
            </h1>

            <h1 className="flex">
              Water level:{" "}
              <AnimatePresence mode="wait">
                <motion.div
                  key={water}
                  custom={1}
                  variants={numberVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    y: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="mx-3"
                >
                  {water}
                </motion.div>
              </AnimatePresence>
              mm
            </h1>

            <div className="flex flex-col gap-1">
              <div className="w-36">
                <Button
                  radius="sm"
                  onPress={updateFeed}
                  className="  bg-sky-200 w-full"
                  isLoading={isButtonLoading}
                >
                  <h5>feed</h5>
                </Button>
              </div>
              <div className="flex italic text-gray-500">
                <h5 className="text-sm">Last fed: {fedTime}</h5>
              </div>
            </div>
            {/* <DownloadTextFile srcs={sources} /> */}
          </div>
        </Card>
        <div className="col-span-1">
          <Line data={data} options={options} />
        </div>
        <div className="col-span-1">
          <Line data={temperatureData} options={options} />
        </div>
      </section>
    </main>
  );
}
