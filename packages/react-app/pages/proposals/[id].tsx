import React, { useState } from 'react'
import { useRouter } from 'next/router'
import VotersList from '@/components/VotersList'
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction, useContractRead } from 'wagmi'
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/Constants'
import { hexToNumber, truncate } from '@/utils/Truncate'
import { formatTimestamp, dateToTimeStamp } from '@/utils/ConvertDate'

export default function Proposal() {
  const [selected, setSelected] = useState<string>("")
  const router = useRouter()
  const { id, creator, title, description, startTime, endTime, noVotes, yesVotes } = router.query
   const choices = [
    { text: 'Yes', value: true },
    { text: 'No', value: false }
   ]
  
   const contractRead : any = useContractRead({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI.abi,
      functionName: 'getVoters',
      chainId: 44787,
    })
  
  console.log(contractRead.data)

  const { config } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI.abi,
    functionName: 'vote',
    args: [id, selected],
  })

  const { data, write } = useContractWrite(config)
  const { isLoading, isSuccess } = useWaitForTransaction({
      hash: data?.hash,
  })

  const handleSelected = (e: React.FormEvent<HTMLInputElement>) => {
    setSelected(e.currentTarget.value)
  }
  
  console.log(data)
  return (
    <div>
      <div>
        <h1 className='text-3xl font-bold my-4'>{title}</h1>
        <div className='my-4'>
          <label className={` ${dateToTimeStamp() < hexToNumber(startTime) ? 'bg-slate-200' :
            dateToTimeStamp() <= hexToNumber(endTime) ? "bg-green-200" :
            dateToTimeStamp() > hexToNumber(endTime) ? "bg-red-200" : null}  rounded-full p-2`}>
            {dateToTimeStamp() < hexToNumber(startTime) ? 'Pending' :
            dateToTimeStamp() < hexToNumber(endTime) ? "Active" :
            dateToTimeStamp() > hexToNumber(endTime) ? "Closed" : null
          }</label>
        <label className='mx-2'>{creator}</label>
        </div>
    
        <p>{description}</p>
      </div>
      <div className='flex justify-around'>
        <div className='border-2 p-4 rounded'>
        <h1 className='border-b pb-2 text-lg font-bold'>Cast your vote</h1>
        <div className='py-2 border-b cursor-pointer'>
           {choices.map((item, index) => <div key={index}>
                    <input className='mx-2' type="radio" id="yes" name="choice" value={item.value.toString()} checked={selected === item.value.toString()}
                onChange={handleSelected} />
                    <label className='text-lg' htmlFor="yes">{`${item.text} - ${title} `}</label>
                  </div>                    
               )}
            
        </div>
          <button onClick={() => write?.()} className='bg-green-500 rounded w-full p-4'>Vote</button>
        </div>

          <div className='border-2 p-4 rounded'>
            <h1 className='border-b pb-2 text-lg font-bold'>Current results</h1>
            <div className='py-2 border-b'>
             <p>{`Yes ${hexToNumber(yesVotes)}%`}</p>
            </div>
            <div className='py-2 border-b'>
             <p>{`No ${hexToNumber(noVotes)}%`}</p>
          </div>
          <div>
            <label className='font-bold'>Start time: </label>
            <label>{formatTimestamp(startTime) }</label>
          </div>
           <div>
            <label  className='font-bold'>End time: </label>
            <label>{formatTimestamp(endTime) }</label>
          </div>
        </div>
      </div>
        {/* {contractRead.data.find((item : any) => hexToNumber(item.proposerIndex._hex) == id ? <VotersList /> : null } */}
       <VotersList />
    </div>
  )
}
