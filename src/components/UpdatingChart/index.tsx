import {
    Card,
    CardContent,
    CardHeader,
    SelectChangeEvent,
} from "@mui/material";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { chartOptions, COIN_PAIRS_OPTIONS } from "../../utils/const";
import {
    CandleStickChartData,
    FinancialOHLCData,
} from "../../types/chart-data.types";
import CoinOptions from "../CoinOptions";

const UpdatingChart = () => {
    const [series, setSeries] = useState<{ data: CandleStickChartData[] }[]>([
        { data: [] },
    ]);
    const [selectedCoin, setSelectedCoin] = useState<string>("XBT");

    const ws = useRef<WebSocket | null>(null);
    const selectedCoinName = COIN_PAIRS_OPTIONS?.find?.(
        (item) => item?.value === selectedCoin
    )?.label;

    const handleCoinChange = (event: SelectChangeEvent<string>) => {
        setSelectedCoin(event.target.value);
    };

    useEffect(() => {
        const fetchHistoricalData = async () => {
            const oneDayAgo = Math.floor(Date.now() / 1000) - 24 * 60 * 60;

            try {
                const response = await axios.get(
                    "https://api.kraken.com/0/public/OHLC",
                    {
                        params: {
                            pair: `${selectedCoin}USD`,
                            interval: 5,
                            since: oneDayAgo,
                        },
                    }
                );
                const key = Object.keys(response?.data?.result)?.[0]; // Get dynamic key for the pair

                if (response.data.result[key]) {
                    let candles = response.data.result[key].map(
                        (candle: FinancialOHLCData) => ({
                            x: new Date(candle[0] * 1000),
                            y: [
                                parseFloat(candle[1]), // Open
                                parseFloat(candle[2]), // High
                                parseFloat(candle[3]), // Low
                                parseFloat(candle[4]), // Close
                            ] as [number, number, number, number],
                        })
                    );

                    // Keep only the last 200 data points
                    candles = candles.slice(-200);
                    setSeries([{ data: candles }]);
                }
            } catch (error) {
                console.error("Error fetching historical data:", error);
            }
        };

        fetchHistoricalData();
    }, [selectedCoin]);

    useEffect(() => {
        ws.current = new WebSocket("wss://ws.kraken.com");
        ws.current.onopen = () => {
            console.log("WebSocket connected!", [
                `${selectedCoin?.split?.("/")?.[0]}/USD`,
            ]);
            ws?.current?.send(
                JSON.stringify({
                    event: "subscribe",
                    pair: [`${selectedCoin?.split?.("/")?.[0]}/USD`],
                    subscription: { name: "ohlc", interval: 5 },
                })
            );
        };
        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (Array.isArray(data) && data?.[2] === "ohlc-5") {
                const newCandle = {
                    x: new Date(data?.[1]?.[1] * 1000),
                    y: [
                        parseFloat(data?.[1]?.[2]),
                        parseFloat(data?.[1]?.[3]),
                        parseFloat(data?.[1]?.[4]),
                        parseFloat(data?.[1]?.[5]),
                    ] as [number, number, number, number],
                };

                setSeries((prevSeries) => {
                    const updatedData = [...prevSeries[0].data, newCandle];
                    return [{ data: updatedData.slice(-200) }];
                });
            }
        };

        ws.current.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        ws.current.onclose = () => {
            console.log("WebSocket closed");
        };

        return () => {
            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                console.log("Closing WebSocket...");
                ws.current.close();
            }
        };
    }, [selectedCoin]);

    return (
        <Card sx={{ width: { lg: "95vw", md: "90vw", sm: "85vw" }, flex: 1 }}>
            <CardHeader
                title={`Historical OHLC for ${selectedCoinName} (5-min intervals)`}
                action={
                    <CoinOptions
                        value={selectedCoin}
                        onChange={handleCoinChange}
                    />
                }
            />
            <CardContent>
                <ReactApexChart
                    options={{
                        ...chartOptions,
                        chart: {
                            id: "kraken-financial-data",
                            height: 450,
                            type: "candlestick",
                            zoom: { enabled: true },
                            events: {
                                zoomed: (...rest) => {
                                    console.log({ rest });
                                },
                            },
                        },
                    }}
                    series={series}
                    type="candlestick"
                    height={400}
                    width="100%"
                />
            </CardContent>
        </Card>
    );
};

export default UpdatingChart;
