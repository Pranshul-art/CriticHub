import React from 'react';

const OptionsDesign=({children})=>{
    return <div className=' p-1 md:p-3 h-10 md:h-12 md:mx-3 cursor-pointer bg-slate-300  hover:bg-navy-500 rounded-2xl text-gray md:font-medium'>
        <span className='flex '>{children}</span>
    </div>
}

export default OptionsDesign;