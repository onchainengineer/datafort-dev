import React, { ReactElement, useState } from 'react'
import Time from '@shared/atoms/Time'
import Table, { TableOceanColumn } from '@shared/atoms/Table'
import Button from '@shared/atoms/Button'
import Details from './Details'
import Refresh from '@images/refresh.svg'
import { useUserPreferences } from '@context/UserPreferences'
import NetworkName from '@shared/NetworkName'
import styles from './index.module.css'
import AssetListTitle from '@shared/AssetListTitle'
import { useAccount } from 'wagmi'

export function Status({ children }: { children: string }): ReactElement {
  return <div className={styles.status}>{children}</div>
}

const columns: TableOceanColumn<ComputeJobMetaData>[] = [
  {
    name: 'Dataset',
    selector: (row) => (
      <AssetListTitle did={row.inputDID[0]} title={row.assetName} />
    )
  },
  {
    name: 'Network',
    selector: (row) => <NetworkName networkId={row.networkId} />
  },
  {
    name: 'Created',
    selector: (row) => <Time date={row.dateCreated} isUnix relative />
  },
  {
    name: 'Finished',
    selector: (row) =>
      row.dateFinished ? <Time date={row.dateFinished} isUnix relative /> : ''
  },
  {
    name: 'Status',
    selector: (row) => <Status>{row.statusText}</Status>
  },
  {
    name: 'Actions',
    selector: (row) => <Details job={row} />
  }
]

export default function ComputeJobs({
  minimal,
  jobs,
  isLoading,
  refetchJobs
}: {
  minimal?: boolean
  jobs?: ComputeJobMetaData[]
  isLoading?: boolean
  refetchJobs?: any
}): ReactElement {
  const { address } = useAccount()
  const { chainIds } = useUserPreferences()
  const [columnsMinimal] = useState([columns[4], columns[5], columns[3]])

  return address ? (
    <>
      {jobs?.length >= 0 && !minimal && (
        <Button
          style="text"
          size="small"
          title="Refresh compute jobs"
          onClick={async () => await refetchJobs(true)}
          disabled={isLoading}
          className={styles.refresh}
        >
          <Refresh />
          Refresh
        </Button>
      )}
      <Table
        columns={minimal ? columnsMinimal : columns}
        data={jobs}
        isLoading={isLoading}
        defaultSortFieldId="row.dateCreated"
        defaultSortAsc={false}
        emptyMessage={chainIds.length === 0 ? 'No network selected' : null}
      />
    </>
  ) : (
    <div>Please connect your Web3 wallet.</div>
  )
}
