import React, { useState } from 'react';
import { useQuery } from 'react-query';
import {
  Container,
  Box,
  TextField,
  Button,
  makeStyles,
} from '@material-ui/core';
import Axios from 'axios';

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

const fetchData = async (key, url) => {
  const response = await Axios.get(url);
  return response.data;
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const classes = useStyles();
  const { data, status } = useQuery(
    searchTerm ? ['search', searchTerm] : null,
    (_key, term) =>
      fetchData(_key, `https://api.github.com/search/repositories?q=${term}`),
    {
      refetchOnWindowFocus: false,
    }
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    setSearchTerm(searchTerm);
  };

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            label="Search Term"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            variant="outlined"
          />
          <Button type="submit">Search</Button>
        </form>
        {status === 'loading' && <div>Loading data...</div>}
        {status === 'error' && <div>Error loading data</div>}
        {status === 'success' && (
          <ul>
            {data.items.map((item) => (
              <li key={item.id}>{item.full_name}</li>
            ))}
          </ul>
        )}
      </Box>
    </Container>
  );
};

export default App;
