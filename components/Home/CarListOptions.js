import { CarListData } from '../../utils/CarListData'
import CarListitem from './CarListitem'
import React, { useState } from 'react'
import {useRouter} from 'next/navigation';
function CarListOptions({distance}) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const router=useRouter();
  return (
    <div className='mt-6 p-5 overflow-y-auto' style={{ height: '250px' }}>
      <h2 className='text-[22px] font-bold'>Recommandé</h2>
      {CarListData.map((item, index) => (
        <div
          className={ `cursor-pointer p-2 px-2 rounded-md 
          border-black ${activeIndex==index? 'border-[3px]': null }`}
          key={item.id}
          onClick={() => {setActiveIndex(index);
            setSelectedCar(item)
          }}
        >
          <CarListitem car={item} distance={distance} />
        </div>
      ))}
          {selectedCar?.name? <div className='flex justify-between fixed
          bottom-5 bg-white left-5 p-2 shadow-xl rounded-lg
          w-full md:w-[30%] border-[1px] items-center' >
              <h2>Commander pour</h2>
              <button className='
              p-3 bg-black text-white rounded-lg text-center '
              onClick={()=>router.push('/payment?amount=' +(selectedCar.amount*distance).toFixed(2))}
              >Commander {selectedCar.name}</button>
           </div>:null}

    </div>
    
  )
}

export default CarListOptions
