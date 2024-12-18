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
  sources: string[];
  setSrc: (src: string) => void;
}

interface FedTimeProps {
  fedTime: string;

  setFedTime: (date: string) => void;
}

interface ClusterProps {
  clusterNum: number;

  setCluster: (cluster: number) => void;
}

interface StatusProps {
  status: string;

  setStatus: (string: string) => void;
}