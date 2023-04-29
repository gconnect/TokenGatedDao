import React from 'react'
import { useContractRead } from 'wagmi'
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/Constants'
import { hexToNumber } from '@/utils/Truncate'

export default function VotersList(id: number) {

    const contractRead : any = useContractRead({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI.abi,
      functionName: 'getVoters',
      chainId: 44787,
    })
  // const value = contractRead.data.find((item: any) => hexToNumber(item.proposalIndex) == id)
  // console.log(value)
  console.log(contractRead.data)

  return (
    <div>
        <h1 className='text-lg font-bold'>Votes (16)</h1>
        <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full text-left text-sm font-light">
                  <thead className="border-b font-medium dark:border-neutral-500">
                    <tr>
                      <th scope="col" className="px-6 py-4">Proposal Index</th>
                      <th scope="col" className="px-6 py-4">Address</th>
                      <th scope="col" className="px-6 py-4">Vote Choice</th>
                    </tr>
                  </thead>
                <tbody>
                    {contractRead.data && contractRead.data.map((item : any, index: number) =>
                      <tr key={index} className="border-b dark:border-neutral-500">
                      <td className="whitespace-nowrap px-6 py-4 font-medium">{hexToNumber(item.proposerIndex._hex)}</td>
                      <td className="whitespace-nowrap px-6 py-4">{item.voterAddress}</td>
                      <td className="whitespace-nowrap px-6 py-4">{item.voteChoice}</td>
                    </tr>
                    )}
                    {!contractRead.data &&
                    <tr>
                      <td colSpan={3}>No data available</td>
                    </tr>
                  }
                  </tbody>
                </table>
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}
