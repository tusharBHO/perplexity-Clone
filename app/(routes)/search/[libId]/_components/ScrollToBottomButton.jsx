import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function ScrollToBottomButton() {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const fullHeight = document.documentElement.scrollHeight;

            // Show button if user scrolled up by 300px or more from bottom
            setShowButton(scrollTop + windowHeight < fullHeight - 300);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToBottom = () => {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
    };

    if (!showButton) return null;

    return (
        <button
            onClick={scrollToBottom}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center w-10 h-10 bg-secondary text-muted01 rounded-full shadow-lg hover:bg-red-300 hover:text-dark transition-colors"
            title="Scroll to latest chat"
        >
            <ChevronDown className="w-5 h-5" />
        </button>
    );
}








// import { useState, useEffect } from "react";
// import { ChevronDown } from "lucide-react";

// export default function ScrollToBottomButton() {
//     const [showButton, setShowButton] = useState(false);

//     useEffect(() => {
//         const handleScroll = () => {
//             const scrollTop = window.scrollY;
//             const windowHeight = window.innerHeight;
//             const fullHeight = document.documentElement.scrollHeight;

//             // Show button if user scrolled up by 300px or more from bottom
//             setShowButton(scrollTop + windowHeight < fullHeight - 300);
//         };

//         window.addEventListener("scroll", handleScroll);
//         return () => window.removeEventListener("scroll", handleScroll);
//     }, []);

//     const scrollToBottom = () => {
//         window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
//     };

//     if (!showButton) return null;

//     return (
//         <button
//             onClick={scrollToBottom}
//             className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center w-10 h-10 bg-secondary text-muted01 rounded-full shadow-lg hover:bg-red-300 hover:text-dark transition-colors"
//             title="Scroll to latest chat"
//         >
//             <ChevronDown className="w-5 h-5" />
//         </button>
//     );
// }



// <button
//   onClick={scrollToBottom}
//   className="fixed bottom-20 right-5 z-50 flex items-center justify-center w-10 h-10 bg-secondary text-muted01 rounded-full shadow-lg hover:bg-red-300 hover:text-dark transition-colors"
//   title="Scroll to latest chat"
// >
//   <ChevronDown className="w-5 h-5" />
// </button>
