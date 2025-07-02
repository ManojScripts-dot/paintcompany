import NnE from "./NnE";
import NewArrival from "./NewArrival";

function NewsAndEventsMain() {
    return (
        <div className="flex flex-col md:flex-row items-stretch w-full bg-[#f5f5f5] py-5 ">
            <div className="w-full md:w-1/2">
                <NnE />
            </div>
            <div className="hidden md:block border-l-2 border-gray-500 mx-2 sm:mx-4 self-stretch"></div>
            <div className="w-full md:w-1/2">
                <NewArrival />
            </div>
        </div>
    );
}

export default NewsAndEventsMain;