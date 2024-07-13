// pages/driver/login.js
"use client"
import { useState } from 'react';
import { account } from '../appwriteConfig';
import { useRouter } from 'next/router';

export default function DriverLogin() {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        if (!phone.startsWith('+221')) {
            setError('Le numéro de téléphone doit commencer par +221.');
            return;
        }
        try {
            await account.createSession(phone, password);
            router.push('/driver/home');
            setError('');
        } catch (error) {
            console.error('Error logging in:', error);
            setError('Erreur de connexion. Veuillez vérifier vos informations.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6">Connexion Chauffeur</h2>
                <input
                    type="text"
                    placeholder="Numéro de téléphone (+221)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded mb-4"
                />
                <input
                    type="password"
                    placeholder="Mot de passe (4 chiffres)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded mb-4"
                />
                <button onClick={handleLogin} className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-700">
                    Connexion
                </button>
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
        </div>
    );
}
