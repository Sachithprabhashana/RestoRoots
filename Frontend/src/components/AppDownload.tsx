import React from 'react';

interface AppDownloadProps {
    expoUrl?: string;
    playStoreUrl?: string;
    appStoreUrl?: string;
}

export const AppDownload: React.FC<AppDownloadProps> = ({
    expoUrl = 'exp://192.168.8.129:8081',
    playStoreUrl = 'https://play.google.com/store',
    appStoreUrl = 'https://www.apple.com/app-store/',
}) => {
    const encodedUrl =
        typeof encodeURIComponent === 'function'
            ? encodeURIComponent(expoUrl)
            : expoUrl;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodedUrl}`;

    return (
        <section
            id="app-download"
            className="scroll-mt-28 w-full mt-20 py-16 px-4 bg-[#fff8f6] border-y border-[#ffe2db]"
        >
            <div className="max-w-4xl mx-auto text-center">
                <span className="inline-block px-3.5 py-1 mb-3 text-xs font-semibold tracking-wide uppercase rounded-full bg-[#ffe8e2] text-[#FF4C24]">
                    Mobile Companion
                </span>

                <p className="text-2xl font-semibold md:text-3xl text-neutral-800">
                    For Better Experience Download <br />
                    <span className="text-[#FF4C24]">RestoRoots</span> Mobile App
                </p>
                <p className="mt-2 text-sm text-neutral-600">
                    Scan the QR code with Expo Go on your phone while connected to the same Wi-Fi.
                </p>

                <div className="flex flex-col items-center gap-3 mt-6">
                    <img
                        src={qrCodeUrl}
                        alt="Scan to open RestoRoots mobile app in Expo Go"
                        className="p-2.5 bg-white border w-44 h-44 rounded-2xl border-[#ffd6cc] shadow-sm"
                    />
                    <span className="text-xs font-mono bg-white border border-neutral-200 px-3 py-1.5 rounded-md text-neutral-700">
                        {expoUrl}
                    </span>
                </div>

                {/* Store Link Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-4 mt-7">
                    <a
                        href={playStoreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-5 py-2.5 text-left text-white transition bg-neutral-900 hover:bg-neutral-800 rounded-xl shadow-sm"
                    >
                        {/* Google Play Icon */}
                        <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M4.2 3.1C3.9 3.4 3.8 3.9 3.8 4.5v15c0 .6.1 1.1.4 1.4l.1.1 8.4-8.4v-.2L4.3 3l-.1.1Z"
                                fill="#4285F4"
                            />
                            <path
                                d="M15.5 14.8 12.7 12v-.2l2.8-2.8.1.1 3.3 1.9c.9.5.9 1.4 0 1.9l-3.3 1.9-.1.1Z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M15.6 14.7 12.7 11.8 4.2 20.3c.3.4.9.4 1.5.1l9.9-5.7Z"
                                fill="#EA4335"
                            />
                            <path
                                d="M15.6 8.9 5.7 3.2c-.6-.3-1.2-.3-1.5.1l8.5 8.5 2.9-2.9Z"
                                fill="#34A853"
                            />
                        </svg>
                        <div className="leading-tight">
                            <span className="block text-[10px] uppercase tracking-wider text-neutral-300">
                                Get it on
                            </span>
                            <span className="text-sm font-semibold">Google Play</span>
                        </div>
                    </a>

                    <a
                        href={appStoreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-5 py-2.5 text-left text-white transition bg-neutral-900 hover:bg-neutral-800 rounded-xl shadow-sm"
                    >
                        {/* Apple App Store Icon */}
                        <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16.7 12.8c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.7-1.3-.1-2.5.8-3.1.8-.7 0-1.7-.8-2.8-.7-1.4 0-2.7.8-3.4 2.1-1.5 2.5-.4 6.3 1 8.4.7 1 1.5 2.1 2.6 2.1 1 0 1.4-.7 2.7-.7 1.2 0 1.6.7 2.7.7 1.1 0 1.8-1 2.5-2 .8-1.2 1.1-2.3 1.1-2.4-.1 0-2.3-.9-2.3-3.1ZM14.6 6.2c.6-.7 1-1.7.9-2.7-.9 0-2 .6-2.6 1.3-.5.6-1 1.6-.9 2.6 1 .1 2-.5 2.6-1.2Z" />
                        </svg>
                        <div className="leading-tight">
                            <span className="block text-[10px] text-neutral-300">
                                Download on the
                            </span>
                            <span className="text-sm font-semibold">App Store</span>
                        </div>
                    </a>
                </div>
            </div>
        </section>
    );
};