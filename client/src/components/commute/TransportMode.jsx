import {
  Bus,
  TrainFront,
  CarTaxiFront,
  Footprints,
} from "lucide-react";

function TransportMode() {
  const transportModes = [
    {
      icon: Bus,
      name: "Jeepney",
    },
    {
      icon: TrainFront,
      name: "MRT/LRT",
    },
    {
      icon: CarTaxiFront,
      name: "Ride-Hailing",
    },
    {
      icon: Footprints,
      name: "Walking",
    },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      {transportModes.map((mode, index) => {
        const Icon = mode.icon;

        return (
          <div
            key={index}
            className="rounded-[28px] border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600">
              <Icon className="text-white" />
            </div>

            <h3 className="mt-6 text-xl font-bold text-white">
              {mode.name}
            </h3>
          </div>
        );
      })}
    </div>
  );
}

export default TransportMode;