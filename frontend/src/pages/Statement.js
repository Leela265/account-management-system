import { useEffect, useState } from "react";
import API from "../services/api";

const Statement = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchStatement = async () => {
      try {
        const { data } = await API.get("/account/statement");
        setTransactions(data);
      } catch (error) {
        alert("Failed to fetch transactions");
      }
    };

    fetchStatement();
  }, []);

  return (
    <div>
      <h2>Account Statement</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Amount</th>
            <th>From</th>
            <th>To</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} style={{ color: t.transaction_type === "credit" ? "green" : "red" }}>
              <td>{new Date(t.created_at).toLocaleDateString()}</td>
              <td>{t.transaction_type}</td>
              <td>₹{t.amount}</td>
              <td>{t.sender_id}</td>
              <td>{t.receiver_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Statement;