"use client";
import { Button, Card, Image } from "@nextui-org/react";
import { create } from "zustand";
import { useEffect } from "react";
import { getServerData } from "@/libs/getFirebase";
import { AnimatePresence, motion } from "framer-motion";
import { updateFirebase } from "@/libs/updateFirebase";

const useWater = create<WaterProps>((set) => ({
  water: 0.0,
  setWater: (value) => set({ water: value }),
}));

const useTemperature = create<TempProps>((set) => ({
  temperature: 0.0,
  setTemperature: (temp) => set({ temperature: temp }),
}));

const useImage = create<ImageProps>((set) => ({
  src: "/images/fishtank.jpg",
  setSrc: (src) => set({ src: src }),
}));

const useFed = create<FedTimeProps>((set) => ({
  fedTime: "",
  setFedTime: (date) => set({ fedTime: date }),
}));

export default function Home() {
  const { water, setWater } = useWater();
  const { temperature, setTemperature } = useTemperature();
  const { src, setSrc } = useImage();
  const { fedTime, setFedTime } = useFed();

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
    await getServerData().then((res) => {
      setWater(res.waterLevel.float);
      setTemperature(res.waterTemperature.float);
      setFedTime(formatTimestamp(res.servo.timestamp));
    });
  };

  const updateFeed = async () => {
    await updateFirebase();
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
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
    <main className="h-screen w-screen flex p-4  items-center bg-gradient-to-tr from-blue-500 to-blue-50">
      <section className="max-w-screen-lg mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Image src={src} />
        </div>

        <Card shadow="none" className=" p-8 shadow-md">
          <div className=" flex flex-col gap-4">
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
                  className="mx-3"
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
                >
                  <h5>feed</h5>
                </Button>
              </div>
              <div className="flex italic text-gray-500">
                <h5 className="text-sm">Last fed: {fedTime}</h5>
              </div>
            </div>
          </div>
        </Card>
      </section>
      <section className="absolute flex justify-center items-center bottom-0 right-0 left-0 p-6 text-white">
        <h5>
          embedded project: fist-tank. created by ya zee leng diew zoo ling
        </h5>
      </section>
    </main>
  );
}
