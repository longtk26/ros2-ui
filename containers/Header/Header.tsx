import Image from "next/image";

const Header = () => {
    return (
        <header className="fixed border-b border-white bg-blue-400 shadow-lg z-[100] top-0 left-0 right-0 w-full h-[60px] flex justify-center">
            <nav className="max-w-screen-xl flex justify-between items-center h-full w-full">
                <Image
                    src="/logo.jpg"
                    alt="LOGO_HCMUT"
                    className="rounded-full"
                    width={50}
                    height={50}
                />
                <h1 className="text-2xl text-white font-bold">ĐỒ ÁN 2</h1>
            </nav>
        </header>
    );
};

export default Header;
