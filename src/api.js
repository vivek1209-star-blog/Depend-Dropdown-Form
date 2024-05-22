import axios from 'axios';

const api = axios.create({
  baseURL: 'https://countriesnow.space/api/v0.1/'
});

export const fetchCountries = async () => {
  return await api.get('countries/positions');
};

export const fetchStates = async (country) => {
  return api.post('countries/states', { country });
};

export const fetchDistricts = async (country, state) => {
  return api.post('countries/state/cities', { country, state });
};

export const fetchCities = async (country, state, district) => {
  return api.post('countries/state/cities', { country, state, district });
};
