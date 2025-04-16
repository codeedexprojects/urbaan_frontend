import React from 'react'
import InvoiceSearchBar from './InvoiceSearchBar'
import InvoiceFilter from './InvoiceFilter'
import InvoiceTable from './InvoiceTable'
import { useState } from 'react'

const Invoice = () => {
  const [invoice, setInvoice] = useState([])
  return (
    <>
      <h1 className="text-2xl lg:text-3xl font-semibold">Invoice Lists</h1>
      <div className='space-y-5 mt-5'>
        <div className='flex items-center gap-5'>
          <div>
            <InvoiceSearchBar
              setInvoice={setInvoice}
            />
          </div>
          <div>
            <InvoiceFilter setInvoice={setInvoice}/>
          </div>
        </div>
        <div>
          <InvoiceTable
            invoice={invoice}
            setInvoice={setInvoice}
          />
        </div>
      </div>
    </>
  )
}

export default Invoice
