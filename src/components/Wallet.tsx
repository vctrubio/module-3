import React from 'react';
import { Wallet } from '../../lib/types';



export function Wallet({ wallet }: { wallet: Wallet }) {

    if (!wallet)
        return <>no wallet</>

    return (
        <div className="border border-gray-800 p-4 rounded-xl mx-auto">
            <div className='flex justify-between'>
                <div>addre</div>
                <div>net</div>
            </div>
            <div className="flex flex-col">
                <div>balance</div>
                <div>block</div>
            </div>
        </div>
    )


}