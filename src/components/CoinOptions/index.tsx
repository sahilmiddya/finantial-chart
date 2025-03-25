import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from "@mui/material";
import { COIN_PAIRS_OPTIONS } from "../../utils/const";

interface CoinOptionsProps {
    onChange: (event: SelectChangeEvent<string>) => void;
    value?: string;
}

const CoinOptions: React.FC<CoinOptionsProps> = ({ onChange, value }) => {
    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">
                    Select Coin
                </InputLabel>
                <Select
                    onChange={onChange}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={value}
                    label="Select Coin"
                >
                    {COIN_PAIRS_OPTIONS?.map?.((item) => (
                        <MenuItem value={item?.value} key={item?.value}>
                            {item?.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};

export default CoinOptions;
