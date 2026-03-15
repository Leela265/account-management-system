import supabase from "../config/supabaseClient.js";

export const getBalance = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from("users")
      .select("balance")
      .eq("id", userId)
      .single();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.json({ balance: data.balance });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const transferMoney = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverEmail, amount } = req.body;

    const { data: receiver, error: receiverError } = await supabase
      .from("users")
      .select("*")
      .eq("email", receiverEmail)
      .single();

    if (receiverError || !receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    const { data: sender } = await supabase
      .from("users")
      .select("*")
      .eq("id", senderId)
      .single();

    if (sender.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const newSenderBalance = sender.balance - amount;
    const newReceiverBalance = receiver.balance + amount;

    await supabase.from("users").update({ balance: newSenderBalance }).eq("id", senderId);
    await supabase.from("users").update({ balance: newReceiverBalance }).eq("id", receiver.id);

    await supabase.from("transactions").insert([
      {
        sender_id: senderId,
        receiver_id: receiver.id,
        amount,
        transaction_type: "debit"
      },
      {
        sender_id: senderId,
        receiver_id: receiver.id,
        amount,
        transaction_type: "credit"
      }
    ]);

    res.json({ message: "Transfer successful" });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getStatement = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.json(data);

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};