import AuthForm from '@/app/auth/AuthForm';


export default function Auth() {
    return (
        <div className="container flex gap-8 items-center h-screen">
            <img
                src="https://ky-photos-preview.s3.us-east-1.amazonaws.com/2025-05-20@23+Carlsbad,+UCSD,+La+Jolla/IMG_E5705-preview.webp"
                className="hidden sm:block w-56 md:w-72 lg:w-96 rounded-lg shadow-2xl"
            />
            <div className="text-pretty">
                <h1 className="text-4xl font-bold mb-3">
                    You need to authenticate to view this page.
                </h1>
                <p className="text-primary">Enter authentication token below:</p>
                <AuthForm />
            </div>
        </div>
    )
}
