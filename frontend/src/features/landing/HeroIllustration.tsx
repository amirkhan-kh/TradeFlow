const S = 1;
const OX = 300;
const OY = 70;

const iso = (x: number, y: number, z = 0): [number, number] => [OX + (x - y) * 0.866 * S, OY + (x + y) * 0.5 * S - z * S];
const pts = (...p: [number, number, number][]) => p.map(([x, y, z]) => iso(x, y, z).map((n) => n.toFixed(1)).join(",")).join(" ");

interface Colors {
  top: string;
  right: string;
  left: string;
}

function Box({ x, y, z = 0, w, d, h, c }: { x: number; y: number; z?: number; w: number; d: number; h: number; c: Colors }) {
  return (
    <g>
      <polygon points={pts([x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h])} fill={c.right} />
      <polygon points={pts([x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h])} fill={c.left} />
      <polygon points={pts([x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h])} fill={c.top} />
    </g>
  );
}

function Wheel({ x, y }: { x: number; y: number }) {
  const [cx, cy] = iso(x, y, 6);
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx="7" ry="7.5" fill="#13201c" />
      <ellipse cx={cx} cy={cy} rx="3" ry="3.2" fill="#8a9b95" />
    </g>
  );
}

function Truck({ x, y, cargo, flip = false }: { x: number; y: number; cargo: Colors; flip?: boolean }) {
  const cab: Colors = { top: "#f5f8f7", right: "#d8e1de", left: "#eaf0ee" };
  const cabX = flip ? x - 26 : x + 74;
  return (
    <g>
      <Box x={x} y={y} z={8} w={72} d={34} h={44} c={cargo} />
      <Box x={cabX} y={y + 2} z={8} w={24} d={30} h={30} c={cab} />
      {!flip && <polygon points={pts([cabX + 24, y + 6, 22], [cabX + 24, y + 28, 22], [cabX + 24, y + 28, 34], [cabX + 24, y + 6, 34])} fill="#18324d" opacity=".85" />}
      <Wheel x={x + 12} y={y + 34} />
      <Wheel x={x + 58} y={y + 34} />
      <Wheel x={cabX + 14} y={y + 32} />
    </g>
  );
}

const kraft: Colors = { top: "#ecd2a6", right: "#cfa772", left: "#ddb886" };
const greenBox: Colors = { top: "#3dae7f", right: "#0f6044", left: "#137852" };
const navyBox: Colors = { top: "#2a4a6b", right: "#0f2236", left: "#18324d" };

/** `label` is the translated accessible name of the drawing. */
export function HeroIllustration({ label }: { label: string }) {
  const wx = 40;
  const wy = 20;
  const ww = 170;
  const wd = 120;
  const wh = 80;
  const ridge = 36;
  const midY = wy + wd / 2;

  return (
    <svg viewBox="0 0 600 440" className="h-auto w-full" role="img" aria-label={label}>
      <defs>
        <linearGradient id="pf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ecf8f2" />
          <stop offset="1" stopColor="#d2efe0" />
        </linearGradient>
      </defs>

      <Box x={-20} y={-20} z={-10} w={330} d={300} h={10} c={{ top: "url(#pf)", right: "#a7dfc4", left: "#c3e8d5" }} />
      {Array.from({ length: 10 }, (_, i) => (
        <polyline key={i} points={pts([-20 + i * 33, -20, 0], [-20 + i * 33, 280, 0])} stroke="#137852" strokeOpacity=".06" />
      ))}

      <polyline
        points={pts([60, 230, 0], [230, 230, 0], [230, 170, 0])}
        fill="none"
        stroke="#137852"
        strokeWidth="2.5"
        strokeDasharray="6 7"
        strokeLinecap="round"
        opacity=".55"
      />

      {/* warehouse */}
      <polygon points={pts([wx - 4, wy - 6, wh], [wx + ww + 4, wy - 6, wh], [wx + ww + 4, midY, wh + ridge], [wx - 4, midY, wh + ridge])} fill="#3dae7f" />
      <polygon points={pts([wx + ww, wy, 0], [wx + ww, wy + wd, 0], [wx + ww, wy + wd, wh], [wx + ww, wy, wh])} fill="#cfe2d8" />
      <polygon points={pts([wx + ww, wy, wh], [wx + ww, wy + wd, wh], [wx + ww, midY, wh + ridge])} fill="#bdd8ca" />
      <polygon points={pts([wx, wy + wd, 0], [wx + ww, wy + wd, 0], [wx + ww, wy + wd, wh], [wx, wy + wd, wh])} fill="#f1f7f4" />
      <polygon points={pts([wx - 4, wy + wd + 6, wh - 3], [wx + ww + 4, wy + wd + 6, wh - 3], [wx + ww + 4, midY, wh + ridge], [wx - 4, midY, wh + ridge])} fill="#1f9366" />
      {Array.from({ length: 9 }, (_, i) => {
        const x = wx + 10 + i * 19;
        return <polyline key={i} points={pts([x, wy + wd + 6, wh - 3], [x, midY, wh + ridge])} stroke="#0f6044" strokeOpacity=".35" strokeWidth="1.5" />;
      })}
      <polyline points={pts([wx - 4, midY, wh + ridge], [wx + ww + 4, midY, wh + ridge])} stroke="#a7dfc4" strokeWidth="2" />

      {/* dock doors */}
      {[0, 1].map((i) => {
        const y0 = wy + 18 + i * 50;
        return (
          <g key={i}>
            <polygon points={pts([wx + ww, y0, 0], [wx + ww, y0 + 36, 0], [wx + ww, y0 + 36, 48], [wx + ww, y0, 48])} fill="#0e4c37" />
            {[10, 20, 30, 40].map((z) => (
              <polyline key={z} points={pts([wx + ww, y0, z], [wx + ww, y0 + 36, z])} stroke="#3dae7f" strokeOpacity=".4" />
            ))}
          </g>
        );
      })}
      {/* windows */}
      {Array.from({ length: 6 }, (_, i) => {
        const x = wx + 14 + i * 26;
        return <polygon key={i} points={pts([x, wy + wd, 52], [x + 16, wy + wd, 52], [x + 16, wy + wd, 64], [x, wy + wd, 64])} fill="#a7dfc4" />;
      })}
      <polygon points={pts([wx + 60, wy + wd, 0], [wx + 92, wy + wd, 0], [wx + 92, wy + wd, 38], [wx + 60, wy + wd, 38])} fill="#137852" />

      {/* pallets */}
      <Box x={222} y={30} w={22} d={22} h={18} c={kraft} />
      <Box x={222} y={30} z={18} w={22} d={22} h={16} c={kraft} />
      <Box x={246} y={34} w={20} d={20} h={18} c={greenBox} />
      <Box x={20} y={160} w={20} d={20} h={16} c={kraft} />
      <Box x={20} y={182} w={18} d={18} h={14} c={greenBox} />

      <Truck x={234} y={150} cargo={greenBox} flip />
      <Truck x={40} y={214} cargo={navyBox} />

      {/* sensor pin */}
      <g className="animate-float">
        <circle cx={iso(120, 60, 140)[0]} cy={iso(120, 60, 140)[1]} r="16" fill="#fff" stroke="#a7dfc4" strokeWidth="2" />
        <path
          d={`M${iso(120, 60, 140)[0] - 6} ${iso(120, 60, 140)[1]} l4 4 8-8`}
          stroke="#137852"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
