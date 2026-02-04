import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";

export default function Book() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    service: "",
  });

  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/appointments`, form);

      // Store the booked appointment
      setBooked(response.data);

      toast.success("✨ Appointment booked successfully! ✨", {
        duration: 4000,
        icon: "🌸",
      });

      // Reset form after successful booking
      setForm({
        name: "",
        phone: "",
        date: "",
        time: "",
        service: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.error || "Booking failed ❌", {
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="book"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FDECEF] to-[#FFF1F5] px-4"
    >
      {/* ✅ CONFIRMATION MODAL */}
      <AnimatePresence>
        {booked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border-2 border-pink-300"
              initial={{ y: -50 }}
              animate={{ y: 0 }}
            >
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6 }}
                  className="text-6xl mb-4"
                >
                  ✨
                </motion.div>

                <h2 className="text-3xl font-bold text-[#9D174D] mb-2">
                  Booked!
                </h2>
                <p className="text-[#7C2D12] mb-6">Your appointment has been confirmed</p>

                <div className="bg-pink-50 rounded-2xl p-6 mb-6 text-left space-y-3 border border-pink-200">
                  <p className="text-[#7C2D12]">
                    <span className="font-semibold">👤 Name:</span> {booked.name}
                  </p>
                  <p className="text-[#7C2D12]">
                    <span className="font-semibold">📞 Phone:</span> {booked.phone}
                  </p>
                  <p className="text-[#7C2D12]">
                    <span className="font-semibold">✂️ Service:</span> {booked.service}
                  </p>
                  <p className="text-[#7C2D12]">
                    <span className="font-semibold">📅 Date:</span> {booked.date}
                  </p>
                  <p className="text-[#7C2D12]">
                    <span className="font-semibold">⏰ Time:</span> {booked.time}
                  </p>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setBooked(null)}
                    className="flex-1 py-3 bg-gradient-to-r from-[#EC4899] to-[#F472B6] text-white font-semibold rounded-xl"
                  >
                    Book Another
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setBooked(null)}
                    className="flex-1 py-3 bg-gray-400 text-white font-semibold rounded-xl hover:bg-gray-500 transition"
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOOKING FORM */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/90 backdrop-blur-lg shadow-xl rounded-3xl p-8 w-full max-w-md space-y-5 border border-pink-100"
      >
        <h2 className="text-3xl font-bold text-center text-[#7C2D12]">
          Book Appointment
        </h2>

        <p className="text-center text-[#9D174D] text-sm">
          Pamper yourself with our beauty services 🌸
        </p>

        {["name", "phone", "date", "time"].map((f) => (
          <motion.input
            key={f}
            whileFocus={{ scale: 1.02 }}
            type={
              f === "phone"
                ? "tel"
                : f === "date"
                ? "date"
                : f === "time"
                ? "time"
                : "text"
            }
            name={f}
            placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
            value={form[f]}
            onChange={handleChange}
            required
            className="w-full border border-pink-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        ))}

        <motion.select
          name="service"
          value={form.service}
          onChange={handleChange}
          required
          className="w-full border border-pink-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
        >
          <option value="">Select Service</option>
          <option>Hair & Scalp Treatment</option>
          <option>Facial Treatment</option>
          <option>Bridal Make Up</option>
          <option>Hair Coloring</option>
          <option>Manicure & Pedicure</option>
          <option>Waxing</option>
          <option>Henna Arts</option>
        </motion.select>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 bg-gradient-to-r from-[#EC4899] to-[#F472B6] text-white font-semibold rounded-xl shadow-lg"
        >
          {loading ? "Booking..." : "Confirm Appointment"}
        </motion.button>
      </motion.form>
    </section>
  );
}
