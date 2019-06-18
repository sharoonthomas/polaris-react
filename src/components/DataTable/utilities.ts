import {DataTableState} from './types';

export interface TableMeasurements {
  firstVisibleColumnIndex: number;
  tableLeftVisibleEdge: number;
  tableRightVisibleEdge: number;
}

export function isEdgeVisible(position: number, start: number, end: number) {
  const minVisiblePixels = 30;

  return (
    position >= start + minVisiblePixels && position <= end - minVisiblePixels
  );
}

export function getPrevAndCurrentColumns(
  tableData: TableMeasurements,
  columnData: DataTableState['columnVisibilityData'],
) {
  const {firstVisibleColumnIndex} = tableData;
  const previousColumnIndex = Math.max(firstVisibleColumnIndex - 1, 0);
  const previousColumn = columnData[previousColumnIndex];
  const currentColumn = columnData[firstVisibleColumnIndex];

  return {previousColumn, currentColumn};
}
