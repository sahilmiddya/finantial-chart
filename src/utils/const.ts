import { ApexOptions } from "apexcharts";
import dayjs from "dayjs";

export const chartOptions = {
    // title: {
    //     text: "Historical OHLC (5-min intervals)",
    //     align: "left",
    // },
    annotations: {
        xaxis: [
            {
                x: "Oct 06 14:00",
                borderColor: "#00E396",
                label: {
                    borderColor: "#00E396",
                    style: {
                        fontSize: "12px",
                        color: "#fff",
                        background: "#00E396",
                    },
                    orientation: "horizontal",
                    offsetY: 7,
                    text: "Annotation Test",
                },
            },
        ],
    },
    tooltip: {
        enabled: true,
    },
    xaxis: {
        type: "category",
        labels: {
            formatter: function (val) {
                return dayjs(val).format("MMM DD HH:mm");
            },
        },
    },
    yaxis: {
        tooltip: {
            enabled: true,
        },
    },
} as ApexOptions;

export const COIN_PAIRS_OPTIONS = [
    { label: "Bitcoin", value: "XBT" },
    { label: "Ethereum", value: "ETH/" },
];
