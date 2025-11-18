import { Navbar } from "@/components/Navbar";
import { RoomCard } from "@/components/RoomCard";

export default function Dashboard() {

    return <div className="flex flex-col w-full min-h-screen">
        <Navbar />
        <div className="flex items-center justify-between mt-24 px-32" >
            <RoomCard isJoin={false} />
            <div className="h-96 border-amber-600 border" ></div>
            <RoomCard isJoin={true} />
        </div>    

    </div>
}