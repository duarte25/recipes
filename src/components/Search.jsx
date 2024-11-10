// components/Search.js
import { useState } from "react";
import { TextField, Autocomplete, CircularProgress } from "@mui/material";

const Search = ({ options, onSearch }) => {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = async (event, newValue) => {
    setInputValue(newValue);
    setLoading(true);
    
    // Simula uma busca assíncrona (ex: fetch API ou busca local)
    const searchResults = options.filter((option) =>
      option.toLowerCase().includes(newValue.toLowerCase())
    );

    setSuggestions(searchResults);
    setLoading(false);
  };

  return (
    <Autocomplete
      freeSolo
      options={suggestions}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search"
          variant="outlined"
          sx={{ backgroundColor: 'white', width: "400px" }}  // Define o fundo branco
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default Search;
