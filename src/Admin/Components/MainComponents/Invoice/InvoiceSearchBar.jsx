import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { RiSearch2Line } from 'react-icons/ri'
import { AppContext } from '../../../../StoreContext/StoreContext'

const InvoiceSearchBar = ({ setInvoice }) => {
  const [searchInvoice, setSearchInvoice] = useState('')
  const { BASE_URL } = useContext(AppContext)
  const [debounceTimeout, setDebounceTimeout] = useState(null)

  // search invoice
  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }

    const timeout = setTimeout(() => {
      const searchInvoiceItems = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/admin/invoice/search?search=${searchInvoice}`)
          setInvoice(response.data.invoices)
          console.log(response.data.invoices)
        } catch (error) {
          console.log(error)
        }
      }

      if (searchInvoice.trim()) {
        searchInvoiceItems()
      }
    }, 1000) // Adjust the delay (in milliseconds) as per your requirement

    setDebounceTimeout(timeout)
    return () => clearTimeout(timeout)
  }, [searchInvoice, BASE_URL, setInvoice])

  return (
    <div className="border border-gray-300 py-1 px-2 flex items-center gap-1 rounded-xl bg-white h-12 w-96">
      <RiSearch2Line className="text-gray-700 text-xl" />
      <input
        type="search"
        name="search"
        value={searchInvoice}
        onChange={(e) => setSearchInvoice(e.target.value)}
        placeholder="Search by Customer Name & Number"
        className="bg-transparent placeholder:text-gray-500 placeholder:text-base focus:outline-none text-secondary w-full"
      />
    </div>
  )
}

export default InvoiceSearchBar
