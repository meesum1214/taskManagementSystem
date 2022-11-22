import { signOut } from "firebase/auth";
import { useRouter } from "next/router"
import { auth } from "../firebase/initFirebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default () => {
    const [user, loading, error] = useAuthState(auth);

    const router = useRouter()

    const onLogout = () => {
        signOut(auth);
        localStorage.removeItem('peretz-auth-token')
        router.push('/login')
    }

    return (
        // Create navbar with tailwinf css according to app styling
        <nav className="flex items-center justify-between flex-wrap bg-gray-800 p-6">
            <div className="flex items-center flex-shrink-0 text-white mr-6">
                <span className="font-semibold text-xl tracking-tight cursor-pointer" onClick={() => router.push('/')}>Peretz</span>
            </div>

            <div
                className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-gray-800 hover:bg-white mt-4 lg:mt-0 cursor-pointer transition-all"
                onClick={onLogout}
            >
                Logout
            </div>
        </nav>
    )
}