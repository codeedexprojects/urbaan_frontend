import React from 'react';

const PleaseNote = () => {
    return (
        <div className="py-10 px-6 md:px-20 lg:px-40">
            <h1 className="text-center text-3xl font-bold mb-8">Please Note</h1>
            
            <div className="space-y-6">
                <div>
                    <p className="mb-4">Actual product colour may vary slightly due to photographic lighting sources or your mobile/monitor display settings</p>
                    <p>Refer to the size chart before placing the order. (There will be no return for size issues)</p>
                </div>

                <div>
                    <h2 className="text-lg font-semibold mb-2">IMPORTANT INFORMATION</h2>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Once your order is placed, you can't cancel or return it—so please choose carefully!</li>
                        <li>We don't accept returns or Refunds for our products except in the case of:
                            <ul className="list-disc list-inside ml-5 mt-1 space-y-1">
                                <li>Major Damage / Item missing / wrong item sent (Size different from the order)</li>
                            </ul>
                        </li>
                        <li>In case you face a situation as above, it is must that we need an Unboxing video unedited and uncut video while opening the parcel.</li>
                        <li>360º opening video must!! Otherwise no complaints will be accepted</li>
                        <li>Video should start, from showing the address label as it is sent by us right from the outer package...</li>
                        <li>Return requests without an unboxing video will not be accepted.</li>
                        <li>Place your orders only at www.urbaan.in - no whatsapp orders</li>
                        <li>Customer care number 9847820705</li>
                        <li>Email id: urbaancustomercare@gmail.com</li>
                        <li>If you have a return request, you will have to raise a query through our support platforms Call/Website Support Portal etc within 24 hours.</li>
                        <li>Discounted items are final and cannot be returned or exchanged</li>
                        <li>Once a product is dispatched, returns are not accepted.</li>
                        <li>If you're unsure about anything, you're always welcome to visit our store before placing your order.</li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-lg font-semibold mb-2">WASH CARE</h2>
                    <ul className="list-disc list-inside space-y-1">
                        <li>A dry clean is preferred for the first wash.</li>
                        <li>Wash separately in cold water.</li>
                        <li>Use a colour guard</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PleaseNote;