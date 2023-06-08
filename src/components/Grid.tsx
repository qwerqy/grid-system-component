import React, { useContext, createContext } from "react";
import styled from "styled-components";

interface Area {
  name: string;
  start: number[];
  end: number[];
}

interface GridProps {
  gridArea?: string;
  areas: Area[];
  columns?: number;
  rows?: number;
  children: React.ReactNode;
  backgroundColor?: string;
}

interface GridContextType {
  areas: any;
  getColumnsAndRows: (gridArea?: string) => { columns: number; rows: number };
}

const generateGridTemplateAreas = (
  areas: Area[],
  rows?: number,
  columns?: number
): string => {
  const gridTemplateAreasArray: string[][] = [];

  if (rows && columns) {
    // Initialize gridTemplateAreasArray with empty strings
    for (let i = 0; i < rows; i++) {
      gridTemplateAreasArray[i] = [];
      for (let j = 0; j <= columns; j++) {
        gridTemplateAreasArray[i][j] = ".";
      }
    }

    // Assign area names to corresponding grid cells
    areas.forEach((area) => {
      const { name, start, end } = area;
      const [startColumn, startRow] = start;
      const [endColumn, endRow] = end;

      for (let row = startRow; row <= endRow; row++) {
        for (let col = startColumn; col <= endColumn; col++) {
          gridTemplateAreasArray[row][col] = name;
        }
      }
    });

    // Convert gridTemplateAreasArray to a string
    return gridTemplateAreasArray.map((row) => `"${row.join(" ")}"`).join("\n");
  }
  return "";
};

const GridContainer = styled.div<GridProps>`
  display: grid;
  grid-column-gap: 12px;
  grid-template-columns: ${({ columns }) => `repeat(${columns}, 1fr)`};
  grid-template-rows: ${({ rows }) => `repeat(${rows}, 1fr)`};
  grid-template-areas: ${(props) =>
    generateGridTemplateAreas(props.areas, props.rows, props.columns)};
  grid-area: ${({ gridArea }) => gridArea};
  height: 100%;
  width: 100%;
  background-color: ${(props) => props.backgroundColor};
`;

const GridContext = createContext<GridContextType | null>(null);

const Grid: React.FC<GridProps> = ({
  areas,
  columns: initialColumns = 3,
  rows: initialRows = 4,
  children,
  gridArea,
}) => {
  const parentCtx = useContext(GridContext);
  const parentColsRows = parentCtx?.getColumnsAndRows(gridArea);

  const calculateAreaColumnsAndRows = (
    areaName?: string
  ): { columns: number; rows: number } => {
    if (areaName) {
      const area = areas.find((a) => a.name === areaName);
      if (area) {
        const areaColumns = area.end[0] - area.start[0] + 1;
        const areaRows = area.end[1] - area.start[1] + 1;

        return {
          columns: Math.min(areaColumns),
          rows: Math.min(areaRows),
        };
      }
      return {
        columns: initialColumns,
        rows: initialRows,
      };
    }
    return {
      columns: initialColumns,
      rows: initialRows,
    };
  };

  const contextValue: GridContextType = {
    areas,
    getColumnsAndRows: (gridArea?: string) => {
      if (gridArea) {
        console.log(calculateAreaColumnsAndRows(gridArea));
        return calculateAreaColumnsAndRows(gridArea);
      }

      return {
        columns: initialColumns,
        rows: initialRows,
      };
    },
  };

  console.log(parentColsRows, areas, gridArea);

  return (
    <GridContext.Provider value={contextValue}>
      <GridContainer
        columns={parentColsRows?.columns || initialColumns}
        rows={parentColsRows?.rows || initialRows}
        areas={areas}
        gridArea={gridArea}
      >
        {/* {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            const { gridArea } = child.props;
            const { columns: childColumns, rows: childRows } =
              calculateAreaColumnsAndRows(gridArea);

            console.log(childRows);
            return React.cloneElement(child, {
              // @ts-ignore
              columns: childColumns,
              rows: childRows,
            });
          }
          return child;
        })} */}
        {children}
      </GridContainer>
    </GridContext.Provider>
  );
};

export { Grid };
