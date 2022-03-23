import axios from "axios";
import React, { useContext, useState } from "react";
import { GlobalState } from "../../../GlobalState";
import Swal from "sweetalert2";

function Cateories() {
  const state = useContext(GlobalState);
  const [categories, setCategories] = state.categories.category;
  const [category, setCategory] = useState("");
  const [token, setToken] = state.token;
  const [callback, setCallback] = state.categories.callback;
  const [Edit, setEdit] = useState(false);
  const [id, setId] = useState("");
  // console.log(state);
  // console.log(callback);
  const createCategory = async (e) => {
    e.preventDefault();
    try {
      if (Edit) {
        const res = await axios.put(
          `/api/category/${id}`,
          { name: category },
          {
            headers: { Authorization: token },
          }
        );
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: res.data.msg,
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        const res = await axios.post(
          "/api/category",
          { name: category },
          {
            headers: { Authorization: token },
          }
        );
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: res.data.msg,
          showConfirmButton: false,
          timer: 1500,
        });
      }
      setEdit(false); // After Editable
      setCategory("");
      setCallback(!callback);
    } catch (error) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data.msg,
      });
    }
  };
  const editCategory = async (id, name) => {
    setId(id);
    setCategory(name);
    setEdit(true);
  };
  const deleteCategory = async (id) => {
    try {
      const res = await axios.delete(`/api/category/${id}`, {
        headers: { Authorization: token },
      });
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: res.data.msg,
        showConfirmButton: false,
        timer: 1500,
      });
      setCallback(!callback);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data.msg
      });
    }
  };
  return (
    <div className="categories">
      <form onSubmit={createCategory}>
        <label htmlFor="category">Cateories</label>
        <input
          type="text"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button type="submit">{Edit ? "Update" : "Create"}</button>
      </form>
      <div className="col">
        {categories.length === 0 ? (
          <p className="empty_category">There is No Category</p>
        ) : (
          categories.map((cat) => (
            <div className="row" key={cat._id}>
              <p>{cat.name}</p>
              <div>
                <button onClick={() => editCategory(cat._id, cat.name)}>
                  Edit
                </button>
                <button onClick={() => deleteCategory(cat._id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Cateories;
