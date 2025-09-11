"use client";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import { Mail, User, MessageSquare } from "lucide-react";
import { useToast } from "../../../context/ToastContext";

export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await emailjs.send(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
                {
                    user_name: form.name,
                    user_email: form.email,
                    message: form.message,
                },
                process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
            );

            // Reset form and show success toast
            setForm({ name: "", email: "", message: "" });
            showToast("✅ Message sent successfully!");
        } catch (err) {
            console.error("EmailJS error:", err);
            showToast("⚠️ Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl h-fit my-auto mx-auto p-8 bg-secondary rounded-2xl shadow-lg">
            <h1 className="text-3xl font-bold text-dark mb-2">Get in Touch</h1>
            <p className="text-muted mb-6">
                Have a question or just want to say hi? Fill out the form below and I’ll get back to you soon.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-dark mb-1" htmlFor="name">
                        Name
                    </label>
                    <div className="flex items-center border border-theme rounded-xl px-3 py-2 bg-white focus-within:ring-1 focus-within:ring-gray-400">
                        <User className="w-5 h-5 text-gray-600 mr-2" />
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full bg-transparent outline-none text-gray-600 placeholder-gray-500"
                            placeholder="John Doe"
                        />
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-dark mb-1" htmlFor="email">
                        Email
                    </label>
                    <div className="flex items-center border border-theme rounded-xl px-3 py-2 bg-white focus-within:ring-1 focus-within:ring-gray-400">
                        <Mail className="w-5 h-5 text-gray-600 mr-2" />
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full bg-transparent outline-none text-gray-600 placeholder-gray-500"
                            placeholder="you@example.com"
                        />
                    </div>
                </div>

                {/* Message */}
                <div>
                    <label className="block text-sm font-medium text-dark mb-1" htmlFor="message">
                        Message
                    </label>
                    <div className="flex items-start border border-theme rounded-xl px-3 py-2 bg-white focus-within:ring-1 focus-within:ring-gray-400">
                        <MessageSquare className="w-5 h-5 text-gray-600 mr-2 mt-1" />
                        <textarea
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            required
                            rows={5}
                            className="w-full bg-transparent outline-none text-gray-600 placeholder-gray-500 resize-none"
                            placeholder="Write your message..."
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3 rounded-xl bg-accent text-white font-medium hover:opacity-90 transition disabled:opacity-50"
                >
                    {loading ? "Sending..." : "Send Message"}
                </button>
            </form>
        </div>
    );
}