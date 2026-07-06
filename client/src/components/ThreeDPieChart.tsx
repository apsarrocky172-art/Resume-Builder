import React from 'react';

interface Metric {
  subject: string;
  A: number;
  fullMark: number;
}

interface ThreeDPieChartProps {
  readinessMetrics: Metric[];
}

const COLOR_MAP: Record<string, string> = {
  'Quantitative': '#6366f1',       // Indigo
  'Logical Reasoning': '#ec4899',   // Pink
  'Verbal Ability': '#f59e0b',      // Amber
  'Coding Accuracy': '#10b981',     // Emerald
  'Oral Communication': '#8b5cf6',  // Purple
};

const DEFAULT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

// Helper to darken a hex color dynamically
const darkenColor = (hex: string, percent: number) => {
  hex = hex.replace(/^\s*#|\s*$/g, '');
  if (hex.length === 3) {
    hex = hex.replace(/(.)/g, '$1$1');
  }
  let r = parseInt(hex.substr(0, 2), 16);
  let g = parseInt(hex.substr(2, 2), 16);
  let b = parseInt(hex.substr(4, 2), 16);

  r = Math.max(0, Math.floor(r * (1 - percent / 100)));
  g = Math.max(0, Math.floor(g * (1 - percent / 100)));
  b = Math.max(0, Math.floor(b * (1 - percent / 100)));

  const rs = r.toString(16).padStart(2, '0');
  const gs = g.toString(16).padStart(2, '0');
  const bs = b.toString(16).padStart(2, '0');
  return `#${rs}${gs}${bs}`;
};

export const ThreeDPieChart: React.FC<ThreeDPieChartProps> = ({ readinessMetrics }) => {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [tooltip, setTooltip] = React.useState<{
    visible: boolean;
    x: number;
    y: number;
    label: string;
    score: number;
    color: string;
  } | null>(null);



  // Define slices and mapping colors
  const slices = readinessMetrics.map((m, idx) => {
    const color = COLOR_MAP[m.subject] || DEFAULT_COLORS[idx % DEFAULT_COLORS.length];
    return {
      subject: m.subject,
      score: m.A,
      color,
      renderValue: Math.max(14, m.A), // Ensure a minimum size so labels do not overlap
    };
  });

  const renderSum = slices.reduce((acc, curr) => acc + curr.renderValue, 0);

  // Compute angles
  let currentAngle = 0;
  const slicesWithAngles = slices.map((slice) => {
    const angleDelta = (slice.renderValue / renderSum) * 2 * Math.PI;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angleDelta;
    currentAngle = endAngle;
    const midAngle = (startAngle + endAngle) / 2;

    return {
      ...slice,
      startAngle,
      endAngle,
      midAngle,
    };
  });

  // 3D parameters (Enlarged)
  const cx = 250;
  const cy = 135;
  const rx = 125;
  const ry = 68; // Squish factor (y-axis radius)
  const h = 24;  // Extrusion depth

  // Calculate adjusted vertical positions for labels to prevent vertical overlapping/collisions
  const initialLabels = slicesWithAngles.map((slice, idx) => {
    const isHovered = hoveredIndex === idx;

    // Labels translate with the slices to maintain pointer connection alignment
    const translateOffset = isHovered ? 12 : 0;
    const tdx = translateOffset * Math.cos(slice.midAngle);
    const tdy = translateOffset * Math.sin(slice.midAngle) * 0.55;

    const baseOffset = 6;
    const dx = baseOffset * Math.cos(slice.midAngle);
    const dy = baseOffset * Math.sin(slice.midAngle) * 0.55;

    const ox = cx + dx;
    const oy = cy + dy;

    const startX = ox + rx * Math.cos(slice.midAngle);
    const startY = oy + ry * Math.sin(slice.midAngle);

    const breakX = ox + (rx + 22) * Math.cos(slice.midAngle);
    const initialBreakY = oy + (ry + 16) * Math.sin(slice.midAngle);

    const isRightSide = Math.cos(slice.midAngle) >= 0;
    const endX = isRightSide ? cx + rx + 65 : cx - rx - 65;
    const textAnchor: "start" | "end" = isRightSide ? 'start' : 'end';
    const textX = isRightSide ? endX + 8 : endX - 8;

    return {
      idx,
      slice,
      isHovered,
      tdx,
      tdy,
      startX,
      startY,
      breakX,
      breakY: initialBreakY,
      isRightSide,
      endX,
      textAnchor,
      textX,
    };
  });

  const adjustLabels = (labelsList: typeof initialLabels) => {
    if (labelsList.length <= 1) return;
    // Sort ascending by initial vertical position
    labelsList.sort((a, b) => a.breakY - b.breakY);
    const minSpacing = 28; // Min vertical gap between labels (name + score + spacing)

    // Pass 1: push overlapping labels downwards
    for (let i = 1; i < labelsList.length; i++) {
      if (labelsList[i].breakY < labelsList[i - 1].breakY + minSpacing) {
        labelsList[i].breakY = labelsList[i - 1].breakY + minSpacing;
      }
    }

    // Pass 2: push back upwards if they exit the SVG box
    const maxAllowedY = 275;
    if (labelsList[labelsList.length - 1].breakY > maxAllowedY) {
      labelsList[labelsList.length - 1].breakY = maxAllowedY;
      for (let i = labelsList.length - 2; i >= 0; i--) {
        if (labelsList[i].breakY > labelsList[i + 1].breakY - minSpacing) {
          labelsList[i].breakY = labelsList[i + 1].breakY - minSpacing;
        }
      }
    }
  };

  const rightLabels = initialLabels.filter(l => l.isRightSide);
  const leftLabels = initialLabels.filter(l => !l.isRightSide);

  adjustLabels(rightLabels);
  adjustLabels(leftLabels);

  const adjustedLabelsMap: Record<number, typeof initialLabels[0]> = {};
  initialLabels.forEach(l => {
    adjustedLabelsMap[l.idx] = l;
  });

  // Sorting based on Math.sin(midAngle) to draw backmost slices first (depth sorting)
  const sortedSlices = [...slicesWithAngles]
    .map((slice, originalIndex) => ({ ...slice, originalIndex }))
    .sort((a, b) => Math.sin(a.midAngle) - Math.sin(b.midAngle));

  const handleMouseMove = (e: React.MouseEvent, index: number, slice: any) => {
    const container = document.getElementById('three-d-pie-container');
    if (container) {
      const rect = container.getBoundingClientRect();
      // Position tooltip above cursor
      setTooltip({
        visible: true,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top - 12,
        label: slice.subject,
        score: slice.score,
        color: slice.color,
      });
    }
    setHoveredIndex(index);
  };

  return (
    <div
      id="three-d-pie-container"
      className="relative w-full h-full flex items-center justify-center min-h-[280px]"
      onMouseLeave={() => {
        setHoveredIndex(null);
        setTooltip(null);
      }}
    >
      <svg viewBox="0 0 500 300" className="w-full h-full select-none overflow-visible">
        <defs>
          {slicesWithAngles.map((slice, i) => (
            <linearGradient id={`topGrad-${i}`} x1="0%" y1="0%" x2="0%" y2="100%" key={i}>
              <stop offset="0%" stopColor={slice.color} />
              <stop offset="100%" stopColor={darkenColor(slice.color, 12)} />
            </linearGradient>
          ))}
          <filter id="pieShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#000000" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* 3D Drop shadow ellipse below the entire pie chart */}
        <ellipse
          cx={cx}
          cy={cy + h + 12}
          rx={rx + 8}
          ry={ry + 4}
          fill="#000000"
          opacity="0.16"
          filter="url(#pieShadow)"
        />

        {/* Slices rendering */}
        {sortedSlices.map((slice) => {
          const isHovered = hoveredIndex === slice.originalIndex;

          // CSS dynamic translation for smooth explode animation
          const translateOffset = isHovered ? 12 : 0;
          const tdx = translateOffset * Math.cos(slice.midAngle);
          const tdy = translateOffset * Math.sin(slice.midAngle) * 0.55;

          // Stable base offset to keep slices separated by default (similar to target design)
          const baseOffset = 6;
          const dx = baseOffset * Math.cos(slice.midAngle);
          const dy = baseOffset * Math.sin(slice.midAngle) * 0.55;

          const ox = cx + dx;
          const oy = cy + dy;

          const xStart = ox + rx * Math.cos(slice.startAngle);
          const yStart = oy + ry * Math.sin(slice.startAngle);
          const xEnd = ox + rx * Math.cos(slice.endAngle);
          const yEnd = oy + ry * Math.sin(slice.endAngle);

          const largeArcFlag = slice.endAngle - slice.startAngle > Math.PI ? 1 : 0;

          // Side wall paths
          const startFacePath = `M ${ox} ${oy} L ${xStart} ${yStart} L ${xStart} ${yStart + h} L ${ox} ${oy + h} Z`;
          const endFacePath = `M ${ox} ${oy} L ${xEnd} ${yEnd} L ${xEnd} ${yEnd + h} L ${ox} ${oy + h} Z`;
          const outerCurvedPath = `M ${xStart} ${yStart} A ${rx} ${ry} 0 ${largeArcFlag} 1 ${xEnd} ${yEnd} L ${xEnd} ${yEnd + h} A ${rx} ${ry} 0 ${largeArcFlag} 0 ${xStart} ${yStart + h} Z`;

          // Colors
          const topColor = `url(#topGrad-${slice.originalIndex})`;
          const outerSideColor = darkenColor(slice.color, 16);
          const startSideColor = darkenColor(slice.color, 10);
          const endSideColor = darkenColor(slice.color, 24);

          return (
            <g
              key={slice.originalIndex}
              className="cursor-pointer"
              style={{
                transform: `translate(${tdx}px, ${tdy}px)`,
                transition: 'transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
              onMouseEnter={() => setHoveredIndex(slice.originalIndex)}
              onMouseMove={(e) => handleMouseMove(e, slice.originalIndex, slice)}
            >
              {/* Flat start face */}
              <path
                d={startFacePath}
                fill={startSideColor}
              />

              {/* Flat end face */}
              <path
                d={endFacePath}
                fill={endSideColor}
              />

              {/* Outer cylinder face */}
              <path
                d={outerCurvedPath}
                fill={outerSideColor}
              />

              {/* Top face */}
              <path
                d={`M ${ox} ${oy} L ${xStart} ${yStart} A ${rx} ${ry} 0 ${largeArcFlag} 1 ${xEnd} ${yEnd} Z`}
                fill={topColor}
                stroke={isHovered ? '#ffffff' : 'none'}
                strokeWidth={1.5}
              />
            </g>
          );
        })}

        {/* Labels and pointer lines rendering (Collision-Resolved & Legible) */}
        {slicesWithAngles.map((slice, originalIndex) => {
          const labelInfo = adjustedLabelsMap[originalIndex];
          if (!labelInfo) return null;

          const { isHovered, tdx, tdy, startX, startY, breakX, breakY, endX, textAnchor, textX } = labelInfo;

          return (
            <g
              key={`label-${originalIndex}`}
              className="pointer-events-none"
              style={{
                transform: `translate(${tdx}px, ${tdy}px)`,
                transition: 'transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              {/* Pointer path */}
              <path
                d={`M ${startX} ${startY} L ${breakX} ${breakY} L ${endX} ${breakY}`}
                stroke={isHovered ? slice.color : '#94a3b8'}
                strokeWidth={isHovered ? 1.5 : 1}
                strokeDasharray={isHovered ? 'none' : '2,2'}
                fill="none"
                opacity={isHovered ? 1 : 0.45}
              />

              {/* Start anchor circle */}
              <circle
                cx={startX}
                cy={startY}
                r={2.5}
                fill={slice.color}
                opacity={isHovered ? 1 : 0.7}
              />

              {/* Break corner circle */}
              <circle
                cx={breakX}
                cy={breakY}
                r={1.5}
                fill={isHovered ? slice.color : '#94a3b8'}
                opacity={isHovered ? 1 : 0.5}
              />

              {/* Label text: Subject Name */}
              <text
                x={textX}
                y={breakY - 3}
                textAnchor={textAnchor}
                className={`text-[12px] md:text-[13px] font-bold tracking-wide transition-all duration-300 ${isHovered ? 'fill-slate-900 dark:fill-white font-extrabold' : 'fill-slate-700 dark:fill-slate-300'
                  }`}
              >
                {slice.subject}
              </text>

              {/* Label text: Score */}
              <text
                x={textX}
                y={breakY + 9}
                textAnchor={textAnchor}
                fill={isHovered ? slice.color : ''}
                className={`text-[12px] md:text-[13px] font-extrabold transition-all duration-300 ${isHovered ? '' : 'fill-slate-800 dark:fill-slate-200'
                  }`}
              >
                {slice.score}%
              </text>
            </g>
          );
        })}
      </svg>

      {/* Sleek Floating Glassmorphic Tooltip */}
      {tooltip && tooltip.visible && (
        <div
          className="absolute pointer-events-none bg-slate-950/90 dark:bg-slate-900/95 border border-slate-700/80 p-2.5 rounded-xl shadow-2xl backdrop-blur-md transition-all duration-75 flex flex-col gap-0.5 z-20"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tooltip.color }} />
            {tooltip.label}
          </span>
          <span className="text-xs font-black text-white mt-0.5">Readiness Score: {tooltip.score}%</span>
        </div>
      )}
    </div>
  );
};
