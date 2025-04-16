import React from 'react'
import { FloatingWhatsApp } from 'react-floating-whatsapp'

const MyWhatsapp = () => {
    return (
        <>
            <FloatingWhatsApp
                phoneNumber='9847820705'
                accountName='URBAAN COLLECTIONS'
                notification="true"
                avatar='logo.png'
                notificationSound='true'
                chatMessage='Hi there! 👋 How can we assist you with your shopping today?'
                statusMessage='Typically replies within minutes'
                allowEsc='true'
                className="floating-whatsapp"
            />
        </>
    )
}

export default MyWhatsapp
