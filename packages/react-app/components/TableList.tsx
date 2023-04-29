import React from 'react'
import {usePrepareContractWrite,useContractWrite, useWaitForTransaction, useContractRead } from 'wagmi'
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/Constants'
import Link from 'next/link'
import { hexToNumber, truncate } from '@/utils/Truncate'
import { ethers } from 'ethers'
import Router from 'next/router'
import { convertEndTime, convertEnded, convertStartTime, dateToTimeStamp } from '@/utils/ConvertDate'

export default function TableList() {
    
    const proposals = useContractRead({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI.abi,
      functionName: 'getAllProposals',
      chainId: 44787,
    })
  
   const tokenBalance = useContractRead({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI.abi,
      functionName: 'getTokenBalance',
      chainId: 44787,
    })
  
  console.log(tokenBalance.data)

  const votingPeriod = (item : any) => {
    if (dateToTimeStamp() < hexToNumber(item.startTime._hex)) {
      return convertStartTime(item.startTime._hex)
    } else if (dateToTimeStamp() < hexToNumber(item.endTime._hex)) {
      return convertEndTime(item.endTime._hex)
    } else if (dateToTimeStamp() > hexToNumber(item.endTime._hex)) {
      return convertEnded(item.endTime._hex)
    }
  }
  return (
    <div>
      
        <h1 className='text-lg mt-4 font-bold'>List of Proposals</h1>
        <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full text-left text-sm font-light">
                  <thead className="border-b font-medium dark:border-neutral-500">
                    <tr>
                      <th scope="col" className="px-6 py-4">#</th>
                      <th scope="col" className="px-6 py-4">Proposal</th>
                      <th scope="col" className="px-6 py-4">Creator Address</th>
                      <th scope="col" className="px-6 py-4">Voting Period</th>
                    <th scope="col" className="px-6 py-4">Choice / Current Result</th>
                    <th scope="col" className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                <tbody>
                  {proposals.data && proposals.data.map((item: any[], index: number) => 
                      <tr key={index} onClick={() => Router.push({
                          pathname: `/proposals/${index}`,
                        query: {
                          id: index, creator: item.creator, title: item.title,
                          description: item.description, yesVotes: item.yesVotes._hex,
                          noVotes: item.noVotes._hex, startTime: item.startTime._hex,
                          endTime: item.endTime._hex
                        }
                        })} className="border-b dark:border-neutral-500 cursor-pointer">
                        <td className="whitespace-nowrap px-6 py-4 font-medium">{index}</td>
                        <td className="whitespace-nowrap px-6 py-4">{item.title}</td>
                        <td className="whitespace-nowrap px-6 py-4">{ item.creator}</td>
                        <td className="whitespace-nowrap px-6 py-4">{votingPeriod(item)}</td>
                        <td className="whitespace-nowrap px-6 py-4 flex">
                        <div onClick={() => write?.()} className='bg-slate-200 rounded-full px-2'>
                          <label className='text-xl'>👍</label>
                          <label className='text-lg'>{`${hexToNumber(item.yesVotes._hex)} %`}</label>
                        </div>
                        <div onClick={() => write?.()} className='bg-slate-200 rounded-full px-2 ml-2'>
                          <label className='ml-4 text-xl'>👎</label> 
                          <label className='text-lg'>{`${hexToNumber(item.noVotes._hex)} %`}</label>
                        </div>
                        </td>
                        <td>
                          <div className={` ${dateToTimeStamp() < hexToNumber(item.startTime._hex) ? 'bg-slate-200' : dateToTimeStamp() <= hexToNumber(item.endTime._hex)? "bg-green-200" : dateToTimeStamp() > hexToNumber(item.endTime._hex) ? "bg-red-200" : null}  rounded p-4`}>
                            {dateToTimeStamp() < hexToNumber(item.startTime._hex) ? 'Pending' : dateToTimeStamp() < hexToNumber(item.endTime._hex) ? "Active" : dateToTimeStamp() > hexToNumber(item.endTime._hex) ? "Closed" : null
                          }</div>
                        </td>
                      </tr>
                    
                  )}
                
                  </tbody>
                </table>
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}
