import React from 'react';
import Image from 'next/image';
import { FaUser } from "react-icons/fa6";


function CarListitem({ car,distance }) {
  return (
    <div className='border p-2 rounded-md mb-2'>
      <div>
        <Image
          src={car.image}
          width={car.width + 100} // Ajouter 100 pixels à la largeur
          height={car.height + 100} // Ajouter 100 pixels à la hauteur
          alt={car.name}
        />
      </div>
      <div>
        <h2 className='text-lg font-semibold flex gap-3 items-center '>{car.name}
        
        <span className='flex gap-3 font-normal items-center'>
        <FaUser  />
        </span>
        
        </h2>
        <p>{car.desc}</p>
        <p>Sièges: {car.seat}</p>
        <p className='text-[18px] font-semibold' >Tarif: {(car.amount*distance).toFixed(2)} FCFA</p>
      </div>
    </div>
  );
}

export default CarListitem;
