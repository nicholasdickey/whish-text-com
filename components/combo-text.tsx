import React, { useState, useEffect } from "react";
import { styled } from "styled-components";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import axios from "axios";

interface SearchResults {
  values: string[]; // sorted list of values
}

const search = async (id: string, value: string): Promise<string[]> => {
  const url = `${process.env.NEXT_PUBLIC_LAKEAPI}/api/v1/wishtext/search/combo?id=${id}&text=${value}`;
  const res = await axios.get(url);
  console.log("combo lookup", value, res.data.results);
  return res.data.results;
};

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  error: boolean;
  onChange: any;
  helperText: string;
}

const Combo: React.FC<FormFieldProps> = ({
  id,
  label,
  value,
  error,
  onChange,
  helperText,
  ...rest
}) => {
  const [inputValue, setInputValue] = useState<string>(value);
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("combo search", id, inputValue);
      const results = await search(id, inputValue);
      setOptions(results);
    };

    fetchData();
  }, [id, inputValue]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = event.target.value;
    setInputValue(newInputValue);
    onChange(id, newInputValue); // Call onChange for each character entered
  };

  const PopperMy = function (props: any) {
    return <Popper {...props} style={{ width: 250 }} placement="bottom-start" />;
  };

  return (
    <Box sx={{ mb: 4, mt: 3 }}>
      <Autocomplete
        value={value}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        onChange={(event, newValue) => {
          if (newValue === null) {
            onChange(id, "");
          } else {
            onChange(id, newValue);
          }
        }}
        options={options}
        PopperComponent={PopperMy}
        renderInput={(params: any) => (
          <TextField
            {...params}
            sx={{
              width: { xs: 1 },
            }}
            error={error}
            id={id}
            label={label}
            value={inputValue}
            onChange={handleInputChange}
            helperText={helperText}
            {...rest}
          />
        )}
        freeSolo // Allow free-typed values
      />
    </Box>
  );
};

export default Combo;
