"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faLinkedin, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

function Accueil() {
  const router = useRouter();

  const headerAccueil = {
    id: 1,
    name: '',
    icon: '/sunu-taxi logo.png',
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    initial: {},
    animate: { transition: { staggerChildren: 0.2 } },
  };

  return (
    <div className='flex flex-col min-h-screen'>
      <div className='fixed top-0 left-0 w-full h-12.5 p-5 pb-3 pl-10 flex items-center justify-between bg-black text-white z-50'>
        <div className='flex items-center'>
          <img src={headerAccueil.icon} alt={headerAccueil.name} className='w-20 h-20 mr-2' />
          <span className='text-xl font-bold'>{headerAccueil.name}</span>
        </div>
        <ul className='flex space-x-6'>
          <li className='hover:bg-gray-700'><a href='/' className='block px-3 py-2'>HOME</a></li>
          <li className='hover:bg-gray-700'><a href='#about' className='block px-3 py-2'>A PROPOS DE NOUS</a></li>
          <li className='hover:bg-gray-700'><a href='#contact' className='block px-3 py-2'>CONTACTEZ-NOUS</a></li>
          <li className='hover:bg-gray-700'><a href='/sign-up' className='block px-3 py-2'>LOGIN</a></li>
        </ul>
      </div>

      <div className='pt-32 flex-grow'>
        <div className='relative w-full'>
          <motion.img src='/chauffeur-taxi.jpg' alt='Banner' className='w-full h-auto object-cover filter blur-sm brightness-50' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} />
          <motion.div className='absolute inset-0 flex items-center justify-center' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}>
            <h1 className='text-6xl md:text-8xl lg:text-9xl font-bold text-white'>Bienvenue chez Sunu Taxi</h1>
          </motion.div>
        </div>

        <motion.div className='p-7 flex items-start mt-40 space-x-8' variants={staggerContainer} initial='initial' animate='animate'>
          <motion.img src='/chauffeur de taxi bis.jpg' className='w-1/2 h-auto' variants={fadeInUp} />
          <motion.div variants={fadeInUp}>
            <h1 className='text-6xl md:text-6xl lg:text-6xl font-bold text-black leading-relaxed break-words'>
              Plus besoin d'attendre. Commandez votre taxi en ligne et gagnez du temps.
            </h1>
            <p className='mt-4 text-xl'>
              Commander dès maintenant votre taxi sans plus attendre 
            </p>
            <div className='mt-4'>
              <button className='bg-black text-white font-semibold py-2 px-4 rounded-xl' onClick={() => router.push('/sig-in')}>
                Chercher un taxi
              </button>
              <p className='mt-8'>
                Vous avez déjà un compte ? <Link href='/sign-in' className='text-black-500 underline hover:text-black'>Connectez-vous</Link>
              </p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div className='p-7 flex items-start mt-40 space-x-8' variants={staggerContainer} initial='initial' animate='animate'>
          <motion.div className='mt-48' variants={fadeInUp}>
            <h1 className='text-6xl md:text-6xl lg:text-6xl font-bold text-black leading-relaxed break-words'>
              Cherchez un taxi n'importe où dans Dakar et quand vous voulez
            </h1>
            <p className='mt-4 text-xl'>
              Créer votre compte dès maintenant et commander votre taxi sans plus attendre 
            </p>
            <div className='mt-4'>
              <button className='bg-black text-white font-semibold py-2 px-4 rounded-xl' onClick={() => router.push('/sign-up')}>
                Créer compte
              </button>
            </div>
          </motion.div>
          <motion.img src='/Taxi canva.png' className='w-1/2 h-auto' variants={fadeInUp} />
        </motion.div>

        {/* Section pour devenir chauffeur */}
        <motion.div className='p-24 flex items-start mt-40 space-x-8' variants={staggerContainer} initial='initial' animate='animate'>
          <motion.div variants={fadeInUp}>
            <h1 className='text-6xl md:text-6xl lg:text-6xl font-bold text-black leading-relaxed break-words'>
              Rejoignez notre équipe de chauffeurs
            </h1>
            <p className='mt-4 text-xl'>
              Vous souhaitez devenir chauffeur de taxi ? Rejoignez-nous dès maintenant et profitez des nombreux avantages offerts par Sunu Taxi.
            </p>
            <div className='mt-4'>
              <button className='bg-black text-white font-semibold py-2 px-4 rounded-xl' onClick={() => router.push('/Accueil/InscriptionDriver')}>
                Devenir chauffeur
              </button>
            </div>
          </motion.div>
          <motion.img src='/Devenir-chauffeur.png' className='w-1/2 h-auto' variants={fadeInUp} />
        </motion.div>
      </div>

      {/* Pied de page */}
      <footer className='bg-black text-white p-5 mt-64'>
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

export default Accueil;
