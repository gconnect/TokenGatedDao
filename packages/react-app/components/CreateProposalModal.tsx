import { convertDateToTimeStamp } from '@/utils/ConvertDate'
import React, { useState } from 'react'
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/Constants'

interface IParam {
  show: boolean
  hide: () => void
  action: () => void
}
export default function CreateProposalModal(param: IParam) {
  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [startTime, setStartTime] = useState<string>("")
  const [endTime, setEndTime] = useState<string>("")

  const handleTitle = (e: React.FormEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }

   const handleDescription= (e: React.FormEvent<HTMLTextAreaElement>) => {
    setDescription(e.currentTarget.value)
   }
  
  const handleStartTime= (e: React.FormEvent<HTMLInputElement>) => {
    setStartTime(e.currentTarget.value)
    console.log(e.currentTarget.value)
  }
  
  const handleEndtime = (e: React.FormEvent<HTMLInputElement>) => {
    setEndTime(e.currentTarget.value)
  }

  const { config } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI.abi,
    functionName: 'createProposal',
    args: [title, description, convertDateToTimeStamp(startTime), convertDateToTimeStamp(endTime)],
  })

  const { data, write } = useContractWrite(config)
  const { isLoading, isSuccess } = useWaitForTransaction({
      hash: data?.hash,
  })
  
  return (
    <div>
      {param.show ? 
      <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">Create proposal</h3>
                  <div className="mt-2">
                      <input className='border-2 rounded w-full my-2 p-2' type="text" placeholder='Enter proposal' value={title} onChange={handleTitle} />
                      <textarea className='border p-4' placeholder='Description' id="w3review" name="w3review" rows={4} cols={50} value={description} onChange={handleDescription}/>                                         
                      <p className='font-bold my-2'>Voting Period</p>
                    <div className='flex my-2'>
                      <div>
                        <label>Start</label>
                        <input className='border-2 rounded w-full p-2' type="datetime-local" min={new Date().toISOString().slice(0, 16)} value={startTime} onChange={handleStartTime} />
                      </div>                 
                      <div>
                        <label>End</label>
                        <input className='border-2 rounded w-full p-2' type="datetime-local" min={new Date().toISOString().slice(0, 16)} value={endTime} onChange={handleEndtime} />   
                      </div>
                      
                    </div>  
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button onClick={() => write?.()} type="button" className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto">Submit</button>
              <button onClick={param.hide} type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">close</button>
            </div>
          </div>
        </div>
      </div>
    </div> : null}
    </div>   
  )
}
