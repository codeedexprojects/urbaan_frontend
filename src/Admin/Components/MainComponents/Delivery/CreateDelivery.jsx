import { Button } from '@material-tailwind/react'
import React from 'react'
import { useContext } from 'react'
import { AppContext } from '../../../../StoreContext/StoreContext'
import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useEffect } from 'react'

const CreateDelivery = ({ setDeliveryFees }) => {
    const [deliveryInput, setDeliveryInput] = useState('')
    const [quantityInput, setQuantityInput] = useState('')
    const { BASE_URL } = useContext(AppContext)


    // fetch delivery fees
    const fetchDeliveryFees = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/admin/delivery-fee/view`)
            setDeliveryFees(response.data.data)
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchDeliveryFees()
    }, [])


    // handle delivery
    const handleDeliveryFeeSubmit = async (e) => {
        e.preventDefault();
        try {
            const deliveryPayload = {
                deliveryFee: deliveryInput,
                quantity: quantityInput
            }
            console.log(deliveryPayload);
            const token = localStorage.getItem('token')
            const response = await axios.post(`${BASE_URL}/admin/delivery-fee/add`, deliveryPayload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(response.data);
            toast.success('Delivery Fees is added')
            fetchDeliveryFees();
            setQuantityInput('')
            setDeliveryInput('')
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className="bg-white rounded-xl shadow-md sticky top-5 transition-all duration-300 ease-in-out">
                <div className="p-5">
                    <h2 className="text-xl font-medium mb-3 lg:mb-0 text-secondary">Create Delivery</h2>
                </div>
                <hr />
                <div className="p-5">
                    <form className="space-y-5"
                        onSubmit={handleDeliveryFeeSubmit}
                    >
                        {/* quantity */}
                        <div className="flex flex-col gap-1">
                            <label htmlFor="quantity" className="font-normal text-base">Quantity</label>
                            <input
                                value={quantityInput}
                                onChange={(e) => setQuantityInput(e.target.value)}
                                type="number"
                                name="quantity"
                                id="quantity"
                                placeholder="Enter Quantity"
                                min='0'
                                className="border-[1px] bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500 focus:outline-none"
                            />
                        </div>

                        {/* quantity */}
                        <div className="flex flex-col gap-1">
                            <label htmlFor="delivery" className="font-normal text-base">Delivery Charge</label>
                            <input
                                value={deliveryInput}
                                onChange={(e) => setDeliveryInput(e.target.value)}
                                type="number"
                                name="delivery"
                                id="delivery"
                                placeholder="Enter Delivery Charge"
                                min='0'
                                className="border-[1px] bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500 focus:outline-none"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <Button type="submit" className="bg-buttonBg font-normal tracking-wider font-custom text-sm">
                                Submit
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default CreateDelivery
