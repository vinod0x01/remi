import { Outlet } from "react-router-dom";

export function MySpacePage() {
    return (
        <>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">My Space</h1>
            </div>
            <div
                className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
                x-chunk="dashboard-02-chunk-1"
            >
                <Outlet />
            </div>
        </>
    );
}
