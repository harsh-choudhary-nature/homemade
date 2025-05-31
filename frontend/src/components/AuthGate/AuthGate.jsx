// components/AuthGate.jsx (or .tsx)
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import { UserProvider } from "@/contexts/UserContext";
import { getUserFromRequest } from "@/lib/auth";
import { Suspense } from "react";
import Loader from "../Loader/Loader";

export default async function AuthGate({ children }) {

    const user = await getUserFromRequest(); // this is a client-side call now

    return (
        <UserProvider initialUser={user}>
            <div className="App">
                <Navbar />
                <Suspense fallback={<Loader/>}>
                    <main>
                        {children}
                    </main>
                </Suspense>
                <Footer />
            </div>
        </UserProvider>
    );
}
