// app/(routes)/profile/page.jsx
import { redirect } from "next/navigation";

export default function ProfileIndex() {
    redirect("/profile/account"); // default tab
}