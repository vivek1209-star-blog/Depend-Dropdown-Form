import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  Container,
  CircularProgress,
  Backdrop,
  Grid,
  Tooltip,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  fetchCountries,
  fetchStates,
  fetchCities,
  fetchDistricts,
} from "./api";

const App = () => {
  const [formValues, setFormValues] = useState({
    country: "",
    state: "",
    district: "",
    city: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const getAllCountries = async () => {
    setLoading(true);
    try {
      const response = await fetchCountries();
      setCountries(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch countries:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCountries();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formValues.country) errors.country = "Country is required";
    if (!formValues.state) errors.state = "State is required";
    if (!formValues.district) errors.district = "District is required";
    if (!formValues.city) errors.city = "City is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangeCountry = async (event, value) => {
    setLoading(true);
    setFormValues((prevValues) => ({
      ...prevValues,
      country: value,
      state: "",
      district: "",
      city: "",
    }));
    setFormErrors((prevErrors) => ({ ...prevErrors, country: "" }));
    try {
      const response = await fetchStates(value);
      setStates(response.data.data.states);
      setDistricts([]);
      setCities([]);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch states:", error);
      setLoading(false);
    }
  };

  const handleChangeState = async (event, value) => {
    setLoading(true);
    setFormValues((prevValues) => ({
      ...prevValues,
      state: value,
      district: "",
      city: "",
    }));
    setFormErrors((prevErrors) => ({ ...prevErrors, state: "" }));
    try {
      const response = await fetchDistricts(formValues.country, value);
      setDistricts(response.data.data);
      setCities([]);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch districts:", error);
      setLoading(false);
    }
  };

  const handleChangeDistrict = async (event, value) => {
    setLoading(true);
    setFormValues((prevValues) => ({
      ...prevValues,
      district: value,
      city: "",
    }));
    setFormErrors((prevErrors) => ({ ...prevErrors, district: "" }));
    try {
      const response = await fetchCities(
        formValues.country,
        formValues.state,
        value
      );
      setCities(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch cities:", error);
      setLoading(false);
    }
  };

  const handleChangeCity = (event, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      city: value,
    }));
    setFormErrors((prevErrors) => ({ ...prevErrors, city: "" }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      console.log(formValues);
      setOpen(true);

      // Reset the form and state
      setFormValues({ country: "", state: "", district: "", city: "" });
      setCountries([]);
      setStates([]);
      setDistricts([]);
      setCities([]);

      // Optionally reload countries if needed right after form reset
      getAllCountries();
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Backdrop
        open={loading}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Typography
        variant="h6"
        component="header"
        sx={{
          position: "fixed",
          width: "100%",
          top: 0,
          zIndex: 1200,
          bgcolor: "primary.main",
          color: "white",
          padding: "10px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        Location Form
      </Typography>
      <Box
        component="nav"
        sx={{
          position: "fixed",
          top: 56,
          width: 240,
          height: "calc(100% - 56px)",
          bgcolor: "#333333",
          color: "white",
          overflowY: "auto",
        }}
      >
        Sidebar Content
      </Box>
      <Container
        component="main"
        sx={{
          flexGrow: 1,
          ml: { xs: 0, md: 30 },
          mt: 8,
          overflowY: "auto",
          padding: "20px",
          bgcolor: "grey.100",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Tooltip title="Please select a country first">
                <Autocomplete
                  options={countries.map((option) => option.name)}
                  getOptionLabel={(option) => option}
                  value={formValues.country}
                  onChange={handleChangeCountry}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Country"
                      fullWidth
                      error={Boolean(formErrors.country)}
                      helperText={formErrors.country}
                    />
                  )}
                />
              </Tooltip>
            </Grid>
            <Grid item xs={12}>
              <Tooltip title="Please select a state after selecting a country">
                <Autocomplete
                  options={states.map((option) => option.name)}
                  getOptionLabel={(option) => option}
                  value={formValues.state}
                  onChange={handleChangeState}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="State"
                      fullWidth
                      error={Boolean(formErrors.state)}
                      helperText={formErrors.state}
                    />
                  )}
                />
              </Tooltip>
            </Grid>
            <Grid item xs={12}>
              <Tooltip title="Please select a district after selecting a state">
                <Autocomplete
                  options={districts}
                  getOptionLabel={(option) => option}
                  value={formValues.district}
                  onChange={handleChangeDistrict}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="District"
                      fullWidth
                      error={Boolean(formErrors.district)}
                      helperText={formErrors.district}
                    />
                  )}
                />
              </Tooltip>
            </Grid>
            <Grid item xs={12}>
              <Tooltip title="Please select a city after selecting a district">
                <Autocomplete
                  options={cities}
                  getOptionLabel={(option) => option}
                  value={formValues.city}
                  onChange={handleChangeCity}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="City"
                      fullWidth
                      error={Boolean(formErrors.city)}
                      helperText={formErrors.city}
                    />
                  )}
                />
              </Tooltip>
            </Grid>
          </Grid>
          <Button fullWidth type="submit" variant="contained" sx={{ mt: 2 }}>
            Submit
          </Button>
        </form>
      </Container>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          Form submitted successfully!
          <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default App;
