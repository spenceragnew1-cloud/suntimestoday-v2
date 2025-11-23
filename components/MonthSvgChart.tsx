interface MonthSvgChartProps {
  title: string;
  values: number[]; // one value per day of month
  color?: string;
  height?: number;
  monthName?: string;
  cityName?: string;
}

export function MonthSvgChart({
  title,
  values,
  color = "#0070f3",
  height = 160,
  monthName,
  cityName,
}: MonthSvgChartProps) {
  if (!values || values.length === 0) {
    return null;
  }

  const width = 320;
  const chartHeight = height;
  const padding = 20;
  const chartWidth = width - padding * 2;
  const chartAreaHeight = chartHeight - padding * 2 - 20; // Extra space for title

  // Calculate min/max with 10% padding
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue;
  const paddingAmount = range * 0.1;
  const scaledMin = minValue - paddingAmount;
  const scaledMax = maxValue + paddingAmount;
  const scaledRange = scaledMax - scaledMin;

  // Generate grid lines (4 horizontal lines)
  const gridLines = [];
  for (let i = 0; i <= 4; i++) {
    const y = padding + 20 + (chartAreaHeight / 4) * i;
    gridLines.push(
      <line
        key={i}
        x1={padding}
        y1={y}
        x2={width - padding}
        y2={y}
        stroke="#e5e7eb"
        strokeWidth="1"
      />
    );
  }

  // Generate polyline points
  const points = values
    .map((value, index) => {
      const x = padding + (chartWidth / (values.length - 1)) * index;
      const normalizedValue = (value - scaledMin) / scaledRange;
      const y = padding + 20 + chartAreaHeight - normalizedValue * chartAreaHeight;
      return `${x},${y}`;
    })
    .join(" ");

  const ariaLabel = monthName && cityName
    ? `${title} chart for ${monthName} in ${cityName}`
    : `${title} chart`;

  return (
    <div className="w-full max-w-md mx-auto">
      <svg
        viewBox={`0 0 ${width} ${chartHeight}`}
        className="w-full h-auto"
        role="img"
        aria-label={ariaLabel}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid lines */}
        {gridLines}

        {/* Data line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Title */}
        <text
          x={width / 2}
          y={15}
          textAnchor="middle"
          className="text-sm font-semibold fill-gray-800"
          fontSize="14"
        >
          {title}
        </text>
      </svg>
    </div>
  );
}
