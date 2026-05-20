export const apexBase = {
  chart: {
    fontFamily: "'Inter', 'Pretendard', sans-serif",
    foreColor: '#6C727E',
    toolbar: { show: false },
    zoom: { enabled: false },
    animations: {
      enabled: true,
      easing: 'easeout',
      speed: 700,
      animateGradually: { enabled: true, delay: 60 },
      dynamicAnimation: { enabled: true, speed: 350 },
    },
  },
  grid: {
    borderColor: '#F4F5F8',
    strokeDashArray: 0,
    padding: { left: 8, right: 8, top: 0, bottom: 0 },
  },
  xaxis: {
    axisBorder: { color: '#E5E7EB' },
    axisTicks: { color: '#E5E7EB' },
    labels: {
      style: { fontSize: '12px', colors: '#6C727E' },
    },
  },
  yaxis: {
    labels: {
      style: { fontSize: '12px', colors: '#6C727E' },
    },
  },
  tooltip: {
    theme: 'light',
    style: { fontSize: '12px', fontFamily: "'Inter', 'Pretendard', sans-serif" },
  },
  dataLabels: { enabled: false },
  legend: {
    fontSize: '12px',
    fontFamily: "'Inter', 'Pretendard', sans-serif",
    labels: { colors: '#3D424A' },
    markers: { width: 8, height: 8, radius: 2 },
    itemMargin: { vertical: 4, horizontal: 8 },
  },
  stroke: { width: 2, curve: 'smooth' },
  states: {
    hover: { filter: { type: 'none' } },
    active: { filter: { type: 'none' } },
  },
};

export const chartPalette = [
  '#5E6AD2',
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#14B8A6',
  '#6B7280',
];

export const scorePalette = [
  '#EF4444',
  '#F87171',
  '#F59E0B',
  '#FBBF24',
  '#34D399',
  '#10B981',
  '#059669',
];

export const mergeChartOptions = (base, override) => {
  const result = { ...base };
  // eslint-disable-next-line no-restricted-syntax
  for (const key of Object.keys(override)) {
    if (
      base[key] &&
      typeof base[key] === 'object' &&
      !Array.isArray(base[key])
    ) {
      result[key] = { ...base[key], ...override[key] };
    } else {
      result[key] = override[key];
    }
  }
  return result;
};
