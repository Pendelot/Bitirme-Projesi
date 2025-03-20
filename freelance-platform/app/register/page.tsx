"use client";

import RegisterForm from "../components/RegisterForm"; // Doğru yolu kullan

export default function RegisterPage() {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <RegisterForm />
        </div>
    );
}
