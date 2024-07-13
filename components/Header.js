import React from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'

export default function Header() {
    const headerMenu= [
        {
            id:1,
            name: 'Voiture',
            icon: '/voiture.webp'
        },

        {
            id:2,
            name: 'boîte',
            icon: '/package.png'
        }
        
        
    ]
  return (
    
    <div className='p-5 pb-3 p1-10 border-b-[4px]
       border-gray-200 flex items-center justify-between shadow-lg' >
      <div className='flex gap-24 items-center'>
        <Image src='/sunu-taxi logo.png' width={70} height={70} alt='logo' />
         <div className='flex gap-6 items-center'  >
           {headerMenu.map((item)=>(

            <div className='flex gap-2 items-center' > 
              <Image src={item.icon}width={20} height={20} />
            <h2 className='text-14px font-medium'>{item.name}
             
            </h2>
              </div> 
           ))}
         </div>
      </div>
      <UserButton/>
    </div>
  )
}
