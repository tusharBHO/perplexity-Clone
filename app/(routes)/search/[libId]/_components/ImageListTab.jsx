import Image from 'next/image'
import React from 'react'

function ImageListTab({ chat }) {
    return (
        <div className='flex gap-5 flex-wrap mt-6'>
            {chat.searchResult.map((item, index) => (
                <Image src={item.thumbnail} alt={item.title} width={200} height={200} key={index}
                    className='bg-accent rounded-xl z`' />
            ))}
        </div>
    )
}

export default ImageListTab