interface WaterProps {
  water: number;
  setWater: (water: number) => void;
}

interface TempProps {
  temperature: number;
  setTemperature: (temp: number) => void;
}

interface ImageProps {
  src: string;
  setSrc: (src: string) => void;
}

interface FedTimeProps {
  fedTime: string;

  setFedTime: (date: string) => void;
}
