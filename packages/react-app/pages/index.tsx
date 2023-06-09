import React, { useState } from "react";
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction, useAccount, useContractRead } from 'wagmi'
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/Constants'
import CreateProposalModal from "@/components/CreateProposalModal";
import TableList from "@/components/TableList";

export default function Home() {
  const [showModal, setShowModal] = useState(false)
  const { address } = useAccount()

  const { config } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI.abi,
    functionName: 'addMember',
  })

  const { data, write } = useContractWrite(config)
  const { isLoading, isSuccess } = useWaitForTransaction({
      hash: data?.hash,
  })

    // Get member status
  const memberStatus : any = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI.abi,
    functionName: 'getMemberStatus',
    chainId: 44787,
    args: [address]
  })

  const alreadyJoined = memberStatus.data && memberStatus.data

  const proposals : any = useContractRead({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI.abi,
      functionName: 'getAllProposals',
      chainId: 44787,
  })
  const [items, setItems] = useState<any[]>();

  const addItem = () => {
   return setItems(proposals.data)
  }
 
  return (
    <div>
      {!address ? <div className="text-lg">Please connect your wallet</div> : 
        <div>
          <div>
            {alreadyJoined ?
              
            <button
              onClick={() => setShowModal(true)}
              type="button"
              className="inline-block ml-2 rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
              data-te-ripple-init
              data-te-ripple-color="light">
              Create Proposal
            </button> :
              
              <button
                onClick={() => write?.()}
                type="button"
                className="inline-block rounded bg-green-500 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                data-te-ripple-init
                data-te-ripple-color="light">
                Join Community
              </button>
            }
                      
          <CreateProposalModal getData={addItem} show={showModal} hide={() => setShowModal(false)} />
        </div>
        <TableList data={proposals.data} />
          </div>
        }
    </div>
  )
}
