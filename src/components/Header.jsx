import Image from "next/image";

export default function Header() {
    return (
        // <div className="bg-header-image h-lvh flex bg-cover bg-center">
        <div className="bg-amber-900 flex flex-row items-center justify-between px-16 h-16">
            <Image
                src={"/Marca.png"}
                width={250}
                height={250}
                alt="Logo"
            />
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <li className="list-none text-2xl"><a href="/">Home</a></li>
        </div >
    );
}
