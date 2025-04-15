'use client';

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import emailjs from '@emailjs/browser';

export default function ContactModal() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [rating, setRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Ստեղնաշարով նավիգացիա (Esc ստեղնով փակել)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isModalOpen) {
                setIsModalOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isModalOpen]);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim() || !email.trim() || !message.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'Please fill in all fields.',
            });
            return;
        }

        if (!validateEmail(email)) {
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'Please enter a valid email address.',
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await emailjs.send(
                'geuphmh',
                'l6p2mq8222',
                { name, email, message, rating },
                'Xh3WhTefsno6bxN5J'
            );
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Message sent successfully!',
            });
            setIsModalOpen(false);
            setName('');
            setEmail('');
            setMessage('');
            setRating(0);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to send message. Please try again later.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-4 right-4 px-3 py-2 bg-red-900/70 text-white rounded-lg hover:bg-red-900 text-sm sm:text-base shadow-lg transition-all duration-300"
            >
                Contact Us
            </button>
            <div
                className={`fixed inset-0 bg-black/60 flex items-center justify-center transition-all duration-300 ${
                    isModalOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}
            >
                <div className="bg-gray-800 p-4 sm:p-6 rounded-lg w-full max-w-xs sm:max-w-md relative">
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="absolute top-2 right-2 text-xl sm:text-2xl bg-none border-none cursor-pointer text-white hover:text-gray-300"
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                    <h2 className="text-xl sm:text-2xl mb-3 text-white sm:mb-4">Contact Us</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your Name"
                            className="p-2 text-sm sm:text-base bg-black/50 backdrop-blur-lg border-b border-gray-300 outline-none text-white focus:border-red-900"
                            required
                        />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your Email"
                            className="p-2 text-sm sm:text-base bg-black/50 backdrop-blur-lg border-b border-gray-300 outline-none text-white focus:border-red-900"
                            required
                        />
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Your Message"
                            className="p-2 text-sm sm:text-base bg-black/50 backdrop-blur-lg border-b border-gray-300 outline-none text-white focus:border-red-900 resize-none h-20 sm:h-24"
                            required
                        />
                        <div className="text-center">
                            <p className="text-sm sm:text-base text-[#808080]">Rate your experience:</p>
                            <div className="flex justify-center flex-row-reverse text-xl sm:text-3xl cursor-pointer">
                                {[5, 4, 3, 2, 1].map((value) => (
                                    <span
                                        key={value}
                                        className={`mx-1 ${
                                            rating >= value ? 'text-yellow-400' : 'text-gray-400'
                                        } hover:text-yellow-400 transition-transform hover:scale-110`}
                                        onClick={() => setRating(value)}
                                    >
                    ★
                  </span>
                                ))}
                            </div>
                            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-[#808080]">
                                Your rating: <span className="font-bold text-yellow-400">{rating}</span>
                            </p>
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-3 py-2 bg-red-900 text-white rounded-lg hover:bg-red-950 flex items-center justify-center text-sm sm:text-base"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="border-2 border-white/30 border-t-white rounded-full w-4 h-4 sm:w-5 sm:h-5 animate-spin mr-2" />
                                    Sending...
                                </>
                            ) : (
                                'Send'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}