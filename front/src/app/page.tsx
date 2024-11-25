"use client";
import { Button, Card, Image } from "@nextui-org/react";
import { create } from "zustand";

interface WaterProps {
  water: number;
  setWater: (water: number) => void;
}

interface TempProps {
  temperature: number;
  setTemperature: (temp: number) => void;
}

const useWater = create<WaterProps>((set) => ({
  water: 1.5,
  setWater: (value) => set({ water: value }),
}));

const useTemperature = create<TempProps>((set) => ({
  temperature: 42.3,
  setTemperature: (temp) => set({ temperature: temp }),
}));

export default function Home() {
  const { water, setWater } = useWater();
  const { temperature, setTemperature } = useTemperature();
  return (
    <main className="h-screen w-screen flex p-4  items-center bg-gradient-to-tr from-blue-500 to-blue-50">
      <section className="max-w-screen-lg mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Image src="/images/fishtank.jpg" />
        </div>

        <Card shadow="none" className=" p-8 shadow-md">
          <div className=" flex flex-col gap-4">
            <h1>Temperature: {temperature} °C</h1>
            <h1>Water level: {water}</h1>
            <div>
              <Button
                onPress={() => {
                  setTemperature(1);
                }}
                className="  bg-sky-200 "
              >
                <h5>feed</h5>
              </Button>
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
