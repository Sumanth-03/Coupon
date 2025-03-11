import { useState, useEffect } from "react";
import { IconButton, Alert } from "@material-tailwind/react";
import copyIcon from "../Assets/clipboard.svg";  // Make sure the copy.svg file exists in your assets folder

export function CopyButton({ textToCopy }) {
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setOpenSnackbar(true);
        });
    };

    // Auto close snackbar after 2 seconds
    useEffect(() => {
        if (openSnackbar) {
            const timer = setTimeout(() => {
                setOpenSnackbar(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [openSnackbar]);

    return (
        <>
            {/* Copy Button */}
            <IconButton onClick={handleCopy} variant="text" className="p-1">
                <span></span>
                <img src={copyIcon} alt="copy" className="w-6 h-auto" />
            </IconButton>

            {/* Snackbar (Toast Notification) */}
            {/* <div className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${openSnackbar ? "opacity-100 text-white" : "opacity-0 pointer-events-none"}`}>
                <Alert className="bg-green-500 text-white font-medium shadow-lg rounded-lg">
                    Copied to clipboard!
                </Alert>
            </div> */}
        </>
    );
}
