import React, { useState, useMemo } from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Breadcrumbs,
  Link,
  IconButton,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

interface CategoryData {
  categoryOrBrand: string;
  count: number;
}

interface TreemapData {
  name: string;
  size?: number;
  children?: TreemapData[];
  color?: string;
}

interface ProductsByCategoryTreemapProps {
  data: CategoryData[];
}

type TreemapPoint = {
  x: number;
  y: number;
  width: number;
  height: number;
};

interface RechartContentProps extends TreemapPoint {
  root?: TreemapData;
  depth?: number;
  colors?: string[];
  index?: number;
  payload?: {
    name: string;
    size: number;
    color: string;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      name: string;
      size: number;
    };
  }>;
}

const COLORS = [
  '#4361ee',
  '#3a0ca3',
  '#7209b7',
  '#f72585',
  '#4895ef',
  '#4cc9f0',
  '#480ca8',
  '#3f37c9',
  '#3a0ca3',
  '#3c096c',
  '#5a189a',
  '#6f42c1',
];

const transformData = (data: CategoryData[]): TreemapData => {
  return {
    name: 'All Categories',
    children: data.map((item, index) => ({
      name: item.categoryOrBrand,
      size: item.count,
      color: COLORS[index % COLORS.length],
    })),
  };
};

const CustomContent: React.FC<RechartContentProps> = (props) => {
  const { x, y, width, height, payload } = props;

  if (!payload) return null;

  const { name, size, color } = payload;
  const fontSize = Math.min(width / 8, height / 4, 14);

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        className="transition-opacity hover:opacity-80"
      />
      {width > 30 && height > 30 && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#ffffff"
          fontSize={fontSize}
          className="select-none pointer-events-none"
        >
          <tspan x={x + width / 2} dy="-0.5em">
            {name}
          </tspan>
          <tspan x={x + width / 2} dy="1.2em">
            {size} produits
          </tspan>
        </text>
      )}
    </g>
  );
};

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;
    return (
      <Card className="bg-white shadow-lg">
        <CardContent className="p-2">
          <Typography variant="subtitle2" className="font-semibold">
            {data.name}
          </Typography>
          <Typography variant="body2">{data.size} produits</Typography>
        </CardContent>
      </Card>
    );
  }
  return null;
};

const ProductsByCategoryTreemap: React.FC<ProductsByCategoryTreemapProps> = ({
  data,
}) => {
  const treeMapData = useMemo(() => transformData(data), [data]);
  const [currentPath, setCurrentPath] = useState<string[]>([]);

  const getCurrentData = () => {
    let current = treeMapData;
    for (const path of currentPath) {
      const found = current.children?.find((child) => child.name === path);
      if (found) current = found;
    }
    return current;
  };

  const handleClick = (data: TreemapData) => {
    if (data.children) {
      setCurrentPath([...currentPath, data.name]);
    }
  };

  const handleBack = () => {
    setCurrentPath((prev) => prev.slice(0, -1));
  };

  const currentData = getCurrentData();

  return (
    <Card className="w-full">
      <CardContent>
        <Box className="flex items-center mb-4">
          {currentPath.length > 0 && (
            <IconButton onClick={handleBack} size="small" className="mr-2">
              <ArrowBack />
            </IconButton>
          )}
          <Breadcrumbs>
            <Link
              component="button"
              variant="subtitle1"
              onClick={() => setCurrentPath([])}
              underline="hover"
              color="inherit"
            >
              Toutes les catégories
            </Link>
            {currentPath.map((path) => (
              <Typography key={path} variant="subtitle1" color="text.primary">
                {path}
              </Typography>
            ))}
          </Breadcrumbs>
        </Box>

        <ResponsiveContainer width="100%" height={400}>
          <Treemap
            data={currentData.children || []}
            dataKey="size"
            stroke="#fff"
            fill="#8884d8"
            content={React.createElement(CustomContent)}
            onClick={handleClick}
          >
            <Tooltip content={<CustomTooltip />} />
          </Treemap>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ProductsByCategoryTreemap;
