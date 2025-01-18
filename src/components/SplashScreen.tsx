import React, { useEffect, useState } from "react";
import "./SplashScreen.css";
import { motion } from "framer-motion";

const SplashScreen: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) {
        return null;
    }

    return (
        <div className="splash-screen">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="logo-container"
            >
                <img src="favicon.png" alt="App Logo" className="app-logo" />
            </motion.div>
        </div>
    );
};

export default SplashScreen;
