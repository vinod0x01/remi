import { Route, Routes } from "react-router-dom";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import AuthPage from "./pages/auth/auth-page";
import { NavLayout } from "./pages/nav-layout/nav-layout";
import { MySpacePage } from "./pages/my-space/my-space-page";
import { ItemsPage } from "./pages/items/items-page";
import { MemberPage } from "./pages/member/member-page";
import SpacesGlairy from "./pages/my-space/spaces-galary";
import SpaceDetails from "./pages/my-space/space-details";
import { ToastContainer } from "react-toastify";
import SpaceImageDetails from "./pages/my-space/space-image-details";
import ItemsGallery from "./pages/items/items-gallery";
import MemberGallery from "./pages/member/member-gallery";
import { useUserQuery } from "./api/user/user";

function App() {
    // const { loggedIn } = useUserStore();
    const { data: currentUser } = useUserQuery();

    // if (!loggedIn) return <AuthPage />;

    // return <AuthPage />;
    return (
        <>
            <ToastContainer />
            {!currentUser ? (
                <AuthPage />
            ) : (
                <Routes>
                    <Route path="/" element={<NavLayout />}>
                        <Route path="spaces" element={<MySpacePage />}>
                            <Route index element={<SpacesGlairy />} />
                            <Route
                                path=":spaceId/image/:imageId"
                                element={<SpaceImageDetails />}
                            />
                            <Route path=":spaceId" element={<SpaceDetails />} />
                        </Route>
                        <Route path="items" element={<ItemsPage />}>
                            <Route index element={<ItemsGallery />} />
                        </Route>
                        <Route path="member" element={<MemberPage />}>
                            <Route index element={<MemberGallery />} />
                        </Route>
                    </Route>
                </Routes>
            )}
        </>
    );
}

export default App;
