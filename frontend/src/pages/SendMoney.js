import { useState, useEffect } from "react";
import API from "../services/api";

const SendMoney = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ receiverEmail: "", amount: "" });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await API.get("/users");
        setUsers(data);
      } catch (error) {
        alert("Failed to fetch users");
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/account/transfer", form);
      alert("Transfer successful");
      setForm({ receiverEmail: "", amount: "" });
    } catch (error) {
      alert("Transfer failed");
    }
  };

  return (
    <div>
      <h2>Send Money</h2>
      <form onSubmit={handleSubmit}>
        <select
          name="receiverEmail"
          value={form.receiverEmail}
          onChange={handleChange}
          required
        >
          <option value="">Select Receiver</option>
          {users.map((user) => (
            <option key={user.id} value={user.email}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
        <br />
        <input
          name="amount"
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
        />
        <br />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default SendMoney;