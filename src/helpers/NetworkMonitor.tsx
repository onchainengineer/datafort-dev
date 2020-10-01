import React, { ReactElement, useEffect } from 'react'
import { useOcean } from '@oceanprotocol/react'
import { getOceanConfig } from './wrapRootElement'

export function NetworkMonitor(): ReactElement {
  const { connect, web3Provider } = useOcean()

  useEffect(() => {
    if (!web3Provider) return

    async function handleNetworkChanged(chainId: number) {
      const config = getOceanConfig(chainId)
      await connect(config)
    }

    web3Provider.on('chainChanged', handleNetworkChanged)

    return () => {
      web3Provider.removeListener('chainChanged', handleNetworkChanged)
    }
  }, [web3Provider, connect])

  return <></>
}