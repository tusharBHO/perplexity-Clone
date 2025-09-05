// app/(routes)/contact/page.jsx
import ProfileSidebar from "../profile/_components/Sidebar";
import ContactPage from "./ContactPage"; // the form component

export default function ContactLayout() {
    return (
        <div className="flex min-h-screen bg-primary m-auto">
            {/* <ProfileSidebar /> */}
            <ContactPage />
        </div>
    );
}