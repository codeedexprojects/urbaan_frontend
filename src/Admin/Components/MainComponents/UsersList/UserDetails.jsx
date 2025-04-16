import React from 'react'

const UserDetails = ({ user }) => {
    const primaryAddress = user.addresses?.[0] || {};
    return (
        <>
            <div className='bg-white rounded-xl shadow-md sticky top-5 transition-all duration-300 ease-in-out'>
                <div className='p-5'>
                    <h2 className="text-xl font-medium mb-3 lg:mb-0 text-secondary">User Details</h2>
                </div>
                <hr />
                <div className='p-5'>
                    <form action="" className='space-y-5'>
                        {/* title */}
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="" className='font-normal text-base'>User Name</label>
                            <input
                                type="text"
                                value={user.name}
                                name="name"
                                id=""
                                placeholder=''
                                className='border-[1px] text-gray-600 
                                    bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500
                                     focus:outline-none'/>
                        </div>

                        {/* Phone number */}
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="" className='font-normal text-base'>Phone Number</label>
                            <input
                                type="text"
                                name="name"
                                value={user.phone}
                                id=""
                                placeholder=''
                                className='order-[1px] text-gray-600  
                                    bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500
                                     focus:outline-none'/>
                        </div>

                        {/* City and State */}
                        <div className='flex items-center justify-between gap-2'>
                            <div className='flex flex-col gap-1 w-1/2'>
                                <label htmlFor="" className='font-normal text-base'>City</label>
                                <input
                                    type="text"
                                    name="name"
                                    id=""
                                    value={primaryAddress.city || 'NA'}
                                    placeholder=''
                                    className='order-[1px] text-gray-600  w-full 
                                    bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500
                                     focus:outline-none'/>
                            </div>
                            <div className='flex flex-col gap-1 w-1/2'>
                                <label htmlFor="" className='font-normal text-base'>State</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={primaryAddress.state || 'NA'}
                                    id=""
                                    placeholder=''
                                    className='order-[1px] text-gray-600  w-full
                                    bg-gray-100/50 p-2 rounded-md placeholder:text-sm placeholder:font-light placeholder:text-gray-500
                                     focus:outline-none'/>
                            </div>
                        </div>

                        {/* address */}
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="" className='font-normal text-base'>Address</label>
                            <textarea
                                name="description"
                                rows="5"
                                value={primaryAddress.address || "NA"}
                                className="w-full order-[1px] text-gray-600  bg-gray-100/50 p-2 rounded resize-none overflow-y-scroll focus:outline-none
                                        placeholder:text-sm placeholder:font-light placeholder:text-gray-500"
                                placeholder="Enter your description here..."
                                style={{ maxHeight: '150px' }}
                            ></textarea>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default UserDetails