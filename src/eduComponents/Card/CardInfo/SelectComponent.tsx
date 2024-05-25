import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import CloseIcon from '@mui/icons-material/Close';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};


function getStyles(name: string, personName: readonly string[], theme: Theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

export function MultipleSelectChip({ data, setExistedLabels, handleRemove }) {
    const theme = useTheme();
    const [personName, setPersonName] = React.useState<string[]>([]);

    const handleChange = (event: SelectChangeEvent<typeof personName>) => {
        const {
            target: { value },
        } = event;
        const selectedValues = typeof value === 'string' ? value.split(',') : value;
        const selectedLabels = data.filter(item => selectedValues.includes(item.id));
        setPersonName(selectedLabels.map(item => item.id));
        setExistedLabels(selectedLabels);
    };

    return (
        <div>
            <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-chip-label">Категории</InputLabel>
                <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    sx={{
                        color: theme.palette.mode === 'dark' ? 'blue' : 'black',
                        border: theme.palette.mode === 'dark' ? 'solid pink' : 'black',
                        '&.Mui-focused': {
                            border: 'none',
                        },
                    }}
                    multiple
                    value={personName}
                    onChange={handleChange}
                    input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => {
                                const label = data.find(item => item.id === value);
                                return (
                                    <Chip
                                        key={label.id}
                                        label={label.title}
                                        style={{backgroundColor: `${label.color}`, color: '#fff'}}
                                    />
                                );
                            })}
                        </Box>
                    )}
                    MenuProps={MenuProps}
                >
                    {data.map((label) => (
                        <MenuItem
                            key={label.id}
                            value={label.id}
                            style={getStyles(label.id, personName, theme)}
                        >
                            <div style={{display: "flex", flexDirection: 'row'}}>
                                <div style={{borderRadius: '300px', backgroundColor: `${label.color}`, height: '15px', width: '15px',
                                    marginRight: '6px', justifyContent: "space-between" }}/>
                            {label.title}
                                <CloseIcon onClick={() => handleRemove(label.id)} sx={{marginLeft: '10px'}}/>
                            </div>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}

const SelectComponent = ({data, handleChange, selectValue}) => {

    return (
        <Box sx={{ minWidth: 120, color: 'black' }}>
            <div style={{borderColor: '#eee'}}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">{data.selectLabel}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectValue}
                    label="Сложность"
                    onChange={handleChange}
                >
                    {data.difficultyValue.map((value, index) => (
                        <MenuItem key={value} value={value}>
                            {data.difficultyLabel[index]}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            </div>
        </Box>
    );
};

export default SelectComponent
