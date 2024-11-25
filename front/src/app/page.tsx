"use client";
import { Button, Card, Image } from "@nextui-org/react";

export default function Home() {
  return (
    <main className="h-screen w-screen flex  items-center bg-gradient-to-tr from-blue-500 to-blue-50">
      <section className="max-w-screen-lg mx-auto grid grid-cols-2 gap-4">
        <div>
          <Image src="/images/fishtank.jpg" />
        </div>

        <Card shadow="none" className=" p-8 shadow-md">
          <div className=" flex flex-col gap-4">
            <h1>Temperature: 45 C</h1>
            <h1>Water level: 45%</h1>
            <div>
              <Button className="  bg-sky-200 ">
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
