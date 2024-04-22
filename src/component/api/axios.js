import axios from "axios";

const LOCAL_URL = "http://localhost:5600";
const ONLINE_URL = "https://titaniumserver.zeabur.app";

export default axios.create({
  baseURL: ONLINE_URL,
});
