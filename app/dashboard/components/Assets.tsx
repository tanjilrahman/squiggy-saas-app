
import React from 'react'
import { DataTable } from '../data-table'
import { Payment, columns } from '../columns'
const data: Payment[] = [
    {
        id: "728ed52f",
        amount: 100,
        status: "pending",
        email: "fdasfm@example.com",
    }, {
        id: "728ed52f",
        amount: 100,
        status: "pending",
        email: "dfam@example.com",
    },
    {
        id: "728ed52f",
        amount: 100,
        status: "pending",
        email: "aam@example.com",
    },
    {
        id: "728ed52f",
        amount: 100,
        status: "pending",
        email: "dfdm@example.com",
    },
    // ...
]
function Assets() {
    return (
        <div>
            <p>Assets</p>
            <DataTable columns={columns} data={data} />
        </div>
    )
}

export default Assets