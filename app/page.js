"use client"
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getProducts} from "@/redux/slices/productsSlice";
import Products from "@/components/Products";

export default function Home() {
    const dispatch = useDispatch()
    const [add, setAdd] = useState(false)
    useEffect(() => {
        dispatch(getProducts())
    }, []);

    return (
        <div>
            <Products/>
            {add && <div>Դուք Միացաք աշխարհին</div>}
            <button className='p-4 bg-blue-500 hover:bg-blue-700 cursor-pointer'
                    onClick={() => setAdd(!add)}>{!add ? "Միանալ Աշխարհին" : "Անջատվել աշխարհից"}</button>
        </div>
    );
}
