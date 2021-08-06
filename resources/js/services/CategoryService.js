import Axios from "axios";

export const getCategoryList = async () => {
  return await Axios.get('http://localhost:8000/api/categories').then(
    (res) => {
      return res.data;
    }
  );
};

export const storeNewCategory = async (data) => {
    data.user_id= 1;
    return await Axios.post('http://localhost:8000/api/categories', data)
    .then((res) => {
      return res.data;
    });
}

export const updateCategory = async (id, data) => {
  data.user_id= 1;
  return await Axios.put(`http://localhost:8000/api/categories/${id}`, data)
  .then((res) => {
    return res.data;
  });
}

export const deleteCategory = async (id) => {
  return await Axios.delete(`http://localhost:8000/api/categories/${id}`)
  .then((res) => {
    return res.data;
  });
}