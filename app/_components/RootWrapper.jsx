// "use client";
// import { useEffect, useState } from "react";

// export default function RootWrapper({ children }) {
//     const [mounted, setMounted] = useState(false);

//     useEffect(() => {
//         setMounted(true);
//     }, []);

//     return (
//         <div
//             className={`min-h-screen transition-opacity duration-1000 ${mounted ? "opacity-100" : "opacity-0"
//                 }`}
//         >
//             {children}
//         </div>
//     );
// }
