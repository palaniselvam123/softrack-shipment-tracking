import {
  CloudRain,
  CloudSun,
  Cloud,
  Wind,
  Sun
} from "lucide-react";

export function getWeatherIcon(text: string) {
  const t = text.toLowerCase();

  if (t.includes("rain") || t.includes("storm"))
    return <CloudRain className="w-4 h-4 text-blue-500" />;

  if (t.includes("cloud"))
    return <Cloud className="w-4 h-4 text-slate-500" />;

  if (t.includes("wind"))
    return <Wind className="w-4 h-4 text-indigo-500" />;

  return <Sun className="w-4 h-4 text-yellow-500" />;
}
