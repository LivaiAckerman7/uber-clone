"use client"
import React, { useState } from 'react';
import { account } from '../appwriteConfig';
import { useRouter } from 'next/navigation';

const PhoneLogin = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [userId, setUserId] = useState(null);
    const router = useRouter();

    const handlePhoneSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = await account.createPhoneToken(
                '+221' + phoneNumber
            );
            setUserId(token.userId);
            setOtpSent(true);
        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'OTP', error);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        try {
            const session = await account.createSession(userId, otp);
            router.push('/DriverHome'); // Redirection après vérification OTP
        } catch (error) {
            console.error('Erreur lors de la vérification de l\'OTP', error);
        }
    };

    return (
        <div>
            {!otpSent ? (
                <form onSubmit={handlePhoneSubmit}>
                    <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Numéro de téléphone"
                    />
                    <button type="submit">Envoyer OTP</button>
                </form>
            ) : (
                <form onSubmit={handleOtpSubmit}>
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Code OTP"
                    />
                    <button type="submit">Vérifier OTP</button>
                </form>
            )}
        </div>
    );
};

export default PhoneLogin;
