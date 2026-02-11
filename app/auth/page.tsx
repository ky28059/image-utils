import AuthForm from '@/app/auth/AuthForm';


export default function Auth() {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="max-w-prose text-pretty">
                <h1 className="text-4xl font-bold mb-3">
                    You need to authenticate to view this page.
                </h1>
                <p className="text-primary">Enter authentication token below:</p>
                <AuthForm />
            </div>
        </div>
    )
}
