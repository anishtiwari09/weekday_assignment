import axios from "axios";
export const fetchJobPost = (body) => {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.weekday.technology/adhoc/getSampleJdJSON",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
  };
  return axios(config);
};
