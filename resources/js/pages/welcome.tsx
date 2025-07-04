import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Pindorm| Find Your Next Student Home">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="flex min-h-screen flex-col bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
                <header className="flex w-full justify-end gap-4 px-6 py-4 text-sm">
                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className="rounded border border-gray-300 px-5 py-2 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-500"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link href={route('login')} className="rounded px-5 py-2 hover:underline">
                                Log in
                            </Link>
                            <Link
                                href={route('register')}
                                className="rounded border border-gray-300 px-5 py-2 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-500"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </header>

                <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                    <h1 className="mb-4 text-4xl font-semibold md:text-6xl">Find Your Next Student Home</h1>
                    <p className="mb-8 max-w-xl text-lg text-gray-600 md:text-xl dark:text-gray-300">
                        Pindorm connects students to verified dormitories and apartments near campus — just like Airbnb, but for students.
                    </p>
                    <Link
                        href={auth.user ? route('dashboard') : route('login')}
                        className="rounded-full bg-black px-6 py-3 text-sm text-white transition-all duration-200 hover:scale-105 dark:bg-white dark:text-black"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </>
    );
}
