"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Client, Databases, Storage, ID } from 'appwrite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faLinkedin, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import Link from 'next/link';

const DriverSignUp = () => {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState('');

  const initialValues = {
    Prenom: '',
    Nom: '',
    Numero_de_telephone: '',
    PermisDeConduire: null,
    CarteDitentite: null,
    CarteGrise: null,
  };

  const validationSchema = Yup.object({
    Prenom: Yup.string().required('Obligatoire'),
    Nom: Yup.string().required('Obligatoire'),
    Numero_de_telephone: Yup.number().required('Obligatoire').typeError('Must be a number'),
    PermisDeConduire: Yup.mixed().required('Obligatoire'),
    CarteDitentite: Yup.mixed().required('Obligatoire'),
    CarteGrise: Yup.mixed().required('Obligatoire'),
  });

  const handleSubmit = async (values) => {
    const client = new Client();
    client
      .setEndpoint('https://cloud.appwrite.io/v1') // Remplace par ton endpoint Appwrite correct
      .setProject('66605760000452c7c002');         // Remplace par l'ID correct du projet

    const databases = new Databases(client);
    const storage = new Storage(client);

    try {
      // Upload files to storage
      console.log("Uploading driver license...");
      const driverLicenseFile = await storage.createFile('6665996f00263517739a', ID.unique(), values.PermisDeConduire);
      console.log("Driver license uploaded:", driverLicenseFile);

      console.log("Uploading ID card...");
      const idCardFile = await storage.createFile('6665996f00263517739a', ID.unique(), values.CarteDitentite);
      console.log("ID card uploaded:", idCardFile);

      console.log("Uploading registration card...");
      const registrationCardFile = await storage.createFile('6665996f00263517739a', ID.unique(), values.CarteGrise);
      console.log("Registration card uploaded:", registrationCardFile);

      // Create document with file IDs
      console.log("Creating document in database...");
      const response = await databases.createDocument(
        '6661dd0800138aec5066',
        '6661dd200033a0e7695e',
        ID.unique(),
        {
          Prenom: values.Prenom,
          Nom: values.Nom,
          Numero_de_telephone: parseInt(values.Numero_de_telephone, 10),
          PermisDeConduire: driverLicenseFile.$id,
          CarteDitentite: idCardFile.$id,
          CarteGrise: registrationCardFile.$id,
        }
      );
      console.log("Document created:", response);
      setSuccessMessage('Vos informations ont été soumises avec succès nous vous informeront le plutôt possible de la validité de votre candidature ou non.');
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className='relative flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <div className='absolute inset-0'>
        <img src='/chauffeur-taxi.jpg' alt='Background' className='w-full h-full object-cover opacity-30' />
      </div>
      <div className='relative z-10 flex flex-col md:flex-row bg-white p-8 rounded shadow-md w-full max-w-4xl'>
        <div className='md:w-1/2 md:pr-8 mb-8 md:mb-0'>
          <h1 className='text-4xl font-bold mb-4'>Rejoignez notre équipe de chauffeurs</h1>
          <p className='text-xl mb-4'>
            Profitez des nombreux avantages de travailler avec Sunu Taxi. Inscrivez-vous dès maintenant pour commencer à conduire avec nous !
          </p>
          <ul className='list-disc pl-5 text-lg'>
            <li>Gagnez plus en conduisant plus</li>
            <li>Horaires flexibles</li>
            <li>Soutien 24/7</li>
            <li>Accès à plus de clients</li>
          </ul>
        </div>
        <div className='md:w-1/2'>
          <h1 className='text-2xl font-bold mb-4'>Inscrivez-vous</h1>
          {successMessage && <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4'>{successMessage}</div>}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue }) => (
              <Form className='space-y-4'>
                <div>
                  <label htmlFor='Prenom'>Prénom</label>
                  <Field name='Prenom' type='text' className='w-full p-2 border border-gray-300 rounded mt-1' />
                  <ErrorMessage name='Prenom' component='div' className='text-red-500 text-sm mt-1' />
                </div>
                <div>
                  <label htmlFor='Nom'>Nom</label>
                  <Field name='Nom' type='text' className='w-full p-2 border border-gray-300 rounded mt-1' />
                  <ErrorMessage name='Nom' component='div' className='text-red-500 text-sm mt-1' />
                </div>
                <div>
                  <label htmlFor='Numero_de_telephone'>Numéro de téléphone</label>
                  <Field name='Numero_de_telephone' type='text' className='w-full p-2 border border-gray-300 rounded mt-1' />
                  <ErrorMessage name='Numero_de_telephone' component='div' className='text-red-500 text-sm mt-1' />
                </div>
                <div>
                  <label htmlFor='PermisDeConduire'>Photo permis de conduire</label>
                  <input name='PermisDeConduire' type='file' className='w-full p-2 border border-gray-300 rounded mt-1' onChange={(event) => setFieldValue('PermisDeConduire', event.currentTarget.files[0])} />
                  <ErrorMessage name='PermisDeConduire' component='div' className='text-red-500 text-sm mt-1' />
                </div>
                <div>
                  <label htmlFor='CarteDitentite'>Photo pièce d'identité</label>
                  <input name='CarteDitentite' type='file' className='w-full p-2 border border-gray-300 rounded mt-1' onChange={(event) => setFieldValue('CarteDitentite', event.currentTarget.files[0])} />
                  <ErrorMessage name='CarteDitentite' component='div' className='text-red-500 text-sm mt-1' />
                </div>
                <div>
                  <label htmlFor='CarteGrise'>Photo carte grise</label>
                  <input name='CarteGrise' type='file' className='w-full p-2 border border-gray-300 rounded mt-1' onChange={(event) => setFieldValue('CarteGrise', event.currentTarget.files[0])} />
                  <ErrorMessage name='CarteGrise' component='div' className='text-red-500 text-sm mt-1' />
                </div>
                <button type='submit' className='bg-black text-white font-semibold py-2 px-4 rounded-xl'>
                  Soumettre
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <div className='mt-4'>
        <button className='bg-black text-white font-semibold py-2 px-4 rounded-xl' onClick={() => router.push('/')}>
          Retour à l'accueil
        </button>
      </div>
      
      {/* Pied de page */}
      <footer className='bg-black text-white p-5 mt-64 w-full'>
        <div className='container mx-auto flex justify-between'>
          <div>
            <h3 className='text-lg font-semibold'>Sunu Taxi</h3>
            <p className='text-sm'>Votre solution de taxi en ligne</p>
          </div>
          <ul className='flex space-x-6'>
            <li><Link href='/' className='hover:underline'>Accueil</Link></li>
            <li><Link href='#about' className='hover:underline'>À propos de nous</Link></li>
            <li><Link href='#contact' className='hover:underline'>Contactez-nous</Link></li>
            <li><Link href='/sign-up' className='hover:underline'>Login</Link></li>
          </ul>
        </div>
        <div className='text-center mt-4'>
          <div className='flex justify-center space-x-4'>
            <a href='https://instagram.com' target='_blank' rel='noopener noreferrer' className='text-white hover:text-gray-400'>
              <FontAwesomeIcon icon={faInstagram} size='2x' />
            </a>
            <a href='https://linkedin.com' target='_blank' rel='noopener noreferrer' className='text-white hover:text-gray-400'>
              <FontAwesomeIcon icon={faLinkedin} size='2x' />
            </a>
            <a href='https://whatsapp.com' target='_blank' rel='noopener noreferrer' className='text-white hover:text-gray-400'>
              <FontAwesomeIcon icon={faWhatsapp} size='2x' />
            </a>
          </div>
          <p className='text-sm mt-4'>&copy; 2024 Sunu Taxi. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}

export default DriverSignUp;