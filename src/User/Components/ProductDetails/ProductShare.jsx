import React, { useState } from 'react';
import { RiShareLine, RiFileCopyLine, RiWhatsappLine, RiFacebookLine, RiTwitterLine, RiTelegramLine } from 'react-icons/ri';
import { Button } from '@material-tailwind/react';
import toast from 'react-hot-toast';

const ProductShare = ({ productDetails, productId, categoryId }) => {
    const [isShareOpen, setIsShareOpen] = useState(false);
    
    // Generate the product URL
    const generateProductUrl = () => {
        const baseUrl = window.location.origin;
        return `${baseUrl}/product-details/${productId}/${categoryId}`;
    };

    const productUrl = generateProductUrl();
    const productTitle = productDetails?.title || 'Check out this product';
    const productImage = productDetails?.images?.[0] || '';
    const productPrice = productDetails?.offerPrice || '';

    // Share text for social media
    const shareText = `Check out this amazing product: ${productTitle}${productPrice ? ` for just ₹${Math.floor(productPrice)}` : ''}`;

    // Copy to clipboard function
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(productUrl);
            toast.success('Link copied to clipboard!');
            setIsShareOpen(false);
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = productUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            toast.success('Link copied to clipboard!');
            setIsShareOpen(false);
        }
    };

    // Web Share API (for mobile devices)
    const handleWebShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: productTitle,
                    text: shareText,
                    url: productUrl,
                });
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Error sharing:', error);
                    // Fallback to custom share modal
                    setIsShareOpen(true);
                }
            }
        } else {
            setIsShareOpen(true);
        }
    };

    // Social media share functions
    const shareToWhatsApp = () => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${productUrl}`)}`;
        window.open(whatsappUrl, '_blank');
        setIsShareOpen(false);
    };

    const shareToFacebook = () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
        window.open(facebookUrl, '_blank');
        setIsShareOpen(false);
    };

    const shareToTwitter = () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(productUrl)}`;
        window.open(twitterUrl, '_blank');
        setIsShareOpen(false);
    };

    const shareToTelegram = () => {
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(shareText)}`;
        window.open(telegramUrl, '_blank');
        setIsShareOpen(false);
    };

    return (
        <>
            {/* Share Button */}
            <Button
                onClick={handleWebShare}
                className='flex items-center justify-center gap-2 font-normal font-custom tracking-wide text-sm
                xl:text-base lg:text-base bg-transparent text-primary border-[1px] border-gray-500 shadow-none rounded-md
                hover:shadow-none px-4'
            >
                <RiShareLine className='text-xl' />
                <span className='hidden xl:inline lg:inline'>Share</span>
            </Button>

            {/* Custom Share Modal */}
            {isShareOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Share Product</h3>
                            <button 
                                onClick={() => setIsShareOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        
                        {/* Share Options */}
                        <div className="space-y-3">
                            {/* Copy Link */}
                            <button
                                onClick={copyToClipboard}
                                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <RiFileCopyLine className="text-xl text-gray-600" />
                                <span>Copy Link</span>
                            </button>

                            {/* WhatsApp */}
                            <button
                                onClick={shareToWhatsApp}
                                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <RiWhatsappLine className="text-xl text-green-600" />
                                <span>WhatsApp</span>
                            </button>

                            {/* Facebook */}
                            <button
                                onClick={shareToFacebook}
                                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <RiFacebookLine className="text-xl text-blue-600" />
                                <span>Facebook</span>
                            </button>

                            {/* Twitter */}
                            <button
                                onClick={shareToTwitter}
                                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <RiTwitterLine className="text-xl text-blue-400" />
                                <span>Twitter</span>
                            </button>

                            {/* Telegram */}
                            <button
                                onClick={shareToTelegram}
                                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <RiTelegramLine className="text-xl text-blue-500" />
                                <span>Telegram</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductShare;