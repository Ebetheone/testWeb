import axios from "axios";

const instance = axios.create({
  baseURL:
    "https://fastfoodweb-9054c-default-rtdb.asia-southeast1.firebasedatabase.app",
});

export default instance;
