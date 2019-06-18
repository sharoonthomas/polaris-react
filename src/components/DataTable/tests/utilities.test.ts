import {isEdgeVisible, getPrevAndCurrentColumns} from '../utilities';

describe('isEdgeVisible()', () => {
  it('returns true if there is enough room', () => {
    const position = 175;
    const tableStart = 145;
    const tableEnd = 205;

    const isVisible = isEdgeVisible(position, tableStart, tableEnd);

    expect(isVisible).toBe(true);
  });

  it('returns false if there is not enough room', () => {
    const position = 175;
    const tableStart = 145;
    const tableEnd = 200;

    const isVisible = isEdgeVisible(position, tableStart, tableEnd);

    expect(isVisible).toBe(false);
  });
});

describe('getPrevAndCurrentColumns()', () => {
  it('returns the calculated measurements', () => {
    const columnVisibilityData = [
      {leftEdge: 145, rightEdge: 236, isVisible: true},
      {leftEdge: 236, rightEdge: 357, isVisible: true},
      {leftEdge: 357, rightEdge: 474, isVisible: true},
      {leftEdge: 474, rightEdge: 601, isVisible: true},
    ];

    const tableData = {
      fixedColumnWidth: 145,
      firstVisibleColumnIndex: 3,
      tableLeftVisibleEdge: 145,
      tableRightVisibleEdge: 551,
    };

    const actualMeasurement = getPrevAndCurrentColumns(
      tableData,
      columnVisibilityData,
    );
    const expectedMeasurement = {
      previousColumn: {leftEdge: 357, rightEdge: 474, isVisible: true},
      currentColumn: {leftEdge: 474, rightEdge: 601, isVisible: true},
    };
    expect(actualMeasurement).toStrictEqual(expectedMeasurement);
  });
});
