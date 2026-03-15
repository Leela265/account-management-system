import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const { data } = await API.get("/account/balance");
        setBalance(data.balance);
      } catch (error) {
        alert("Failed to fetch balance");
      }
    };

    fetchBalance();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Current Balance: ₹{balance}</p>
      <button onClick={() => navigate("/send-money")}>Send Money</button>
      <button onClick={() => navigate("/statement")}>Account Statement</button>
    </div>
  );
};

export default Dashboard;