export interface CandleStickChartData {
    x: Date;
    y: [number, number, number, number]; // Open, High, Low, Close
}

export interface FinancialOHLCData {
    0: number; // Timestamp
    1: string; // Open price
    2: string; // High price
    3: string; // Low price
    4: string; // Close price
}
