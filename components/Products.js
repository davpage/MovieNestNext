import React from 'react';
import {useSelector} from "react-redux";
import Image from "next/image";

const Products = () => {
    const {products} = useSelector((state) => state.productsReducer)

    return <div className='w-full h-[400px] flex gap-4'>
        {products.length > 0 && products.map((product, index) => {
            console.log(products)
            return <div key={`${product.id}-${index}`} className='w-38 h-[180px] bg-blue-500'>
                <Image
                    src='/no-image.jpeg'
                    alt="Product Image"
                    width={500}
                    height={500}
                />
                <div className='flex gap-2'>
                    <span>{product.description}</span>
                    <p>{product.price}$</p>
                </div>
            </div>;
        })
        }
    </div>

};

export default Products;