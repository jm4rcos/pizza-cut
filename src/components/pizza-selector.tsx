import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PIZZA_FLAVORS = [
  "Margherita",
  "Pepperoni",
  "Quatro Queijos",
  "Calabresa",
  "Frango c/ Catupiry",
  "Portuguesa",
  "Vegetariana",
] as const;
const BORDER_FLAVORS = [
  "Sem Borda",
  "Catupiry",
  "Cheddar",
  "Chocolate",
] as const;
const SIZES = ["P", "M", "G"] as const;

type Flavor = (typeof PIZZA_FLAVORS)[number];
type BorderFlavor = (typeof BORDER_FLAVORS)[number];
type Size = (typeof SIZES)[number];

interface FlavorButtonProps {
  flavor: string;
  isSelected: boolean;
  onClick: () => void;
}

const FlavorButton: React.FC<FlavorButtonProps> = ({
  flavor,
  isSelected,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-full text-sm ${
      isSelected ? "bg-yellow-500 text-white" : "bg-gray-200 text-gray-700"
    }`}
  >
    {flavor}
  </button>
);

interface SizeSelectorProps {
  size: Size;
  onChangeSize: (direction: "left" | "right") => void;
}

const SizeSelector: React.FC<SizeSelectorProps> = ({ size, onChangeSize }) => (
  <div className="flex items-center space-x-2">
    <button onClick={() => onChangeSize("left")} className="text-gray-500">
      <ChevronLeft size={20} />
    </button>
    <span className="font-semibold">{size}</span>
    <button onClick={() => onChangeSize("right")} className="text-gray-500">
      <ChevronRight size={20} />
    </button>
  </div>
);

interface PizzaVisualProps {
  selectedFlavors: Flavor[];
  borderFlavor: BorderFlavor;
}

const PizzaVisual: React.FC<PizzaVisualProps> = ({
  selectedFlavors,
  borderFlavor,
}) => {
  const getSlicePath = (index: number, total: number) => {
    const startAngle = (index / total) * 360;
    const endAngle = ((index + 1) / total) * 360;
    const start = polarToCartesian(50, 50, 48, startAngle);
    const end = polarToCartesian(50, 50, 48, endAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return `M50,50 L${start.x},${start.y} A48,48 0 ${largeArcFlag},1 ${end.x},${end.y} Z`;
  };

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="48" fill="#FEF3C7" />
        {selectedFlavors.map((flavor, index) => (
          <g key={flavor}>
            {selectedFlavors.length > 1 && (
              <path
                d={getSlicePath(index, selectedFlavors.length)}
                fill="#FEF3C7"
                stroke="#FCD34D"
                strokeWidth="0.5"
              />
            )}
            <text
              x="50"
              y="50"
              textAnchor="middle"
              fill="#4B5563"
              fontSize="4"
              fontWeight="bold"
              transform={`rotate(${
                (index + 0.5) * (360 / selectedFlavors.length)
              }, 50, 50) translate(0, -30)`}
            >
              {flavor}
            </text>
          </g>
        ))}
        {borderFlavor !== "Sem Borda" && (
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="#D97706"
            strokeWidth="4"
          />
        )}
      </svg>
    </div>
  );
};

const PizzaSelector: React.FC = () => {
  const [selectedFlavors, setSelectedFlavors] = useState<Flavor[]>([]);
  const [borderFlavor, setBorderFlavor] = useState<BorderFlavor>("Sem Borda");
  const [currentSize, setCurrentSize] = useState<number>(1);

  const toggleFlavor = (flavor: Flavor) => {
    setSelectedFlavors((prev) =>
      prev.includes(flavor)
        ? prev.filter((f) => f !== flavor)
        : prev.length < 3
        ? [...prev, flavor]
        : prev
    );
  };

  const changeSize = (direction: "left" | "right") => {
    setCurrentSize((prev) =>
      direction === "left"
        ? prev > 0
          ? prev - 1
          : SIZES.length - 1
        : prev < SIZES.length - 1
        ? prev + 1
        : 0
    );
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Monte sua Pizza</h2>

      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-2">Sabores (até 3):</h3>
        <div className="flex flex-wrap gap-2">
          {PIZZA_FLAVORS.map((flavor) => (
            <FlavorButton
              key={flavor}
              flavor={flavor}
              isSelected={selectedFlavors.includes(flavor)}
              onClick={() => toggleFlavor(flavor)}
            />
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-2">Borda:</h3>
        <div className="flex flex-wrap gap-2">
          {BORDER_FLAVORS.map((flavor) => (
            <FlavorButton
              key={flavor}
              flavor={flavor}
              isSelected={borderFlavor === flavor}
              onClick={() => setBorderFlavor(flavor)}
            />
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-2">Tamanho:</h3>
        <SizeSelector size={SIZES[currentSize]} onChangeSize={changeSize} />
      </div>

      <PizzaVisual
        selectedFlavors={selectedFlavors}
        borderFlavor={borderFlavor}
      />
    </div>
  );
};

export default PizzaSelector;
