const apiKey = "IcW7adKobbotMCEGiN62ZXR2JIDVYkX5Dwfsdg0D";

const baseURL = "https://developer.nps.gov/api/v1/parks";

const options = {
  params: {
    api_key: apiKey,
  },
};

const getParksByState = async (state) => {
  return axios.get(`${baseURL}?stateCode=${state}`, options);
};
